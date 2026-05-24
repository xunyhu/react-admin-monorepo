import request from '@/utils/request';
import type {
  CategoryStatItem,
  DashboardChartsData,
  DashboardOverview,
  OrderTrendItem,
  SalesTrendItem,
  TopProductItem,
  UserTrendItem,
} from '@/pages/dashboard/types';

export const getDashboardOverview = () =>
  request.get<DashboardOverview>('/dashboard/overview');

export const getSalesTrend = () =>
  request.get<SalesTrendItem[]>('/dashboard/sales-trend');

export const getOrderTrend = () =>
  request.get<OrderTrendItem[]>('/dashboard/order-trend');

export const getUserTrend = () =>
  request.get<UserTrendItem[]>('/dashboard/user-trend');

export const getTopProducts = () =>
  request.get<TopProductItem[]>('/dashboard/top-products');

export const getCategoryStats = () =>
  request.get<CategoryStatItem[]>('/dashboard/category-stats');

export const getDashboardCharts = () =>
  request.get<DashboardChartsData>('/dashboard/charts');

export type {
  CategoryStatItem,
  DashboardChartsData,
  DashboardOverview,
  OrderTrendItem,
  SalesTrendItem,
  TopProductItem,
  UserTrendItem,
};
