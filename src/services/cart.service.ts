import axios from "axios";
import type { Cart } from "@/types/cart";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  withCredentials: true,
});

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const cartService = {
  async getCart(token: string): Promise<Cart> {
    const res = await api.get<{ cart: Cart }>("/api/cart", { headers: auth(token) });
    return res.data.cart;
  },

  async addItem(productId: string, quantity: number, token: string, variantId?: string): Promise<Cart> {
    const res = await api.post<{ cart: Cart }>(
      "/api/cart/items",
      { productId, variantId, quantity },
      { headers: auth(token) }
    );
    return res.data.cart;
  },

  async updateItem(id: string, quantity: number, token: string): Promise<Cart> {
    const res = await api.put<{ cart: Cart }>(
      `/api/cart/items/${id}`,
      { quantity },
      { headers: auth(token) }
    );
    return res.data.cart;
  },

  async removeItem(id: string, token: string): Promise<Cart> {
    const res = await api.delete<{ cart: Cart }>(`/api/cart/items/${id}`, { headers: auth(token) });
    return res.data.cart;
  },

  async clearCart(token: string): Promise<void> {
    await api.delete("/api/cart", { headers: auth(token) });
  },
};
