import request from '@/utils/request';
import type {
  OrderDetail,
  OrderListParams,
  OrderListResult,
} from '@/pages/order/types';

export const getOrderList = (params: OrderListParams) =>
  request.get<OrderListResult>('/orders', { params });

export const getOrderDetail = (id: number) =>
  request.get<OrderDetail>(`/orders/${id}`);

export const shipOrder = (id: number) =>
  request.post(`/orders/${id}/ship`);

export const closeOrder = (id: number) =>
  request.post(`/orders/${id}/close`);

export const deleteOrder = (id: number) =>
  request.delete(`/orders/${id}`);

export type { OrderDetail, OrderListParams, OrderListResult };
