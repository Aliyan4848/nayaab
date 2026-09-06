import Link from "next/link";
import { getDashboardStats } from "@/server/services/admin-dashboard";

export const dynamic = "force-dynamic";

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

function StatCard({ label, value, href, alert }: { label: string; value: string | number; href?: string; alert?: boolean }) {
  const content = (
    <div className={`border p-5 ${alert ? "border-error bg-error/5" : "border-border bg-ivory"}`}>
      <p className="font-sans text-xs uppercase tracking-wide2 text-charcoal/60">{label}</p>
      <p className={`mt-2 font-serif text-2xl ${alert ? "text-error" : "text-ink"}`}>{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Today's Orders" value={stats.todaysOrders} href="/admin/orders" />
        <StatCard label="Today's Revenue" value={formatPKR(stats.todaysRevenue)} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} href="/admin/orders?status=PENDING" alert={stats.pendingOrders > 0} />
        <StatCard label="Published Products" value={stats.totalProducts} href="/admin/products" />
        <StatCard label="Low Stock" value={stats.lowStockCount} href="/admin/inventory" alert={stats.lowStockCount > 0} />
        <StatCard label="Out of Stock" value={stats.outOfStockCount} href="/admin/inventory" alert={stats.outOfStockCount > 0} />
        <StatCard label="Failed Notifications" value={stats.unreadNotifications} alert={stats.unreadNotifications > 0} />
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-sans text-xs uppercase tracking-wide2 text-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="font-sans text-xs text-ink/60 underline">
            View all
          </Link>
        </div>

        <div className="border border-border bg-ivory">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide2 text-charcoal/50">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-charcoal/50">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-ink underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">{order.items.length}</td>
                    <td className="px-4 py-3 text-ink">{formatPKR(Number(order.total))}</td>
                    <td className="px-4 py-3 text-charcoal/70">{order.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
