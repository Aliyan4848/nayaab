"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CART_COOKIE } from "@/lib/cart-session";
import { createOrderFromCart, CheckoutError } from "@/server/services/order";
import { getCartSummary } from "@/server/services/cart";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  phone: z.string().min(7, "A valid phone number is required."),
  email: z.string().email("Enter a valid email.").optional().or(z.literal("")),
  addressLine: z.string().min(5, "Please enter your full address."),
  city: z.string().min(2, "City is required."),
  province: z.string().min(2, "Province is required."),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  idempotencyKey: z.string().min(1),
});

export interface CheckoutFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function placeOrderAction(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = checkoutSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const sessionId = cookies().get(CART_COOKIE)?.value;
  if (!sessionId) {
    return { error: "Your cart is empty." };
  }

  const [settings, cart] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: "singleton" } }),
    getCartSummary(sessionId),
  ]);

  const baseShippingFee = settings ? Number(settings.shippingFee) : 0;
  const freeShippingThreshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : null;
  const shippingFee = freeShippingThreshold && cart.subtotal >= freeShippingThreshold ? 0 : baseShippingFee;

  try {
    const order = await createOrderFromCart({
      sessionId,
      address: parsed.data,
      shippingFee,
      idempotencyKey: parsed.data.idempotencyKey,
    });
    redirect(`/order-confirmation/${order.orderNumber}`);
  } catch (err) {
    if (err instanceof CheckoutError) {
      return { error: err.message };
    }
    // Next's redirect() throws internally — let it propagate, don't swallow it as an error.
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error(err);
    return { error: "Something went wrong placing your order. Please try again." };
  }
}
