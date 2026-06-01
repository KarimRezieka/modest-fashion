import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-light text-[#F5F1EB] tracking-wide mb-2">Orders</h2>
        <p className="text-xs text-[#F5F1EB]/40">Your order history</p>
      </div>

      <div className="text-center py-20 border border-[#F5F1EB]/10 flex flex-col items-center gap-4">
        <ShoppingBag size={28} className="text-[#F5F1EB]/20" />
        <p className="text-xs text-[#F5F1EB]/30 tracking-widest uppercase">
          Orders module coming soon
        </p>
      </div>
    </div>
  );
}
