"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

const adjustSchema = z.object({
  inventoryId: z.string(),
  change: z.coerce.number().int(),
  reason: z.string().min(2, "A reason is required."),
});

export interface InventoryActionState {
  error?: string;
}

export async function adjustStockAction(_prev: InventoryActionState, formData: FormData): Promise<InventoryActionState> {
  const parsed = adjustSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const inventory = await prisma.inventory.findUnique({ where: { id: parsed.data.inventoryId } });
  if (!inventory) return { error: "Inventory record not found." };

  const newQuantity = inventory.quantity + parsed.data.change;
  if (newQuantity < 0) {
    return { error: `That would take stock negative (currently ${inventory.quantity}).` };
  }

  const admin = await getCurrentAdmin();

  await prisma.$transaction([
    prisma.inventory.update({ where: { id: inventory.id }, data: { quantity: newQuantity } }),
    prisma.inventoryHistory.create({
      data: {
        inventoryId: inventory.id,
        change: parsed.data.change,
        reason: parsed.data.reason,
        changedBy: admin?.adminId,
      },
    }),
  ]);

  revalidatePath("/admin/inventory");
  return {};
}
