import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { PlpToolbar } from "@/components/storefront/PlpToolbar";
import { Container, Section } from "@/components/ui/Layout";
import { ProductCard } from "@/components/ui/ProductCard";
import { prisma } from "@/lib/prisma";
import { getProducts, SortOption } from "@/server/services/catalog";

// Sort is query-string driven and stock/price must stay current.
export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string };
}) {
  const collection = await prisma.collection.findFirst({ where: { slug: params.slug, isActive: true } });
  if (!collection) notFound();

  const sort = (searchParams.sort as SortOption) ?? "featured";
  const products = await getProducts({ collectionSlug: params.slug, sort });

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Section className="pb-24 pt-10">
          <Container>
            <h1 className="mb-2 font-serif text-3xl text-ink">{collection.name}</h1>
            {collection.description && (
              <p className="mb-6 max-w-xl font-sans text-sm text-charcoal/70">{collection.description}</p>
            )}
            <PlpToolbar basePath={`/collections/${params.slug}`} currentSort={sort} productCount={products.length} />

            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-xl text-ink">No products in this collection yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
