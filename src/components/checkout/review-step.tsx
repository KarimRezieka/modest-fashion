"use client";

import { useState } from "react";
import { MapPin, CreditCard, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShippingInput } from "@/lib/validations/order";

interface ReviewStepProps {
  shipping: ShippingInput;
  total: number;
  itemCount: number;
  loading: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function ReviewStep({ shipping, total, itemCount, loading, onBack, onConfirm }: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="border border-[#F5F1EB]/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={13} className="text-[#7A8471]" />
          <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Shipping To</p>
        </div>
        <p className="text-sm text-[#F5F1EB]/80">{shipping.name}</p>
        <p className="text-xs text-[#F5F1EB]/50 mt-1 leading-relaxed">
          {shipping.street}{shipping.apt ? `, ${shipping.apt}` : ""}<br />
          {shipping.city}{shipping.state ? `, ${shipping.state}` : ""} {shipping.postal}<br />
          {shipping.country}
        </p>
        <p className="text-xs text-[#F5F1EB]/40 mt-1">{shipping.phone}</p>
      </div>

      <div className="border border-[#F5F1EB]/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={13} className="text-[#7A8471]" />
          <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Payment</p>
        </div>
        <p className="text-xs text-[#F5F1EB]/50">Card payment confirmed via Stripe</p>
      </div>

      <div className="border border-[#F5F1EB]/10 p-6 bg-[#F5F1EB]/2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-[#F5F1EB]/40">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
            <p className="text-lg text-[#F5F1EB] mt-1">EGP {total.toLocaleString()}</p>
          </div>
          <Check size={20} className="text-[#7A8471]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" onClick={onBack} className="text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <Button onClick={onConfirm} loading={loading} size="lg" className="flex-1">
          Place Order
        </Button>
      </div>

      <p className="text-xs text-[#F5F1EB]/20 text-center">
        By placing your order you agree to our Terms and Conditions
      </p>
    </div>
  );
}
