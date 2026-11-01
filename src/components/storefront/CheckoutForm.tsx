"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useMemo } from "react";
import { placeOrderAction, CheckoutFormState } from "@/server/actions/checkout-actions";

const initialState: CheckoutFormState = {};

function Field({
  name,
  label,
  type = "text",
  required = true,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-sans text-xs uppercase tracking-wide2 text-ink">
        {label}
        {!required && " (optional)"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full border border-border bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-ink"
      />
      {error && <p className="mt-1 font-sans text-xs text-error">{error}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-ink px-6 py-4 font-sans text-sm uppercase tracking-wide2 text-ivory transition-colors hover:bg-charcoal disabled:opacity-50"
    >
      {pending ? "Placing Order..." : "Place Order — Cash on Delivery"}
    </button>
  );
}

export function CheckoutForm() {
  const [state, formAction] = useFormState(placeOrderAction, initialState);

  // Regenerated per page load; server keys idempotency off this so a
  // doubled/retried submit never creates two orders.
  const idempotencyKey = useMemo(
    () => (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now())),
    []
  );

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

      {state.error && (
        <div className="border border-error bg-error/5 px-4 py-3 font-sans text-sm text-error">{state.error}</div>
      )}

      <Field name="fullName" label="Full Name" error={fieldErrors.fullName} />
      <Field name="phone" label="Phone Number" type="tel" error={fieldErrors.phone} />
      <Field name="email" label="Email" type="email" required={false} error={fieldErrors.email} />
      <Field name="addressLine" label="Complete Address" error={fieldErrors.addressLine} />

      <div className="grid grid-cols-2 gap-4">
        <Field name="city" label="City" error={fieldErrors.city} />
        <Field name="province" label="Province" error={fieldErrors.province} />
      </div>
      <Field name="postalCode" label="Postal Code" required={false} error={fieldErrors.postalCode} />

      <div>
        <label htmlFor="notes" className="font-sans text-xs uppercase tracking-wide2 text-ink">
          Order Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-1.5 w-full border border-border bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-ink"
        />
      </div>

      <div className="border border-border bg-ivoryMuted p-4 font-sans text-sm text-charcoal/80">
        <p className="text-xs uppercase tracking-wide2 text-ink">Payment Method</p>
        <p className="mt-1.5">Cash on Delivery — pay when your order arrives. Nationwide.</p>
      </div>

      <SubmitButton />
    </form>
  );
}
