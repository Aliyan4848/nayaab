import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { Container, Section } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { getOrderByNumber } from "@/server/services/order";

export const dynamic = "force-dynamic";

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export default async function OrderConfirmationPage({ params }: { params: { orderNumber: string } }) {
  const order = await getOrderByNumber(params.orderNumber);
  if (!order) notFound();

  const address = order.shippingAddress as {
    fullName: string;
    addressLine: string;
    city: string;
    province: string;
  };

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Section className="pb-24 pt-16">
          <Container className="mx-auto max-w-2xl">
            <div className="text-center">
              <p className="font-sans text-xs uppercase tracking-wide2 text-emerald">Order Confirmed</p>
              <h1 className="mt-3 font-serif text-3xl text-ink">Thank you, {order.guestName.split(" ")[0]}.</h1>
              <p className="mt-2 font-sans text-sm text-charcoal/70">
                Order <span className="text-ink">{order.orderNumber}</span> has been placed and will be confirmed
                shortly.
              </p>
            </div>

            <div className="mt-10 border border-border p-6">
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-3 font-sans text-sm">
                    <span className="text-charcoal/70">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="text-ink">{formatPKR(Number(item.lineTotal))}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-4 font-sans text-sm">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span>{formatPKR(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Shipping</span>
                  <span>{Number(order.shippingFee) === 0 ? "Free" : formatPKR(Number(order.shippingFee))}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-4 font-sans text-base text-ink">
                <span>Total</span>
                <span>{formatPKR(Number(order.total))}</span>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <p className="font-sans text-xs uppercase tracking-wide2 text-ink">Delivery Address</p>
                <p className="mt-2 font-sans text-sm text-charcoal/70">
                  {address.fullName}
                  <br />
                  {address.addressLine}
                  <br />
                  {address.city}, {address.province}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-wide2 text-ink">Payment Method</p>
                <p className="mt-2 font-sans text-sm text-charcoal/70">Cash on Delivery</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href={`/track-order?order=${order.orderNumber}`} className="flex-1">
                <Button className="w-full" variant="outline">
                  Track This Order
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
