import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: boolean;
}

export function StatCard({ label, value, sub, icon: Icon, accent }: StatCardProps) {
  return (
    <div className={cn(
      "border p-6 flex flex-col gap-3",
      accent ? "border-[#7A8471]/40 bg-[#7A8471]/5" : "border-[#F5F1EB]/10"
    )}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest uppercase text-[#F5F1EB]/40">{label}</p>
        <Icon size={15} className={accent ? "text-[#7A8471]" : "text-[#F5F1EB]/20"} />
      </div>
      <p className={cn(
        "text-2xl font-light tracking-wide",
        accent ? "text-[#7A8471]" : "text-[#F5F1EB]"
      )}>
        {value}
      </p>
      {sub && <p className="text-xs text-[#F5F1EB]/30">{sub}</p>}
    </div>
  );
}
