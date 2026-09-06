import { Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCardData } from "@/components/ui/ProductCard";

export type SortOption = "featured" | "newest" | "price_asc" | "price_desc" | "bestselling";

export interface ProductFilters {
  fabric?: string;
  categorySlug?: string;
  collectionSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}

const sortToOrderBy: Record<SortOption, Prisma.ProductOrderByWithRelationInput> = {
  featured: { isFeatured: "desc" },
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  bestselling: { isBestseller: "desc" },
};

function toProductCard(
  product: Prisma.ProductGetPayload<{ include: { images: true } }>
): ProductCardData {
  const sorted = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const front = sorted.find((i) => i.type === "front") ?? sorted[0];
  const hover = sorted.find((i) => i.id !== front?.id);

  return {
    slug: product.slug,
    name: product.name,
    fabric: product.fabric,
    price: Number(product.salePrice ?? product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : product.salePrice ? Number(product.price) : null,
    imageUrl: front?.url ?? "/placeholder-product.jpg",
    hoverImageUrl: hover?.url ?? null,
    isNewArrival: product.isNewArrival,
  };
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductCardData[]> {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
    ...(filters.fabric ? { fabric: { equals: filters.fabric, mode: "insensitive" } } : {}),
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.collectionSlug ? { collection: { slug: filters.collectionSlug } } : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            ...(filters.minPrice ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
  };

  const products = await prisma.product.findMany({
    where,
    include: { images: true },
    orderBy: sortToOrderBy[filters.sort ?? "featured"],
  });

  return products.map(toProductCard);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: ProductStatus.PUBLISHED },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      videos: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      category: true,
      collection: true,
      reviews: { where: { status: "APPROVED" }, include: { images: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedProducts(product: { id: string; categoryId: string | null; fabric: string | null }) {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.PUBLISHED,
      id: { not: product.id },
      OR: [
        product.categoryId ? { categoryId: product.categoryId } : undefined,
        product.fabric ? { fabric: product.fabric } : undefined,
      ].filter(Boolean) as Prisma.ProductWhereInput[],
    },
    include: { images: true },
    take: 4,
  });
  return products.map(toProductCard);
}

export async function getFabricCategories() {
  return prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
}
