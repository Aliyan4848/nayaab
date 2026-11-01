import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { archiveProductAction, publishProductAction } from "@/server/actions/admin-product-actions";

export const dynamic = "force-dynamic";

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { inventory: true, category: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-ink px-5 py-2.5 font-sans text-xs uppercase tracking-wide2 text-ivory hover:bg-charcoal"
        >
          Add Product
        </Link>
      </div>

      <div className="border border-border bg-ivory">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide2 text-charcoal/50">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-charcoal/50">
                  No products yet. Add your first one.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="text-ink underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{p.sku}</td>
                  <td className="px-4 py-3 text-charcoal/70">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink">{formatPKR(Number(p.salePrice ?? p.price))}</td>
                  <td className="px-4 py-3 text-charcoal/70">{p.inventory?.quantity ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs uppercase tracking-wide2 ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald/10 text-emerald"
                          : p.status === "DRAFT"
                          ? "bg-charcoal/10 text-charcoal"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "PUBLISHED" ? (
                      <form action={archiveProductAction}>
                        <input type="hidden" name="productId" value={p.id} />
                        <button type="submit" className="text-xs uppercase tracking-wide2 text-charcoal/60 underline">
                          Archive
                        </button>
                      </form>
                    ) : (
                      <form action={publishProductAction}>
                        <input type="hidden" name="productId" value={p.id} />
                        <button type="submit" className="text-xs uppercase tracking-wide2 text-emerald underline">
                          Publish
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
