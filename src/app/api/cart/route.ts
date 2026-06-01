import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";

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

function formatCart(cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  const items = cart.items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: item.product.price.toString(),
      comparePrice: item.product.comparePrice?.toString() ?? null,
    },
    variant: null,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return {
    id: cart.id,
    items,
    subtotal: subtotal.toFixed(2),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId }, include: cartInclude });
  }
  return cart;
}

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const cart = await getOrCreateCart(user.userId);
  return NextResponse.json({ cart: formatCart(cart) });
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return NextResponse.json({ message: "Cart cleared" });
}
