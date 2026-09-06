import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { Container, Section, Badge } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { WhatsAppOrderButton } from "@/components/storefront/WhatsAppOrderButton";
import { AddToCartForm, BuyNowForm } from "@/components/storefront/AddToCartForm";
import { getProductBySlug, getRelatedProducts } from "@/server/services/catalog";

function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    amount
  );
}

// Product detail content doesn't depend on the request itself — cache with
// periodic revalidation instead of forcing a DB round trip every request,
// but never bake a single build-time snapshot in permanently.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.seoTitle || `${product.name} — NAYAAB`,
    description: product.seoDescription || product.shortDescription || product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const productUrl = `${siteUrl}/products/${product.slug}`;

  const displayPrice = Number(product.salePrice ?? product.price);
  const onSale = product.compareAtPrice && Number(product.compareAtPrice) > displayPrice;
  const inStock = (product.inventory?.quantity ?? 0) - (product.inventory?.reservedQuantity ?? 0) > 0;

  const confidenceBlocks = [
    { title: "What's Included", body: product.piecesIncluded },
    {
      title: "Fabric Details",
      body: [product.shirtFabric, product.trouserFabric, product.dupattaFabric].filter(Boolean).join(" · "),
    },
    { title: "Color", body: product.color },
    { title: "Care Instructions", body: product.careInstructions },
  ].filter((b) => b.body);

  // Structured data — only real fields, aggregateRating only if reviews exist.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "NAYAAB" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: displayPrice,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: productUrl,
    },
    ...(product.reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue:
              product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length,
            reviewCount: product.reviews.length,
          },
        }
      : {}),
  };

  return (
    <>
      <AnnouncementBar />
      <Nav />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main>
        <Container className="py-8 md:py-14">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivoryMuted">
                {product.images[0] && (
                  <Image src={product.images[0].url} alt={product.images[0].altText ?? product.name} fill priority className="object-cover" />
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(1).map((img) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden bg-ivoryMuted">
                      <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {product.fabric && (
                <p className="font-sans text-xs uppercase tracking-wide2 text-charcoal/60">{product.fabric}</p>
              )}
              <h1 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{product.name}</h1>
              <p className="mt-1 font-sans text-xs text-charcoal/50">SKU: {product.sku}</p>

              <div className="mt-5 flex items-center gap-3">
                <p className="font-sans text-xl text-ink">{formatPKR(displayPrice)}</p>
                {onSale && (
                  <p className="font-sans text-base text-charcoal/50 line-through">
                    {formatPKR(Number(product.compareAtPrice))}
                  </p>
                )}
                {onSale && <Badge tone="sale">Sale</Badge>}
              </div>

              <p className={`mt-2 font-sans text-xs uppercase tracking-wide2 ${inStock ? "text-emerald" : "text-error"}`}>
                {inStock ? "In Stock" : "Out of Stock"}
              </p>

              <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-charcoal/80">
                {product.shortDescription ?? product.description}
              </p>

              <div className="mt-8 space-y-3">
                <AddToCartForm productId={product.id} inStock={inStock} />
                <BuyNowForm productId={product.id} inStock={inStock} />
                <WhatsAppOrderButton productName={product.name} sku={product.sku} productUrl={productUrl} />
              </div>

              {/* Product confidence blocks */}
              <div className="mt-10 divide-y divide-border border-t border-border">
                {confidenceBlocks.map((block) => (
                  <div key={block.title} className="py-4">
                    <p className="font-sans text-xs uppercase tracking-wide2 text-ink">{block.title}</p>
                    <p className="mt-1.5 font-sans text-sm text-charcoal/70">{block.body}</p>
                  </div>
                ))}
                {(product.embroideryDetails || product.printDetails) && (
                  <div className="py-4">
                    <p className="font-sans text-xs uppercase tracking-wide2 text-ink">Embroidery / Print</p>
                    <p className="mt-1.5 font-sans text-sm text-charcoal/70">
                      {[product.embroideryDetails, product.printDetails].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                )}
              </div>

              <p className="mt-8 font-sans text-xs text-charcoal/50">
                Full description available below. Delivery, returns, and exchange information is on our{" "}
                <Link href="/shipping" className="underline">
                  Shipping
                </Link>{" "}
                and{" "}
                <Link href="/returns" className="underline">
                  Returns &amp; Exchanges
                </Link>{" "}
                pages.
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-3xl border-t border-border pt-10">
            <h2 className="font-serif text-2xl text-ink">Description</h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal/80">{product.description}</p>
          </div>
        </Container>

        {related.length > 0 && (
          <Section className="bg-ivoryMuted">
            <Container>
              <h2 className="mb-10 font-serif text-3xl text-ink">You May Also Like</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </Container>
          </Section>
        )}
      </main>

      <Footer />
    </>
  );
}
