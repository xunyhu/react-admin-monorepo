import { Card, List, Tag } from 'antd';

import type { LowStockItem } from '../types';

interface LowStockAlertProps {
  data: LowStockItem[];
  loading?: boolean;
}

export default function LowStockAlert({ data, loading }: LowStockAlertProps) {
  return (
    <Card title="库存预警">
      <List
        loading={loading}
        dataSource={data}
        locale={{ emptyText: '暂无库存预警' }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.name} description={`预警阈值：${item.threshold}`} />
            <Tag color={item.stock <= item.threshold / 2 ? 'red' : 'orange'}>
              剩余 {item.stock}
            </Tag>
          </List.Item>
        )}
      />
    </Card>
  );
}
