export type PayStatus = 'pending' | 'paid' | 'refunded';

export type ShippingStatus = 'pending' | 'shipped' | 'received';

export type OrderStatus = 'pending_pay' | 'pending_ship' | 'completed' | 'closed';

export type OrderLogType = 'created' | 'paid' | 'shipped' | 'received';

export interface OrderUser {
  avatar: string;
  nickname: string;
  phone: string;
}

export interface OrderProductItem {
  id: number;
  image: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  orderNo: string;
  user: OrderUser;
  products: OrderProductItem[];
  totalAmount: number;
  productCount: number;
  payStatus: PayStatus;
  shippingStatus: ShippingStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}

export interface OrderAddress {
  receiver: string;
  phone: string;
  address: string;
}

export interface OrderAmount {
  productTotal: number;
  freight: number;
  discount: number;
  paidAmount: number;
}

export interface OrderLog {
  type: OrderLogType;
  content: string;
  time: string;
}

export interface OrderDetail extends OrderItem {
  paidAt?: string;
  address: OrderAddress;
  amount: OrderAmount;
  logs: OrderLog[];
}

export interface OrderListParams {
  page: number;
  pageSize: number;
  orderNo?: string;
  nickname?: string;
  phone?: string;
  payStatus?: PayStatus;
  shippingStatus?: ShippingStatus;
  startTime?: string;
  endTime?: string;
}

export interface OrderListResult {
  list: OrderItem[];
  total: number;
}

export interface OrderSearchValues {
  orderNo?: string;
  nickname?: string;
  phone?: string;
  payStatus?: PayStatus;
  shippingStatus?: ShippingStatus;
  dateRange?: [string, string];
}

export const PAY_STATUS_OPTIONS = [
  { label: '待支付', value: 'pending' as PayStatus },
  { label: '已支付', value: 'paid' as PayStatus },
  { label: '已退款', value: 'refunded' as PayStatus },
];

export const SHIPPING_STATUS_OPTIONS = [
  { label: '待发货', value: 'pending' as ShippingStatus },
  { label: '已发货', value: 'shipped' as ShippingStatus },
  { label: '已签收', value: 'received' as ShippingStatus },
];

export const ORDER_STATUS_OPTIONS = [
  { label: '待支付', value: 'pending_pay' as OrderStatus },
  { label: '待发货', value: 'pending_ship' as OrderStatus },
  { label: '已完成', value: 'completed' as OrderStatus },
  { label: '已关闭', value: 'closed' as OrderStatus },
];

export const PAY_STATUS_MAP: Record<PayStatus, string> = {
  pending: '待支付',
  paid: '已支付',
  refunded: '已退款',
};

export const SHIPPING_STATUS_MAP: Record<ShippingStatus, string> = {
  pending: '待发货',
  shipped: '已发货',
  received: '已签收',
};

export const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  pending_pay: '待支付',
  pending_ship: '待发货',
  completed: '已完成',
  closed: '已关闭',
};
