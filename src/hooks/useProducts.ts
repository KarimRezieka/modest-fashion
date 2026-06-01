"use client";

import { useState, useEffect, useCallback } from "react";
import { productService } from "@/services/product.service";
import type { ProductListItem, ProductsResponse } from "@/types/product";
import type { ProductFilters } from "@/services/product.service";

export function useProducts(filters: ProductFilters = {}) {
  const [data, setData] = useState<ProductsResponse>({ products: [], total: 0, page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts(filters);
      setData(result);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...data, loading, error, refetch: fetch };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<import("@/types/product").Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.getProduct(slug)
      .then(setProduct)
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<(import("@/types/product").Category & { _count: { products: number } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
