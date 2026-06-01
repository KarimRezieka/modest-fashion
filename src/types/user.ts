export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  apartment: string | null;
  city: string;
  state: string | null;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
}

export interface UpdateProfileInput {
  name: string;
  phone?: string;
}
