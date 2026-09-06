import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { Container, Section } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { CART_COOKIE } from "@/lib/cart-session";
import { getCartSummary } from "@/server/services/cart";
import { updateCartItemAction, removeCartItemAction } from "@/server/actions/cart-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your Cart — NAYAAB" };

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export default async function CartPage() {
  const sessionId = cookies().get(CART_COOKIE)?.value;
  const cart = await getCartSummary(sessionId);

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Section className="pb-24 pt-10">
          <Container>
            <h1 className="mb-10 font-serif text-3xl text-ink">Your Cart</h1>

            {cart.lines.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-sans text-sm text-charcoal/60">Your cart is empty.</p>
                <Link href="/products" className="mt-6 inline-block">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-12 md:grid-cols-3">
                <div className="divide-y divide-border md:col-span-2">
                  {cart.lines.map((line) => (
                    <div key={line.itemId} className="flex gap-5 py-6">
                      <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-ivoryMuted">
                        {line.imageUrl && <Image src={line.imageUrl} alt={line.name} fill className="object-cover" />}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="font-serif text-lg text-ink">{line.name}</p>
                          <p className="mt-1 font-sans text-xs text-charcoal/50">SKU: {line.sku}</p>
                          {!line.isAvailable && (
                            <p className="mt-2 font-sans text-xs uppercase tracking-wide2 text-error">
                              Only {line.availableStock} left — reduce quantity to continue
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <form action={updateCartItemAction} className="flex items-center gap-2">
                            <input type="hidden" name="itemId" value={line.itemId} />
                            <label className="font-sans text-xs text-charcoal/60" htmlFor={`qty-${line.itemId}`}>
                              Qty
                            </label>
                            <input
                              id={`qty-${line.itemId}`}
                              name="quantity"
                              type="number"
                              min={1}
                              max={line.availableStock > 0 ? line.availableStock : undefined}
                              defaultValue={line.quantity}
                              className="w-16 border border-border bg-transparent px-2 py-1.5 font-sans text-sm outline-none focus:border-ink"
                            />
                            <button
                              type="submit"
                              className="font-sans text-xs uppercase tracking-wide2 text-ink underline"
                            >
                              Update
                            </button>
                          </form>

                          <form action={removeCartItemAction}>
                            <input type="hidden" name="itemId" value={line.itemId} />
                            <button
                              type="submit"
                              className="font-sans text-xs uppercase tracking-wide2 text-charcoal/50 underline hover:text-error"
                            >
                              Remove
                            </button>
                          </form>
                        </div>
                      </div>

                      <p className="font-sans text-sm text-ink">{formatPKR(line.lineTotal)}</p>
                    </div>
                  ))}

                  <div className="pt-6">
                    <Link href="/products" className="font-sans text-xs uppercase tracking-wide2 text-ink/70 underline">
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                <div className="h-fit border border-border p-6">
                  <p className="font-sans text-xs uppercase tracking-wide2 text-ink">Order Summary</p>
                  <div className="mt-4 space-y-2 font-sans text-sm">
                    <div className="flex justify-between text-charcoal/70">
                      <span>Subtotal</span>
                      <span>{formatPKR(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-charcoal/70">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between border-t border-border pt-4 font-sans text-base text-ink">
                    <span>Total</span>
                    <span>{formatPKR(cart.subtotal)}</span>
                  </div>

                  {cart.hasUnavailableItems ? (
                    <p className="mt-4 font-sans text-xs text-error">
                      Resolve the stock issue above before checking out.
                    </p>
                  ) : (
                    <Link href="/checkout" className="mt-6 block">
                      <Button className="w-full" size="lg">
                        Checkout
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
