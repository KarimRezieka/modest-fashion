"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

interface ProductCardProps {
  product: ProductListItem;
  wishlisted?: boolean;
  onWishlistToggle?: (productId: string) => void;
}

export function ProductCard({ product, wishlisted, onWishlistToggle }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const mainImage = product.images[0]?.url ?? null;
  const hoverImage = product.images[1]?.url ?? null;

  const discountPct = product.comparePrice
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.comparePrice)) * 100)
    : null;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#111] aspect-[3/4]">
          {mainImage ? (
            <>
              <Image
                src={mainImage}
                alt={product.images[0]?.alt ?? product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-700",
                  hovered && hoverImage ? "opacity-0" : "opacity-100"
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {hoverImage && (
                <Image
                  src={hoverImage}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700",
                    hovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                  )}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs tracking-widest text-[#F5F1EB]/10 uppercase">MODEST</span>
            </div>
          )}

          {discountPct && (
            <div className="absolute top-3 left-3 bg-[#7A8471] px-2 py-0.5">
              <span className="text-[10px] text-[#F5F1EB] tracking-wide">−{discountPct}%</span>
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-xs tracking-widest uppercase text-[#F5F1EB]/60">Sold Out</span>
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={() => onWishlistToggle?.(product.id)}
        className={cn(
          "absolute top-3 right-3 p-1.5 transition-all duration-200",
          wishlisted ? "text-[#F5F1EB]" : "text-[#F5F1EB]/0 group-hover:text-[#F5F1EB]/50 hover:!text-[#F5F1EB]"
        )}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={16}
          className={wishlisted ? "fill-current" : ""}
        />
      </button>

      <div className="pt-4 pb-2">
        <p className="text-[10px] tracking-widest uppercase text-[#F5F1EB]/30 mb-1">
          {product.category.name}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm text-[#F5F1EB]/80 hover:text-[#F5F1EB] transition-colors tracking-wide">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm text-[#F5F1EB]">EGP {parseFloat(product.price).toLocaleString()}</span>
          {product.comparePrice && (
            <span className="text-xs text-[#F5F1EB]/30 line-through">
              EGP {parseFloat(product.comparePrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
