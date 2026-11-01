import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { updateShipmentAction } from "@/server/actions/admin-order-actions";

export const dynamic = "force-dynamic";

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" }, include: { changedBy: true } },
      shipment: true,
      payment: true,
    },
  });

  if (!order) notFound();

  const address = order.shippingAddress as {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    province: string;
    postalCode: string | null;
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-2xl text-ink">Order {order.orderNumber}</h1>
      <p className="mt-1 font-sans text-xs text-charcoal/50">Placed {order.createdAt.toLocaleString()}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <section className="border border-border bg-ivory p-5">
            <p className="mb-3 font-sans text-xs uppercase tracking-wide2 text-ink">Items</p>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 font-sans text-sm">
                  <span className="text-charcoal/70">
                    {item.productName} ({item.productSku}) × {item.quantity}
                  </span>
                  <span className="text-ink">{formatPKR(Number(item.lineTotal))}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-border pt-3 font-sans text-sm">
              <div className="flex justify-between text-charcoal/70">
                <span>Subtotal</span>
                <span>{formatPKR(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Shipping</span>
                <span>{formatPKR(Number(order.shippingFee))}</span>
              </div>
              <div className="flex justify-between text-ink">
                <span>Total</span>
                <span>{formatPKR(Number(order.total))}</span>
              </div>
            </div>
          </section>

          <section className="border border-border bg-ivory p-5">
            <p className="mb-3 font-sans text-xs uppercase tracking-wide2 text-ink">Status History</p>
            <div className="space-y-2">
              {order.statusHistory.map((h) => (
                <div key={h.id} className="flex justify-between font-sans text-sm">
                  <span className="text-charcoal/70">
                    {h.previousStatus ? `${h.previousStatus} → ` : ""}
                    {h.newStatus}
                    {h.note ? ` — ${h.note}` : ""}
                  </span>
                  <span className="text-xs text-charcoal/40">{h.createdAt.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-border bg-ivory p-5">
            <p className="mb-3 font-sans text-xs uppercase tracking-wide2 text-ink">Shipment / Tracking</p>
            <form action={updateShipmentAction} className="grid grid-cols-2 gap-3">
              <input type="hidden" name="orderId" value={order.id} />
              <input
                name="courierName"
                placeholder="Courier name"
                defaultValue={order.shipment?.courierName ?? ""}
                className="border border-border bg-transparent px-3 py-2 font-sans text-sm outline-none focus:border-ink"
              />
              <input
                name="trackingNumber"
                placeholder="Tracking number"
                defaultValue={order.shipment?.trackingNumber ?? ""}
                className="border border-border bg-transparent px-3 py-2 font-sans text-sm outline-none focus:border-ink"
              />
              <input
                name="trackingUrl"
                placeholder="Tracking URL"
                defaultValue={order.shipment?.trackingUrl ?? ""}
                className="col-span-2 border border-border bg-transparent px-3 py-2 font-sans text-sm outline-none focus:border-ink"
              />
              <button
                type="submit"
                className="col-span-2 bg-ink px-5 py-2.5 font-sans text-xs uppercase tracking-wide2 text-ivory hover:bg-charcoal"
              >
                Save Tracking Info
              </button>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          <section className="border border-border bg-ivory p-5">
            <p className="mb-2 font-sans text-xs uppercase tracking-wide2 text-ink">Update Status</p>
            <p className="mb-3 font-sans text-sm text-ink">Current: {order.status}</p>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </section>

          <section className="border border-border bg-ivory p-5">
            <p className="mb-2 font-sans text-xs uppercase tracking-wide2 text-ink">Customer</p>
            <p className="font-sans text-sm text-charcoal/80">
              {address.fullName}
              <br />
              {order.guestPhone}
              {order.guestEmail && (
                <>
                  <br />
                  {order.guestEmail}
                </>
              )}
            </p>
          </section>

          <section className="border border-border bg-ivory p-5">
            <p className="mb-2 font-sans text-xs uppercase tracking-wide2 text-ink">Delivery Address</p>
            <p className="font-sans text-sm text-charcoal/80">
              {address.addressLine}
              <br />
              {address.city}, {address.province}
              {address.postalCode ? ` ${address.postalCode}` : ""}
            </p>
          </section>

          <section className="border border-border bg-ivory p-5">
            <p className="mb-2 font-sans text-xs uppercase tracking-wide2 text-ink">Payment</p>
            <p className="font-sans text-sm text-charcoal/80">
              {order.paymentMethod}
              <br />
              Status: {order.paymentStatus}
            </p>
          </section>

          {order.notes && (
            <section className="border border-border bg-ivory p-5">
              <p className="mb-2 font-sans text-xs uppercase tracking-wide2 text-ink">Order Notes</p>
              <p className="font-sans text-sm text-charcoal/80">{order.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
