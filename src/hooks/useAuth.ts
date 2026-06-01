"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { LoginInput, RegisterInput } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, isLoading, setUser, setLoading, logout: clearStore } = useAuthStore();

  const login = useCallback(
    async (data: LoginInput) => {
      setLoading(true);
      try {
        const res = await authService.login(data);
        setUser(res.user, res.tokens.accessToken);
        router.push("/");
        return { success: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Login failed";
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading, setUser]
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      setLoading(true);
      try {
        const res = await authService.register(data);
        setUser(res.user, res.tokens.accessToken);
        router.push("/");
        return { success: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Registration failed";
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading, setUser]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearStore();
      router.push("/login");
    }
  }, [router, clearStore]);

  return { user, accessToken, isAuthenticated, isLoading, login, register, logout };
}
