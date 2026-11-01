import { randomUUID } from "crypto";

export const CART_COOKIE = "nayaab_cart_session";

export function newCartSessionId(): string {
  return randomUUID();
}
