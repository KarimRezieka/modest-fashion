import axios from "axios";
import type { AdminDashboardData, AdminOrderRow } from "@/types/admin";
import type { OrderStatus } from "@/types/order";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  withCredentials: true,
});

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const adminService = {
  async getStats(token: string): Promise<AdminDashboardData> {
    const res = await api.get<AdminDashboardData>("/api/admin/stats", { headers: auth(token) });
    return res.data;
  },

  async getOrders(
    token: string,
    params: { page?: number; status?: string; search?: string } = {}
  ): Promise<{ orders: AdminOrderRow[]; total: number; totalPages: number }> {
    const p = new URLSearchParams();
    if (params.page) p.set("page", String(params.page));
    if (params.status) p.set("status", params.status);
    if (params.search) p.set("search", params.search);
    const res = await api.get(`/api/admin/orders?${p}`, { headers: auth(token) });
    return res.data;
  },

  async getOrder(id: string, token: string) {
    const res = await api.get(`/api/admin/orders/${id}`, { headers: auth(token) });
    return res.data.order;
  },

  async updateOrderStatus(id: string, status: OrderStatus, token: string) {
    const res = await api.put(`/api/admin/orders/${id}`, { status }, { headers: auth(token) });
    return res.data.order;
  },
};
