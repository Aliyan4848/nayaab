import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "@/server/actions/admin-product-actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { inventory: true, images: { orderBy: { sortOrder: "asc" } } } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Edit Product — {product.name}</h1>
      <ProductForm
        action={boundAction}
        categories={categories}
        submitLabel="Save Changes"
        defaults={{
          name: product.name,
          sku: product.sku,
          description: product.description,
          shortDescription: product.shortDescription ?? undefined,
          fabric: product.fabric ?? undefined,
          shirtFabric: product.shirtFabric ?? undefined,
          trouserFabric: product.trouserFabric ?? undefined,
          dupattaFabric: product.dupattaFabric ?? undefined,
          embroideryDetails: product.embroideryDetails ?? undefined,
          printDetails: product.printDetails ?? undefined,
          color: product.color ?? undefined,
          piecesIncluded: product.piecesIncluded ?? undefined,
          season: product.season ?? undefined,
          careInstructions: product.careInstructions ?? undefined,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          categoryId: product.categoryId ?? undefined,
          status: product.status,
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
          isBestseller: product.isBestseller,
          stockQuantity: product.inventory?.quantity ?? 0,
          lowStockThreshold: product.inventory?.lowStockThreshold ?? 5,
          imageUrls: product.images.map((i) => i.url).join("\n"),
        }}
      />
    </div>
  );
}
