import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { Container, Section } from "@/components/ui/Layout";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { CART_COOKIE } from "@/lib/cart-session";
import { getCartSummary } from "@/server/services/cart";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout — NAYAAB" };

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export default async function CheckoutPage() {
  const sessionId = cookies().get(CART_COOKIE)?.value;
  const cart = await getCartSummary(sessionId);

  if (cart.lines.length === 0) redirect("/cart");

  const settings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
  const shippingFee = settings ? Number(settings.shippingFee) : 0;
  const freeShippingThreshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : null;
  const effectiveShipping = freeShippingThreshold && cart.subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = cart.subtotal + effectiveShipping;

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Section className="pb-24 pt-10">
          <Container>
            <h1 className="mb-10 font-serif text-3xl text-ink">Checkout</h1>

            {cart.hasUnavailableItems && (
              <div className="mb-8 border border-error bg-error/5 px-4 py-3 font-sans text-sm text-error">
                Some items in your cart have limited stock.{" "}
                <Link href="/cart" className="underline">
                  Review your cart
                </Link>{" "}
                before continuing.
              </div>
            )}

            <div className="grid gap-12 md:grid-cols-3">
              <div className="md:col-span-2">
                <p className="mb-6 font-sans text-xs uppercase tracking-wide2 text-charcoal/60">
                  Checking out as guest — no account needed.
                </p>
                <CheckoutForm />
              </div>

              <div className="h-fit border border-border p-6">
                <p className="font-sans text-xs uppercase tracking-wide2 text-ink">Order Summary</p>
                <div className="mt-4 divide-y divide-border">
                  {cart.lines.map((line) => (
                    <div key={line.itemId} className="flex justify-between py-3 font-sans text-sm">
                      <span className="text-charcoal/70">
                        {line.name} × {line.quantity}
                      </span>
                      <span className="text-ink">{formatPKR(line.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 border-t border-border pt-4 font-sans text-sm">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span>
                    <span>{formatPKR(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Shipping</span>
                    <span>{effectiveShipping === 0 ? "Free" : formatPKR(effectiveShipping)}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-border pt-4 font-sans text-base text-ink">
                  <span>Total</span>
                  <span>{formatPKR(total)}</span>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
