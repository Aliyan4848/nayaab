import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Website Settings</h1>
      <SettingsForm
        defaults={{
          brandName: settings?.brandName ?? "NAYAAB",
          contactEmail: settings?.contactEmail ?? undefined,
          whatsappNumber: settings?.whatsappNumber ?? undefined,
          instagramUrl: settings?.instagramUrl ?? undefined,
          facebookUrl: settings?.facebookUrl ?? undefined,
          shippingFee: settings ? Number(settings.shippingFee) : 0,
          freeShippingThreshold: settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : undefined,
          codAvailable: settings?.codAvailable ?? true,
          returnPolicyText: settings?.returnPolicyText ?? undefined,
          exchangePolicyText: settings?.exchangePolicyText ?? undefined,
          announcementBarText: settings?.announcementBarText ?? undefined,
        }}
      />
    </div>
  );
}
