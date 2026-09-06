import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { Container, Section } from "@/components/ui/Layout";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProducts } from "@/server/services/catalog";

export const metadata = { title: "New Arrivals — NAYAAB" };

// No per-request params here — cache and refresh periodically rather than
// forcing a DB round trip on every request.
export const revalidate = 60;

export default async function NewArrivalsPage() {
  const all = await getProducts({ sort: "newest" });
  const newOnly = all.filter((p) => p.isNewArrival);
  const products = newOnly.length > 0 ? newOnly : all;

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Section className="pb-24 pt-10">
          <Container>
            <h1 className="mb-10 font-serif text-3xl text-ink">New Arrivals</h1>
            {products.length === 0 ? (
              <p className="py-24 text-center font-sans text-sm text-charcoal/60">
                No new arrivals published yet — check back soon.
              </p>
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
