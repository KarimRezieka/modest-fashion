import axios from "axios";
import type { Order } from "@/types/order";
import type { CreateOrderInput } from "@/lib/validations/order";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  withCredentials: true,
});

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const orderService = {
  async createPaymentIntent(amountEGP: number, token: string): Promise<{ clientSecret: string; id: string }> {
    const res = await api.post<{ clientSecret: string; id: string }>(
      "/api/stripe/payment-intent",
      { amount: Math.round(amountEGP * 100) },
      { headers: auth(token) }
    );
    return res.data;
  },

  async createOrder(data: CreateOrderInput, token: string): Promise<Order> {
    const res = await api.post<{ order: Order }>("/api/orders", data, { headers: auth(token) });
    return res.data.order;
  },

  async getOrders(token: string): Promise<Order[]> {
    const res = await api.get<{ orders: Order[] }>("/api/orders", { headers: auth(token) });
    return res.data.orders;
  },

  async getOrder(id: string, token: string): Promise<Order> {
    const res = await api.get<{ order: Order }>(`/api/orders/${id}`, { headers: auth(token) });
    return res.data.order;
  },
};
