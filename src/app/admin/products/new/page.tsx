import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/server/actions/admin-product-actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Add Product</h1>
      <ProductForm action={createProductAction} defaults={{}} categories={categories} submitLabel="Create Product" />
    </div>
  );
}
