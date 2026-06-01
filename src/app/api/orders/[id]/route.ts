import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: user.userId },
    include: { items: true },
  });

  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  return NextResponse.json({
    order: {
      ...order,
      subtotal: order.subtotal.toString(),
      shippingCost: order.shippingCost.toString(),
      total: order.total.toString(),
      items: order.items.map((i) => ({ ...i, price: i.price.toString() })),
    },
  });
}
