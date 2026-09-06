"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { loginAction, FormState } from "@/server/actions/admin-auth-actions";

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-ink px-6 py-3.5 font-sans text-sm uppercase tracking-wide2 text-ivory transition-colors hover:bg-charcoal disabled:opacity-50"
    >
      {pending ? "Signing In..." : "Sign In"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const params = useSearchParams();
  const justCreated = params.get("created") === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivoryMuted px-4">
      <div className="w-full max-w-sm border border-border bg-ivory p-8">
        <p className="text-center font-serif text-2xl text-ink">NAYAAB</p>
        <p className="mt-1 text-center font-sans text-xs uppercase tracking-wide2 text-charcoal/50">Admin Login</p>

        {justCreated && (
          <div className="mt-6 border border-emerald bg-emerald/5 px-4 py-3 font-sans text-sm text-emerald">
            Admin account created. Sign in below.
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-4">
          {state.error && (
            <div className="border border-error bg-error/5 px-4 py-3 font-sans text-sm text-error">{state.error}</div>
          )}
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
              className="mt-1.5 w-full border border-border bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-ink"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
