import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { id: true, email: true, name: true } },
    },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Validation failed" }, { status: 422 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: parsed.data,
      include: {
        items: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json({
      order: {
        ...order,
        subtotal: order.subtotal.toString(),
        shippingCost: order.shippingCost.toString(),
        total: order.total.toString(),
        items: order.items.map((i) => ({ ...i, price: i.price.toString() })),
      },
    });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
