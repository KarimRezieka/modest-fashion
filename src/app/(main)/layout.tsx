import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
