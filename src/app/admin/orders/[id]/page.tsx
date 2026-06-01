"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { useAuthStore } from "@/store/auth.store";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { OrderDetailView } from "@/components/orders/order-detail-view";
import type { Order } from "@/types/order";
import type { OrderStatus } from "@/types/order";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [order, setOrder] = useState<Order & { user?: { email: string; name: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    adminService.getOrder(id, accessToken)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id, accessToken]);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    if (!accessToken) return;
    const updated = await adminService.updateOrderStatus(orderId, status, accessToken);
    setOrder(updated);
  };

  if (loading) {
    return <div className="p-8 animate-pulse"><div className="h-8 w-48 bg-[#F5F1EB]/5 rounded mb-6" /></div>;
  }

  if (!order) {
    return (
      <div className="p-8">
        <Link href="/admin/orders" className="text-xs text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 flex items-center gap-2 mb-4">
          <ArrowLeft size={12} /> Orders
        </Link>
        <p className="text-xs text-[#F5F1EB]/30 tracking-widest uppercase">Order not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/orders" className="text-xs text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 flex items-center gap-2">
          <ArrowLeft size={12} /> Orders
        </Link>
        <div className="flex items-center gap-4">
          {order.user && (
            <div className="flex items-center gap-2 text-xs text-[#F5F1EB]/40">
              <User size={12} />
              <span>{order.user.name} · {order.user.email}</span>
            </div>
          )}
          <OrderStatusSelect orderId={order.id} current={order.status} onUpdate={handleStatusUpdate} />
        </div>
      </div>

      <OrderDetailView order={order} />
    </div>
  );
}
