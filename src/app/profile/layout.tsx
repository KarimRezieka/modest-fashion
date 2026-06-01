import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const sidebarLinks = [
  { href: "/profile", label: "Account" },
  { href: "/profile/addresses", label: "Addresses" },
  { href: "/profile/wishlist", label: "Wishlist" },
  { href: "/profile/orders", label: "Orders" },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="border-b border-[#F5F1EB]/10 pb-8 mb-12">
            <h1 className="text-xs tracking-[0.4em] uppercase text-[#F5F1EB]/40">Account</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
            <aside>
              <nav className="flex flex-col gap-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs tracking-widest uppercase text-[#F5F1EB]/40 hover:text-[#F5F1EB] transition-colors py-2 border-b border-[#F5F1EB]/5 last:border-0"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>
            <div>{children}</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
