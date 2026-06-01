"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { orderService } from "@/services/order.service";
import type { Order } from "@/types/order";

export function useOrders() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await orderService.getOrders(accessToken);
      setOrders(data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

export function useOrder(id: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !accessToken) return;
    orderService.getOrder(id, accessToken)
      .then(setOrder)
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false));
  }, [id, accessToken]);

  return { order, loading, error };
}
