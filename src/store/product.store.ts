"use client";

import { create } from "zustand";
import type { SortOption } from "@/types/product";

interface ProductFiltersState {
  search: string;
  category: string;
  sort: SortOption;
  minPrice: number;
  maxPrice: number;
  page: number;

  setSearch: (v: string) => void;
  setCategory: (v: string) => void;
  setSort: (v: SortOption) => void;
  setPriceRange: (min: number, max: number) => void;
  setPage: (v: number) => void;
  resetFilters: () => void;
}

const defaults = {
  search: "",
  category: "",
  sort: "newest" as SortOption,
  minPrice: 0,
  maxPrice: 0,
  page: 1,
};

export const useProductFilters = create<ProductFiltersState>((set) => ({
  ...defaults,

  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set(defaults),
}));
