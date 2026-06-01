import type { OrderStatus, PaymentStatus } from "./order";

export interface AdminStats {
  totalRevenue: string;
  totalOrders: number;
  pendingOrders: number;
  totalUsers: number;
  todayOrders: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  productSlug: string;
  totalSold: number;
}

export interface LowStockVariant {
  id: string;
  productName: string;
  productSlug: string;
  size: string | null;
  color: string | null;
  stock: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentOrders: AdminOrderRow[];
  topProducts: TopProduct[];
  dailyRevenue: DailyRevenue[];
  lowStock: LowStockVariant[];
}

export interface AdminOrderRow {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: string;
  shippingName: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
  user?: { email: string; name: string };
}
