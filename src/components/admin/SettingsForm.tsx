"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateSiteSettingsAction, SettingsActionState } from "@/server/actions/admin-settings-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink px-6 py-3 font-sans text-sm uppercase tracking-wide2 text-ivory hover:bg-charcoal disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save Settings"}
    </button>
  );
}

export interface SettingsDefaults {
  brandName: string;
  contactEmail?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  shippingFee: number;
  freeShippingThreshold?: number;
  codAvailable: boolean;
  returnPolicyText?: string;
  exchangePolicyText?: string;
  announcementBarText?: string;
}

export function SettingsForm({ defaults }: { defaults: SettingsDefaults }) {
  const [state, formAction] = useFormState<SettingsActionState, FormData>(updateSiteSettingsAction, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error && (
        <div className="border border-error bg-error/5 px-4 py-3 font-sans text-sm text-error">{state.error}</div>
      )}
      {state.success && (
        <div className="border border-emerald bg-emerald/5 px-4 py-3 font-sans text-sm text-emerald">
          Settings saved.
        </div>
      )}

      <div>
        <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Brand Name</label>
        <input
          name="brandName"
          defaultValue={defaults.brandName}
          required
          className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Contact Email</label>
          <input
            name="contactEmail"
            type="email"
            defaultValue={defaults.contactEmail}
            className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="font-sans text-xs uppercase tracking-wide2 text-ink">WhatsApp Number</label>
          <input
            name="whatsappNumber"
            placeholder="+92XXXXXXXXXX"
            defaultValue={defaults.whatsappNumber}
            className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Instagram URL</label>
          <input
            name="instagramUrl"
            defaultValue={defaults.instagramUrl}
            className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Facebook URL</label>
          <input
            name="facebookUrl"
            defaultValue={defaults.facebookUrl}
            className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Shipping Fee (PKR)</label>
          <input
            name="shippingFee"
            type="number"
            defaultValue={defaults.shippingFee}
            required
            className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Free Shipping Threshold</label>
          <input
            name="freeShippingThreshold"
            type="number"
            defaultValue={defaults.freeShippingThreshold}
            className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 font-sans text-sm text-ink">
        <input type="checkbox" name="codAvailable" defaultChecked={defaults.codAvailable} /> Cash on Delivery available
      </label>

      <div>
        <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Announcement Bar Text</label>
        <input
          name="announcementBarText"
          defaultValue={defaults.announcementBarText}
          className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Return Policy Text</label>
        <textarea
          name="returnPolicyText"
          rows={3}
          defaultValue={defaults.returnPolicyText}
          className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="font-sans text-xs uppercase tracking-wide2 text-ink">Exchange Policy Text</label>
        <textarea
          name="exchangePolicyText"
          rows={3}
          defaultValue={defaults.exchangePolicyText}
          className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
