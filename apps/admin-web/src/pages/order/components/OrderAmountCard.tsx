import { Descriptions } from 'antd';

import type { OrderAmount } from '../types';

interface OrderAmountCardProps {
  amount: OrderAmount;
}

export default function OrderAmountCard({ amount }: OrderAmountCardProps) {
  return (
    <Descriptions
      bordered
      column={1}
      size="small"
      style={{ maxWidth: 360 }}
      items={[
        {
          key: 'productTotal',
          label: '商品总额',
          children: `¥${amount.productTotal.toFixed(2)}`,
        },
        {
          key: 'freight',
          label: '运费',
          children: `¥${amount.freight.toFixed(2)}`,
        },
        {
          key: 'discount',
          label: '优惠金额',
          children: `-¥${amount.discount.toFixed(2)}`,
        },
        {
          key: 'paidAmount',
          label: '实付金额',
          children: (
            <span style={{ color: '#ff4d4f', fontWeight: 600, fontSize: 16 }}>
              ¥{amount.paidAmount.toFixed(2)}
            </span>
          ),
        },
      ]}
    />
  );
}
