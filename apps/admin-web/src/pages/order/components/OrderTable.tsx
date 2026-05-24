import { Avatar, Button, Image, Popconfirm, Space, Table, Typography } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import BtnPermission from '@/components/BtnPermission';
import type { OrderItem } from '../types';
import OrderStatusTag from './OrderStatusTag';

interface OrderTableProps {
  list: OrderItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  selectedRowKeys: number[];
  onSelectedRowKeysChange: (keys: number[]) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onShip: (id: number) => void;
  onClose: (id: number) => void;
  onDelete: (id: number) => void;
}

function renderUserInfo(user: OrderItem['user']) {
  return (
    <Space>
      <Avatar src={user.avatar} size={36}>
        {user.nickname.slice(0, 1)}
      </Avatar>
      <div>
        <div>{user.nickname}</div>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {user.phone}
        </Typography.Text>
      </div>
    </Space>
  );
}

function renderProductInfo(products: OrderItem['products']) {
  const first = products[0];
  if (!first) return '-';

  return (
    <Space align="start">
      <Image
        src={first.image}
        width={48}
        height={48}
        style={{ objectFit: 'cover', borderRadius: 4 }}
        preview={false}
      />
      <div style={{ maxWidth: 200 }}>
        <Typography.Text ellipsis={{ tooltip: first.name }}>
          {first.name}
        </Typography.Text>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {first.sku}
          </Typography.Text>
        </div>
        {products.length > 1 && (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            等 {products.length} 种商品
          </Typography.Text>
        )}
      </div>
    </Space>
  );
}

export default function OrderTable({
  list,
  loading,
  page,
  pageSize,
  total,
  selectedRowKeys,
  onSelectedRowKeysChange,
  onPageChange,
  onShip,
  onClose,
  onDelete,
}: OrderTableProps) {
  const navigate = useNavigate();

  const columns = useMemo<ColumnsType<OrderItem>>(
    () => [
      {
        title: '订单号',
        dataIndex: 'orderNo',
        width: 180,
        fixed: 'left',
      },
      {
        title: '用户信息',
        dataIndex: 'user',
        width: 200,
        render: (_, record) => renderUserInfo(record.user),
      },
      {
        title: '商品信息',
        dataIndex: 'products',
        width: 280,
        render: (_, record) => renderProductInfo(record.products),
      },
      {
        title: '订单金额',
        dataIndex: 'totalAmount',
        width: 120,
        render: (value: number) => (
          <span style={{ color: '#ff4d4f' }}>¥{value.toFixed(2)}</span>
        ),
      },
      {
        title: '商品数量',
        dataIndex: 'productCount',
        width: 100,
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        width: 100,
        render: (value: OrderItem['payStatus']) => (
          <OrderStatusTag type="pay" value={value} />
        ),
      },
      {
        title: '发货状态',
        dataIndex: 'shippingStatus',
        width: 100,
        render: (value: OrderItem['shippingStatus']) => (
          <OrderStatusTag type="shipping" value={value} />
        ),
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        width: 100,
        render: (value: OrderItem['orderStatus']) => (
          <OrderStatusTag type="order" value={value} />
        ),
      },
      {
        title: '下单时间',
        dataIndex: 'createdAt',
        width: 170,
      },
      {
        title: '操作',
        width: 220,
        fixed: 'right',
        render: (_: unknown, record: OrderItem) => {
          const canShip =
            record.payStatus === 'paid' &&
            record.shippingStatus === 'pending' &&
            record.orderStatus !== 'closed';
          const canClose =
            record.orderStatus !== 'completed' && record.orderStatus !== 'closed';

          return (
            <Space size={0} wrap>
              <BtnPermission code="order:detail">
                <Button
                  type="link"
                  size="small"
                  onClick={() => navigate(`/order/detail/${record.id}`)}
                >
                  查看详情
                </Button>
              </BtnPermission>

              {canShip && (
                <BtnPermission code="order:ship">
                  <Popconfirm
                    title="确认发货？"
                    description="发货后订单状态将更新为已发货"
                    onConfirm={() => onShip(record.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="link" size="small">
                      发货
                    </Button>
                  </Popconfirm>
                </BtnPermission>
              )}

              {canClose && (
                <BtnPermission code="order:close">
                  <Popconfirm
                    title="确认关闭订单？"
                    description="关闭后订单将无法继续操作"
                    onConfirm={() => onClose(record.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="link" size="small" danger>
                      关闭
                    </Button>
                  </Popconfirm>
                </BtnPermission>
              )}

              <BtnPermission code="order:delete">
                <Popconfirm
                  title="确认删除订单？"
                  description="删除后不可恢复"
                  onConfirm={() => onDelete(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link" size="small" danger>
                    删除
                  </Button>
                </Popconfirm>
              </BtnPermission>
            </Space>
          );
        },
      },
    ],
    [navigate, onShip, onClose, onDelete]
  );

  const rowSelection: TableRowSelection<OrderItem> = {
    selectedRowKeys,
    onChange: (keys) => onSelectedRowKeysChange(keys as number[]),
  };

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={list}
      loading={loading}
      scroll={{ x: 1500 }}
      rowSelection={rowSelection}
      locale={{ emptyText: '暂无订单数据' }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (count) => `共 ${count} 条`,
        onChange: onPageChange,
      }}
    />
  );
}
