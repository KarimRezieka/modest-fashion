"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { cartService } from "@/services/cart.service";
import type { CartItemProduct, CartItemVariant } from "@/types/cart";

export function useCart() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const {
    items, isOpen, isLoading, cartId,
    open, close, toggle,
    setCart, setLoading,
    guestAdd, guestUpdate, guestRemove, guestClear,
    clearCart, itemCount, subtotal,
  } = useCartStore();

  // Fetch server cart when authenticated
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    setLoading(true);
    cartService.getCart(accessToken)
      .then((cart) => setCart(cart.id, cart.items as any))
      .finally(() => setLoading(false));
  }, [isAuthenticated, accessToken]);

  const addToCart = useCallback(
    async (product: CartItemProduct, variant: CartItemVariant | null = null, quantity = 1) => {
      if (!isAuthenticated || !accessToken) {
        guestAdd(product, variant, quantity);
        open();
        return;
      }
      setLoading(true);
      try {
        const cart = await cartService.addItem(product.id, quantity, accessToken, variant?.id ?? undefined);
        setCart(cart.id, cart.items as any);
        open();
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, accessToken, guestAdd, setCart, setLoading, open]
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (!isAuthenticated || !accessToken) {
        guestUpdate(id, quantity);
        return;
      }
      setLoading(true);
      try {
        const cart = await cartService.updateItem(id, quantity, accessToken);
        setCart(cart.id, cart.items as any);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, accessToken, guestUpdate, setCart, setLoading]
  );

  const removeItem = useCallback(
    async (id: string) => {
      if (!isAuthenticated || !accessToken) {
        guestRemove(id);
        return;
      }
      setLoading(true);
      try {
        const cart = await cartService.removeItem(id, accessToken);
        setCart(cart.id, cart.items as any);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, accessToken, guestRemove, setCart, setLoading]
  );

  const emptyCart = useCallback(async () => {
    if (isAuthenticated && accessToken) {
      await cartService.clearCart(accessToken);
    }
    clearCart();
  }, [isAuthenticated, accessToken, clearCart]);

  return {
    items,
    isOpen,
    isLoading,
    isAuthenticated,
    open,
    close,
    toggle,
    addToCart,
    updateQuantity,
    removeItem,
    emptyCart,
    itemCount: itemCount(),
    subtotal: subtotal(),
  };
}
