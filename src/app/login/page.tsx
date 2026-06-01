import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — MODEST",
  description: "Sign in to your MODEST account",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col justify-end p-16">
          <Link href="/" className="text-3xl font-display tracking-[0.3em] text-off-white font-light mb-4">
            MODEST
          </Link>
          <p className="text-off-white/40 text-sm tracking-widest uppercase">
            Designed for Presence
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <Link
              href="/"
              className="lg:hidden text-2xl font-display tracking-[0.3em] text-off-white font-light block mb-10"
            >
              MODEST
            </Link>
            <h1 className="text-2xl font-display font-light text-off-white tracking-wide mb-2">
              Welcome back
            </h1>
            <p className="text-off-white/40 text-sm">
              Sign in to continue
            </p>
          </div>

          <LoginForm />

          <p className="mt-12 text-center text-xs text-off-white/20 tracking-wide">
            By signing in you agree to our{" "}
            <Link href="/terms" className="text-off-white/40 hover:text-off-white/60 transition-colors">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
