"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=abayas", label: "Abayas" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { toggle: toggleCart, itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#F5F1EB]/5">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-light tracking-[0.35em] text-[#F5F1EB] hover:text-[#D8CBB8] transition-colors"
        >
          MODEST
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-xs tracking-widest uppercase transition-colors",
                  pathname === link.href
                    ? "text-[#F5F1EB]"
                    : "text-[#F5F1EB]/40 hover:text-[#F5F1EB]/80"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <Link href="/wishlist" className="text-[#F5F1EB]/50 hover:text-[#F5F1EB] transition-colors">
            <Heart size={18} />
          </Link>

          <button
            onClick={toggleCart}
            className="relative text-[#F5F1EB]/50 hover:text-[#F5F1EB] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#7A8471] rounded-full text-[9px] text-[#F5F1EB] flex items-center justify-center"
              >
                {itemCount > 9 ? "9+" : itemCount}
              </motion.span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="text-[#F5F1EB]/50 hover:text-[#F5F1EB] transition-colors"
            >
              <User size={18} />
            </button>

            {userOpen && (
              <div className="absolute right-0 top-8 w-44 bg-[#111] border border-[#F5F1EB]/10 py-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 border-b border-[#F5F1EB]/10 mb-1">
                      <p className="text-xs text-[#F5F1EB]/60 truncate">{user?.name}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-xs tracking-wide text-[#F5F1EB]/60 hover:text-[#F5F1EB] hover:bg-[#F5F1EB]/5 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/profile/orders"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-xs tracking-wide text-[#F5F1EB]/60 hover:text-[#F5F1EB] hover:bg-[#F5F1EB]/5 transition-colors"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/profile/wishlist"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-xs tracking-wide text-[#F5F1EB]/60 hover:text-[#F5F1EB] hover:bg-[#F5F1EB]/5 transition-colors"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={() => { setUserOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2 text-xs tracking-wide text-[#F5F1EB]/40 hover:text-red-400 hover:bg-[#F5F1EB]/5 transition-colors mt-1 border-t border-[#F5F1EB]/10"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-xs tracking-wide text-[#F5F1EB]/60 hover:text-[#F5F1EB] hover:bg-[#F5F1EB]/5 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-xs tracking-wide text-[#F5F1EB]/60 hover:text-[#F5F1EB] hover:bg-[#F5F1EB]/5 transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#F5F1EB]/50 hover:text-[#F5F1EB] transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-black border-t border-[#F5F1EB]/10 px-6 py-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest uppercase text-[#F5F1EB]/60 hover:text-[#F5F1EB] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
