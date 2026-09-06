import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { Container, Section } from "@/components/ui/Layout";

export function ComingSoonPage({ title, note }: { title: string; note?: string }) {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Section className="py-32 text-center">
          <Container>
            <h1 className="font-serif text-3xl text-ink">{title}</h1>
            <p className="mx-auto mt-4 max-w-md font-sans text-sm text-charcoal/60">
              {note ?? "This page is being built in an upcoming phase."}
            </p>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
