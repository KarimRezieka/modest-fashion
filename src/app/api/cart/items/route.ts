import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";
import { addToCartSchema } from "@/lib/validations/cart";

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true, name: true, slug: true, price: true, comparePrice: true, inStock: true,
          images: { select: { url: true, alt: true }, orderBy: { position: "asc" as const }, take: 1 },
        },
      },
    },
    orderBy: { id: "asc" as const },
  },
} as const;

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { productId, variantId, quantity } = parsed.data;

    const product = await prisma.product.findUnique({ where: { id: productId, published: true } });
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    if (!product.inStock) return NextResponse.json({ message: "Product is out of stock" }, { status: 400 });

    let cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId: user.userId } });

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId ?? null },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId: variantId ?? null, quantity },
      });
    }

    const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: cartInclude });
    const items = updated!.items.map((item) => ({
      ...item,
      product: { ...item.product, price: item.product.price.toString(), comparePrice: item.product.comparePrice?.toString() ?? null },
      variant: null,
    }));
    const subtotal = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);

    return NextResponse.json({
      cart: { id: cart.id, items, subtotal: subtotal.toFixed(2), itemCount: items.reduce((s, i) => s + i.quantity, 0) },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
