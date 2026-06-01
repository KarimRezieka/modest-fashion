"use client";

import { useEffect } from "react";
import { useProductFilters } from "@/store/product.store";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { ShopFilters } from "@/components/products/shop-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const { search, category, sort, minPrice, maxPrice, page, setPage } = useProductFilters();
  const { products, total, totalPages, loading } = useProducts({ search, category, sort, minPrice, maxPrice, page });
  const { categories } = useCategories();
  const { isAuthenticated } = useAuth();
  const { items: wishlistItems, addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const wishlistedIds = wishlistItems.map((i) => i.productId);

  const handleWishlistToggle = async (productId: string) => {
    if (!isAuthenticated) return;
    const existing = wishlistItems.find((i) => i.productId === productId);
    if (existing) {
      await removeFromWishlist(existing.id);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light tracking-wide text-[#F5F1EB] mb-3">Shop</h1>
        <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/30">
          {category ? categories.find((c) => c.slug === category)?.name ?? category : "All Collections"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12">
        <aside className="hidden md:block">
          <ShopFilters categories={categories} total={total} />
        </aside>

        <div>
          <ProductGrid
            products={products}
            loading={loading}
            wishlistedIds={wishlistedIds}
            onWishlistToggle={handleWishlistToggle}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={cn(
                  "p-2 border border-[#F5F1EB]/15 text-[#F5F1EB]/50 hover:border-[#F5F1EB]/40 hover:text-[#F5F1EB] transition-colors",
                  page === 1 && "opacity-30 cursor-not-allowed"
                )}
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-8 h-8 text-xs transition-colors",
                      p === page
                        ? "bg-[#F5F1EB] text-black"
                        : "text-[#F5F1EB]/40 hover:text-[#F5F1EB] border border-[#F5F1EB]/10 hover:border-[#F5F1EB]/30"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className={cn(
                  "p-2 border border-[#F5F1EB]/15 text-[#F5F1EB]/50 hover:border-[#F5F1EB]/40 hover:text-[#F5F1EB] transition-colors",
                  page === totalPages && "opacity-30 cursor-not-allowed"
                )}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
