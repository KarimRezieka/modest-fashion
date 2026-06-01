import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";
import { updateCartItemSchema } from "@/lib/validations/cart";

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

function buildCartResponse(cart: NonNullable<Awaited<ReturnType<typeof prisma.cart.findUnique>>>) {
  const items = (cart as typeof cart & { items: typeof cartInclude.items.include extends never ? never : any[] }).items.map((item: any) => ({
    ...item,
    product: { ...item.product, price: item.product.price.toString(), comparePrice: item.product.comparePrice?.toString() ?? null },
    variant: null,
  }));
  const subtotal = items.reduce((sum: number, i: any) => sum + parseFloat(i.product.price) * i.quantity, 0);
  return { id: cart.id, items, subtotal: subtotal.toFixed(2), itemCount: items.reduce((s: number, i: any) => s + i.quantity, 0) };
}

async function getCartForUser(userId: string) {
  return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateCartItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const item = await prisma.cartItem.findFirst({ where: { id, cartId: cart.id } });
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    await prisma.cartItem.update({ where: { id }, data: { quantity: parsed.data.quantity } });

    const updated = await getCartForUser(user.userId);
    return NextResponse.json({ cart: buildCartResponse(updated!) });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
  if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

  const item = await prisma.cartItem.findFirst({ where: { id, cartId: cart.id } });
  if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

  await prisma.cartItem.delete({ where: { id } });

  const updated = await getCartForUser(user.userId);
  return NextResponse.json({ cart: buildCartResponse(updated!) });
}
