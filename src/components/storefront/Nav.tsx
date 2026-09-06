import Link from "next/link";
<<<<<<< HEAD
import { cookies } from "next/headers";
import { Container } from "@/components/ui/Layout";
import { CART_COOKIE } from "@/lib/cart-session";
import { getCartItemCount } from "@/server/services/cart";
=======
import { Container } from "@/components/ui/Layout";
>>>>>>> 2dbe9de1761928c1534f5e2cb75c28dc3284ff88

const links = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/collections", label: "Collections" },
  { href: "/unstitched", label: "Unstitched" },
  { href: "/fabric", label: "Fabric" },
  { href: "/sale", label: "Sale" },
];

<<<<<<< HEAD
export async function Nav() {
  const sessionId = cookies().get(CART_COOKIE)?.value;
  const cartCount = await getCartItemCount(sessionId);

=======
export function Nav() {
>>>>>>> 2dbe9de1761928c1534f5e2cb75c28dc3284ff88
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
<<<<<<< HEAD
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
=======
            Cart
>>>>>>> 2dbe9de1761928c1534f5e2cb75c28dc3284ff88
          </Link>
        </div>
      </Container>
    </header>
  );
}
