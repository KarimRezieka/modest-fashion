"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminOrders } from "@/hooks/useAdmin";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const STATUS_FILTERS = ["", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const statusColors: Record<string, string> = {
  PENDING:    "text-[#D8CBB8]",
  PROCESSING: "text-[#7A8471]",
  SHIPPED:    "text-blue-400",
  DELIVERED:  "text-green-400",
  CANCELLED:  "text-red-400",
  PAID:       "text-[#7A8471]",
  FAILED:     "text-red-400",
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { orders, total, totalPages, loading, updateStatus } = useAdminOrders({ page, status, search });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#F5F1EB] tracking-wide">Orders</h1>
          <p className="text-xs text-[#F5F1EB]/30 mt-1">{total} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Search size={13} className="absolute left-3 top-2.5 text-[#F5F1EB]/25" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or ID…"
            className="bg-transparent border border-[#F5F1EB]/15 pl-8 pr-4 py-2 text-xs text-[#F5F1EB] placeholder:text-[#F5F1EB]/25 outline-none focus:border-[#F5F1EB]/40 transition-colors w-60"
          />
        </form>

        <div className="flex gap-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s || "all"}
              onClick={() => { setStatus(s); setPage(1); }}
              className={cn(
                "px-3 py-1.5 text-[10px] tracking-widest uppercase transition-colors",
                status === s
                  ? "bg-[#F5F1EB]/10 text-[#F5F1EB]"
                  : "text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60"
              )}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#F5F1EB]/10">
        <div className="grid grid-cols-[100px_1fr_120px_100px_110px_120px] gap-4 px-6 py-3 border-b border-[#F5F1EB]/10 text-[10px] tracking-widest uppercase text-[#F5F1EB]/25">
          <span>Order</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Status</span>
        </div>

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 border-b border-[#F5F1EB]/5 animate-pulse" />
          ))
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xs text-[#F5F1EB]/20 tracking-widest uppercase">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-[100px_1fr_120px_100px_110px_120px] gap-4 px-6 py-4 border-b border-[#F5F1EB]/5 hover:bg-[#F5F1EB]/2 transition-colors items-center"
            >
              <Link href={`/admin/orders/${order.id}`} className="text-xs font-mono text-[#F5F1EB]/60 hover:text-[#F5F1EB] transition-colors">
                #{order.id.slice(-8).toUpperCase()}
              </Link>
              <div>
                <p className="text-xs text-[#F5F1EB]/70">{order.shippingName}</p>
                {order.user && <p className="text-[10px] text-[#F5F1EB]/30 mt-0.5">{order.user.email}</p>}
              </div>
              <p className="text-xs text-[#F5F1EB]/40">
                {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
              </p>
              <span className="text-xs text-[#F5F1EB]/70">EGP {parseFloat(order.total).toLocaleString()}</span>
              <span className={cn("text-xs tracking-wide", statusColors[order.paymentStatus] ?? "text-[#F5F1EB]/40")}>
                {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
              </span>
              <OrderStatusSelect
                orderId={order.id}
                current={order.status}
                onUpdate={updateStatus}
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-2 border border-[#F5F1EB]/15 text-[#F5F1EB]/40 hover:text-[#F5F1EB] disabled:opacity-25 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-[#F5F1EB]/40">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="p-2 border border-[#F5F1EB]/15 text-[#F5F1EB]/40 hover:text-[#F5F1EB] disabled:opacity-25 transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
