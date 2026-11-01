import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/get-current-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — NAYAAB", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  // Middleware already redirects unauthenticated requests, but layouts
  // render for /admin/login and /admin/setup too (they're under the same
  // segment) — those pages render their own full-page UI, so only wrap
  // authenticated pages with the sidebar shell here.
  if (!admin) return <>{children}</>;

  return (
    <div className="flex bg-ivoryMuted">
      <AdminSidebar adminEmail={admin.email} />
      <main className="min-h-screen flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
