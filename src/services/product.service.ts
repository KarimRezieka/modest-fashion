import axios from "axios";
import type { Product, ProductListItem, ProductsResponse, Category } from "@/types/product";
import type { CreateProductInput, UpdateProductInput, CreateCategoryInput } from "@/lib/validations/product";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  withCredentials: true,
});

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters.featured) params.set("featured", "true");
    const res = await api.get<ProductsResponse>(`/api/products?${params}`);
    return res.data;
  },

  async getProduct(slug: string): Promise<Product> {
    const res = await api.get<{ product: Product }>(`/api/products/${slug}`);
    return res.data.product;
  },

  async createProduct(data: CreateProductInput, token: string): Promise<Product> {
    const res = await api.post<{ product: Product }>("/api/products", data, { headers: authHeaders(token) });
    return res.data.product;
  },

  async updateProduct(slug: string, data: UpdateProductInput, token: string): Promise<Product> {
    const res = await api.put<{ product: Product }>(`/api/products/${slug}`, data, { headers: authHeaders(token) });
    return res.data.product;
  },

  async deleteProduct(slug: string, token: string): Promise<void> {
    await api.delete(`/api/products/${slug}`, { headers: authHeaders(token) });
  },

  async getCategories(): Promise<(Category & { _count: { products: number } })[]> {
    const res = await api.get<{ categories: (Category & { _count: { products: number } })[] }>("/api/categories");
    return res.data.categories;
  },

  async createCategory(data: CreateCategoryInput, token: string): Promise<Category> {
    const res = await api.post<{ category: Category }>("/api/categories", data, { headers: authHeaders(token) });
    return res.data.category;
  },
};
