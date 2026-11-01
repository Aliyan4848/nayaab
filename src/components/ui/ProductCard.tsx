import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Layout";

export interface ProductCardData {
  slug: string;
  name: string;
  fabric?: string | null;
  price: number;
  compareAtPrice?: number | null;
  imageUrl: string;
  hoverImageUrl?: string | null;
  isNewArrival?: boolean;
}

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivoryMuted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
        {product.hoverImageUrl && (
          <Image
            src={product.hoverImageUrl}
            alt=""
            fill
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNewArrival && <Badge tone="new">New</Badge>}
          {onSale && <Badge tone="sale">Sale</Badge>}
        </div>
      </div>
      <div className="mt-3 space-y-1">
        {product.fabric && (
          <p className="font-sans text-[11px] uppercase tracking-wide2 text-charcoal/60">{product.fabric}</p>
        )}
        <h3 className="font-serif text-base text-ink">{product.name}</h3>
        <p className="font-sans text-sm text-ink">
          {formatPKR(product.price)}
          {onSale && (
            <span className="ml-2 text-charcoal/50 line-through">{formatPKR(product.compareAtPrice!)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
