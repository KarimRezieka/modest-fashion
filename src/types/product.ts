export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
}

export interface ProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
  sku: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  comparePrice: string | null;
  categoryId: string;
  category: Category;
  inStock: boolean;
  featured: boolean;
  published: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  inStock: boolean;
  featured: boolean;
  category: { name: string; slug: string };
  images: Pick<ProductImage, "url" | "alt">[];
}

export interface ProductsResponse {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export type SortOption = "newest" | "oldest" | "price_asc" | "price_desc" | "featured";
