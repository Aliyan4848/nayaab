// Fallback fabric imagery used only when a Category record has no imageUrl
// set in Admin yet. Product data itself now comes from Prisma
// (src/server/services/catalog.ts) — nothing product-related lives here.
export const fabricCategories = [
  { name: "Lawn", slug: "lawn", imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80" },
  { name: "Chiffon", slug: "chiffon", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80" },
  { name: "Linen", slug: "linen", imageUrl: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&q=80" },
  { name: "Khaddar", slug: "khaddar", imageUrl: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&q=80" },
];
