"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";
import { productService } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const { products, total, totalPages, loading, refetch } = useProducts({ search, limit: 20, page });
  const { categories } = useCategories();
  const accessToken = useAuthStore((s) => s.accessToken);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = async (slug: string) => {
    if (!accessToken || !confirm("Delete this product? This cannot be undone.")) return;
    try {
      await productService.deleteProduct(slug, accessToken);
      await refetch();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#F5F1EB] tracking-wide">Products</h1>
          <p className="text-xs text-[#F5F1EB]/30 mt-1">{total} total</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus size={14} /> New Product
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6 max-w-sm">
        <Search size={13} className="absolute left-3 top-2.5 text-[#F5F1EB]/25" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent border border-[#F5F1EB]/15 pl-8 pr-4 py-2 text-xs text-[#F5F1EB] placeholder:text-[#F5F1EB]/25 outline-none focus:border-[#F5F1EB]/40 transition-colors"
        />
      </form>

      <div className="border border-[#F5F1EB]/10">
        <div className="grid grid-cols-[1fr_120px_90px_80px_80px_100px] gap-4 px-6 py-3 border-b border-[#F5F1EB]/10 text-[10px] tracking-widest uppercase text-[#F5F1EB]/25">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 border-b border-[#F5F1EB]/5 animate-pulse" />
          ))
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xs text-[#F5F1EB]/20 tracking-widest uppercase">No products found</p>
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_120px_90px_80px_80px_100px] gap-4 px-6 py-4 border-b border-[#F5F1EB]/5 hover:bg-[#F5F1EB]/2 transition-colors items-center"
            >
              <div className="min-w-0">
                <p className="text-sm text-[#F5F1EB]/80 truncate">{p.name}</p>
                <p className="text-xs text-[#F5F1EB]/25 font-mono mt-0.5 truncate">{p.slug}</p>
              </div>
              <span className="text-xs text-[#F5F1EB]/40 truncate">{p.category.name}</span>
              <span className="text-xs text-[#F5F1EB]/70">EGP {parseFloat(p.price).toLocaleString()}</span>
              <span className={cn("text-xs", p.inStock ? "text-[#7A8471]" : "text-red-400/70")}>
                {p.inStock ? "In Stock" : "Out"}
              </span>
              <span className={cn("text-xs", p.featured ? "text-[#D8CBB8]" : "text-[#F5F1EB]/25")}>
                {p.featured ? "Featured" : "—"}
              </span>
              <div className="flex items-center gap-3 justify-end">
                <Link href={`/product/${p.slug}`} target="_blank" className="text-[#F5F1EB]/25 hover:text-[#F5F1EB]/60 transition-colors">
                  <Eye size={14} />
                </Link>
                <Link href={`/admin/products/${p.slug}/edit`} className="text-[#F5F1EB]/25 hover:text-[#F5F1EB]/60 transition-colors">
                  <Pencil size={14} />
                </Link>
                <button onClick={() => handleDelete(p.slug)} className="text-[#F5F1EB]/25 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-4 py-2 border border-[#F5F1EB]/15 text-xs text-[#F5F1EB]/40 hover:text-[#F5F1EB] disabled:opacity-25 transition-colors">
            Prev
          </button>
          <span className="text-xs text-[#F5F1EB]/40">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="px-4 py-2 border border-[#F5F1EB]/15 text-xs text-[#F5F1EB]/40 hover:text-[#F5F1EB] disabled:opacity-25 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
