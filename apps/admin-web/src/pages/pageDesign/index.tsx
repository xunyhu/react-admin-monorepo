import { Button, Space, Table, Tag } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

type PageDesign = {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published';
  updatedAt: number;
};

function loadPageDesigns(): PageDesign[] {
  try {
    const raw = localStorage.getItem('pageDesigns');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PageDesign[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function PageDesignListPage() {
  const navigate = useNavigate();

  const data = useMemo(() => loadPageDesigns(), []);

  return (
    <div style={{ padding: 6 }}>
      <PageHeader
        title="装修页列表"
        extra={
          <Button
            type="primary"
            onClick={() => window.open('/pageDesign/create', '_blank')}
          >
            + 新建装修页
          </Button>
        }
      />

      <Table<PageDesign>
        rowKey="id"
        dataSource={data}
        pagination={false}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
            render: (text, record) => (
              <Space>
                <span style={{ fontWeight: 500 }}>{text}</span>
                {record.status === 'draft' ? (
                  <Tag color="default">草稿</Tag>
                ) : (
                  <Tag color="green">已发布</Tag>
                )}
              </Space>
            ),
          },
          {
            title: '描述',
            dataIndex: 'description',
            render: (v) => v || '-',
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            width: 200,
            render: (ts) => new Date(Number(ts)).toLocaleString(),
          },
          {
            title: '操作',
            width: 140,
            render: (_, record) => (
              <Button
                type="link"
                onClick={() =>
                  window.open(`/pageDesign/create?editId=${record.id}`, '_blank')
                }
              >
                编辑
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
