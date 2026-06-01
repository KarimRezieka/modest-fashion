import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MODEST — Designed for Presence",
    template: "%s — MODEST",
  },
  description:
    "A modern modest fashion brand. Minimal design, premium aesthetic, oversized silhouettes.",
  keywords: ["modest fashion", "abayas", "hoodies", "oversized", "luxury streetwear"],
  openGraph: {
    type: "website",
    title: "MODEST",
    description: "Designed for Presence",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-black text-off-white antialiased">{children}</body>
    </html>
  );
}
