"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import type { WishlistItem } from "@/types/user";

export function useWishlist() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await userService.getWishlist(accessToken);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(
    async (productId: string) => {
      if (!accessToken) return;
      const item = await userService.addToWishlist(productId, accessToken);
      setItems((prev) => [item, ...prev]);
    },
    [accessToken]
  );

  const removeFromWishlist = useCallback(
    async (id: string) => {
      if (!accessToken) return;
      await userService.removeFromWishlist(id, accessToken);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [accessToken]
  );

  const isWishlisted = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  return { items, loading, addToWishlist, removeFromWishlist, isWishlisted, refetch: fetchWishlist };
}
