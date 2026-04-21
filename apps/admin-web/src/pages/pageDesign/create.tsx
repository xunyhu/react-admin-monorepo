import {
  Button,
  Card,
  Divider,
  Empty,
  Form,
  Input,
  Radio,
  Space,
  Typography,
  message,
} from 'antd';
import type { DragEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createDesignPage, getDesignPageDetail, updateDesignPage } from '@/api/design';

type PageDesign = {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published';
  updatedAt: number;
  schema?: PageSchema;
};

type BlockDefinition<P extends Record<string, any>> = {
  title: string;
  description: string;
  defaultProps: P;
  render: (props: P) => ReactNode;
  renderEditor: (props: P, onChange: (patch: Partial<P>) => void) => ReactNode;
};

const BLOCK_REGISTRY = {
  banner: {
    title: '轮播图',
    description: '图片 + 跳转链接',
    defaultProps: {
      items: [
        {
          imageUrl: 'https://picsum.photos/800/400?random=11',
          linkUrl: 'https://example.com',
        },
        {
          imageUrl: 'https://picsum.photos/800/400?random=12',
          linkUrl: 'https://example.com',
        },
      ],
      aspectRatio: 2,
      borderRadius: 12,
    },
    render: (props: {
      items: Array<{ imageUrl: string; linkUrl?: string }>;
      aspectRatio?: number;
      borderRadius?: number;
    }) => {
      const first = props.items?.[0];
      const ratio =
        props.aspectRatio && props.aspectRatio > 0 ? props.aspectRatio : 2;
      const radius = Math.max(0, props.borderRadius ?? 12);
      return (
        <div
          style={{
            width: '100%',
            borderRadius: radius,
            overflow: 'hidden',
            background: '#f3f3f3',
            position: 'relative',
          }}
        >
          <div style={{ width: '100%', paddingTop: `${100 / ratio}%` }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: first?.imageUrl
                ? `url(${first.imageUrl})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            title={first?.linkUrl || ''}
          />
          <div
            style={{
              position: 'absolute',
              left: 12,
              bottom: 10,
              padding: '2px 8px',
              fontSize: 12,
              color: '#fff',
              background: 'rgba(0,0,0,0.35)',
              borderRadius: 999,
            }}
          >
            轮播图（{props.items?.length || 0}）
          </div>
          {Array.isArray(props.items) && props.items.length > 1 && (
            <div
              style={{
                position: 'absolute',
                right: 12,
                bottom: 12,
                display: 'flex',
                gap: 6,
              }}
            >
              {props.items.slice(0, 6).map((_, idx) => (
                <span
                  key={idx}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background:
                      idx === 0
                        ? 'rgba(255,255,255,0.95)'
                        : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
    },
    renderEditor: (
      props: {
        items: Array<{ imageUrl: string; linkUrl?: string }>;
        aspectRatio?: number;
        borderRadius?: number;
      },
      onChange: (patch: Partial<any>) => void
    ) => {
      const items = Array.isArray(props.items) ? props.items : [];
      const lines = items
        .map(
          (it) => `${(it.imageUrl || '').trim()} | ${(it.linkUrl || '').trim()}`
        )
        .join('\n');
      return (
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            每行一项：imageUrl | linkUrl（linkUrl 可空）
          </Typography.Text>
          <Input.TextArea
            rows={6}
            value={lines}
            onChange={(e) => {
              const next = e.target.value
                .split('\n')
                .map((x) => x.trim())
                .filter(Boolean)
                .map((line) => {
                  const [imageUrlRaw, linkUrlRaw] = line
                    .split('|')
                    .map((s) => s.trim());
                  return {
                    imageUrl: imageUrlRaw || '',
                    linkUrl: linkUrlRaw || '',
                  };
                })
                .filter((x) => x.imageUrl);
              onChange({ items: next });
            }}
            placeholder="https://...jpg | https://...\nhttps://...jpg |"
          />
          <Space style={{ width: '100%' }} size={12}>
            <Input
              value={String(props.aspectRatio ?? 2)}
              onChange={(e) => {
                const v = Number(e.target.value);
                onChange({ aspectRatio: Number.isFinite(v) && v > 0 ? v : 2 });
              }}
              addonBefore="宽高比"
              placeholder="2"
            />
            <Input
              value={String(props.borderRadius ?? 12)}
              onChange={(e) => {
                const v = Number(e.target.value);
                onChange({
                  borderRadius: Number.isFinite(v) ? Math.max(0, v) : 12,
                });
              }}
              addonBefore="圆角"
              placeholder="12"
            />
          </Space>
        </Space>
      );
    },
  },
  productList: {
    title: '商品列表',
    description: 'mock 数据即可，支持 1 列 / 2 列',
    defaultProps: { columns: 2 as const, showPrice: true },
    render: (props: { columns: 1 | 2; showPrice?: boolean }) => {
      const columns = props.columns === 1 ? 1 : 2;
      const products = [
        {
          id: 'p1',
          name: '示例商品 A',
          price: 99,
          imageUrl: 'https://picsum.photos/300/300?random=21',
        },
        {
          id: 'p2',
          name: '示例商品 B',
          price: 199,
          imageUrl: 'https://picsum.photos/300/300?random=22',
        },
        {
          id: 'p3',
          name: '示例商品 C',
          price: 59,
          imageUrl: 'https://picsum.photos/300/300?random=23',
        },
        {
          id: 'p4',
          name: '示例商品 D',
          price: 29,
          imageUrl: 'https://picsum.photos/300/300?random=24',
        },
      ];
      return (
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: columns === 1 ? '1fr' : '1fr 1fr',
            gap: 12,
          }}
        >
          {products.slice(0, columns === 1 ? 3 : 4).map((p) => (
            <div
              key={p.id}
              style={{
                border: '1px solid #f0f0f0',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div style={{ width: '100%', background: '#f5f5f5' }}>
                <div style={{ width: '100%', paddingTop: '100%' }} />
                <div
                  style={{
                    position: 'relative',
                    marginTop: '-100%',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${p.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
              <div style={{ padding: 10 }}>
                <div
                  style={{ fontWeight: 600, fontSize: 13, lineHeight: '18px' }}
                >
                  {p.name}
                </div>
                {props.showPrice !== false && (
                  <div
                    style={{ marginTop: 6, color: '#ff4d4f', fontWeight: 600 }}
                  >
                    ¥{p.price}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    },
    renderEditor: (
      props: { columns: 1 | 2; showPrice?: boolean },
      onChange: (patch: Partial<any>) => void
    ) => (
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Radio.Group
          value={props.columns}
          options={[
            { label: '1 列', value: 1 },
            { label: '2 列', value: 2 },
          ]}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => onChange({ columns: e.target.value })}
        />
        <Radio.Group
          value={props.showPrice === false ? 'hide' : 'show'}
          options={[
            { label: '显示价格', value: 'show' },
            { label: '隐藏价格', value: 'hide' },
          ]}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => onChange({ showPrice: e.target.value === 'show' })}
        />
      </Space>
    ),
  },
  title: {
    title: '标题',
    description: '文本 + 样式（居中 / 左右）',
    defaultProps: { text: '标题', align: 'left' as const, level: 5 as const },
    render: (props: {
      text: string;
      align: 'left' | 'center' | 'right';
      level?: 4 | 5;
    }) => (
      <Typography.Title
        level={props.level ?? 5}
        style={{ margin: 0, textAlign: props.align || 'left' }}
      >
        {props.text}
      </Typography.Title>
    ),
    renderEditor: (
      props: {
        text: string;
        align: 'left' | 'center' | 'right';
        level?: 4 | 5;
      },
      onChange: (patch: Partial<any>) => void
    ) => (
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Input
          value={props.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="标题文本"
        />
        <Radio.Group
          value={props.align}
          options={[
            { label: '左', value: 'left' },
            { label: '中', value: 'center' },
            { label: '右', value: 'right' },
          ]}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => onChange({ align: e.target.value })}
        />
        <Radio.Group
          value={props.level ?? 5}
          options={[
            { label: '大', value: 4 },
            { label: '中', value: 5 },
          ]}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => onChange({ level: e.target.value })}
        />
      </Space>
    ),
  },
  image: {
    title: '图片',
    description: '单图组件',
    defaultProps: {
      imageUrl: 'https://picsum.photos/800/600?random=31',
      linkUrl: '',
      aspectRatio: 1.6,
      borderRadius: 12,
    },
    render: (props: {
      imageUrl: string;
      linkUrl?: string;
      aspectRatio?: number;
      borderRadius?: number;
    }) => {
      const ratio =
        props.aspectRatio && props.aspectRatio > 0 ? props.aspectRatio : 1.6;
      const radius = Math.max(0, props.borderRadius ?? 12);
      return (
        <div
          style={{
            width: '100%',
            borderRadius: radius,
            overflow: 'hidden',
            background: '#f3f3f3',
            position: 'relative',
          }}
          title={props.linkUrl || ''}
        >
          <div style={{ width: '100%', paddingTop: `${100 / ratio}%` }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: props.imageUrl
                ? `url(${props.imageUrl})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      );
    },
    renderEditor: (
      props: {
        imageUrl: string;
        linkUrl?: string;
        aspectRatio?: number;
        borderRadius?: number;
      },
      onChange: (patch: Partial<any>) => void
    ) => (
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Input
          value={props.imageUrl}
          onChange={(e) => onChange({ imageUrl: e.target.value })}
          placeholder="图片 URL"
        />
        <Input
          value={props.linkUrl}
          onChange={(e) => onChange({ linkUrl: e.target.value })}
          placeholder="跳转链接（可选）"
        />
        <Space style={{ width: '100%' }} size={12}>
          <Input
            value={String(props.aspectRatio ?? 1.6)}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange({ aspectRatio: Number.isFinite(v) && v > 0 ? v : 1.6 });
            }}
            addonBefore="宽高比"
          />
          <Input
            value={String(props.borderRadius ?? 12)}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange({
                borderRadius: Number.isFinite(v) ? Math.max(0, v) : 12,
              });
            }}
            addonBefore="圆角"
          />
        </Space>
      </Space>
    ),
  },
  text: {
    title: '文本',
    description: '展示一段文字',
    defaultProps: { text: '这里是一段文字' },
    render: (props: { text: string }) => (
      <Typography.Paragraph style={{ margin: 0 }}>
        {props.text}
      </Typography.Paragraph>
    ),
    renderEditor: (
      props: { text: string },
      onChange: (patch: Partial<{ text: string }>) => void
    ) => (
      <Input.TextArea
        rows={4}
        value={props.text}
        onChange={(e) => onChange({ text: e.target.value })}
      />
    ),
  },
  button: {
    title: '按钮',
    description: '跳转链接',
    defaultProps: { text: '按钮', variant: 'primary' as const, linkUrl: '' },
    render: (props: {
      text: string;
      variant: 'primary' | 'default';
      linkUrl?: string;
    }) => (
      <Button
        type={props.variant || 'primary'}
        style={{ width: '100%' }}
      >
        {props.text}
      </Button>
    ),
    renderEditor: (
      props: { text: string; variant: 'primary' | 'default'; linkUrl?: string },
      onChange: (
        patch: Partial<{
          text: string;
          variant: 'primary' | 'default';
          linkUrl?: string;
        }>
      ) => void
    ) => (
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Input
          value={props.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="按钮文案"
        />
        <Input
          value={props.linkUrl}
          onChange={(e) => onChange({ linkUrl: e.target.value })}
          placeholder="跳转链接（可选）"
        />
        <Radio.Group
          value={props.variant}
          options={[
            { label: '主按钮', value: 'primary' },
            { label: '默认', value: 'default' },
          ]}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => onChange({ variant: e.target.value })}
        />
      </Space>
    ),
  },
  container: {
    title: '容器',
    description: 'padding / 背景色（简化版：不支持嵌套子组件）',
    defaultProps: { padding: 12, backgroundColor: '#ffffff', borderRadius: 12 },
    render: (props: {
      padding?: number;
      backgroundColor?: string;
      borderRadius?: number;
    }) => {
      const pad = Number.isFinite(props.padding)
        ? Math.max(0, Number(props.padding))
        : 12;
      const radius = Math.max(0, props.borderRadius ?? 12);
      return (
        <div
          style={{
            width: '100%',
            padding: pad,
            background: props.backgroundColor || '#fff',
            borderRadius: radius,
            border: '1px dashed #e5e5e5',
            color: '#999',
            fontSize: 12,
            lineHeight: '18px',
          }}
        >
          容器（当前版本不支持嵌套子组件）
        </div>
      );
    },
    renderEditor: (
      props: {
        padding?: number;
        backgroundColor?: string;
        borderRadius?: number;
      },
      onChange: (patch: Partial<any>) => void
    ) => (
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <Input
          value={String(props.padding ?? 12)}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange({ padding: Number.isFinite(v) ? Math.max(0, v) : 12 });
          }}
          addonBefore="padding"
        />
        <Input
          value={props.backgroundColor}
          onChange={(e) => onChange({ backgroundColor: e.target.value })}
          addonBefore="背景色"
          placeholder="#ffffff"
        />
        <Input
          value={String(props.borderRadius ?? 12)}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange({
              borderRadius: Number.isFinite(v) ? Math.max(0, v) : 12,
            });
          }}
          addonBefore="圆角"
        />
      </Space>
    ),
  },
  divider: {
    title: '分割线',
    description: '区块分隔',
    defaultProps: { text: '' },
    render: (props: { text?: string }) => (
      <Divider style={{ margin: 0 }}>{props.text || ''}</Divider>
    ),
    renderEditor: (
      props: { text?: string },
      onChange: (patch: Partial<{ text?: string }>) => void
    ) => (
      <Input
        value={props.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="分割线文字（可选）"
      />
    ),
  },
  richText: {
    title: '富文本',
    description: '简化版（textarea）',
    defaultProps: { content: '这里是一段富文本（简化版）\n支持换行。' },
    render: (props: { content: string }) => (
      <div
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 12,
          background: '#fff',
          border: '1px solid #f0f0f0',
          whiteSpace: 'pre-wrap',
          lineHeight: '20px',
        }}
      >
        {props.content}
      </div>
    ),
    renderEditor: (
      props: { content: string },
      onChange: (patch: Partial<{ content: string }>) => void
    ) => (
      <Input.TextArea
        rows={6}
        value={props.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="输入内容（简化版，不做 HTML 解析）"
      />
    ),
  },
  grid: {
    title: '宫格',
    description: '类似 4 宫格入口',
    defaultProps: {
      columns: 4 as const,
      items: [
        { title: '入口 1', linkUrl: 'https://example.com' },
        { title: '入口 2', linkUrl: 'https://example.com' },
        { title: '入口 3', linkUrl: 'https://example.com' },
        { title: '入口 4', linkUrl: 'https://example.com' },
      ],
    },
    render: (props: {
      columns?: 3 | 4;
      items: Array<{ title: string; linkUrl?: string }>;
    }) => {
      const cols = props.columns === 3 ? 3 : 4;
      const items = Array.isArray(props.items) ? props.items : [];
      return (
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: 10,
          }}
        >
          {items.slice(0, cols === 4 ? 8 : 9).map((it, idx) => (
            <div
              key={`${idx}-${it.title}`}
              style={{
                borderRadius: 12,
                background: '#fff',
                border: '1px solid #f0f0f0',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: it.linkUrl ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (!it.linkUrl) return;
                window.open(it.linkUrl, '_blank', 'noopener,noreferrer');
              }}
              title={it.linkUrl || ''}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: `hsl(${(idx * 45) % 360} 70% 90%)`,
                  border: `1px solid hsl(${(idx * 45) % 360} 60% 80%)`,
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  lineHeight: '16px',
                  textAlign: 'center',
                }}
              >
                {it.title}
              </div>
            </div>
          ))}
        </div>
      );
    },
    renderEditor: (
      props: {
        columns?: 3 | 4;
        items: Array<{ title: string; linkUrl?: string }>;
      },
      onChange: (patch: Partial<any>) => void
    ) => {
      const items = Array.isArray(props.items) ? props.items : [];
      const lines = items
        .map(
          (it) => `${(it.title || '').trim()} | ${(it.linkUrl || '').trim()}`
        )
        .join('\n');
      return (
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Radio.Group
            value={props.columns ?? 4}
            options={[
              { label: '3 列', value: 3 },
              { label: '4 列', value: 4 },
            ]}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => onChange({ columns: e.target.value })}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            每行一项：title | linkUrl（linkUrl 可空）
          </Typography.Text>
          <Input.TextArea
            rows={6}
            value={lines}
            onChange={(e) => {
              const next = e.target.value
                .split('\n')
                .map((x) => x.trim())
                .filter(Boolean)
                .map((line) => {
                  const [titleRaw, linkUrlRaw] = line
                    .split('|')
                    .map((s) => s.trim());
                  return { title: titleRaw || '', linkUrl: linkUrlRaw || '' };
                })
                .filter((x) => x.title);
              onChange({ items: next });
            }}
            placeholder="入口 1 | https://...\n入口 2 |"
          />
        </Space>
      );
    },
  },
} satisfies Record<string, BlockDefinition<any>>;

type BlockType = keyof typeof BLOCK_REGISTRY;

type PageBlock = {
  id: string;
  type: BlockType;
  props: Record<string, any>;
};

type PageSchema = {
  blocks: PageBlock[];
};

function cloneProps<T>(obj: T): T {
  if (typeof structuredClone !== 'undefined') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj)) as T;
}

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

  const previewWrapRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [timeText, setTimeText] = useState(() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  });
  const [batteryPercent, setBatteryPercent] = useState<number | null>(null);

  useEffect(() => {
    if (!editId) return;
    getDesignPageDetail(editId)
      .then((res: any) => {
        const data = res?.data;
        if (!data) return;
        form.setFieldsValue({
          name: data.name,
          description: data.description,
          status: data.status,
        });
        setBlocks(data.schema?.blocks || []);
        setSelectedId(null);
      })
      .catch(() => {
        // 已由 request 层提示错误
      });
  }, [editId, form]);

  useEffect(() => {
    // 原本 localStorage 的多窗口同步逻辑已移除（改为服务端保存）
    return;
  }, [editId, form]);

  const selected = useMemo(
    () => blocks.find((b) => b.id === selectedId) || null,
    [blocks, selectedId]
  );

  const palette = useMemo(() => {
    const order: BlockType[] = [
      'banner',
      'productList',
      'title',
      'image',
      'button',
      'container',
      'divider',
      'richText',
      'grid',
      'text',
    ].filter((t) => t in BLOCK_REGISTRY) as BlockType[];

    const rest = (Object.keys(BLOCK_REGISTRY) as BlockType[]).filter(
      (t) => !order.includes(t)
    );

    return [...order, ...rest].map((type) => {
      const def = BLOCK_REGISTRY[type];
      return { type, title: def.title, description: def.description };
    });
  }, []);

  const updateBlockProps = (id: string, patch: Record<string, any>) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, props: { ...b.props, ...patch } } : b
      )
    );
  };

  const createBlock = (type: BlockType): PageBlock | null => {
    const def = BLOCK_REGISTRY[type];
    if (!def) return;

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    return {
      id,
      type,
      props: cloneProps(def.defaultProps),
    };
  };

  const insertBlockAt = (type: BlockType, index: number) => {
    const next = createBlock(type);
    if (!next) return;
    setBlocks((prev) => {
      const safeIndex = Math.max(0, Math.min(index, prev.length));
      const copy = prev.slice();
      copy.splice(safeIndex, 0, next);
      return copy;
    });
    setSelectedId(next.id);
  };

  const addBlock = (type: BlockType) => insertBlockAt(type, blocks.length);

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setBlocks((prev) => {
      if (fromIndex < 0 || fromIndex >= prev.length) return prev;
      const safeTo = Math.max(0, Math.min(toIndex, prev.length - 1));
      const copy = prev.slice();
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(safeTo, 0, item);
      return copy;
    });
  };

  const onDropToCanvas = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('application/x-page-block-id');
    const type = e.dataTransfer.getData(
      'application/x-page-block-type'
    ) as BlockType;
    // 从预览区拖到空白处：移动到末尾
    if (draggedId) {
      const fromIndex = blocks.findIndex((b) => b.id === draggedId);
      if (fromIndex >= 0) moveBlock(fromIndex, blocks.length - 1);
      return;
    }
    if (!type) return;
    insertBlockAt(type, blocks.length);
  };

  const renderBlock = (b: PageBlock, index: number) => {
    const isSelected = b.id === selectedId;
    const wrapperStyle: React.CSSProperties = {
      borderRadius: 0,
      outline: isSelected ? '2px solid #1677ff' : 'none',
      outlineOffset: -2,
      background: 'transparent',
      cursor: 'pointer',
      width: '100%',
    };

    const def = BLOCK_REGISTRY[b.type];
    return (
      <div
        key={b.id}
        style={wrapperStyle}
        onClick={() => setSelectedId(b.id)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/x-page-block-id', b.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const draggedId = e.dataTransfer.getData('application/x-page-block-id');
          const type = e.dataTransfer.getData(
            'application/x-page-block-type'
          ) as BlockType;

          // 预览区内排序：把拖拽的 block 放到当前 block 前面
          if (draggedId) {
            const fromIndex = blocks.findIndex((x) => x.id === draggedId);
            if (fromIndex < 0) return;
            let toIndex = index;
            if (fromIndex < toIndex) toIndex -= 1; // 移除后索引前移
            moveBlock(fromIndex, toIndex);
            return;
          }

          // 从组件库拖入：插入到当前 block 前面
          if (!type) return;
          insertBlockAt(type, index);
        }}
      >
        {def ? (
          def.render(b.props as any)
        ) : (
          <Typography.Text type="secondary">未知组件：{b.type}</Typography.Text>
        )}
      </div>
    );
  };

  const onSave = async () => {
    const values = await form.validateFields();
    const payload = {
      name: values.name,
      description: values.description,
      status: values.status,
      schemaVersion: 1,
      schema: { blocks },
    };

    if (editId) {
      await updateDesignPage(editId, payload as any);
      message.success('已更新');
      return;
    }

    await createDesignPage(payload as any);
    message.success('已创建');
  };

  const onClose = () => {
    // 如果是 window.open 打开的，优先尝试关闭；否则/关闭失败则回到列表页
    try {
      window.close();
    } catch {
      // ignore
    }
    window.setTimeout(() => {
      navigate('/pageDesign', { replace: true });
    }, 0);
  };

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;

    const phoneW = 390;
    const phoneH = 844;
    const phoneOuterPadding = 10;
    const frameW = phoneW + phoneOuterPadding * 2;
    const frameH = phoneH + phoneOuterPadding * 2;

    const recompute = () => {
      const { width, height } = el.getBoundingClientRect();
      // 预留一点呼吸空间，避免贴边或出现滚动条
      const safeW = Math.max(0, width - 24);
      const safeH = Math.max(0, height - 24);
      const next = Math.min(1, safeW / frameW, safeH / frameH);
      setPreviewScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    recompute();
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => recompute())
        : null;
    ro?.observe(el);
    window.addEventListener('resize', recompute);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      setTimeText(`${hh}:${mm}`);
    };

    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const navAny = navigator as any;
    if (!navAny?.getBattery) return;

    let battery: any = null;
    const sync = () => {
      if (cancelled || !battery) return;
      const level = typeof battery.level === 'number' ? battery.level : null;
      if (typeof level !== 'number' || !Number.isFinite(level)) {
        setBatteryPercent(null);
        return;
      }
      setBatteryPercent(Math.round(level * 100));
    };

    navAny
      .getBattery()
      .then((b: any) => {
        if (cancelled) return;
        battery = b;
        sync();
        battery.addEventListener?.('levelchange', sync);
        battery.addEventListener?.('chargingchange', sync);
      })
      .catch(() => {
        setBatteryPercent(null);
      });

    return () => {
      cancelled = true;
      battery?.removeEventListener?.('levelchange', sync);
      battery?.removeEventListener?.('chargingchange', sync);
    };
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          height: 44,
          flex: '0 0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Typography.Text strong style={{ fontSize: 14 }}>
          {editId ? '装修编辑器' : '新建装修页（编辑器）'}
        </Typography.Text>
        <Space>
          <Button size="small" onClick={onClose}>
            关闭窗口
          </Button>
          <Button size="small" type="primary" onClick={onSave}>
            保存
          </Button>
        </Space>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          gap: 12,
          padding: 8,
          paddingTop: 8,
        }}
      >
        <div
          style={{ width: 300, minWidth: 300, minHeight: 0, display: 'flex' }}
        >
          <Card
            title="组件库"
            size="small"
            style={{ width: '100%', height: '100%' }}
            bodyStyle={{ height: 'calc(100% - 46px)', overflow: 'auto' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 8,
              }}
            >
              {palette.map((item) => (
                <div
                  key={String(item.type)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'application/x-page-block-type',
                      item.type
                    );
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  style={{
                    padding: 8,
                    border: '1px solid #f0f0f0',
                    borderRadius: 10,
                    cursor: 'grab',
                    userSelect: 'none',
                    background: '#fff',
                  }}
                  title={item.title}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      lineHeight: '16px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ color: '#999', fontSize: 12 }}>
              拖拽到中间预览区以添加组件
            </div>
          </Card>
        </div>

        <div style={{ flex: 1, minWidth: 560, minHeight: 0, display: 'flex' }}>
          <Card
            title="C 端页面预览"
            size="small"
            style={{ width: '100%', height: '100%' }}
            bodyStyle={{
              height: 'calc(100% - 46px)',
              overflow: 'hidden',
              background: '#f5f5f5',
            }}
          >
            <div
              ref={previewWrapRef}
              style={{
                height: '100%',
                padding: 12,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 390,
                  height: 844,
                  background: '#0b0b0b',
                  borderRadius: 56,
                  padding: 10,
                  boxShadow:
                    '0 24px 80px rgba(0,0,0,0.22), 0 10px 30px rgba(0,0,0,0.18)',
                  position: 'relative',
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#fff',
                    borderRadius: 46,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* iPhone 状态栏（简化） */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 54,
                      padding: '10px 14px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      zIndex: 3,
                      pointerEvents: 'none',
                      color: '#111',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 0.2,
                    }}
                  >
                    <div style={{ width: 64, paddingTop: 4 }}>{timeText}</div>
                    {/* 灵动岛 */}
                    <div
                      style={{
                        width: 156,
                        height: 34,
                        background: '#0b0b0b',
                        borderRadius: 18,
                        opacity: 0.95,
                      }}
                    />
                    <div
                      style={{
                        width: 64,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 6,
                        alignItems: 'center',
                        color: '#111',
                        height: 34,
                        transform: 'translateY(-1px)',
                      }}
                    >
                      {/* Wi‑Fi（简化） */}
                      <span
                        style={{
                          position: 'relative',
                          width: 18,
                          height: 12,
                          display: 'inline-block',
                          transform: 'translateY(-1px)',
                        }}
                        aria-hidden
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: 2,
                            width: 18,
                            height: 18,
                            border: '1.6px solid transparent',
                            borderTopColor: '#111',
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: 5,
                            width: 12,
                            height: 12,
                            border: '1.6px solid transparent',
                            borderTopColor: '#111',
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: 0,
                            width: 3.2,
                            height: 3.2,
                            background: '#111',
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        />
                      </span>
                      {typeof batteryPercent === 'number' ? (
                        <span style={{ fontSize: 11, lineHeight: '12px' }}>
                          {batteryPercent}%
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      paddingTop: 54,
                      paddingBottom: 0,
                      background: '#f2f2f7',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        overflow: 'auto',
                        padding: 0,
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onDropToCanvas}
                    >
                      {blocks.length === 0 ? (
                        <div
                          style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Empty description="把左侧组件拖到这里" />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            background: '#fff',
                            border: '1px solid #e5e5e5',
                          }}
                        >
                          <div style={{ padding: '0 16px' }}>
                            {blocks.map((b, idx) => renderBlock(b, idx))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div
          style={{ width: 360, minWidth: 360, minHeight: 0, display: 'flex' }}
        >
          <Card
            title="配置项"
            size="small"
            style={{ width: '100%', height: '100%' }}
            bodyStyle={{ height: 'calc(100% - 46px)', overflow: 'auto' }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{ status: 'draft' }}
            >
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
                <Typography.Text strong>
                  已选中：
                  {BLOCK_REGISTRY[selected.type]?.title
                    ? ` ${BLOCK_REGISTRY[selected.type].title}`
                    : ` ${selected.type}`}
                </Typography.Text>

                {BLOCK_REGISTRY[selected.type]?.renderEditor ? (
                  BLOCK_REGISTRY[selected.type].renderEditor(
                    selected.props as any,
                    (patch) => updateBlockProps(selected.id, patch as any)
                  )
                ) : (
                  <Empty description="该组件暂无可配置项" />
                )}

                <Button
                  danger
                  onClick={() => {
                    setBlocks((prev) =>
                      prev.filter((b) => b.id !== selected.id)
                    );
                    setSelectedId(null);
                  }}
                >
                  删除该组件
                </Button>
              </Space>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
