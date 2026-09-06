import Link from "next/link";
import { logoutAction } from "@/server/actions/admin-auth-actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border bg-ivory">
      <div className="border-b border-border px-6 py-6">
        <p className="font-serif text-xl text-ink">NAYAAB</p>
        <p className="font-sans text-[11px] uppercase tracking-wide2 text-charcoal/50">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block px-3 py-2 font-sans text-sm text-ink/80 hover:bg-ivoryMuted hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border px-6 py-4">
        <p className="truncate font-sans text-xs text-charcoal/60">{adminEmail}</p>
        <form action={logoutAction} className="mt-2">
          <button type="submit" className="font-sans text-xs uppercase tracking-wide2 text-ink underline">
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}
