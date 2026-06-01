"use client";

import { create } from "zustand";
import type { ShippingInput } from "@/lib/validations/order";

export type CheckoutStep = "shipping" | "payment" | "review";

interface CheckoutState {
  step: CheckoutStep;
  shipping: ShippingInput | null;
  paymentIntentId: string | null;
  clientSecret: string | null;
  orderId: string | null;

  setStep: (step: CheckoutStep) => void;
  setShipping: (shipping: ShippingInput) => void;
  setPaymentIntent: (id: string, clientSecret: string) => void;
  setOrderId: (id: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: "shipping",
  shipping: null,
  paymentIntentId: null,
  clientSecret: null,
  orderId: null,

  setStep: (step) => set({ step }),
  setShipping: (shipping) => set({ shipping }),
  setPaymentIntent: (paymentIntentId, clientSecret) => set({ paymentIntentId, clientSecret }),
  setOrderId: (orderId) => set({ orderId }),
  reset: () => set({ step: "shipping", shipping: null, paymentIntentId: null, clientSecret: null, orderId: null }),
}));
