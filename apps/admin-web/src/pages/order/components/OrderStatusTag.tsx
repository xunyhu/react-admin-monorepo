import { Tag } from 'antd';

import {
  ORDER_STATUS_MAP,
  PAY_STATUS_MAP,
  SHIPPING_STATUS_MAP,
  type OrderStatus,
  type PayStatus,
  type ShippingStatus,
} from '../types';

type StatusType = 'pay' | 'shipping' | 'order';

interface OrderStatusTagProps {
  type: StatusType;
  value: PayStatus | ShippingStatus | OrderStatus;
}

const PAY_COLOR: Record<PayStatus, string> = {
  pending: 'orange',
  paid: 'green',
  refunded: 'red',
};

const SHIPPING_COLOR: Record<ShippingStatus, string> = {
  pending: 'orange',
  shipped: 'blue',
  received: 'green',
};

const ORDER_COLOR: Record<OrderStatus, string> = {
  pending_pay: 'orange',
  pending_ship: 'blue',
  completed: 'green',
  closed: 'default',
};

export default function OrderStatusTag({ type, value }: OrderStatusTagProps) {
  if (type === 'pay') {
    const status = value as PayStatus;
    return <Tag color={PAY_COLOR[status]}>{PAY_STATUS_MAP[status]}</Tag>;
  }

  if (type === 'shipping') {
    const status = value as ShippingStatus;
    return <Tag color={SHIPPING_COLOR[status]}>{SHIPPING_STATUS_MAP[status]}</Tag>;
  }

  const status = value as OrderStatus;
  return <Tag color={ORDER_COLOR[status]}>{ORDER_STATUS_MAP[status]}</Tag>;
}
