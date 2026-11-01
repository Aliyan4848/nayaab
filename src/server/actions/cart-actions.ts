"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CART_COOKIE, newCartSessionId } from "@/lib/cart-session";
import * as cartService from "@/server/services/cart";

function getOrSetSessionId(): string {
  const store = cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const id = newCartSessionId();
  store.set(CART_COOKIE, id, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
  return id;
}

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  if (!productId) throw new Error("Missing product.");

  const sessionId = getOrSetSessionId();
  await cartService.addToCart(sessionId, productId, quantity);
  revalidatePath("/cart");
  revalidatePath("/", "layout"); // refresh cart count in Nav
}

export async function buyNowAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  if (!productId) throw new Error("Missing product.");

  const sessionId = getOrSetSessionId();
  await cartService.addToCart(sessionId, productId, quantity);
  redirect("/checkout");
}

export async function updateCartItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  if (!itemId) throw new Error("Missing cart item.");

  await cartService.updateCartItemQuantity(itemId, quantity);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function removeCartItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) throw new Error("Missing cart item.");

  await cartService.removeCartItem(itemId);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}
