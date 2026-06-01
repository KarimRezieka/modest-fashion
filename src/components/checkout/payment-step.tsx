"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentStepProps {
  clientSecret: string;
  total: number;
  onBack: () => void;
  onNext: (paymentIntentId: string) => void;
}

export function PaymentStep({ clientSecret, total, onBack, onNext }: PaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    setLoading(false);

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onNext(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Lock size={12} className="text-[#7A8471]" />
          <p className="text-xs text-[#F5F1EB]/40 tracking-wide">Secured by Stripe</p>
        </div>

        <div className="border border-[#F5F1EB]/15 p-5 focus-within:border-[#F5F1EB]/40 transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  color: "#F5F1EB",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "14px",
                  "::placeholder": { color: "rgba(245,241,235,0.25)" },
                  iconColor: "#7A8471",
                },
                invalid: { color: "#f87171", iconColor: "#f87171" },
              },
            }}
          />
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-400/5 border border-red-400/20 px-4 py-3">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button type="button" onClick={onBack} className="text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <Button type="submit" loading={loading} disabled={!stripe}>
          Review Order — EGP {total.toLocaleString()}
        </Button>
      </div>

      <p className="text-xs text-[#F5F1EB]/20">
        Test card: 4242 4242 4242 4242 · Any future date · Any 3-digit CVC
      </p>
    </form>
  );
}
