"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useCheckoutStore } from "@/store/checkout.store";
import { useCartStore } from "@/store/cart.store";
import { orderService } from "@/services/order.service";
import { useAuthStore } from "@/store/auth.store";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { PaymentStep } from "@/components/checkout/payment-step";
import { ReviewStep } from "@/components/checkout/review-step";
import { OrderSummary } from "@/components/checkout/order-summary";
import type { ShippingInput } from "@/lib/validations/order";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_placeholder");
const SHIPPING_COST = Number(process.env.NEXT_PUBLIC_SHIPPING_COST ?? 0);

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { items, subtotal, emptyCart } = useCart();
  const {
    step, shipping, clientSecret, paymentIntentId,
    setStep, setShipping, setPaymentIntent, setOrderId, reset,
  } = useCheckoutStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login?redirect=/checkout");
  }, [isAuthenticated]);

  useEffect(() => {
    if (items.length === 0 && step !== "review") router.replace("/shop");
  }, [items.length]);

  const total = subtotal + SHIPPING_COST;

  const handleShippingNext = async (data: ShippingInput) => {
    setShipping(data);
    if (!accessToken) return;
    const { clientSecret: cs, id } = await orderService.createPaymentIntent(total, accessToken);
    setPaymentIntent(id, cs);
    setStep("payment");
  };

  const handlePaymentNext = (piId: string) => {
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    if (!accessToken || !paymentIntentId || !shipping) return;
    try {
      const order = await orderService.createOrder(
        {
          paymentIntentId,
          shipping,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSlug: item.product.slug,
            imageUrl: item.product.images[0]?.url ?? null,
            size: item.variant?.size ?? null,
            color: item.variant?.color ?? null,
            price: parseFloat(item.product.price),
            quantity: item.quantity,
          })),
          subtotal,
          shippingCost: SHIPPING_COST,
        },
        accessToken
      );

      setOrderId(order.id);
      await emptyCart();
      useCartStore.getState().clearCart();
      reset();
      router.push(`/checkout/success?order=${order.id}`);
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to place order"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-light text-[#F5F1EB] tracking-wide mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <div>
          <CheckoutStepper current={step} />

          {step === "shipping" && (
            <ShippingStep initial={shipping} onNext={handleShippingNext} />
          )}

          {step === "payment" && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "night",
                  variables: { colorBackground: "#0B0B0B", colorText: "#F5F1EB", colorPrimary: "#7A8471" },
                },
              }}
            >
              <PaymentStep
                clientSecret={clientSecret}
                total={total}
                onBack={() => setStep("shipping")}
                onNext={handlePaymentNext}
              />
            </Elements>
          )}

          {step === "review" && shipping && (
            <ReviewStep
              shipping={shipping}
              total={total}
              itemCount={items.reduce((s, i) => s + i.quantity, 0)}
              loading={false}
              onBack={() => setStep("payment")}
              onConfirm={handlePlaceOrder}
            />
          )}
        </div>

        <div>
          <OrderSummary shippingCost={SHIPPING_COST} />
        </div>
      </div>
    </div>
  );
}
