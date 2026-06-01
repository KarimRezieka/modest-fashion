"use client";

import type { DailyRevenue } from "@/types/admin";

interface RevenueChartProps {
  data: DailyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="border border-[#F5F1EB]/10 p-6">
      <p className="text-[10px] tracking-widest uppercase text-[#F5F1EB]/40 mb-6">Revenue — Last 7 Days</p>
      <div className="flex items-end gap-3 h-28">
        {data.map(({ date, revenue }) => {
          const pct = (revenue / max) * 100;
          const label = new Date(date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short" });
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end" style={{ height: "80px" }}>
                <div
                  className="w-full bg-[#7A8471]/60 hover:bg-[#7A8471] transition-colors relative group"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                >
                  {revenue > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] text-[#F5F1EB]/70 bg-[#111] px-1.5 py-0.5">
                      EGP {revenue.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-[#F5F1EB]/30">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
