export type TrendDirection = 'up' | 'down';

export interface TrendCompare {
  value: number;
  direction: TrendDirection;
  label: string;
}

export interface StatMetric {
  value: number;
  compare: TrendCompare;
}

export interface DashboardOverview {
  todaySales: StatMetric;
  todayOrders: StatMetric;
  todayNewUsers: StatMetric;
  monthSales: StatMetric;
  payConversionRate: StatMetric;
  refundRate: StatMetric;
}

export interface SalesTrendItem {
  date: string;
  amount: number;
}

export interface OrderTrendItem {
  date: string;
  count: number;
}

export interface UserTrendItem {
  date: string;
  count: number;
}

export interface TopProductItem {
  id: number;
  name: string;
  sales: number;
  amount: number;
  conversionRate: number;
}

export interface CategoryStatItem {
  name: string;
  value: number;
}

export interface LowStockItem {
  id: number;
  name: string;
  stock: number;
  threshold: number;
}

export interface RecentOrderItem {
  orderNo: string;
  nickname: string;
  amount: number;
  createdAt: string;
}

export interface RecentPaymentItem {
  orderNo: string;
  amount: number;
  paidAt: string;
}

export interface RecentUserItem {
  nickname: string;
  phone: string;
  createdAt: string;
}

export interface RealtimeData {
  recentOrders: RecentOrderItem[];
  recentPayments: RecentPaymentItem[];
  recentUsers: RecentUserItem[];
}

export interface DashboardChartsData {
  orderTrend: OrderTrendItem[];
  userTrend: UserTrendItem[];
  topProducts: TopProductItem[];
  categoryStats: CategoryStatItem[];
  lowStock: LowStockItem[];
  realtime: RealtimeData;
}
