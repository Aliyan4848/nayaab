"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

const productSchema = z.object({
  name: z.string().min(2, "Name is required."),
  sku: z.string().min(2, "SKU is required."),
  description: z.string().min(10, "Description is required."),
  shortDescription: z.string().optional(),
  fabric: z.string().optional(),
  shirtFabric: z.string().optional(),
  trouserFabric: z.string().optional(),
  dupattaFabric: z.string().optional(),
  embroideryDetails: z.string().optional(),
  printDetails: z.string().optional(),
  color: z.string().optional(),
  piecesIncluded: z.string().optional(),
  season: z.string().optional(),
  careInstructions: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0."),
  compareAtPrice: z.coerce.number().optional(),
  salePrice: z.coerce.number().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.coerce.boolean().optional(),
  isNewArrival: z.coerce.boolean().optional(),
  isBestseller: z.coerce.boolean().optional(),
  stockQuantity: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  imageUrls: z.string().optional(), // newline-separated URLs, pasted manually until Storage upload ships
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export interface ProductFormState {
  error?: string;
}

async function logAudit(action: string, entityId: string) {
  const admin = await getCurrentAdmin();
  await prisma.auditLog.create({
    data: { adminId: admin?.adminId, action, entityType: "Product", entityId },
  });
}

export async function createProductAction(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const parsed = productSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const data = parsed.data;
  const slug = slugify(data.name);

  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) return { error: `A product with a similar name already exists (slug "${slug}" is taken).` };

  const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existingSku) return { error: `SKU "${data.sku}" is already in use.` };

  const imageUrls = (data.imageUrls ?? "")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      sku: data.sku,
      description: data.description,
      shortDescription: data.shortDescription || null,
      fabric: data.fabric || null,
      shirtFabric: data.shirtFabric || null,
      trouserFabric: data.trouserFabric || null,
      dupattaFabric: data.dupattaFabric || null,
      embroideryDetails: data.embroideryDetails || null,
      printDetails: data.printDetails || null,
      color: data.color || null,
      piecesIncluded: data.piecesIncluded || null,
      season: data.season || null,
      careInstructions: data.careInstructions || null,
      price: data.price,
      compareAtPrice: data.compareAtPrice || null,
      salePrice: data.salePrice || null,
      categoryId: data.categoryId || null,
      status: data.status,
      isFeatured: Boolean(data.isFeatured),
      isNewArrival: Boolean(data.isNewArrival),
      isBestseller: Boolean(data.isBestseller),
      images: {
        create: imageUrls.map((url, i) => ({ url, type: i === 0 ? "front" : "gallery", sortOrder: i })),
      },
      inventory: {
        create: { quantity: data.stockQuantity, lowStockThreshold: data.lowStockThreshold ?? 5 },
      },
    },
  });

  await logAudit("PRODUCT_CREATED", product.id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = productSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const data = parsed.data;

  const skuConflict = await prisma.product.findFirst({ where: { sku: data.sku, id: { not: productId } } });
  if (skuConflict) return { error: `SKU "${data.sku}" is already in use by another product.` };

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      sku: data.sku,
      description: data.description,
      shortDescription: data.shortDescription || null,
      fabric: data.fabric || null,
      shirtFabric: data.shirtFabric || null,
      trouserFabric: data.trouserFabric || null,
      dupattaFabric: data.dupattaFabric || null,
      embroideryDetails: data.embroideryDetails || null,
      printDetails: data.printDetails || null,
      color: data.color || null,
      piecesIncluded: data.piecesIncluded || null,
      season: data.season || null,
      careInstructions: data.careInstructions || null,
      price: data.price,
      compareAtPrice: data.compareAtPrice || null,
      salePrice: data.salePrice || null,
      categoryId: data.categoryId || null,
      status: data.status,
      isFeatured: Boolean(data.isFeatured),
      isNewArrival: Boolean(data.isNewArrival),
      isBestseller: Boolean(data.isBestseller),
    },
  });

  await prisma.inventory.updateMany({
    where: { productId },
    data: { quantity: data.stockQuantity, lowStockThreshold: data.lowStockThreshold ?? 5 },
  });

  await logAudit("PRODUCT_EDITED", productId);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  redirect("/admin/products");
}

export async function archiveProductAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) throw new Error("Missing product.");

  await prisma.product.update({ where: { id: productId }, data: { status: "ARCHIVED" } });
  await logAudit("PRODUCT_ARCHIVED", productId);
  revalidatePath("/admin/products");
}

export async function publishProductAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) throw new Error("Missing product.");

  await prisma.product.update({ where: { id: productId }, data: { status: "PUBLISHED" } });
  await logAudit("PRODUCT_PUBLISHED", productId);
  revalidatePath("/admin/products");
}
