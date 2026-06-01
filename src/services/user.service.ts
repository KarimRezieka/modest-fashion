import axios from "axios";
import type { Address, WishlistItem, UpdateProfileInput } from "@/types/user";
import type { User } from "@/types/auth";
import type { AddressInput } from "@/lib/validations/user";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  withCredentials: true,
});

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const userService = {
  async getProfile(token: string): Promise<User> {
    const res = await api.get<{ user: User }>("/api/users/profile", { headers: authHeaders(token) });
    return res.data.user;
  },

  async updateProfile(data: UpdateProfileInput, token: string): Promise<User> {
    const res = await api.put<{ user: User }>("/api/users/profile", data, { headers: authHeaders(token) });
    return res.data.user;
  },

  async getAddresses(token: string): Promise<Address[]> {
    const res = await api.get<{ addresses: Address[] }>("/api/users/addresses", { headers: authHeaders(token) });
    return res.data.addresses;
  },

  async createAddress(data: AddressInput, token: string): Promise<Address> {
    const res = await api.post<{ address: Address }>("/api/users/addresses", data, { headers: authHeaders(token) });
    return res.data.address;
  },

  async updateAddress(id: string, data: AddressInput, token: string): Promise<Address> {
    const res = await api.put<{ address: Address }>(`/api/users/addresses/${id}`, data, { headers: authHeaders(token) });
    return res.data.address;
  },

  async deleteAddress(id: string, token: string): Promise<void> {
    await api.delete(`/api/users/addresses/${id}`, { headers: authHeaders(token) });
  },

  async getWishlist(token: string): Promise<WishlistItem[]> {
    const res = await api.get<{ items: WishlistItem[] }>("/api/users/wishlist", { headers: authHeaders(token) });
    return res.data.items;
  },

  async addToWishlist(productId: string, token: string): Promise<WishlistItem> {
    const res = await api.post<{ item: WishlistItem }>("/api/users/wishlist", { productId }, { headers: authHeaders(token) });
    return res.data.item;
  },

  async removeFromWishlist(id: string, token: string): Promise<void> {
    await api.delete(`/api/users/wishlist/${id}`, { headers: authHeaders(token) });
  },
};
