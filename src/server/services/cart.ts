import { prisma } from "@/lib/prisma";

export interface CartLine {
  itemId: string;
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
  isAvailable: boolean;
}

export interface CartSummary {
  cartId: string | null;
  lines: CartLine[];
  subtotal: number;
  hasUnavailableItems: boolean;
}

async function getOrCreateCartBySession(sessionId: string) {
  const existing = await prisma.cart.findUnique({ where: { sessionId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { sessionId } });
}

export async function addToCart(sessionId: string, productId: string, quantity: number) {
  if (quantity < 1) throw new Error("Quantity must be at least 1.");

  const product = await prisma.product.findUnique({ where: { id: productId }, include: { inventory: true } });
  if (!product || product.status !== "PUBLISHED") throw new Error("This product is not available.");

  const cart = await getOrCreateCartBySession(sessionId);

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId_variantId: { cartId: cart.id, productId, variantId: null } },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  return cart.id;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return;
  }
  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function getCartSummary(sessionId: string | undefined): Promise<CartSummary> {
  if (!sessionId) return { cartId: null, lines: [], subtotal: 0, hasUnavailableItems: false };

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        where: { savedForLater: false },
        include: { product: { include: { images: true, inventory: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart) return { cartId: null, lines: [], subtotal: 0, hasUnavailableItems: false };

  let hasUnavailableItems = false;

  const lines: CartLine[] = cart.items.map((item) => {
    const product = item.product;
    const availableStock = (product.inventory?.quantity ?? 0) - (product.inventory?.reservedQuantity ?? 0);
    const isAvailable = product.status === "PUBLISHED" && availableStock >= item.quantity;
    if (!isAvailable) hasUnavailableItems = true;

    const unitPrice = Number(product.salePrice ?? product.price);
    const image = product.images.find((i) => i.type === "front") ?? product.images[0];

    return {
      itemId: item.id,
      productId: product.id,
      variantId: item.variantId,
      name: product.name,
      sku: product.sku,
      imageUrl: image?.url ?? null,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
      availableStock,
      isAvailable,
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  return { cartId: cart.id, lines, subtotal, hasUnavailableItems };
}

export async function getCartItemCount(sessionId: string | undefined): Promise<number> {
  if (!sessionId) return 0;
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: { where: { savedForLater: false } } },
  });
  return cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
}
