"use client";

import { useFormState, useFormStatus } from "react-dom";

export interface ProductFormDefaults {
  name?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  fabric?: string;
  shirtFabric?: string;
  trouserFabric?: string;
  dupattaFabric?: string;
  embroideryDetails?: string;
  printDetails?: string;
  color?: string;
  piecesIncluded?: string;
  season?: string;
  careInstructions?: string;
  price?: number;
  compareAtPrice?: number | null;
  salePrice?: number | null;
  categoryId?: string;
  status?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  imageUrls?: string;
}

interface Category {
  id: string;
  name: string;
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-sans text-xs uppercase tracking-wide2 text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
      />
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink px-6 py-3 font-sans text-sm uppercase tracking-wide2 text-ivory hover:bg-charcoal disabled:opacity-50"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export function ProductForm({
  action,
  defaults,
  categories,
  submitLabel,
}: {
  action: (prev: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
  defaults: ProductFormDefaults;
  categories: Category[];
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      {state.error && (
        <div className="border border-error bg-error/5 px-4 py-3 font-sans text-sm text-error">{state.error}</div>
      )}

      <section className="grid grid-cols-2 gap-4">
        <Field name="name" label="Product Name" defaultValue={defaults.name} required />
        <Field name="sku" label="SKU" defaultValue={defaults.sku} required />
      </section>

      <section>
        <label htmlFor="description" className="font-sans text-xs uppercase tracking-wide2 text-ink">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaults.description}
          required
          className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
        />
      </section>

      <section>
        <label htmlFor="shortDescription" className="font-sans text-xs uppercase tracking-wide2 text-ink">
          Short Description
        </label>
        <input
          id="shortDescription"
          name="shortDescription"
          defaultValue={defaults.shortDescription}
          className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
        />
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Field name="fabric" label="Fabric Category (e.g. Lawn)" defaultValue={defaults.fabric} />
        <Field name="color" label="Color" defaultValue={defaults.color} />
        <Field name="piecesIncluded" label="Pieces Included" defaultValue={defaults.piecesIncluded} />
        <Field name="season" label="Season" defaultValue={defaults.season} />
        <Field name="shirtFabric" label="Shirt Fabric" defaultValue={defaults.shirtFabric} />
        <Field name="trouserFabric" label="Trouser Fabric" defaultValue={defaults.trouserFabric} />
        <Field name="dupattaFabric" label="Dupatta Fabric" defaultValue={defaults.dupattaFabric} />
        <Field name="careInstructions" label="Care Instructions" defaultValue={defaults.careInstructions} />
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Field name="embroideryDetails" label="Embroidery Details" defaultValue={defaults.embroideryDetails} />
        <Field name="printDetails" label="Print Details" defaultValue={defaults.printDetails} />
      </section>

      <section className="grid grid-cols-3 gap-4">
        <Field name="price" label="Price (PKR)" type="number" defaultValue={defaults.price} required />
        <Field name="compareAtPrice" label="Compare-at Price" type="number" defaultValue={defaults.compareAtPrice ?? undefined} />
        <Field name="salePrice" label="Sale Price" type="number" defaultValue={defaults.salePrice ?? undefined} />
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="font-sans text-xs uppercase tracking-wide2 text-ink">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={defaults.categoryId}
            className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="font-sans text-xs uppercase tracking-wide2 text-ink">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaults.status ?? "DRAFT"}
            className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </section>

      <section className="flex gap-6 font-sans text-sm text-ink">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={defaults.isFeatured} /> Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isNewArrival" defaultChecked={defaults.isNewArrival} /> New Arrival
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isBestseller" defaultChecked={defaults.isBestseller} /> Bestseller
        </label>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Field name="stockQuantity" label="Stock Quantity" type="number" defaultValue={defaults.stockQuantity ?? 0} required />
        <Field name="lowStockThreshold" label="Low Stock Threshold" type="number" defaultValue={defaults.lowStockThreshold ?? 5} />
      </section>

      <section>
        <label htmlFor="imageUrls" className="font-sans text-xs uppercase tracking-wide2 text-ink">
          Image URLs (one per line)
        </label>
        <textarea
          id="imageUrls"
          name="imageUrls"
          rows={4}
          defaultValue={defaults.imageUrls}
          placeholder="https://...&#10;https://..."
          className="mt-1.5 w-full border border-border bg-transparent px-4 py-2.5 font-sans text-sm outline-none focus:border-ink"
        />
        <p className="mt-1.5 font-sans text-xs text-charcoal/50">
          Direct upload with drag-and-drop is a Phase 3/Storage follow-up — paste hosted image URLs for now (e.g.
          from Supabase Storage or Cloudinary after uploading there directly).
        </p>
      </section>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
