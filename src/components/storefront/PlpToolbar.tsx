"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { SortOption } from "@/server/services/catalog";

const sortLabels: Record<SortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  bestselling: "Bestselling",
};

const fabrics = ["Lawn", "Chiffon", "Linen", "Khaddar"];

export function PlpToolbar({
  basePath,
  currentFabric,
  currentSort,
  productCount,
}: {
  basePath: string;
  currentFabric?: string;
  currentSort: SortOption;
  productCount: number;
}) {
  const router = useRouter();

  function withParam(key: string, value: string | undefined) {
    const params = new URLSearchParams();
    if (currentFabric) params.set("fabric", currentFabric);
    if (currentSort !== "featured") params.set("sort", currentSort);
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="mb-8 space-y-5 border-b border-border pb-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href={withParam("fabric", undefined)}
          className={`px-4 py-2 text-xs uppercase tracking-wide2 font-sans border ${
            !currentFabric ? "border-ink bg-ink text-ivory" : "border-border text-ink/70"
          }`}
        >
          All Fabrics
        </Link>
        {fabrics.map((f) => (
          <Link
            key={f}
            href={withParam("fabric", f)}
            className={`px-4 py-2 text-xs uppercase tracking-wide2 font-sans border ${
              currentFabric === f ? "border-ink bg-ink text-ivory" : "border-border text-ink/70"
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between font-sans text-xs text-charcoal/60">
        <p>{productCount} products</p>
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wide2">Sort:</span>
          <select
            defaultValue={currentSort}
            onChange={(e) => router.push(withParam("sort", e.target.value))}
            className="border-none bg-transparent font-sans text-xs uppercase tracking-wide2 text-ink outline-none"
            aria-label="Sort products"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
