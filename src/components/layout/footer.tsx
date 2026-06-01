import Link from "next/link";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Abayas", href: "/shop?category=abayas" },
    { label: "Hoodies", href: "/shop?category=hoodies" },
    { label: "Essentials", href: "/shop?category=essentials" },
  ],
  Help: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Sizing Guide", href: "/sizing" },
    { label: "Returns", href: "/returns" },
  ],
  Account: [
    { label: "Sign In", href: "/login" },
    { label: "Create Account", href: "/register" },
    { label: "Orders", href: "/profile/orders" },
    { label: "Wishlist", href: "/profile/wishlist" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#F5F1EB]/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <Link
              href="/"
              className="text-xl font-light tracking-[0.35em] text-[#F5F1EB] hover:text-[#D8CBB8] transition-colors block mb-4"
            >
              MODEST
            </Link>
            <p className="text-xs text-[#F5F1EB]/30 leading-relaxed max-w-[160px]">
              Designed for Presence. Minimal luxury for the modern wardrobe.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs tracking-widest uppercase text-[#F5F1EB]/40 mb-5">{group}</p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-[#F5F1EB]/40 hover:text-[#F5F1EB]/70 transition-colors tracking-wide"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#F5F1EB]/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#F5F1EB]/20 tracking-wide">
            © {new Date().getFullYear()} MODEST. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-[#F5F1EB]/20 hover:text-[#F5F1EB]/50 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-[#F5F1EB]/20 hover:text-[#F5F1EB]/50 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
