"use client";

import { ProductCard } from "./product-card";
import type { ProductListItem } from "@/types/product";

interface ProductGridProps {
  products: ProductListItem[];
  loading?: boolean;
  wishlistedIds?: string[];
  onWishlistToggle?: (productId: string) => void;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-[#F5F1EB]/5" />
      <div className="pt-4 space-y-2">
        <div className="h-2 w-16 bg-[#F5F1EB]/5 rounded" />
        <div className="h-3 w-3/4 bg-[#F5F1EB]/8 rounded" />
        <div className="h-3 w-1/4 bg-[#F5F1EB]/5 rounded" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, loading, wishlistedIds = [], onWishlistToggle }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/20 mb-3">No products found</p>
        <p className="text-xs text-[#F5F1EB]/20">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          wishlisted={wishlistedIds.includes(product.id)}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
}
