import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";
import { createProductSchema } from "@/lib/validations/product";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") ?? "12")));
  const category = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const minPrice = parseFloat(searchParams.get("minPrice") ?? "0") || 0;
  const maxPrice = parseFloat(searchParams.get("maxPrice") ?? "0") || 0;
  const featured = searchParams.get("featured") === "true";

  const where: Prisma.ProductWhereInput = { published: true };

  if (category) where.category = { slug: category };
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (featured) where.featured = true;
  if (minPrice > 0) where.price = { gte: minPrice };
  if (maxPrice > 0) where.price = { ...((where.price as object) ?? {}), lte: maxPrice };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" }
    : sort === "price_desc" ? { price: "desc" }
    : sort === "oldest" ? { createdAt: "asc" }
    : sort === "featured" ? { featured: "desc" }
    : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, name: true, slug: true, price: true, comparePrice: true,
        inStock: true, featured: true,
        category: { select: { name: true, slug: true } },
        images: { select: { url: true, alt: true }, orderBy: { position: "asc" }, take: 2 },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({ ...p, price: p.price.toString(), comparePrice: p.comparePrice?.toString() ?? null })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { images, variants, ...productData } = parsed.data;

    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (existing) return NextResponse.json({ message: "Slug already in use" }, { status: 409 });

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: { create: images },
        variants: { create: variants },
      },
      include: { images: true, variants: true, category: true },
    });

    return NextResponse.json(
      { product: { ...product, price: product.price.toString(), comparePrice: product.comparePrice?.toString() ?? null } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
