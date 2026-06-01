import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, CreditCard, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING:    { label: "Pending",    color: "text-[#D8CBB8]",  bg: "bg-[#D8CBB8]/10" },
  PROCESSING: { label: "Processing", color: "text-[#7A8471]",  bg: "bg-[#7A8471]/10" },
  SHIPPED:    { label: "Shipped",    color: "text-blue-400",   bg: "bg-blue-400/10" },
  DELIVERED:  { label: "Delivered",  color: "text-green-400",  bg: "bg-green-400/10" },
  CANCELLED:  { label: "Cancelled",  color: "text-red-400",    bg: "bg-red-400/10" },
};

export function OrderDetailView({ order }: { order: Order }) {
  const cfg = statusConfig[order.status];
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-10">
        <div>
          <Link
            href="/profile/orders"
            className="inline-flex items-center gap-2 text-xs text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors mb-4"
          >
            <ArrowLeft size={12} /> Orders
          </Link>
          <h1 className="text-2xl font-light text-[#F5F1EB] tracking-wide">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-xs text-[#F5F1EB]/30 mt-1">{date}</p>
        </div>
        <span className={cn("text-xs px-3 py-1.5 tracking-wide", cfg.color, cfg.bg)}>
          {cfg.label}
        </span>
      </div>

      <div className="grid gap-6">
        {/* Items */}
        <div className="border border-[#F5F1EB]/10 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Package size={13} className="text-[#7A8471]" />
            <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Items</p>
          </div>
          <div className="flex flex-col gap-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-14 aspect-[3/4] bg-[#111] flex-shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8px] text-[#F5F1EB]/10 uppercase">MODEST</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="text-sm text-[#F5F1EB]/80 hover:text-[#F5F1EB] transition-colors"
                  >
                    {item.productName}
                  </Link>
                  {(item.size || item.color) && (
                    <p className="text-xs text-[#F5F1EB]/30 mt-0.5">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-xs text-[#F5F1EB]/40 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm text-[#F5F1EB]/70 flex-shrink-0">
                  EGP {(parseFloat(item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping */}
          <div className="border border-[#F5F1EB]/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={13} className="text-[#7A8471]" />
              <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Shipping Address</p>
            </div>
            <p className="text-sm text-[#F5F1EB]/80">{order.shippingName}</p>
            <p className="text-xs text-[#F5F1EB]/50 mt-1 leading-relaxed">
              {order.shippingStreet}{order.shippingApt ? `, ${order.shippingApt}` : ""}<br />
              {order.shippingCity}{order.shippingState ? `, ${order.shippingState}` : ""} {order.shippingPostal}<br />
              {order.shippingCountry}
            </p>
            <p className="text-xs text-[#F5F1EB]/40 mt-1">{order.shippingPhone}</p>
          </div>

          {/* Payment summary */}
          <div className="border border-[#F5F1EB]/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={13} className="text-[#7A8471]" />
              <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Payment</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#F5F1EB]/50">
                <span>Subtotal</span>
                <span>EGP {parseFloat(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#F5F1EB]/50">
                <span>Shipping</span>
                <span>{parseFloat(order.shippingCost) === 0 ? "Free" : `EGP ${parseFloat(order.shippingCost).toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-sm text-[#F5F1EB] pt-2 border-t border-[#F5F1EB]/10">
                <span>Total</span>
                <span>EGP {parseFloat(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
