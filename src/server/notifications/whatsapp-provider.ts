// WhatsApp notification abstraction — Phase 7 wires the real send() call.
// Manual ordering (wa.me deep links) never depends on this and always works,
// per the spec: "If the API is not configured, WhatsApp manual ordering
// must still work."

export interface WhatsAppMessage {
  to: string; // E.164 phone number
  body: string;
}

export interface WhatsAppProvider {
  isConfigured(): boolean;
  send(message: WhatsAppMessage): Promise<{ success: boolean; error?: string }>;
}

class MetaCloudApiProvider implements WhatsAppProvider {
  isConfigured(): boolean {
    return Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN);
  }

  async send(message: WhatsAppMessage) {
    if (!this.isConfigured()) {
      return { success: false, error: "WhatsApp Cloud API is not configured." };
    }
    // Real fetch() call to Meta's Graph API goes here in Phase 7 —
    // intentionally not implemented against fake credentials.
    return { success: false, error: "MetaCloudApiProvider.send not yet implemented — Phase 7 build step." };
  }
}

class NoopWhatsAppProvider implements WhatsAppProvider {
  isConfigured() {
    return false;
  }
  async send() {
    return { success: false, error: "WhatsApp notifications are disabled (WHATSAPP_PROVIDER=none)." };
  }
}

export function getWhatsAppProvider(): WhatsAppProvider {
  return process.env.WHATSAPP_PROVIDER === "meta_cloud_api"
    ? new MetaCloudApiProvider()
    : new NoopWhatsAppProvider();
}

/** Builds a wa.me deep link with a prefilled message — always available, no API needed. */
export function buildWhatsAppOrderLink(params: {
  businessNumber: string;
  productName: string;
  sku: string;
  productUrl: string;
  customerNote?: string;
}): string {
  const lines = [
    "NAYAAB — Order request",
    `Product: ${params.productName}`,
    `SKU: ${params.sku}`,
    `Link: ${params.productUrl}`,
  ];
  if (params.customerNote) lines.push(params.customerNote);
  const text = encodeURIComponent(lines.join("\n"));
  const number = params.businessNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${number}?text=${text}`;
}
