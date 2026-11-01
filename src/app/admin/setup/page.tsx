"use client";

import { useFormState, useFormStatus } from "react-dom";
import { setupFirstAdminAction, FormState } from "@/server/actions/admin-auth-actions";

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-ink px-6 py-3.5 font-sans text-sm uppercase tracking-wide2 text-ivory transition-colors hover:bg-charcoal disabled:opacity-50"
    >
      {pending ? "Creating Account..." : "Create Admin Account"}
    </button>
  );
}

export default function AdminSetupPage() {
  const [state, formAction] = useFormState(setupFirstAdminAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivoryMuted px-4">
      <div className="w-full max-w-sm border border-border bg-ivory p-8">
        <p className="text-center font-serif text-2xl text-ink">NAYAAB</p>
        <p className="mt-1 text-center font-sans text-xs uppercase tracking-wide2 text-charcoal/50">
          First Admin Setup
        </p>
        <p className="mt-4 font-sans text-xs text-charcoal/60">
          This page only works once — before any admin account exists — and requires the{" "}
          <code className="text-ink">ADMIN_SETUP_TOKEN</code> value from your environment variables.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          {state.error && (
            <div className="border border-error bg-error/5 px-4 py-3 font-sans text-sm text-error">{state.error}</div>
          )}

          <div>
            <label htmlFor="token" className="font-sans text-xs uppercase tracking-wide2 text-ink">
              Setup Token
            </label>
            <input
              id="token"
              name="token"
              type="password"
              required
              className="mt-1.5 w-full border border-border bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="name" className="font-sans text-xs uppercase tracking-wide2 text-ink">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1.5 w-full border border-border bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="email" className="font-sans text-xs uppercase tracking-wide2 text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1.5 w-full border border-border bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-sans text-xs uppercase tracking-wide2 text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={10}
              className="mt-1.5 w-full border border-border bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-ink"
            />
            <p className="mt-1 font-sans text-xs text-charcoal/50">At least 10 characters.</p>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
