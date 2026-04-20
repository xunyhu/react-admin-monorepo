import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  List,
  Radio,
  Row,
  Space,
  Typography,
  message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type PageDesign = {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published';
  updatedAt: number;
  schema?: PageSchema;
};

type BlockType = 'text' | 'button' | 'divider';

type PageBlock =
  | {
      id: string;
      type: 'text';
      props: { text: string };
    }
  | {
      id: string;
      type: 'button';
      props: { text: string; variant: 'primary' | 'default' };
    }
  | {
      id: string;
      type: 'divider';
      props: { text?: string };
    };

type PageSchema = {
  blocks: PageBlock[];
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

function savePageDesigns(list: PageDesign[]) {
  localStorage.setItem('pageDesigns', JSON.stringify(list));
}

const PALETTE: Array<{
  type: BlockType;
  title: string;
  description: string;
  defaultProps: PageBlock['props'];
}> = [
  {
    type: 'text',
    title: '文本',
    description: '展示一段文字',
    defaultProps: { text: '这里是一段文字' },
  },
  {
    type: 'button',
    title: '按钮',
    description: '可点击按钮',
    defaultProps: { text: '按钮', variant: 'primary' },
  },
  {
    type: 'divider',
    title: '分割线',
    description: '区块分隔',
    defaultProps: { text: '' },
  },
];

export default function PageDesignCreatePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const editId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('editId');
  }, [location.search]);

  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!editId) return;
    const existing = loadPageDesigns().find((x) => x.id === editId);
    if (!existing) return;
    form.setFieldsValue({
      name: existing.name,
      description: existing.description,
      status: existing.status,
    });

    setBlocks(existing.schema?.blocks || []);
    setSelectedId(null);
  }, [editId, form]);

  useEffect(() => {
    if (!editId) return;
    const list = loadPageDesigns();
    const existing = list.find((x) => x.id === editId);
    if (!existing) return;

    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'pageDesigns') return;
      const next = loadPageDesigns();
      const latest = next.find((x) => x.id === editId);
      if (!latest) return;
      form.setFieldsValue({
        name: latest.name,
        description: latest.description,
        status: latest.status,
      });
      setBlocks(latest.schema?.blocks || []);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [editId, form]);

  const selected = useMemo(
    () => blocks.find((b) => b.id === selectedId) || null,
    [blocks, selectedId]
  );

  const addBlock = (type: BlockType) => {
    const item = PALETTE.find((p) => p.type === type);
    if (!item) return;

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    const next: PageBlock =
      type === 'text'
        ? { id, type, props: item.defaultProps as any }
        : type === 'button'
          ? { id, type, props: item.defaultProps as any }
          : { id, type, props: item.defaultProps as any };

    setBlocks((prev) => [...prev, next]);
    setSelectedId(id);
  };

  const onDropToCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/x-page-block-type') as BlockType;
    if (!type) return;
    addBlock(type);
  };

  const renderBlock = (b: PageBlock) => {
    const isSelected = b.id === selectedId;
    const wrapperStyle: React.CSSProperties = {
      padding: 12,
      borderRadius: 8,
      border: isSelected ? '1px solid #1677ff' : '1px solid #f0f0f0',
      background: isSelected ? '#e6f4ff' : '#fff',
      cursor: 'pointer',
    };

    return (
      <div key={b.id} style={wrapperStyle} onClick={() => setSelectedId(b.id)}>
        {b.type === 'text' && (
          <Typography.Paragraph style={{ margin: 0 }}>
            {(b.props as any).text}
          </Typography.Paragraph>
        )}
        {b.type === 'button' && (
          <Button type={(b.props as any).variant || 'primary'}>
            {(b.props as any).text}
          </Button>
        )}
        {b.type === 'divider' && (
          <Divider style={{ margin: 0 }}>
            {(b.props as any).text || ''}
          </Divider>
        )}
      </div>
    );
  };

  const onSave = async () => {
    const values = await form.validateFields();
    const now = Date.now();
    const list = loadPageDesigns();

    if (editId) {
      const next = list.map((x) =>
        x.id === editId
          ? {
              ...x,
              name: values.name,
              description: values.description,
              status: values.status,
              updatedAt: now,
              schema: { blocks },
            }
          : x
      );
      savePageDesigns(next);
      message.success('已更新');
      return;
    }

    const created: PageDesign = {
      id: crypto.randomUUID(),
      name: values.name,
      description: values.description,
      status: values.status,
      updatedAt: now,
      schema: { blocks },
    };
    savePageDesigns([created, ...list]);
    message.success('已创建');
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          {editId ? '装修编辑器' : '新建装修页（编辑器）'}
        </Typography.Title>
        <Space>
          <Button onClick={() => window.close()}>关闭窗口</Button>
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        </Space>
      </Space>

      <Row gutter={12}>
        <Col span={5}>
          <Card title="组件库" size="small">
            <List
              dataSource={PALETTE}
              renderItem={(item) => (
                <List.Item>
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'application/x-page-block-type',
                        item.type
                      );
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    style={{
                      width: '100%',
                      padding: 10,
                      border: '1px solid #f0f0f0',
                      borderRadius: 8,
                      cursor: 'grab',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>
                      {item.description}
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div style={{ color: '#999', fontSize: 12 }}>
              拖拽到中间预览区以添加组件
            </div>
          </Card>
        </Col>

        <Col span={14}>
          <Card
            title="预览区"
            size="small"
            bodyStyle={{ minHeight: 520 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropToCanvas}
          >
            {blocks.length === 0 ? (
              <Empty description="把左侧组件拖到这里" />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {blocks.map(renderBlock)}
              </Space>
            )}
          </Card>
        </Col>

        <Col span={5}>
          <Card title="配置面板" size="small">
            <Form form={form} layout="vertical" initialValues={{ status: 'draft' }}>
              <Form.Item
                name="name"
                label="页面名称"
                rules={[{ required: true, message: '请输入页面名称' }]}
              >
                <Input placeholder="例如：双11会场装修页" />
              </Form.Item>

              <Form.Item name="description" label="页面描述">
                <Input.TextArea rows={3} placeholder="简单描述一下页面用途" />
              </Form.Item>

              <Form.Item name="status" label="状态">
                <Radio.Group
                  options={[
                    { label: '草稿', value: 'draft' },
                    { label: '已发布', value: 'published' },
                  ]}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
            </Form>

            <Divider />

            {!selected ? (
              <Empty description="选择一个组件以配置" />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Typography.Text strong>已选中：{selected.type}</Typography.Text>

                {selected.type === 'text' && (
                  <Input.TextArea
                    rows={4}
                    value={(selected.props as any).text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBlocks((prev) =>
                        prev.map((b) =>
                          b.id === selected.id
                            ? ({ ...b, props: { ...(b.props as any), text: val } } as any)
                            : b
                        )
                      );
                    }}
                  />
                )}

                {selected.type === 'button' && (
                  <>
                    <Input
                      value={(selected.props as any).text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBlocks((prev) =>
                          prev.map((b) =>
                            b.id === selected.id
                              ? ({ ...b, props: { ...(b.props as any), text: val } } as any)
                              : b
                          )
                        );
                      }}
                      placeholder="按钮文案"
                    />
                    <Radio.Group
                      value={(selected.props as any).variant}
                      options={[
                        { label: '主按钮', value: 'primary' },
                        { label: '默认', value: 'default' },
                      ]}
                      optionType="button"
                      buttonStyle="solid"
                      onChange={(e) => {
                        const val = e.target.value;
                        setBlocks((prev) =>
                          prev.map((b) =>
                            b.id === selected.id
                              ? ({ ...b, props: { ...(b.props as any), variant: val } } as any)
                              : b
                          )
                        );
                      }}
                    />
                  </>
                )}

                {selected.type === 'divider' && (
                  <Input
                    value={(selected.props as any).text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBlocks((prev) =>
                        prev.map((b) =>
                          b.id === selected.id
                            ? ({ ...b, props: { ...(b.props as any), text: val } } as any)
                            : b
                        )
                      );
                    }}
                    placeholder="分割线文字（可选）"
                  />
                )}

                <Button
                  danger
                  onClick={() => {
                    setBlocks((prev) => prev.filter((b) => b.id !== selected.id));
                    setSelectedId(null);
                  }}
                >
                  删除该组件
                </Button>
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

