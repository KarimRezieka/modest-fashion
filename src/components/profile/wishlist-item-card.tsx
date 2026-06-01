"use client";

import { Trash2, ShoppingBag } from "lucide-react";
import type { WishlistItem } from "@/types/user";

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
}

export function WishlistItemCard({ item, onRemove }: WishlistItemCardProps) {
  return (
    <div className="border border-[#F5F1EB]/10 p-5 flex items-center gap-5 hover:border-[#F5F1EB]/20 transition-colors group">
      <div className="w-16 h-20 bg-[#F5F1EB]/5 flex-shrink-0 flex items-center justify-center">
        <ShoppingBag size={20} className="text-[#F5F1EB]/20" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#F5F1EB]/40 tracking-widest uppercase mb-1">Product</p>
        <p className="text-sm text-[#F5F1EB]/70 truncate font-mono">{item.productId}</p>
        <p className="text-xs text-[#F5F1EB]/30 mt-1.5">
          Added {new Date(item.addedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="text-[#F5F1EB]/30 hover:text-red-400 transition-colors flex-shrink-0"
        aria-label="Remove from wishlist"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
