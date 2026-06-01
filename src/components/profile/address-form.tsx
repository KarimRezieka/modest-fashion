"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/lib/validations/user";
import type { Address } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressFormProps {
  initial?: Address;
  loading?: boolean;
  onSubmit: (data: AddressInput) => Promise<void>;
  onCancel: () => void;
}

export function AddressForm({ initial, loading, onSubmit, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: "Home", isDefault: false },
  });

  useEffect(() => {
    if (initial) {
      reset({
        ...initial,
        apartment: initial.apartment ?? undefined,
        state: initial.state ?? undefined,
      });
    }
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" error={errors.firstName?.message} {...register("firstName")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" error={errors.lastName?.message} {...register("lastName")} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" error={errors.phone?.message} {...register("phone")} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="street">Street Address</Label>
        <Input id="street" error={errors.street?.message} {...register("street")} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="apartment">Apartment / Suite (optional)</Label>
        <Input id="apartment" {...register("apartment")} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <Label htmlFor="city">City</Label>
          <Input id="city" error={errors.city?.message} {...register("city")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" error={errors.postalCode?.message} {...register("postalCode")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <Label htmlFor="country">Country</Label>
          <Input id="country" error={errors.country?.message} {...register("country")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="state">State / Region</Label>
          <Input id="state" {...register("state")} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isDefault"
          className="accent-[#7A8471] w-4 h-4 cursor-pointer"
          {...register("isDefault")}
        />
        <Label htmlFor="isDefault" className="mb-0 cursor-pointer">
          Set as default address
        </Label>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" loading={loading} size="sm">
          {initial ? "Update Address" : "Save Address"}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs tracking-widest uppercase text-[#F5F1EB]/40 hover:text-[#F5F1EB]/70 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
