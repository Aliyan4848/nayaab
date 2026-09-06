import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

const ALL_STATUSES = [
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
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Orders</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`px-3 py-1.5 text-xs uppercase tracking-wide2 font-sans border ${
            !status ? "border-ink bg-ink text-ivory" : "border-border text-ink/70"
          }`}
        >
          All
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 text-xs uppercase tracking-wide2 font-sans border ${
              status === s ? "border-ink bg-ink text-ivory" : "border-border text-ink/70"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="border border-border bg-ivory">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide2 text-charcoal/50">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-charcoal/50">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-ink underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {order.guestName}
                    <br />
                    <span className="text-xs">{order.guestPhone}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{order.createdAt.toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-charcoal/70">{order.items.length}</td>
                  <td className="px-4 py-3 text-ink">{formatPKR(Number(order.total))}</td>
                  <td className="px-4 py-3 text-charcoal/70">{order.paymentMethod}</td>
                  <td className="px-4 py-3 text-charcoal/70">{order.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
