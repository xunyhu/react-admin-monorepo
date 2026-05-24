import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Image,
  Space,
  Spin,
  Table,
  Typography,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '@/components/PageHeader';

import OrderAmountCard from './components/OrderAmountCard';
import OrderStatusTag from './components/OrderStatusTag';
import OrderTimeline from './components/OrderTimeline';
import { useOrderDetail } from './hooks/useOrderDetail';
import type { OrderProductItem } from './types';

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = id ? Number(id) : undefined;
  const { detail, loading } = useOrderDetail(orderId);

  const productColumns = [
    {
      title: '商品图片',
      dataIndex: 'image',
      width: 100,
      render: (src: string) => (
        <Image
          src={src}
          width={64}
          height={64}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 160,
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 120,
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 80,
    },
    {
      title: '小计',
      width: 120,
      render: (_: unknown, record: OrderProductItem) =>
        `¥${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div style={{ padding: 6 }}>
        <PageHeader
          title="订单详情"
          extra={
            <Button onClick={() => navigate('/order')}>返回列表</Button>
          }
        />
        <Card>
          <Typography.Text type="secondary">订单不存在或已删除</Typography.Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 6 }}>
      <PageHeader
        title="订单详情"
        extra={
          <Button onClick={() => navigate('/order')}>返回列表</Button>
        }
      />

      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card title="基础信息" size="small">
          <Descriptions column={2}>
            <Descriptions.Item label="订单号">{detail.orderNo}</Descriptions.Item>
            <Descriptions.Item label="下单时间">{detail.createdAt}</Descriptions.Item>
            <Descriptions.Item label="支付时间">
              {detail.paidAt || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="订单状态">
              <OrderStatusTag type="order" value={detail.orderStatus} />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="用户信息" size="small">
          <Space>
            <Avatar src={detail.user.avatar} size={48}>
              {detail.user.nickname.slice(0, 1)}
            </Avatar>
            <div>
              <div>{detail.user.nickname}</div>
              <Typography.Text type="secondary">{detail.user.phone}</Typography.Text>
            </div>
          </Space>
        </Card>

        <Card title="收货信息" size="small">
          <Descriptions column={1}>
            <Descriptions.Item label="收货人">
              {detail.address.receiver}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {detail.address.phone}
            </Descriptions.Item>
            <Descriptions.Item label="收货地址">
              {detail.address.address}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="商品信息" size="small">
          <Table
            rowKey="id"
            columns={productColumns}
            dataSource={detail.products}
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="金额信息" size="small">
          <OrderAmountCard amount={detail.amount} />
        </Card>

        <Card title="订单日志" size="small">
          <OrderTimeline logs={detail.logs} />
        </Card>
      </Space>
    </div>
  );
}
