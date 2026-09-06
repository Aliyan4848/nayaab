import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CheckoutAddressInput {
  fullName: string;
  phone: string;
  email?: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
}

export class CheckoutError extends Error {}

async function nextOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await tx.orderCounter.upsert({
    where: { year },
    create: { year, count: 1 },
    update: { count: { increment: 1 } },
  });
  return `NAY-${year}-${String(counter.count).padStart(6, "0")}`;
}

/**
 * Creates an order from the customer's current cart inside a single
 * transaction: re-checks stock, decrements inventory, snapshots line items
 * (so later product edits never alter historical orders), generates the
 * order number, records the initial status history entry, and empties
 * the cart. If anything fails, nothing partial is committed.
 *
 * `idempotencyKey` (e.g. a value stored in the checkout form / a hidden
 * token regenerated per page load) prevents duplicate orders from a
 * doubled form submission.
 */
export async function createOrderFromCart(params: {
  sessionId: string;
  address: CheckoutAddressInput;
  shippingFee: number;
  idempotencyKey: string;
}) {
  const { sessionId, address, shippingFee, idempotencyKey } = params;

  const existing = await prisma.order.findUnique({ where: { idempotencyKey } });
  if (existing) return existing;

  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { sessionId },
      include: { items: { where: { savedForLater: false }, include: { product: { include: { inventory: true } } } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new CheckoutError("Your cart is empty.");
    }

    let subtotal = 0;
    const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of cart.items) {
      const product = item.product;
      const available = (product.inventory?.quantity ?? 0) - (product.inventory?.reservedQuantity ?? 0);

      if (product.status !== "PUBLISHED" || available < item.quantity) {
        throw new CheckoutError(`"${product.name}" no longer has enough stock (${available} available).`);
      }

      const unitPrice = Number(product.salePrice ?? product.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItemsData.push({
        productId: product.id,
        variantId: item.variantId,
        productName: product.name,
        productSku: product.sku,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      });

      if (product.inventory) {
        await tx.inventory.update({
          where: { id: product.inventory.id },
          data: { quantity: { decrement: item.quantity } },
        });
        await tx.inventoryHistory.create({
          data: {
            inventoryId: product.inventory.id,
            change: -item.quantity,
            reason: "Order placed",
          },
        });
      }
    }

    const total = subtotal + shippingFee;
    const orderNumber = await nextOrderNumber(tx);

    const order = await tx.order.create({
      data: {
        orderNumber,
        guestName: address.fullName,
        guestPhone: address.phone,
        guestEmail: address.email || null,
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          addressLine: address.addressLine,
          city: address.city,
          province: address.province,
          postalCode: address.postalCode ?? null,
        },
        notes: address.notes || null,
        subtotal,
        shippingFee,
        total,
        idempotencyKey,
        items: { createMany: { data: orderItemsData } },
        statusHistory: { create: { newStatus: "PENDING" } },
      },
    });

    // Clear the cart now that the order owns snapshots of everything in it.
    await tx.cartItem.deleteMany({ where: { cartId: cart.id, savedForLater: false } });

    return order;
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, statusHistory: { orderBy: { createdAt: "asc" } }, shipment: true },
  });
}
