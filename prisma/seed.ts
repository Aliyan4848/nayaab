import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

// -----------------------------------------------------------------------
// DEMO / SEED DATA — safe to delete entirely.
// Every product below is tagged `metadata: { seed: true }` so it can be
// bulk-identified and removed from Admin before going live:
//   npx prisma db execute --stdin <<< "delete from products where metadata->>'seed' = 'true';"
// No fake reviews, counts, or claims are seeded — those must stay empty
// until real ones exist, per project rules.
// -----------------------------------------------------------------------

const FABRIC_IMAGE: Record<string, string> = {
  Lawn: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
  Chiffon: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&q=80",
  Linen: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=1200&q=80",
  Khaddar: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=1200&q=80",
};

async function main() {
  console.log("Seeding NAYAAB demo data...");

  // Categories
  const categories = await Promise.all(
    ["Lawn", "Chiffon", "Linen", "Khaddar"].map((name, i) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase() },
        update: {},
        create: { name, slug: name.toLowerCase(), sortOrder: i, isActive: true },
      })
    )
  );

  const newArrivalsCollection = await prisma.collection.upsert({
    where: { slug: "new-arrivals" },
    update: {},
    create: { name: "New Arrivals", slug: "new-arrivals", isActive: true, isFeatured: true },
  });

  const festiveCollection = await prisma.collection.upsert({
    where: { slug: "festive-edit" },
    update: {},
    create: { name: "Festive Edit", slug: "festive-edit", isActive: true, isFeatured: true },
  });

  const demoProducts = [
    {
      name: "Zaraen — Embroidered Lawn, 3-Piece",
      slug: "zaraen-embroidered-lawn",
      sku: "NAY-LAWN-001",
      fabricCategory: "Lawn",
      collection: newArrivalsCollection,
      description:
        "A hand-finished embroidered lawn set, cut for a relaxed silhouette with a fully embroidered front and coordinating dupatta.",
      shortDescription: "Embroidered lawn, 3-piece with chiffon dupatta.",
      piecesIncluded: "3-Piece (Shirt, Trouser, Dupatta)",
      shirtFabric: "Embroidered Lawn, 3.25m",
      trouserFabric: "Cambric, 2.5m",
      dupattaFabric: "Chiffon, 2.5m",
      embroideryDetails: "Thread embroidery on front, embroidered border on dupatta.",
      printDetails: null,
      color: "Ivory / Rust",
      season: "Spring/Summer",
      careInstructions: "Dry clean recommended for embroidered panels. Hand wash cold otherwise.",
      price: 8900,
      compareAtPrice: null,
      isFeatured: true,
      isNewArrival: true,
      isBestseller: false,
    },
    {
      name: "Meherbano — Chiffon Dupatta Set",
      slug: "meherbano-chiffon-dupatta-set",
      sku: "NAY-CHF-014",
      fabricCategory: "Chiffon",
      collection: festiveCollection,
      description:
        "An occasion-ready set built around a heavily embellished chiffon dupatta, paired with a lightly embroidered shirt.",
      shortDescription: "Festive chiffon set with embellished dupatta.",
      piecesIncluded: "3-Piece (Shirt, Trouser, Dupatta)",
      shirtFabric: "Raw Silk, 2.5m",
      trouserFabric: "Raw Silk, 2.5m",
      dupattaFabric: "Embellished Chiffon, 2.5m",
      embroideryDetails: "Sequin and thread embroidery on dupatta pallu, light embroidery on shirt neckline.",
      printDetails: null,
      color: "Maroon",
      season: "Festive/Winter",
      careInstructions: "Dry clean only.",
      price: 11500,
      compareAtPrice: 13500,
      isFeatured: true,
      isNewArrival: true,
      isBestseller: true,
    },
    {
      name: "Sehr — Printed Linen, 2-Piece",
      slug: "sehr-printed-linen",
      sku: "NAY-LIN-007",
      fabricCategory: "Linen",
      collection: newArrivalsCollection,
      description:
        "A digitally printed linen shirt and trouser set in a muted floral print, designed for everyday wear.",
      shortDescription: "Printed linen, 2-piece, everyday wear.",
      piecesIncluded: "2-Piece (Shirt, Trouser)",
      shirtFabric: "Printed Linen, 3m",
      trouserFabric: "Dyed Linen, 2.5m",
      dupattaFabric: null,
      embroideryDetails: null,
      printDetails: "All-over digital floral print.",
      color: "Sage Green",
      season: "Autumn",
      careInstructions: "Machine wash cold, line dry.",
      price: 6400,
      compareAtPrice: null,
      isFeatured: false,
      isNewArrival: true,
      isBestseller: false,
    },
    {
      name: "Roshni — Khaddar Winter Set",
      slug: "roshni-khaddar-winter-set",
      sku: "NAY-KHD-003",
      fabricCategory: "Khaddar",
      collection: null,
      description:
        "A heavyweight khaddar set with block-print detailing, made for cold-weather everyday wear.",
      shortDescription: "Block-printed khaddar, 3-piece winter set.",
      piecesIncluded: "3-Piece (Shirt, Trouser, Shawl)",
      shirtFabric: "Khaddar, 3m",
      trouserFabric: "Khaddar, 2.5m",
      dupattaFabric: "Wool Shawl, 2.5m",
      embroideryDetails: null,
      printDetails: "Hand block print on shirt front and sleeves.",
      color: "Charcoal",
      season: "Winter",
      careInstructions: "Dry clean recommended.",
      price: 9800,
      compareAtPrice: null,
      isFeatured: false,
      isNewArrival: false,
      isBestseller: true,
    },
  ];

  for (const p of demoProducts) {
    const category = categories.find((c) => c.name === p.fabricCategory);

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        shortDescription: p.shortDescription,
        fabric: p.fabricCategory,
        shirtFabric: p.shirtFabric,
        trouserFabric: p.trouserFabric,
        dupattaFabric: p.dupattaFabric,
        embroideryDetails: p.embroideryDetails,
        printDetails: p.printDetails,
        color: p.color,
        piecesIncluded: p.piecesIncluded,
        season: p.season,
        careInstructions: p.careInstructions,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        status: ProductStatus.PUBLISHED,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestseller: p.isBestseller,
        categoryId: category?.id,
        collectionId: p.collection?.id,
        metadata: { seed: true },
        images: {
          create: [
            { url: FABRIC_IMAGE[p.fabricCategory], altText: `${p.name} — front`, type: "front", sortOrder: 0 },
            { url: FABRIC_IMAGE[p.fabricCategory], altText: `${p.name} — fabric detail`, type: "fabric_texture", sortOrder: 1 },
          ],
        },
        inventory: {
          create: { quantity: 25, reservedQuantity: 0, lowStockThreshold: 5 },
        },
      },
    });

    console.log(`  seeded: ${product.name}`);
  }

  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      brandName: "NAYAAB",
      whatsappNumber: "+92XXXXXXXXXX",
      shippingFee: 250,
      freeShippingThreshold: 10000,
      codAvailable: true,
      announcementBarText: "Nationwide Delivery · Cash on Delivery Available · WhatsApp Support",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
