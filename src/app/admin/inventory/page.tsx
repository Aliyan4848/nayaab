import { prisma } from "@/lib/prisma";
import { StockAdjustForm } from "@/components/admin/StockAdjustForm";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const inventory = await prisma.inventory.findMany({
    include: { product: true },
    orderBy: { quantity: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Inventory</h1>

      <div className="border border-border bg-ivory">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide2 text-charcoal/50">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Reserved</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((inv) => {
              const available = inv.quantity - inv.reservedQuantity;
              const isLow = available > 0 && available <= inv.lowStockThreshold;
              const isOut = available <= 0;

              return (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ink">{inv.product?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-charcoal/70">{inv.product?.sku ?? "—"}</td>
                  <td className="px-4 py-3 text-charcoal/70">{inv.quantity}</td>
                  <td className="px-4 py-3 text-charcoal/70">{inv.reservedQuantity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs uppercase tracking-wide2 ${
                        isOut ? "bg-error/10 text-error" : isLow ? "bg-champagne/20 text-champagne" : "bg-emerald/10 text-emerald"
                      }`}
                    >
                      {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StockAdjustForm inventoryId={inv.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
