"use client";

import { useEffect, useRef } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductFilters } from "@/store/product.store";
import type { Category, SortOption } from "@/types/product";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

interface ShopFiltersProps {
  categories: (Category & { _count: { products: number } })[];
  total: number;
}

export function ShopFilters({ categories, total }: ShopFiltersProps) {
  const { category, sort, search, setCategory, setSort, setSearch, resetFilters } =
    useProductFilters();

  const hasActiveFilters = !!(category || search || sort !== "newest");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-[10px] tracking-widest uppercase text-[#F5F1EB]/30 mb-4">
          {total} {total === 1 ? "product" : "products"}
        </p>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent border-b border-[#F5F1EB]/15 py-2 text-sm text-[#F5F1EB] placeholder:text-[#F5F1EB]/25 outline-none focus:border-[#F5F1EB]/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-0 top-2.5 text-[#F5F1EB]/30 hover:text-[#F5F1EB]/70"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-widest uppercase text-[#F5F1EB]/30 mb-4">Category</p>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              onClick={() => setCategory("")}
              className={cn(
                "text-xs tracking-wide transition-colors",
                !category ? "text-[#F5F1EB]" : "text-[#F5F1EB]/40 hover:text-[#F5F1EB]/70"
              )}
            >
              All
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setCategory(cat.slug)}
                className={cn(
                  "text-xs tracking-wide transition-colors flex items-center justify-between w-full",
                  category === cat.slug ? "text-[#F5F1EB]" : "text-[#F5F1EB]/40 hover:text-[#F5F1EB]/70"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-[#F5F1EB]/20">{cat._count.products}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] tracking-widest uppercase text-[#F5F1EB]/30 mb-4">Sort</p>
        <ul className="flex flex-col gap-2">
          {sortOptions.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => setSort(opt.value)}
                className={cn(
                  "text-xs tracking-wide transition-colors",
                  sort === opt.value ? "text-[#F5F1EB]" : "text-[#F5F1EB]/40 hover:text-[#F5F1EB]/70"
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors"
        >
          <X size={12} />
          Clear filters
        </button>
      )}
    </div>
  );
}
