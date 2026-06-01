"use client";

import { useState } from "react";
import { MapPin, Pencil, Trash2, Star } from "lucide-react";
import type { Address } from "@/types/user";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="border border-[#F5F1EB]/10 p-6 relative group hover:border-[#F5F1EB]/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#7A8471]" />
          <span className="text-xs tracking-widest uppercase text-[#F5F1EB]/60">{address.label}</span>
        </div>
        {address.isDefault && (
          <span className="flex items-center gap-1 text-xs text-[#7A8471]">
            <Star size={11} fill="currentColor" />
            Default
          </span>
        )}
      </div>

      <p className="text-sm text-[#F5F1EB] mb-1">
        {address.firstName} {address.lastName}
      </p>
      <p className="text-xs text-[#F5F1EB]/50 leading-relaxed">
        {address.street}
        {address.apartment && `, ${address.apartment}`}
        <br />
        {address.city}{address.state ? `, ${address.state}` : ""} {address.postalCode}
        <br />
        {address.country}
      </p>
      <p className="text-xs text-[#F5F1EB]/40 mt-2">{address.phone}</p>

      <div className="flex items-center gap-4 mt-5">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-1.5 text-xs text-[#F5F1EB]/40 hover:text-[#F5F1EB]/80 transition-colors"
        >
          <Pencil size={12} />
          Edit
        </button>

        {confirming ? (
          <span className="flex items-center gap-3 text-xs">
            <button
              onClick={() => { onDelete(address.id); setConfirming(false); }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Confirm delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-[#F5F1EB]/30 hover:text-[#F5F1EB]/60 transition-colors"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="flex items-center gap-1.5 text-xs text-[#F5F1EB]/40 hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
