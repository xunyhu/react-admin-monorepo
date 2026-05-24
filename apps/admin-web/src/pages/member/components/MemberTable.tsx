import { Avatar, Button, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import BtnPermission from '@/components/BtnPermission';
import type { MemberItem } from '../types';
import { MemberLevelTag, MemberStatusTag } from './MemberStatusTag';

interface MemberTableProps {
  list: MemberItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (record: MemberItem) => void;
  onDisable: (id: number) => void;
  onEnable: (id: number) => void;
}

export default function MemberTable({
  list,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onEdit,
  onDisable,
  onEnable,
}: MemberTableProps) {
  const navigate = useNavigate();

  const columns = useMemo<ColumnsType<MemberItem>>(
    () => [
      {
        title: '用户ID',
        dataIndex: 'id',
        width: 90,
        fixed: 'left',
      },
      {
        title: '用户头像',
        dataIndex: 'avatar',
        width: 90,
        render: (src: string, record) => (
          <Avatar src={src} size={40}>
            {record.nickname.slice(0, 1)}
          </Avatar>
        ),
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
        width: 120,
        ellipsis: true,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: 130,
      },
      {
        title: '用户等级',
        dataIndex: 'level',
        width: 110,
        render: (value: MemberItem['level']) => <MemberLevelTag value={value} />,
      },
      {
        title: '积分',
        dataIndex: 'points',
        width: 90,
      },
      {
        title: '订单数量',
        dataIndex: 'orderCount',
        width: 100,
      },
      {
        title: '消费总额',
        dataIndex: 'totalSpent',
        width: 120,
        render: (value: number) => (
          <span style={{ color: '#ff4d4f' }}>¥{value.toFixed(2)}</span>
        ),
      },
      {
        title: '注册时间',
        dataIndex: 'createdAt',
        width: 170,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 90,
        render: (value: MemberItem['status']) => <MemberStatusTag value={value} />,
      },
      {
        title: '操作',
        width: 220,
        fixed: 'right',
        render: (_: unknown, record: MemberItem) => (
          <Space size={0} wrap>
            <BtnPermission code="member:detail">
              <Button
                type="link"
                size="small"
                onClick={() => navigate(`/member/detail/${record.id}`)}
              >
                查看详情
              </Button>
            </BtnPermission>

            <BtnPermission code="member:update">
              <Button type="link" size="small" onClick={() => onEdit(record)}>
                编辑会员
              </Button>
            </BtnPermission>

            {record.status === 'active' ? (
              <BtnPermission code="member:disable">
                <Popconfirm
                  title="确认禁用该会员？"
                  description="禁用后会员将无法登录商城"
                  onConfirm={() => onDisable(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link" size="small" danger>
                    禁用会员
                  </Button>
                </Popconfirm>
              </BtnPermission>
            ) : (
              <BtnPermission code="member:disable">
                <Popconfirm
                  title="确认启用该会员？"
                  description="启用后会员可正常使用"
                  onConfirm={() => onEnable(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link" size="small">
                    启用会员
                  </Button>
                </Popconfirm>
              </BtnPermission>
            )}
          </Space>
        ),
      },
    ],
    [navigate, onEdit, onDisable, onEnable]
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={list}
      loading={loading}
      scroll={{ x: 1400 }}
      locale={{ emptyText: '暂无会员数据' }}
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
