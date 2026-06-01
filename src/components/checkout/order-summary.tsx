"use client";

import Image from "next/image";
import { useCart } from "@/hooks/useCart";

interface OrderSummaryProps {
  shippingCost?: number;
}

export function OrderSummary({ shippingCost = 0 }: OrderSummaryProps) {
  const { items, subtotal } = useCart();
  const total = subtotal + shippingCost;

  return (
    <div className="border border-[#F5F1EB]/10 p-6 sticky top-24">
      <h3 className="text-xs tracking-[0.3em] uppercase text-[#F5F1EB]/50 mb-6">Order Summary</h3>

      <div className="flex flex-col gap-4 mb-6">
        {items.map((item) => {
          const image = item.product.images[0];
          return (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="relative w-14 aspect-[3/4] bg-[#111] flex-shrink-0 overflow-hidden">
                {image && (
                  <Image src={image.url} alt={image.alt ?? item.product.name} fill className="object-cover" sizes="56px" />
                )}
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#7A8471] rounded-full text-[9px] text-[#F5F1EB] flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#F5F1EB]/70 leading-tight">{item.product.name}</p>
                {item.variant && (
                  <p className="text-[10px] text-[#F5F1EB]/30 mt-0.5">
                    {[item.variant.size, item.variant.color].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-xs text-[#F5F1EB]/70 flex-shrink-0">
                EGP {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#F5F1EB]/10 pt-4 space-y-2">
        <div className="flex justify-between text-xs text-[#F5F1EB]/50">
          <span>Subtotal</span>
          <span>EGP {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-[#F5F1EB]/50">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? "Free" : `EGP ${shippingCost.toLocaleString()}`}</span>
        </div>
        <div className="flex justify-between text-sm text-[#F5F1EB] pt-2 border-t border-[#F5F1EB]/10 mt-2">
          <span className="tracking-wide">Total</span>
          <span>EGP {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
