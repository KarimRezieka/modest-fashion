"use client";

import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/store/checkout.store";

const steps: { key: CheckoutStep; label: string }[] = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" },
];

const order: Record<CheckoutStep, number> = { shipping: 0, payment: 1, review: 2 };

export function CheckoutStepper({ current }: { current: CheckoutStep }) {
  return (
    <div className="flex items-center gap-0 mb-14">
      {steps.map((step, i) => {
        const done = order[current] > i;
        const active = current === step.key;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all",
                  active ? "bg-[#F5F1EB] text-black" :
                  done ? "bg-[#7A8471] text-[#F5F1EB]" :
                  "border border-[#F5F1EB]/20 text-[#F5F1EB]/30"
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-xs tracking-widest uppercase transition-colors",
                active ? "text-[#F5F1EB]" : done ? "text-[#7A8471]" : "text-[#F5F1EB]/25"
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-16 h-px mx-4 transition-colors",
                done ? "bg-[#7A8471]" : "bg-[#F5F1EB]/10"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
