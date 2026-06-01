"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ChevronDown, ArrowLeft } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { ImageGallery } from "@/components/products/image-gallery";
import { SizeSelector, ColorSelector } from "@/components/products/variant-selector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params);
  const { product, loading, error } = useProduct(slug);
  const { isAuthenticated } = useAuth();
  const { items: wishlistItems, addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [descOpen, setDescOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-[#F5F1EB]/5" />
          <div className="space-y-6 pt-4">
            <div className="h-3 w-20 bg-[#F5F1EB]/5 rounded" />
            <div className="h-8 w-3/4 bg-[#F5F1EB]/8 rounded" />
            <div className="h-6 w-1/4 bg-[#F5F1EB]/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/30 mb-6">Product not found</p>
        <Link href="/shop" className="text-xs tracking-widest uppercase text-[#F5F1EB]/50 hover:text-[#F5F1EB] transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const sizes = product.variants
    .filter((v) => v.size)
    .map((v) => ({ size: v.size!, stock: v.stock }));

  const colors = product.variants
    .filter((v) => v.color)
    .map((v) => ({ color: v.color!, colorHex: v.colorHex, stock: v.stock }))
    .filter((c, i, arr) => arr.findIndex((x) => x.color === c.color) === i);

  const wishlisted = isWishlisted(product.id);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) return;
    const existing = wishlistItems.find((i) => i.productId === product.id);
    if (existing) await removeFromWishlist(existing.id);
    else await addToWishlist(product.id);
  };

  const discountPct = product.comparePrice
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.comparePrice)) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#F5F1EB]/30 hover:text-[#F5F1EB]/70 transition-colors mb-10"
      >
        <ArrowLeft size={12} />
        Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <ImageGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-7">
          <div>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-[10px] tracking-widest uppercase text-[#7A8471] hover:text-[#7A8471]/80 transition-colors"
            >
              {product.category.name}
            </Link>
            <h1 className="text-3xl md:text-4xl font-light text-[#F5F1EB] tracking-wide mt-2">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-xl text-[#F5F1EB]">
              EGP {parseFloat(product.price).toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-[#F5F1EB]/30 line-through">
                EGP {parseFloat(product.comparePrice).toLocaleString()}
              </span>
            )}
            {discountPct && (
              <span className="text-xs text-[#7A8471] bg-[#7A8471]/10 px-2 py-0.5">
                −{discountPct}%
              </span>
            )}
          </div>

          {!product.inStock && (
            <p className="text-xs tracking-widest uppercase text-red-400/70">Out of Stock</p>
          )}

          {sizes.length > 0 && (
            <SizeSelector sizes={sizes} selected={selectedSize} onChange={setSelectedSize} />
          )}

          {colors.length > 0 && (
            <ColorSelector colors={colors} selected={selectedColor} onChange={setSelectedColor} />
          )}

          <div>
            <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/50 mb-3">Quantity</p>
            <div className="flex items-center gap-3 border border-[#F5F1EB]/15 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 text-[#F5F1EB]/50 hover:text-[#F5F1EB] transition-colors text-lg"
              >
                −
              </button>
              <span className="w-8 text-center text-sm text-[#F5F1EB]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 text-[#F5F1EB]/50 hover:text-[#F5F1EB] transition-colors text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              disabled={!product.inStock || (sizes.length > 0 && !selectedSize)}
            >
              <ShoppingBag size={16} />
              Add to Cart
            </Button>
            <button
              onClick={handleWishlistToggle}
              className={cn(
                "w-12 h-12 border flex items-center justify-center transition-all duration-200",
                wishlisted
                  ? "border-[#F5F1EB] text-[#F5F1EB] bg-[#F5F1EB]/5"
                  : "border-[#F5F1EB]/20 text-[#F5F1EB]/40 hover:border-[#F5F1EB]/50 hover:text-[#F5F1EB]"
              )}
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart size={16} className={wishlisted ? "fill-current" : ""} />
            </button>
          </div>

          {sizes.length > 0 && !selectedSize && (
            <p className="text-xs text-[#F5F1EB]/30 -mt-3">Please select a size to continue</p>
          )}

          <div className="border-t border-[#F5F1EB]/10 pt-6 space-y-4">
            <button
              onClick={() => setDescOpen(!descOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Description</span>
              <ChevronDown size={14} className={cn("text-[#F5F1EB]/30 transition-transform", descOpen && "rotate-180")} />
            </button>
            {descOpen && product.description && (
              <p className="text-sm text-[#F5F1EB]/50 leading-relaxed">{product.description}</p>
            )}
          </div>

          <div className="border-t border-[#F5F1EB]/10 pt-4">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Details & Care</span>
              <ChevronDown size={14} className={cn("text-[#F5F1EB]/30 transition-transform", detailsOpen && "rotate-180")} />
            </button>
            {detailsOpen && (
              <ul className="mt-4 space-y-1.5">
                {["100% Premium Cotton", "Oversized fit", "Machine wash cold", "Do not tumble dry"].map((d) => (
                  <li key={d} className="text-xs text-[#F5F1EB]/40 flex items-start gap-2">
                    <span className="text-[#7A8471] mt-0.5">—</span>
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
