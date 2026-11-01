import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { PlpToolbar } from "@/components/storefront/PlpToolbar";
import { Container, Section } from "@/components/ui/Layout";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProducts, SortOption } from "@/server/services/catalog";

const VALID_FABRICS = ["lawn", "chiffon", "linen", "khaddar"];

// Sort is query-string driven and stock/price must stay current.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const name = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return { title: `${name} — NAYAAB`, description: `Shop premium ${name} unstitched fashion from NAYAAB.` };
}

export default async function FabricPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string };
}) {
  if (!VALID_FABRICS.includes(params.slug)) notFound();

  const fabricName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  const sort = (searchParams.sort as SortOption) ?? "featured";
  const products = await getProducts({ fabric: fabricName, sort });

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Section className="pb-24 pt-10">
          <Container>
            <h1 className="mb-2 font-serif text-3xl text-ink">{fabricName}</h1>
            <PlpToolbar basePath={`/fabric/${params.slug}`} currentFabric={fabricName} currentSort={sort} productCount={products.length} />

            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-xl text-ink">No products in {fabricName} right now</p>
                <p className="mt-2 font-sans text-sm text-charcoal/60">Check back soon, or browse all products.</p>
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
