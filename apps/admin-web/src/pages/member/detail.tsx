import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '@/components/PageHeader';

import MemberAddressList from './components/MemberAddressList';
import MemberOrderTable from './components/MemberOrderTable';
import MemberPointTable from './components/MemberPointTable';
import MemberStatisticCards from './components/MemberStatisticCards';
import { MemberLevelTag, MemberStatusTag } from './components/MemberStatusTag';
import { useMemberDetail } from './hooks/useMemberDetail';

export default function MemberDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const memberId = id ? Number(id) : undefined;
  const { detail, loading } = useMemberDetail(memberId);

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
          title="会员详情"
          extra={
            <Button onClick={() => navigate('/member')}>返回列表</Button>
          }
        />
        <Card>
          <Typography.Text type="secondary">会员不存在或已删除</Typography.Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 6 }}>
      <PageHeader
        title="会员详情"
        extra={
          <Button onClick={() => navigate('/member')}>返回列表</Button>
        }
      />

      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card title="基础信息" size="small">
          <Space align="start" size={24}>
            <Avatar src={detail.avatar} size={72}>
              {detail.nickname.slice(0, 1)}
            </Avatar>
            <Descriptions column={2} style={{ flex: 1 }}>
              <Descriptions.Item label="用户昵称">{detail.nickname}</Descriptions.Item>
              <Descriptions.Item label="手机号">{detail.phone}</Descriptions.Item>
              <Descriptions.Item label="用户等级">
                <MemberLevelTag value={detail.level} />
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">{detail.createdAt}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <MemberStatusTag value={detail.status} />
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>

        <Card title="用户统计" size="small">
          <MemberStatisticCards
            orderCount={detail.orderCount}
            totalSpent={detail.totalSpent}
            lastOrderAt={detail.lastOrderAt}
            points={detail.points}
          />
        </Card>

        <Card title="收货地址" size="small">
          <MemberAddressList addresses={detail.addresses} />
        </Card>

        <Card title="最近订单" size="small">
          <MemberOrderTable orders={detail.recentOrders} />
        </Card>

        <Card title="积分记录" size="small">
          <MemberPointTable logs={detail.pointLogs} />
        </Card>
      </Space>
    </div>
  );
}
