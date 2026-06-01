"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { order } = use(searchParams);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-[#7A8471]/15 border border-[#7A8471]/30 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={28} className="text-[#7A8471]" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h1 className="text-3xl font-light text-[#F5F1EB] tracking-wide mb-3">Order Confirmed</h1>
          <p className="text-sm text-[#F5F1EB]/50 mb-2">Thank you for your order.</p>
          {order && (
            <p className="text-xs text-[#F5F1EB]/30 font-mono mb-8">
              #{order.slice(-8).toUpperCase()}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            {order && (
              <Link href={`/orders/${order}`}>
                <Button variant="outline">View Order</Button>
              </Link>
            )}
            <Link href="/shop">
              <Button variant="ghost">Continue Shopping</Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
