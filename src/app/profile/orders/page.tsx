"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/components/orders/order-card";
import { Button } from "@/components/ui/button";

export default function ProfileOrdersPage() {
  const { orders, loading } = useOrders();

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-light text-[#F5F1EB] tracking-wide mb-2">Orders</h2>
        <p className="text-xs text-[#F5F1EB]/40">
          {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? "s" : ""}` : "Your order history"}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 border border-[#F5F1EB]/5 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-20 border border-[#F5F1EB]/10">
          <ShoppingBag size={28} className="text-[#F5F1EB]/15" />
          <p className="text-xs text-[#F5F1EB]/25 tracking-widest uppercase">No orders yet</p>
          <Link href="/shop">
            <Button variant="outline" size="sm">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
