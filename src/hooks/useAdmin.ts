"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { adminService } from "@/services/admin.service";
import type { AdminDashboardData, AdminOrderRow } from "@/types/admin";
import type { OrderStatus } from "@/types/order";

export function useAdminStats() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    adminService.getStats(accessToken)
      .then(setData)
      .finally(() => setLoading(false));
  }, [accessToken]);

  return { data, loading };
}

export function useAdminOrders(params: { page?: number; status?: string; search?: string } = {}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await adminService.getOrders(accessToken, params);
      setOrders(res.orders);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }, [accessToken, JSON.stringify(params)]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    if (!accessToken) return;
    await adminService.updateOrderStatus(id, status, accessToken);
    await fetchOrders();
  }, [accessToken, fetchOrders]);

  return { orders, total, totalPages, loading, updateStatus, refetch: fetchOrders };
}
