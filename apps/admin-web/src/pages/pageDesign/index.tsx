import { Button, Modal, QRCode, Space, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { getDesignPages } from '@/api/design';

type PageDesign = {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published';
  updatedAt: number;
};

export default function PageDesignListPage() {
  const [data, setData] = useState<PageDesign[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    getDesignPages({ page: 1, pageSize: 200 })
      .then((res: any) => {
        const list = (res?.data?.list || []) as PageDesign[];
        setData(list);
      })
      .catch(() => {
        setData([]);
      });
  }, []);

  const openPreview = (pageId: string) => {
    setPreviewUrl(`https://client.xunyihu.com?pageId=${pageId}`);
    setPreviewOpen(true);
  };

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
            width: 200,
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
            width: 300,
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
            width: 200,
            render: (_, record) => (
              <Space size={4}>
                <Button type="link" onClick={() => openPreview(record.id)}>
                  预览
                </Button>
                <Button
                  type="link"
                  onClick={() =>
                    window.open(`/pageDesign/create?editId=${record.id}`, '_blank')
                  }
                >
                  编辑
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="预览二维码"
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <QRCode value={previewUrl || ' '} size={160} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>预览链接</div>
            <Typography.Text
              style={{ wordBreak: 'break-all' }}
              copyable={{ text: previewUrl }}
            >
              {previewUrl}
            </Typography.Text>
          </div>
        </div>
      </Modal>
    </div>
  );
}
