import Image from "next/image";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { Container, Section } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { sampleNewArrivals, fabricCategories } from "@/lib/sample-data";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative flex h-[85vh] min-h-[560px] items-end bg-ink">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80"
            alt="NAYAAB new collection"
            fill
            priority
            className="object-cover opacity-80"
          />
          <Container className="relative z-10 pb-16 text-ivory">
            <p className="font-sans text-xs uppercase tracking-wide2">New Collection</p>
            <h1 className="mt-3 max-w-xl font-serif text-4xl leading-tight md:text-6xl">
              Considered fabric. Considered craft.
            </h1>
            <Link
              href="/new-arrivals"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-ivory px-8 py-4 font-sans text-sm uppercase tracking-wide2 text-ink transition-colors hover:bg-champagneMuted"
            >
              Explore Collection
            </Link>
          </Container>
        </section>

        {/* New Arrivals */}
        <Section>
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-serif text-3xl text-ink">New Arrivals</h2>
              <Link href="/new-arrivals" className="font-sans text-xs uppercase tracking-wide2 text-ink/70">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
              {sampleNewArrivals.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Container>
        </Section>

        {/* Shop by Fabric */}
        <Section className="bg-ivoryMuted">
          <Container>
            <h2 className="mb-10 font-serif text-3xl text-ink">Shop by Fabric</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {fabricCategories.map((f) => (
                <Link key={f.slug} href={`/fabric/${f.slug}`} className="group relative block aspect-[3/4]">
                  <Image
                    src={f.imageUrl}
                    alt={f.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-ink/20" />
                  <p className="absolute bottom-5 left-5 font-serif text-xl text-ivory">{f.name}</p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>

        {/* Brand story */}
        <Section>
          <Container className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1000&q=80"
                alt="NAYAAB craftsmanship"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-wide2 text-ink/60">Our Story</p>
              <h2 className="mt-3 font-serif text-3xl text-ink">
                A quieter kind of luxury
              </h2>
              <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-charcoal/70">
                NAYAAB was founded on a simple belief: that premium fashion doesn&apos;t need to shout. We select
                fabric first, work closely with our print and embroidery partners, and ship every order with the
                same care whether it&apos;s your first with us or your fiftieth.
              </p>
            </div>
          </Container>
        </Section>

        {/* Trust signals */}
        <Section className="bg-ink text-ivory">
          <Container className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { title: "Premium Fabrics", body: "Sourced and inspected before every collection." },
              { title: "Carefully Selected", body: "Every print and embroidery detail reviewed by hand." },
              { title: "Nationwide Delivery", body: "Cash on Delivery available across Pakistan." },
              { title: "Easy Support", body: "Reach us directly on WhatsApp for any order question." },
            ].map((item) => (
              <div key={item.title}>
                <p className="font-serif text-lg">{item.title}</p>
                <p className="mt-2 font-sans text-xs leading-relaxed text-ivory/70">{item.body}</p>
              </div>
            ))}
          </Container>
        </Section>

        {/* Newsletter */}
        <Section>
          <Container className="mx-auto max-w-lg text-center">
            <h2 className="font-serif text-2xl text-ink">Stay in the loop</h2>
            <p className="mt-2 font-sans text-sm text-charcoal/70">
              New arrivals and considered edits, occasionally — no spam.
            </p>
            <form className="mt-6 flex gap-2">
              <input
                type="email"
                required
                placeholder="Your email"
                className="w-full border border-border bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-ink"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
