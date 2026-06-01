"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "./cart-item";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, isLoading, isAuthenticated, close, updateQuantity, removeItem, itemCount, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0B0B0B] border-l border-[#F5F1EB]/8 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F5F1EB]/8">
              <div className="flex items-center gap-3">
                <h2 className="text-xs tracking-[0.3em] uppercase text-[#F5F1EB]">Cart</h2>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-[#7A8471] text-[#F5F1EB] text-[10px] flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </div>
              <button
                onClick={close}
                className="text-[#F5F1EB]/30 hover:text-[#F5F1EB] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {isLoading && items.length === 0 ? (
                <div className="flex flex-col gap-4 pt-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 py-5 border-b border-[#F5F1EB]/8 animate-pulse">
                      <div className="w-20 aspect-[3/4] bg-[#F5F1EB]/5" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 bg-[#F5F1EB]/8 rounded w-3/4" />
                        <div className="h-2 bg-[#F5F1EB]/5 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 py-20">
                  <ShoppingBag size={32} className="text-[#F5F1EB]/10" />
                  <p className="text-xs text-[#F5F1EB]/30 tracking-widest uppercase">Your cart is empty</p>
                  <button
                    onClick={close}
                    className="text-xs tracking-widest uppercase text-[#F5F1EB]/40 hover:text-[#F5F1EB]/80 transition-colors border-b border-[#F5F1EB]/20 pb-0.5"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdate={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#F5F1EB]/8 px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase text-[#F5F1EB]/40">Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base text-[#F5F1EB]"
                  >
                    EGP {subtotal.toLocaleString()}
                  </motion.span>
                </div>
                <p className="text-xs text-[#F5F1EB]/25">Shipping calculated at checkout</p>

                {isAuthenticated ? (
                  <Link href="/checkout" onClick={close} className="block">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" onClick={close} className="block">
                      <Button className="w-full" size="lg">
                        Sign in to Checkout
                      </Button>
                    </Link>
                    <p className="text-center text-xs text-[#F5F1EB]/25">
                      Your cart is saved
                    </p>
                  </div>
                )}

                <button
                  onClick={close}
                  className="w-full text-xs tracking-widest uppercase text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
