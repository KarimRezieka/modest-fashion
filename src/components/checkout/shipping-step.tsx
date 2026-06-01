"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { shippingSchema, type ShippingInput } from "@/lib/validations/order";
import { useAddresses } from "@/hooks/useAddresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Address } from "@/types/user";

interface ShippingStepProps {
  initial: ShippingInput | null;
  onNext: (data: ShippingInput) => void;
}

export function ShippingStep({ initial, onNext }: ShippingStepProps) {
  const { addresses } = useAddresses();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
    defaultValues: initial ?? {},
  });

  const fillFromAddress = (addr: Address) => {
    reset({
      name: `${addr.firstName} ${addr.lastName}`,
      phone: addr.phone,
      street: addr.street,
      apt: addr.apartment ?? undefined,
      city: addr.city,
      state: addr.state ?? undefined,
      country: addr.country,
      postal: addr.postalCode,
    });
  };

  useEffect(() => {
    if (!initial && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      fillFromAddress(def);
    }
  }, [addresses]);

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-7">
      {addresses.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/40 mb-3">Saved Addresses</p>
          <div className="flex flex-col gap-2">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => fillFromAddress(addr)}
                className="flex items-start gap-3 border border-[#F5F1EB]/10 p-4 hover:border-[#F5F1EB]/30 text-left transition-colors"
              >
                <MapPin size={14} className="text-[#7A8471] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#F5F1EB]/70">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="text-xs text-[#F5F1EB]/40 mt-0.5">
                    {addr.street}, {addr.city}, {addr.country}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
          <Label>Full Name</Label>
          <Input error={errors.name?.message} {...register("name")} />
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
          <Label>Phone</Label>
          <Input type="tel" error={errors.phone?.message} {...register("phone")} />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Label>Street Address</Label>
          <Input error={errors.street?.message} {...register("street")} />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Label>Apartment / Suite (optional)</Label>
          <Input {...register("apt")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>City</Label>
          <Input error={errors.city?.message} {...register("city")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Postal Code</Label>
          <Input error={errors.postal?.message} {...register("postal")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Country</Label>
          <Input error={errors.country?.message} {...register("country")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>State / Region (optional)</Label>
          <Input {...register("state")} />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit">Continue to Payment</Button>
      </div>
    </form>
  );
}
