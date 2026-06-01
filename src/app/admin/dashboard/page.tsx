"use client";

import Link from "next/link";
import { TrendingUp, ShoppingBag, Users, Clock, Package, AlertTriangle } from "lucide-react";
import { useAdminStats } from "@/hooks/useAdmin";
import { StatCard } from "@/components/admin/stat-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { adminService } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import type { OrderStatus } from "@/types/order";

export default function AdminDashboardPage() {
  const { data, loading } = useAdminStats();
  const accessToken = useAuthStore((s) => s.accessToken);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    if (!accessToken) return;
    await adminService.updateOrderStatus(id, status, accessToken);
  };

  if (loading || !data) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-[#F5F1EB]/8 p-6 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, recentOrders, topProducts, dailyRevenue, lowStock } = data;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#F5F1EB] tracking-wide">Dashboard</h1>
        <p className="text-xs text-[#F5F1EB]/30 mt-1">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value={`EGP ${parseFloat(stats.totalRevenue).toLocaleString()}`}
          icon={TrendingUp}
          accent
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          sub={`${stats.todayOrders} today`}
          icon={ShoppingBag}
        />
        <StatCard
          label="Pending"
          value={stats.pendingOrders}
          sub="Need action"
          icon={Clock}
        />
        <StatCard
          label="Customers"
          value={stats.totalUsers}
          icon={Users}
        />
      </div>

      {/* Revenue Chart */}
      <div className="mb-8">
        <RevenueChart data={dailyRevenue} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 border border-[#F5F1EB]/10">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F1EB]/8">
            <p className="text-[10px] tracking-widest uppercase text-[#F5F1EB]/40">Recent Orders</p>
            <Link href="/admin/orders" className="text-[10px] tracking-widest uppercase text-[#7A8471] hover:text-[#7A8471]/70 transition-colors">
              View All
            </Link>
          </div>
          <div>
            {recentOrders.slice(0, 6).map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_120px_100px] gap-4 px-6 py-3.5 border-b border-[#F5F1EB]/5 hover:bg-[#F5F1EB]/2 transition-colors items-center"
              >
                <div>
                  <Link href={`/admin/orders/${order.id}`} className="text-xs text-[#F5F1EB]/70 hover:text-[#F5F1EB] font-mono transition-colors">
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                  <p className="text-[10px] text-[#F5F1EB]/30 mt-0.5 truncate">{order.shippingName}</p>
                </div>
                <span className="text-xs text-[#F5F1EB]/60">EGP {parseFloat(order.total).toLocaleString()}</span>
                <OrderStatusSelect
                  orderId={order.id}
                  current={order.status}
                  onUpdate={handleStatusUpdate}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Top Products */}
          <div className="border border-[#F5F1EB]/10">
            <p className="text-[10px] tracking-widest uppercase text-[#F5F1EB]/40 px-5 py-4 border-b border-[#F5F1EB]/8">
              Top Products
            </p>
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#F5F1EB]/20 px-5 py-6">No sales yet</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center justify-between px-5 py-3 border-b border-[#F5F1EB]/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#F5F1EB]/20 w-4">{i + 1}</span>
                    <Link href={`/admin/products/${p.productSlug}/edit`} className="text-xs text-[#F5F1EB]/60 hover:text-[#F5F1EB] transition-colors truncate max-w-[130px]">
                      {p.productName}
                    </Link>
                  </div>
                  <span className="text-xs text-[#7A8471]">{p.totalSold} sold</span>
                </div>
              ))
            )}
          </div>

          {/* Low Stock */}
          {lowStock.length > 0 && (
            <div className="border border-red-400/15">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-red-400/10">
                <AlertTriangle size={12} className="text-red-400/70" />
                <p className="text-[10px] tracking-widest uppercase text-red-400/60">Low Stock</p>
              </div>
              {lowStock.map((v) => (
                <div key={v.id} className="flex items-center justify-between px-5 py-3 border-b border-[#F5F1EB]/5 last:border-0">
                  <div>
                    <p className="text-xs text-[#F5F1EB]/60 truncate max-w-[140px]">{v.productName}</p>
                    <p className="text-[10px] text-[#F5F1EB]/30 mt-0.5">
                      {[v.size, v.color].filter(Boolean).join(" · ") || "Default"}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${v.stock === 0 ? "text-red-400" : "text-[#D8CBB8]"}`}>
                    {v.stock === 0 ? "Out" : `${v.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
