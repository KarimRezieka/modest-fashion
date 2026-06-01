"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const statuses: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<OrderStatus, string> = {
  PENDING:    "text-[#D8CBB8]",
  PROCESSING: "text-[#7A8471]",
  SHIPPED:    "text-blue-400",
  DELIVERED:  "text-green-400",
  CANCELLED:  "text-red-400",
};

interface OrderStatusSelectProps {
  orderId: string;
  current: OrderStatus;
  onUpdate: (id: string, status: OrderStatus) => Promise<void>;
}

export function OrderStatusSelect({ orderId, current, onUpdate }: OrderStatusSelectProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setLoading(true);
    try {
      await onUpdate(orderId, newStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className={cn(
        "bg-transparent text-xs tracking-wide border border-[#F5F1EB]/15 px-2 py-1 outline-none cursor-pointer hover:border-[#F5F1EB]/40 transition-colors disabled:opacity-50",
        statusColors[current]
      )}
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="bg-[#111] text-[#F5F1EB]">
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
