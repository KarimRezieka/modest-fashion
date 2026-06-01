import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@modest.com" },
    update: {},
    create: {
      email: "admin@modest.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      provider: "EMAIL",
    },
  });
  console.log("Admin user:", admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "abayas" },
      update: {},
      create: { name: "Abayas", slug: "abayas", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "hoodies" },
      update: {},
      create: { name: "Hoodies", slug: "hoodies", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "pants" },
      update: {},
      create: { name: "Pants", slug: "pants", sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "essentials" },
      update: {},
      create: { name: "Essentials", slug: "essentials", sortOrder: 4 },
    }),
  ]);
  console.log("Categories:", categories.map((c) => c.name).join(", "));

  // Sample products
  const products = [
    {
      name: "Classic Oversized Abaya",
      slug: "classic-oversized-abaya",
      description: "A refined minimal abaya in premium matte crepe. Oversized silhouette, clean lines, no embellishment.",
      price: 1200,
      comparePrice: 1500,
      categoryId: categories[0].id,
      featured: true,
      variants: [
        { size: "XS", stock: 5 },
        { size: "S",  stock: 8 },
        { size: "M",  stock: 12 },
        { size: "L",  stock: 6 },
        { size: "XL", stock: 3 },
      ],
    },
    {
      name: "MODEST Essential Hoodie",
      slug: "modest-essential-hoodie",
      description: "400gsm heavyweight cotton fleece. Dropped shoulders, ribbed hem, minimal branding.",
      price: 650,
      categoryId: categories[1].id,
      featured: true,
      variants: [
        { size: "S",  color: "Black",     colorHex: "#0B0B0B", stock: 15 },
        { size: "M",  color: "Black",     colorHex: "#0B0B0B", stock: 20 },
        { size: "L",  color: "Black",     colorHex: "#0B0B0B", stock: 14 },
        { size: "M",  color: "Off White", colorHex: "#F5F1EB", stock: 10 },
        { size: "L",  color: "Off White", colorHex: "#F5F1EB", stock: 8 },
        { size: "M",  color: "Olive",     colorHex: "#7A8471", stock: 6 },
      ],
    },
    {
      name: "Wide Leg Trouser",
      slug: "wide-leg-trouser",
      description: "Fluid wide-leg cut in a linen-cotton blend. High rise, clean front, no pleats.",
      price: 480,
      categoryId: categories[2].id,
      variants: [
        { size: "S", stock: 4 },
        { size: "M", stock: 9 },
        { size: "L", stock: 5 },
      ],
    },
    {
      name: "Oversized Tee",
      slug: "oversized-tee",
      description: "230gsm supima cotton. Boxy silhouette, drop shoulder, clean neck. The wardrobe foundation.",
      price: 280,
      categoryId: categories[3].id,
      variants: [
        { size: "S",  color: "Black",     colorHex: "#0B0B0B", stock: 20 },
        { size: "M",  color: "Black",     colorHex: "#0B0B0B", stock: 25 },
        { size: "L",  color: "Black",     colorHex: "#0B0B0B", stock: 18 },
        { size: "XL", color: "Black",     colorHex: "#0B0B0B", stock: 10 },
        { size: "S",  color: "Sand",      colorHex: "#D8CBB8", stock: 12 },
        { size: "M",  color: "Sand",      colorHex: "#D8CBB8", stock: 15 },
        { size: "L",  color: "Sand",      colorHex: "#D8CBB8", stock: 8 },
      ],
    },
    {
      name: "Open Front Kimono Abaya",
      slug: "open-front-kimono-abaya",
      description: "Relaxed open-front silhouette in soft viscose. Perfect for layering.",
      price: 950,
      categoryId: categories[0].id,
      variants: [
        { size: "One Size", stock: 3 },
      ],
    },
    {
      name: "Quarter Zip Fleece",
      slug: "quarter-zip-fleece",
      description: "Midweight polar fleece. Quarter zip, dropped shoulders, oversized fit.",
      price: 520,
      categoryId: categories[1].id,
      variants: [
        { size: "S", color: "Olive", colorHex: "#7A8471", stock: 7 },
        { size: "M", color: "Olive", colorHex: "#7A8471", stock: 9 },
        { size: "L", color: "Olive", colorHex: "#7A8471", stock: 5 },
      ],
    },
  ];

  for (const p of products) {
    const { variants, ...data } = p;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        variants: { create: variants },
      },
    });
    console.log("Product:", data.name);
  }

  console.log("\n✓ Seed complete");
  console.log("  Admin login: admin@modest.com / Admin123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
