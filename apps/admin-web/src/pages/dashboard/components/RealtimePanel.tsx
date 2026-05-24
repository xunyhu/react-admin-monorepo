import { Card, List, Tabs } from 'antd';

import type { RealtimeData } from '../types';

interface RealtimePanelProps {
  data: RealtimeData;
  loading?: boolean;
}

export default function RealtimePanel({ data, loading }: RealtimePanelProps) {
  const items = [
    {
      key: 'orders',
      label: '最近订单',
      children: (
        <List
          size="small"
          loading={loading}
          dataSource={data.recentOrders}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.orderNo}
                description={`${item.nickname} · ${item.createdAt}`}
              />
              <span style={{ fontWeight: 500 }}>¥{item.amount.toFixed(2)}</span>
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'payments',
      label: '最近支付',
      children: (
        <List
          size="small"
          loading={loading}
          dataSource={data.recentPayments}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.orderNo} description={item.paidAt} />
              <span style={{ fontWeight: 500, color: '#3f8600' }}>
                ¥{item.amount.toFixed(2)}
              </span>
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'users',
      label: '最近注册',
      children: (
        <List
          size="small"
          loading={loading}
          dataSource={data.recentUsers}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.nickname}
                description={`${item.phone} · ${item.createdAt}`}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <Card title="实时动态">
      <Tabs items={items} />
    </Card>
  );
}
