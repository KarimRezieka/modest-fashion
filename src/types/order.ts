export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  size: string | null;
  color: string | null;
  price: string;
  quantity: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: string;
  shippingCost: string;
  total: string;
  shippingName: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingApt: string | null;
  shippingCity: string;
  shippingState: string | null;
  shippingCountry: string;
  shippingPostal: string;
  createdAt: string;
  items: OrderItem[];
}

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  apt?: string;
  city: string;
  state?: string;
  country: string;
  postal: string;
}
