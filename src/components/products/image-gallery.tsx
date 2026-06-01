"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  if (!images.length) {
    return (
      <div className="aspect-[3/4] bg-[#111] flex items-center justify-center">
        <span className="text-xs tracking-widest text-[#F5F1EB]/10 uppercase">MODEST</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="hidden md:flex flex-col gap-2 w-20 flex-shrink-0">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square overflow-hidden bg-[#111] transition-all",
              active === i ? "ring-1 ring-[#F5F1EB]/40" : "opacity-50 hover:opacity-80"
            )}
          >
            <Image src={img.url} alt={img.alt ?? productName} fill className="object-cover" />
          </button>
        ))}
      </div>

      <div className="flex-1">
        <div
          className="relative overflow-hidden aspect-[3/4] bg-[#111] cursor-zoom-in"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={images[active].url}
            alt={images[active].alt ?? productName}
            fill
            className={cn(
              "object-cover transition-transform duration-100",
              zoomed ? "scale-150" : "scale-100"
            )}
            style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex gap-2 mt-3 md:hidden">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative w-12 aspect-square overflow-hidden bg-[#111] flex-shrink-0 transition-all",
                active === i ? "ring-1 ring-[#F5F1EB]/40" : "opacity-40"
              )}
            >
              <Image src={img.url} alt={img.alt ?? productName} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
