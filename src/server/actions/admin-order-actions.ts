"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["OUT_FOR_DELIVERY", "DELIVERED"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  RETURNED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

const statusSchema = z.object({
  orderId: z.string(),
  newStatus: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "PACKED",
    "DISPATCHED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "REFUNDED",
  ]),
  note: z.string().optional(),
});

export interface OrderActionState {
  error?: string;
  success?: boolean;
}

export async function updateOrderStatusAction(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const parsed = statusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Invalid status update." };

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) return { error: "Order not found." };

  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(parsed.data.newStatus)) {
    return { error: `Cannot move an order from ${order.status} directly to ${parsed.data.newStatus}.` };
  }

  const admin = await getCurrentAdmin();

  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: parsed.data.newStatus as any } }),
    prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        previousStatus: order.status,
        newStatus: parsed.data.newStatus as any,
        changedById: admin?.adminId,
        note: parsed.data.note || null,
      },
    }),
    prisma.auditLog.create({
      data: {
        adminId: admin?.adminId,
        action: "ORDER_STATUS_CHANGED",
        entityType: "Order",
        entityId: order.id,
        metadata: { from: order.status, to: parsed.data.newStatus },
      },
    }),
  ]);

  revalidatePath(`/admin/orders/${order.id}`);
  revalidatePath("/admin/orders");
  return { success: true };
}

const trackingSchema = z.object({
  orderId: z.string(),
  courierName: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
});

export async function updateShipmentAction(formData: FormData) {
  const parsed = trackingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;

  await prisma.shipment.upsert({
    where: { orderId: parsed.data.orderId },
    create: {
      orderId: parsed.data.orderId,
      courierName: parsed.data.courierName || null,
      trackingNumber: parsed.data.trackingNumber || null,
      trackingUrl: parsed.data.trackingUrl || null,
    },
    update: {
      courierName: parsed.data.courierName || null,
      trackingNumber: parsed.data.trackingNumber || null,
      trackingUrl: parsed.data.trackingUrl || null,
    },
  });

  revalidatePath(`/admin/orders/${parsed.data.orderId}`);
}
