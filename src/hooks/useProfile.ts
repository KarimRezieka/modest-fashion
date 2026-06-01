"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import type { User } from "@/types/auth";
import type { UpdateProfileInput } from "@/types/user";

export function useProfile() {
  const { accessToken, setUser } = useAuthStore();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (data: UpdateProfileInput) => {
      if (!accessToken) return { success: false, error: "Not authenticated" };
      setLoading(true);
      setError(null);
      try {
        const updated = await userService.updateProfile(data, accessToken);
        setUser(updated, accessToken);
        return { success: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Update failed";
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [accessToken, setUser]
  );

  return { user, loading, error, updateProfile };
}
