"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import type { Address } from "@/types/user";
import type { AddressInput } from "@/lib/validations/user";

export function useAddresses() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await userService.getAddresses(accessToken);
      setAddresses(data);
    } catch {
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const createAddress = useCallback(
    async (data: AddressInput) => {
      if (!accessToken) return { success: false };
      try {
        const address = await userService.createAddress(data, accessToken);
        await fetchAddresses();
        return { success: true, address };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to save address";
        return { success: false, error: msg };
      }
    },
    [accessToken, fetchAddresses]
  );

  const updateAddress = useCallback(
    async (id: string, data: AddressInput) => {
      if (!accessToken) return { success: false };
      try {
        await userService.updateAddress(id, data, accessToken);
        await fetchAddresses();
        return { success: true };
      } catch {
        return { success: false, error: "Failed to update address" };
      }
    },
    [accessToken, fetchAddresses]
  );

  const deleteAddress = useCallback(
    async (id: string) => {
      if (!accessToken) return;
      await userService.deleteAddress(id, accessToken);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    },
    [accessToken]
  );

  return { addresses, loading, error, createAddress, updateAddress, deleteAddress, refetch: fetchAddresses };
}
