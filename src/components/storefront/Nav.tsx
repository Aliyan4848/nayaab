import Link from "next/link";
import { Container } from "@/components/ui/Layout";

const links = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/collections", label: "Collections" },
  { href: "/unstitched", label: "Unstitched" },
  { href: "/fabric", label: "Fabric" },
  { href: "/sale", label: "Sale" },
];

export function Nav() {
  return (
    <header className="border-b border-border bg-ivory">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide2 text-ink">
          NAYAAB
        </Link>

        <nav className="hidden gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-sans text-xs uppercase tracking-wide2 text-ink/80 transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 font-sans text-xs uppercase tracking-wide2">
          <Link href="/search" aria-label="Search">
            Search
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden md:inline">
            Wishlist
          </Link>
          <Link href="/account" aria-label="Account" className="hidden md:inline">
            Account
          </Link>
          <Link href="/cart" aria-label="Cart">
            Cart
          </Link>
        </div>
      </Container>
    </header>
  );
}
