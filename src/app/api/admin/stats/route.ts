import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalUsers,
    todayOrders,
    recentOrders,
    topProducts,
    dailyRevenue,
    lowStock,
  ] = await Promise.all([
    // Total revenue from paid orders
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),

    // Total orders
    prisma.order.count(),

    // Pending / processing orders
    prisma.order.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }),

    // Total registered users
    prisma.user.count({ where: { role: "USER" } }),

    // Orders placed today
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),

    // 10 most recent orders
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, status: true, paymentStatus: true, total: true, createdAt: true,
        shippingName: true,
        items: { select: { productName: true }, take: 1 },
      },
    }),

    // Top 5 products by total quantity sold
    prisma.orderItem.groupBy({
      by: ["productId", "productName", "productSlug"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),

    // Daily revenue for last 7 days (raw aggregation per day)
    prisma.order.findMany({
      where: { paymentStatus: "PAID", createdAt: { gte: sevenDaysAgo } },
      select: { total: true, createdAt: true },
    }),

    // Low stock variants (stock <= 5)
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { stock: "asc" },
      take: 10,
    }),
  ]);

  // Build daily revenue map
  const dailyMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = 0;
  }
  for (const order of dailyRevenue) {
    const key = order.createdAt.toISOString().slice(0, 10);
    if (key in dailyMap) dailyMap[key] += parseFloat((order.total as any).toString());
  }

  return NextResponse.json({
    stats: {
      totalRevenue: totalRevenue._sum.total?.toString() ?? "0",
      totalOrders,
      pendingOrders,
      totalUsers,
      todayOrders,
    },
    recentOrders: recentOrders.map((o) => ({
      ...o,
      total: o.total.toString(),
    })),
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      productName: p.productName,
      productSlug: p.productSlug,
      totalSold: p._sum.quantity ?? 0,
    })),
    dailyRevenue: Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue })),
    lowStock: lowStock.map((v) => ({
      id: v.id,
      productName: v.product.name,
      productSlug: v.product.slug,
      size: v.size,
      color: v.color,
      stock: v.stock,
    })),
  });
}
