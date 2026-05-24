import { Button, Popconfirm, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import BtnPermission from '@/components/BtnPermission';
import type { Product } from '../types';

interface ColumnOptions {
  onEdit: (record: Product) => void;
  onDelete: (id: number) => void;
}

export function getProductColumns({
  onEdit,
  onDelete,
}: ColumnOptions): ColumnsType<Product> {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 120,
      render: (value: number) => `¥${Number(value).toFixed(2)}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">上架</Tag>
        ) : (
          <Tag color="default">下架</Tag>
        ),
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: Product) => (
        <Space>
          <BtnPermission code="product:edit">
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
          </BtnPermission>
          <BtnPermission code="product:delete">
            <Popconfirm
              title="确定删除该商品吗？"
              description="删除后不可恢复"
              onConfirm={() => onDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger type="link">
                删除
              </Button>
            </Popconfirm>
          </BtnPermission>
        </Space>
      ),
    },
  ];
}
