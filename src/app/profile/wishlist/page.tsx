"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { WishlistItemCard } from "@/components/profile/wishlist-item-card";

export default function WishlistPage() {
  const { items, loading, removeFromWishlist } = useWishlist();

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-light text-[#F5F1EB] tracking-wide mb-2">Wishlist</h2>
        <p className="text-xs text-[#F5F1EB]/40">
          {items.length > 0 ? `${items.length} saved item${items.length !== 1 ? "s" : ""}` : "Your saved items"}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 border border-[#F5F1EB]/5 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-[#F5F1EB]/10">
          <p className="text-xs text-[#F5F1EB]/30 tracking-widest uppercase">
            Your wishlist is empty
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onRemove={removeFromWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
