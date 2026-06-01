"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import { AddressCard } from "@/components/profile/address-card";
import { AddressForm } from "@/components/profile/address-form";
import { Button } from "@/components/ui/button";
import type { Address } from "@/types/user";
import type { AddressInput } from "@/lib/validations/user";

export default function AddressesPage() {
  const { addresses, loading, createAddress, updateAddress, deleteAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: AddressInput) => {
    setSaving(true);
    if (editing) {
      await updateAddress(editing.id, data);
      setEditing(null);
    } else {
      await createAddress(data);
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleEdit = (address: Address) => {
    setEditing(address);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-light text-[#F5F1EB] tracking-wide mb-2">Addresses</h2>
          <p className="text-xs text-[#F5F1EB]/40">Manage your saved delivery addresses</p>
        </div>
        {!showForm && !editing && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus size={14} />
            Add Address
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <div className="mb-10 border border-[#F5F1EB]/10 p-8">
          <h3 className="text-xs tracking-widest uppercase text-[#F5F1EB]/50 mb-8">
            {editing ? "Edit Address" : "New Address"}
          </h3>
          <AddressForm
            initial={editing ?? undefined}
            loading={saving}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 border border-[#F5F1EB]/5 animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-20 border border-[#F5F1EB]/10">
          <p className="text-xs text-[#F5F1EB]/30 tracking-widest uppercase mb-4">No addresses saved</p>
          <Button onClick={() => setShowForm(true)} variant="outline" size="sm">
            Add your first address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={deleteAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
