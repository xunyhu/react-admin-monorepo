import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { useMemo } from 'react';

import type { MemberPointLog } from '../types';

interface MemberPointTableProps {
  logs: MemberPointLog[];
}

export default function MemberPointTable({ logs }: MemberPointTableProps) {
  const columns = useMemo<ColumnsType<MemberPointLog>>(
    () => [
      {
        title: '积分变动',
        dataIndex: 'change',
        width: 120,
        render: (value: number) => (
          <Typography.Text type={value >= 0 ? 'success' : 'danger'}>
            {value >= 0 ? `+${value}` : value}
          </Typography.Text>
        ),
      },
      {
        title: '来源',
        dataIndex: 'source',
        ellipsis: true,
      },
      {
        title: '时间',
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
      dataSource={logs}
      pagination={false}
      size="small"
      locale={{ emptyText: '暂无积分记录' }}
    />
  );
}
