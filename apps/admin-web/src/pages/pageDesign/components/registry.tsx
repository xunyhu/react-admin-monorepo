import { Button, Divider, Input, Radio, Space, Typography } from 'antd';
import type { BlockDefinition } from './types';

export const BLOCK_REGISTRY = {
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
                  return { imageUrl: imageUrlRaw || '', linkUrl: linkUrlRaw || '' };
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
                onChange({ borderRadius: Number.isFinite(v) ? Math.max(0, v) : 12 });
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
    description: 'mock 数据，支持 1/2 列',
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
                <div style={{ fontWeight: 600, fontSize: 13, lineHeight: '18px' }}>
                  {p.name}
                </div>
                {props.showPrice !== false && (
                  <div style={{ marginTop: 6, color: '#ff4d4f', fontWeight: 600 }}>
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
    description: '文本 + 对齐',
    defaultProps: { text: '标题', align: 'left' as const, level: 5 as const },
    render: (props: { text: string; align: 'left' | 'center' | 'right'; level?: 4 | 5 }) => (
      <Typography.Title
        level={props.level ?? 5}
        style={{ margin: 0, textAlign: props.align || 'left' }}
      >
        {props.text}
      </Typography.Title>
    ),
    renderEditor: (
      props: { text: string; align: 'left' | 'center' | 'right'; level?: 4 | 5 },
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
              backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : undefined,
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
              onChange({ borderRadius: Number.isFinite(v) ? Math.max(0, v) : 12 });
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
      <Typography.Paragraph style={{ margin: 0 }}>{props.text}</Typography.Paragraph>
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
    render: (props: { text: string; variant: 'primary' | 'default' }) => (
      <Button type={props.variant || 'primary'} style={{ width: '100%' }}>
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
    description: 'padding / 背景色（不嵌套）',
    defaultProps: { padding: 12, backgroundColor: '#ffffff', borderRadius: 12 },
    render: (props: { padding?: number; backgroundColor?: string; borderRadius?: number }) => {
      const pad = Number.isFinite(props.padding) ? Math.max(0, Number(props.padding)) : 12;
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
      props: { padding?: number; backgroundColor?: string; borderRadius?: number },
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
            onChange({ borderRadius: Number.isFinite(v) ? Math.max(0, v) : 12 });
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
    render: (props: { columns?: 3 | 4; items: Array<{ title: string; linkUrl?: string }> }) => {
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
              <div style={{ fontSize: 12, lineHeight: '16px', textAlign: 'center' }}>
                {it.title}
              </div>
            </div>
          ))}
        </div>
      );
    },
    renderEditor: (
      props: { columns?: 3 | 4; items: Array<{ title: string; linkUrl?: string }> },
      onChange: (patch: Partial<any>) => void
    ) => {
      const items = Array.isArray(props.items) ? props.items : [];
      const lines = items
        .map((it) => `${(it.title || '').trim()} | ${(it.linkUrl || '').trim()}`)
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
                  const [titleRaw, linkUrlRaw] = line.split('|').map((s) => s.trim());
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

export type BlockType = keyof typeof BLOCK_REGISTRY;

