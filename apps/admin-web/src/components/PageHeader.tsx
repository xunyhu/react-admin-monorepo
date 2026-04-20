import { Space, Typography } from 'antd';
import type { ReactNode } from 'react';

export default function PageHeader(props: {
  title: ReactNode;
  extra?: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Space
      style={{
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 16,
        ...(props.style || {}),
      }}
    >
      <Typography.Title level={3} style={{ margin: 0 }}>
        {props.title || ''}
      </Typography.Title>
      {props.extra ? <Space>{props.extra}</Space> : null}
    </Space>
  );
}
