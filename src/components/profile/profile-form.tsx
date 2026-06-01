"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/user";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm() {
  const { user, loading, updateProfile } = useProfile();
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({ resolver: zodResolver(updateProfileSchema) });

  useEffect(() => {
    if (user) reset({ name: user.name, phone: (user as { phone?: string }).phone ?? "" });
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileInput) => {
    setServerError("");
    const result = await updateProfile(data);
    if (result?.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-md">
      {serverError && (
        <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/20 px-4 py-3">
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" type="text" error={errors.name?.message} {...register("name")} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user?.email ?? ""}
          disabled
          className="opacity-30 cursor-not-allowed"
        />
        <p className="text-xs text-[#F5F1EB]/30 mt-1">Email cannot be changed</p>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" type="tel" placeholder="+20 xxx xxx xxxx" {...register("phone")} />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" loading={loading} disabled={!isDirty} size="sm">
          Save Changes
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-[#7A8471]">
            <Check size={14} />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
