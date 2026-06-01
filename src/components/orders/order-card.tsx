import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:    { label: "Pending",    color: "text-[#D8CBB8]" },
  PROCESSING: { label: "Processing", color: "text-[#7A8471]" },
  SHIPPED:    { label: "Shipped",    color: "text-blue-400" },
  DELIVERED:  { label: "Delivered",  color: "text-green-400" },
  CANCELLED:  { label: "Cancelled",  color: "text-red-400" },
};

export function OrderCard({ order }: { order: Order }) {
  const cfg = statusConfig[order.status];
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center justify-between p-6 border border-[#F5F1EB]/10 hover:border-[#F5F1EB]/25 transition-colors group"
    >
      <div className="flex items-center gap-5">
        <div className="w-10 h-10 border border-[#F5F1EB]/10 flex items-center justify-center flex-shrink-0">
          <Package size={16} className="text-[#F5F1EB]/30" />
        </div>
        <div>
          <p className="text-xs text-[#F5F1EB]/50 font-mono mb-1">#{order.id.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-[#F5F1EB]/70">
            {order.items.length} {order.items.length === 1 ? "item" : "items"} · EGP {parseFloat(order.total).toLocaleString()}
          </p>
          <p className="text-xs text-[#F5F1EB]/30 mt-0.5">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={cn("text-xs tracking-wide", cfg.color)}>{cfg.label}</span>
        <ChevronRight size={14} className="text-[#F5F1EB]/20 group-hover:text-[#F5F1EB]/50 transition-colors" />
      </div>
    </Link>
  );
}
