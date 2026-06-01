"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { CartItem, GuestCartItem } from "@/types/cart";

type AnyCartItem = CartItem | GuestCartItem;

interface CartItemProps {
  item: AnyCartItem;
  onUpdate: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onUpdate, onRemove }: CartItemProps) {
  const image = item.product.images[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex gap-4 py-5 border-b border-[#F5F1EB]/8"
    >
      <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
        <div className="relative w-20 aspect-[3/4] bg-[#111] overflow-hidden">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? item.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] tracking-widest text-[#F5F1EB]/10 uppercase">MODEST</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/product/${item.product.slug}`}
              className="text-sm text-[#F5F1EB]/80 hover:text-[#F5F1EB] transition-colors leading-tight block"
            >
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="text-xs text-[#F5F1EB]/30 mt-0.5">
                {[item.variant.size, item.variant.color].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-[#F5F1EB]/25 hover:text-[#F5F1EB]/70 transition-colors flex-shrink-0 mt-0.5"
            aria-label="Remove"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-[#F5F1EB]/15">
            <button
              onClick={() => item.quantity > 1 ? onUpdate(item.id, item.quantity - 1) : onRemove(item.id)}
              className="w-7 h-7 flex items-center justify-center text-[#F5F1EB]/40 hover:text-[#F5F1EB] transition-colors"
            >
              <Minus size={11} />
            </button>
            <motion.span
              key={item.quantity}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="w-8 text-center text-xs text-[#F5F1EB]/80 select-none"
            >
              {item.quantity}
            </motion.span>
            <button
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-[#F5F1EB]/40 hover:text-[#F5F1EB] transition-colors"
            >
              <Plus size={11} />
            </button>
          </div>

          <span className="text-sm text-[#F5F1EB]">
            EGP {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
