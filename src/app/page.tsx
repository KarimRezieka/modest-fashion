import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-light tracking-[0.4em] text-[#F5F1EB] mb-4">
          MODEST
        </h1>
        <p className="text-[#F5F1EB]/40 tracking-[0.3em] uppercase text-xs">
          Designed for Presence
        </p>
      </div>

      <div className="flex gap-6 mt-8">
        <Link
          href="/login"
          className="text-xs tracking-widest uppercase text-[#F5F1EB]/60 hover:text-[#F5F1EB] transition-colors border-b border-[#F5F1EB]/20 hover:border-[#F5F1EB]/60 pb-1"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="text-xs tracking-widest uppercase text-[#F5F1EB]/60 hover:text-[#F5F1EB] transition-colors border-b border-[#F5F1EB]/20 hover:border-[#F5F1EB]/60 pb-1"
        >
          Create Account
        </Link>
      </div>

      <div className="absolute bottom-8 text-[#F5F1EB]/10 text-xs tracking-widest uppercase">
        Module 1 — Auth
      </div>
    </main>
  );
}
