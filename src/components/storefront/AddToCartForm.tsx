"use client";

import { useFormStatus } from "react-dom";
import { addToCartAction, buyNowAction } from "@/server/actions/cart-actions";
import { Button } from "@/components/ui/Button";

function SubmitButton({ inStock, label, pendingLabel, variant }: { inStock: boolean; label: string; pendingLabel: string; variant?: "primary" | "outline" }) {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" size="lg" type="submit" variant={variant} disabled={!inStock || pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function AddToCartForm({ productId, inStock }: { productId: string; inStock: boolean }) {
  return (
    <form action={addToCartAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={1} />
      <SubmitButton inStock={inStock} label="Add to Cart" pendingLabel="Adding..." />
    </form>
  );
}

export function BuyNowForm({ productId, inStock }: { productId: string; inStock: boolean }) {
  return (
    <form action={buyNowAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={1} />
      <SubmitButton inStock={inStock} label="Buy Now" pendingLabel="Preparing..." variant="outline" />
    </form>
  );
}
