import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";
import { updateProductSchema } from "@/lib/validations/product";

const productSelect = {
  id: true, name: true, slug: true, description: true,
  price: true, comparePrice: true, categoryId: true,
  inStock: true, featured: true, published: true, createdAt: true,
  category: true,
  images: { orderBy: { position: "asc" as const } },
  variants: true,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, published: true },
    select: productSelect,
  });

  if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

  return NextResponse.json({
    product: { ...product, price: product.price.toString(), comparePrice: product.comparePrice?.toString() ?? null },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { slug } = await params;
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ message: "Product not found" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    const { images, variants, ...productData } = parsed.data;

    const product = await prisma.product.update({
      where: { slug },
      data: {
        ...productData,
        ...(images && {
          images: { deleteMany: {}, create: images },
        }),
        ...(variants && {
          variants: { deleteMany: {}, create: variants },
        }),
      },
      select: productSelect,
    });

    return NextResponse.json({
      product: { ...product, price: product.price.toString(), comparePrice: product.comparePrice?.toString() ?? null },
    });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { slug } = await params;
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ message: "Product not found" }, { status: 404 });

  await prisma.product.delete({ where: { slug } });
  return NextResponse.json({ message: "Product deleted" });
}
