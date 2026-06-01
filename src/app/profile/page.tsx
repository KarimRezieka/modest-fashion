import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "Account — MODEST",
};

export default function ProfilePage() {
  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-light text-[#F5F1EB] tracking-wide mb-2">Account Details</h2>
        <p className="text-xs text-[#F5F1EB]/40">Manage your name and contact information</p>
      </div>
      <ProfileForm />
    </div>
  );
}
