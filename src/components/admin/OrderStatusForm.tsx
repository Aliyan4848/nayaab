"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateOrderStatusAction, OrderActionState } from "@/server/actions/admin-order-actions";

const NEXT_STATUS_OPTIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["OUT_FOR_DELIVERY", "DELIVERED"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  RETURNED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink px-5 py-2.5 font-sans text-xs uppercase tracking-wide2 text-ivory hover:bg-charcoal disabled:opacity-50"
    >
      {pending ? "Updating..." : "Update Status"}
    </button>
  );
}

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [state, formAction] = useFormState<OrderActionState, FormData>(updateOrderStatusAction, {});
  const options = NEXT_STATUS_OPTIONS[currentStatus] ?? [];

  if (options.length === 0) {
    return <p className="font-sans text-xs text-charcoal/50">No further status changes available for this order.</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="orderId" value={orderId} />

      {state.error && (
        <div className="border border-error bg-error/5 px-3 py-2 font-sans text-xs text-error">{state.error}</div>
      )}
      {state.success && (
        <div className="border border-emerald bg-emerald/5 px-3 py-2 font-sans text-xs text-emerald">
          Status updated.
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="newStatus" className="font-sans text-xs uppercase tracking-wide2 text-ink">
            Move to
          </label>
          <select
            id="newStatus"
            name="newStatus"
            className="mt-1.5 w-full border border-border bg-transparent px-3 py-2 font-sans text-sm outline-none focus:border-ink"
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <SubmitButton />
      </div>

      <div>
        <label htmlFor="note" className="font-sans text-xs uppercase tracking-wide2 text-ink">
          Internal Note (optional)
        </label>
        <input
          id="note"
          name="note"
          className="mt-1.5 w-full border border-border bg-transparent px-3 py-2 font-sans text-sm outline-none focus:border-ink"
        />
      </div>
    </form>
  );
}
