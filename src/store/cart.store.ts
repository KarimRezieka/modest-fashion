"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, GuestCartItem, CartItemProduct, CartItemVariant } from "@/types/cart";

type AnyCartItem = CartItem | GuestCartItem;

interface CartState {
  items: AnyCartItem[];
  isOpen: boolean;
  isLoading: boolean;

  // Server-synced cart ID (null for guests)
  cartId: string | null;

  open: () => void;
  close: () => void;
  toggle: () => void;
  setLoading: (v: boolean) => void;

  // Called after API responses to replace full cart state
  setCart: (cartId: string, items: CartItem[]) => void;

  // Guest operations (used when unauthenticated)
  guestAdd: (product: CartItemProduct, variant: CartItemVariant | null, quantity: number) => void;
  guestUpdate: (id: string, quantity: number) => void;
  guestRemove: (id: string) => void;
  guestClear: () => void;

  clearCart: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
}

let guestId = 0;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      cartId: null,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setLoading: (v) => set({ isLoading: v }),

      setCart: (cartId, items) => set({ cartId, items }),

      guestAdd: (product, variant, quantity) => {
        const { items } = get();
        const existing = items.find(
          (i) => i.productId === product.id && i.variantId === (variant?.id ?? null)
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          const newItem: GuestCartItem = {
            id: `guest-${++guestId}`,
            productId: product.id,
            variantId: variant?.id ?? null,
            quantity,
            product,
            variant,
          };
          set({ items: [...items, newItem] });
        }
      },

      guestUpdate: (id, quantity) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)) })),

      guestRemove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      guestClear: () => set({ items: [], cartId: null }),
      clearCart: () => set({ items: [], cartId: null }),

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (s, i) => s + parseFloat(i.product.price) * i.quantity,
          0
        ),
    }),
    {
      name: "modest-cart",
      partialize: (s) => ({ items: s.items, cartId: s.cartId }),
    }
  )
);
