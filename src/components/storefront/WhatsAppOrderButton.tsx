import { buildWhatsAppOrderLink } from "@/server/notifications/whatsapp-provider";

export function WhatsAppOrderButton({
  productName,
  sku,
  productUrl,
}: {
  productName: string;
  sku: string;
  productUrl: string;
}) {
  const businessNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ?? "+92XXXXXXXXXX";
  const href = buildWhatsAppOrderLink({ businessNumber, productName, sku, productUrl });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 border border-ink px-6 py-3.5 font-sans text-sm uppercase tracking-wide2 text-ink transition-colors hover:bg-ink hover:text-ivory"
    >
      Order on WhatsApp
    </a>
  );
}
