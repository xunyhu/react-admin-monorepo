import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { TopProductItem } from '../types';

interface TopProductTableProps {
  data: TopProductItem[];
  loading?: boolean;
}

const columns: ColumnsType<TopProductItem> = [
  {
    title: '排名',
    width: 70,
    render: (_value, _record, index) => index + 1,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '销量',
    dataIndex: 'sales',
    width: 90,
    render: (value: number) => `${value}`,
  },
  {
    title: '销售额',
    dataIndex: 'amount',
    width: 120,
    render: (value: number) => `¥${value.toLocaleString()}`,
  },
  {
    title: '转化率',
    dataIndex: 'conversionRate',
    width: 90,
    render: (value: number) => `${value}%`,
  },
];

export default function TopProductTable({ data, loading }: TopProductTableProps) {
  return (
    <Card title="商品排行 TOP5">
      <Table
        rowKey="id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Card>
  );
}
