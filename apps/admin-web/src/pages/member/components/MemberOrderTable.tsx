import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { useMemo } from 'react';

import OrderStatusTag from '@/pages/order/components/OrderStatusTag';
import { ORDER_STATUS_MAP } from '@/pages/order/types';
import type { MemberOrder } from '../types';
import type { OrderStatus } from '@/pages/order/types';

interface MemberOrderTableProps {
  orders: MemberOrder[];
}

export default function MemberOrderTable({ orders }: MemberOrderTableProps) {
  const columns = useMemo<ColumnsType<MemberOrder>>(
    () => [
      {
        title: '订单号',
        dataIndex: 'orderNo',
        width: 180,
      },
      {
        title: '金额',
        dataIndex: 'amount',
        width: 120,
        render: (value: number) => (
          <span style={{ color: '#ff4d4f' }}>¥{value.toFixed(2)}</span>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 120,
        render: (value: string) => {
          if (value in ORDER_STATUS_MAP) {
            return (
              <OrderStatusTag type="order" value={value as OrderStatus} />
            );
          }

          return value;
        },
      },
      {
        title: '下单时间',
        dataIndex: 'createdAt',
        width: 170,
      },
    ],
    []
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={orders}
      pagination={false}
      size="small"
      locale={{ emptyText: '暂无订单记录' }}
    />
  );
}
