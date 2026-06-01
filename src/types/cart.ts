export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  inStock: boolean;
  images: { url: string; alt: string | null }[];
}

export interface CartItemVariant {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: CartItemProduct;
  variant: CartItemVariant | null;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: string;
  itemCount: number;
}

// Guest cart uses same shape but stored in Zustand
export interface GuestCartItem {
  id: string;             // local uuid
  productId: string;
  variantId: string | null;
  quantity: number;
  product: CartItemProduct;
  variant: CartItemVariant | null;
}
