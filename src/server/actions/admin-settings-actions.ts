"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

const settingsSchema = z.object({
  brandName: z.string().min(1),
  contactEmail: z.string().email().optional().or(z.literal("")),
  whatsappNumber: z.string().optional(),
  instagramUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  shippingFee: z.coerce.number().min(0),
  freeShippingThreshold: z.coerce.number().optional(),
  codAvailable: z.coerce.boolean().optional(),
  returnPolicyText: z.string().optional(),
  exchangePolicyText: z.string().optional(),
  announcementBarText: z.string().optional(),
});

export interface SettingsActionState {
  error?: string;
  success?: boolean;
}

export async function updateSiteSettingsAction(_prev: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const data = parsed.data;
  const admin = await getCurrentAdmin();

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      brandName: data.brandName,
      contactEmail: data.contactEmail || null,
      whatsappNumber: data.whatsappNumber || null,
      instagramUrl: data.instagramUrl || null,
      facebookUrl: data.facebookUrl || null,
      shippingFee: data.shippingFee,
      freeShippingThreshold: data.freeShippingThreshold || null,
      codAvailable: Boolean(data.codAvailable),
      returnPolicyText: data.returnPolicyText || null,
      exchangePolicyText: data.exchangePolicyText || null,
      announcementBarText: data.announcementBarText || null,
    },
    update: {
      brandName: data.brandName,
      contactEmail: data.contactEmail || null,
      whatsappNumber: data.whatsappNumber || null,
      instagramUrl: data.instagramUrl || null,
      facebookUrl: data.facebookUrl || null,
      shippingFee: data.shippingFee,
      freeShippingThreshold: data.freeShippingThreshold || null,
      codAvailable: Boolean(data.codAvailable),
      returnPolicyText: data.returnPolicyText || null,
      exchangePolicyText: data.exchangePolicyText || null,
      announcementBarText: data.announcementBarText || null,
    },
  });

  await prisma.auditLog.create({
    data: { adminId: admin?.adminId, action: "SETTINGS_UPDATED", entityType: "SiteSetting", entityId: "singleton" },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}
