"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders",    icon: ShoppingBag,     label: "Orders" },
  { href: "/admin/products",  icon: Package,         label: "Products" },
];

export function AdminNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-[#F5F1EB]/8 flex flex-col">
      <div className="px-6 py-7 border-b border-[#F5F1EB]/8">
        <Link href="/" className="text-lg font-light tracking-[0.3em] text-[#F5F1EB]">
          MODEST
        </Link>
        <p className="text-[10px] tracking-widest uppercase text-[#7A8471] mt-1">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide transition-colors",
              pathname.startsWith(href)
                ? "bg-[#F5F1EB]/8 text-[#F5F1EB]"
                : "text-[#F5F1EB]/40 hover:text-[#F5F1EB]/80 hover:bg-[#F5F1EB]/4"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#F5F1EB]/8 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors"
        >
          <ExternalLink size={14} />
          View Store
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide text-[#F5F1EB]/30 hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
