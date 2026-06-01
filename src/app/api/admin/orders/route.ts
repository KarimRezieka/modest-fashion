import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const status = searchParams.get("status") ?? "";
  const search = searchParams.get("search") ?? "";

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { shippingName: { contains: search, mode: "insensitive" } },
      { id: { contains: search, mode: "insensitive" } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: { select: { productName: true, quantity: true }, take: 3 },
        user: { select: { email: true, name: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    orders: orders.map((o) => ({
      ...o,
      subtotal: o.subtotal.toString(),
      shippingCost: o.shippingCost.toString(),
      total: o.total.toString(),
      items: o.items.map((i) => i),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
