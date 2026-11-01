import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { PlpToolbar } from "@/components/storefront/PlpToolbar";
import { Container, Section } from "@/components/ui/Layout";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProducts, SortOption } from "@/server/services/catalog";

export const metadata = {
  title: "All Products — NAYAAB",
  description: "Shop premium Pakistani unstitched fashion — lawn, chiffon, linen and khaddar.",
};

// Filter/sort results depend on the request's query string, and stock/price
// must stay current — render per-request rather than baking a snapshot in
// at build time.
export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { fabric?: string; sort?: string };
}) {
  const sort = (searchParams.sort as SortOption) ?? "featured";
  const products = await getProducts({ fabric: searchParams.fabric, sort });

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Section className="pb-24 pt-10">
          <Container>
            <h1 className="mb-2 font-serif text-3xl text-ink">All Products</h1>
            <PlpToolbar
              basePath="/products"
              currentFabric={searchParams.fabric}
              currentSort={sort}
              productCount={products.length}
            />

            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-xl text-ink">No products found</p>
                <p className="mt-2 font-sans text-sm text-charcoal/60">
                  Try a different fabric filter, or check back soon — new pieces are added regularly.
                </p>
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
