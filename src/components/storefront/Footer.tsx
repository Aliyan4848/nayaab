import Link from "next/link";
import { Container } from "@/components/ui/Layout";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/new-arrivals", label: "New Arrivals" },
      { href: "/collections", label: "Collections" },
      { href: "/sale", label: "Sale" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { href: "/track-order", label: "Track Order" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns & Exchanges" },
      { href: "/faqs", label: "FAQs" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/refund-policy", label: "Refund Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-ivory">
      <Container className="grid grid-cols-2 gap-10 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <p className="font-serif text-2xl tracking-wide2 text-ink">NAYAAB</p>
          <p className="mt-3 max-w-xs font-sans text-sm text-charcoal/70">
            Premium Pakistani women&apos;s unstitched fashion — considered fabric, considered craft.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-sans text-xs uppercase tracking-wide2 text-ink">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-sm text-charcoal/70 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-sans text-xs uppercase tracking-wide2 text-ink">Connect</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="https://wa.me/" className="font-sans text-sm text-charcoal/70 hover:text-ink">
                WhatsApp
              </Link>
            </li>
            <li>
              <Link href="https://instagram.com" className="font-sans text-sm text-charcoal/70 hover:text-ink">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="https://facebook.com" className="font-sans text-sm text-charcoal/70 hover:text-ink">
                Facebook
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border py-5">
        <Container>
          <p className="font-sans text-[11px] text-charcoal/50">
            © {new Date().getFullYear()} NAYAAB. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
