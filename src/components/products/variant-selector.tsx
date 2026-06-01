"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/product";

interface SizeSelectorProps {
  sizes: { size: string; stock: number }[];
  selected: string;
  onChange: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  if (!sizes.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Size</p>
        {selected && (
          <span className="text-xs text-[#F5F1EB]/40">{selected}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map(({ size, stock }) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            disabled={stock === 0}
            className={cn(
              "min-w-[40px] h-9 px-3 text-xs tracking-wide border transition-all duration-150",
              stock === 0
                ? "border-[#F5F1EB]/8 text-[#F5F1EB]/15 cursor-not-allowed relative overflow-hidden"
                : selected === size
                ? "border-[#F5F1EB] text-[#F5F1EB] bg-[#F5F1EB]/5"
                : "border-[#F5F1EB]/20 text-[#F5F1EB]/50 hover:border-[#F5F1EB]/50 hover:text-[#F5F1EB]/80"
            )}
          >
            {size}
            {stock === 0 && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="absolute w-full h-px bg-[#F5F1EB]/15 rotate-45" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ColorSelectorProps {
  colors: { color: string; colorHex: string | null; stock: number }[];
  selected: string;
  onChange: (color: string) => void;
}

export function ColorSelector({ colors, selected, onChange }: ColorSelectorProps) {
  if (!colors.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/50">Color</p>
        {selected && (
          <span className="text-xs text-[#F5F1EB]/40">{selected}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map(({ color, colorHex, stock }) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            disabled={stock === 0}
            title={color}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all duration-150",
              stock === 0 ? "opacity-25 cursor-not-allowed" : "hover:scale-110",
              selected === color ? "border-[#F5F1EB]" : "border-transparent"
            )}
            style={{ backgroundColor: colorHex ?? "#333" }}
          />
        ))}
      </div>
    </div>
  );
}
