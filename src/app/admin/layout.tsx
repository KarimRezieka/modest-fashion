"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/admin/dashboard");
      return;
    }
    if (user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-xs text-[#F5F1EB]/30 tracking-widest uppercase animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      <AdminNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
