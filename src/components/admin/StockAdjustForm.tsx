"use client";

import { useFormState, useFormStatus } from "react-dom";
import { adjustStockAction, InventoryActionState } from "@/server/actions/admin-inventory-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink px-3 py-1.5 font-sans text-xs uppercase tracking-wide2 text-ivory hover:bg-charcoal disabled:opacity-50"
    >
      {pending ? "Saving..." : "Adjust"}
    </button>
  );
}

export function StockAdjustForm({ inventoryId }: { inventoryId: string }) {
  const [state, formAction] = useFormState<InventoryActionState, FormData>(adjustStockAction, {});

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="inventoryId" value={inventoryId} />
      <input
        type="number"
        name="change"
        placeholder="+/-"
        required
        className="w-20 border border-border bg-transparent px-2 py-1.5 font-sans text-sm outline-none focus:border-ink"
      />
      <input
        type="text"
        name="reason"
        placeholder="Reason"
        required
        className="w-40 border border-border bg-transparent px-2 py-1.5 font-sans text-sm outline-none focus:border-ink"
      />
      <SubmitButton />
      {state.error && <span className="font-sans text-xs text-error">{state.error}</span>}
    </form>
  );
}
