import { ProductCardData } from "@/components/ui/ProductCard";

// Placeholder catalog data — Phase 4 replaces this with real Prisma queries
// against seeded products. Clearly isolated in one file so it's obvious
// what to rip out later.
export const sampleNewArrivals: ProductCardData[] = [
  {
    slug: "zaraen-embroidered-lawn",
    name: "Zaraen — Embroidered Lawn, 3-Piece",
    fabric: "Lawn",
    price: 8900,
    compareAtPrice: null,
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    hoverImageUrl: "https://images.unsplash.com/photo-1610030469668-8e9f7e6c1b3e?w=800&q=80",
    isNewArrival: true,
  },
  {
    slug: "meherbano-chiffon-dupatta-set",
    name: "Meherbano — Chiffon Dupatta Set",
    fabric: "Chiffon",
    price: 11500,
    compareAtPrice: 13500,
    imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
    isNewArrival: true,
  },
  {
    slug: "sehr-printed-linen",
    name: "Sehr — Printed Linen, 2-Piece",
    fabric: "Linen",
    price: 6400,
    compareAtPrice: null,
    imageUrl: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&q=80",
    isNewArrival: true,
  },
  {
    slug: "roshni-khaddar-winter-set",
    name: "Roshni — Khaddar Winter Set",
    fabric: "Khaddar",
    price: 9800,
    compareAtPrice: null,
    imageUrl: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80",
    isNewArrival: false,
  },
];

export const fabricCategories = [
  { name: "Lawn", slug: "lawn", imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80" },
  { name: "Chiffon", slug: "chiffon", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80" },
  { name: "Linen", slug: "linen", imageUrl: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&q=80" },
  { name: "Khaddar", slug: "khaddar", imageUrl: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&q=80" },
];
