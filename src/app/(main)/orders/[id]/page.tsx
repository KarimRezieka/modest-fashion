"use client";

import { use } from "react";
import { useOrder } from "@/hooks/useOrders";
import { OrderDetailView } from "@/components/orders/order-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { order, loading, error } = useOrder(id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-6 w-48 bg-[#F5F1EB]/5 rounded mb-10" />
        <div className="grid gap-6">
          <div className="h-48 bg-[#F5F1EB]/5 border border-[#F5F1EB]/5" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-32 bg-[#F5F1EB]/5 border border-[#F5F1EB]/5" />
            <div className="h-32 bg-[#F5F1EB]/5 border border-[#F5F1EB]/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/30">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <OrderDetailView order={order} />
    </div>
  );
}
