import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

import type { StatMetric } from '../types';

interface StatCardProps {
  title: string;
  metric: StatMetric;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  loading?: boolean;
}

export default function StatCard({
  title,
  metric,
  prefix,
  suffix,
  precision,
  loading,
}: StatCardProps) {
  const isUp = metric.compare.direction === 'up';
  const trendColor = isUp ? '#3f8600' : '#cf1322';
  const trendSymbol = isUp ? '↑' : '↓';

  return (
    <Card loading={loading} size="small" styles={{ body: { padding: '20px 24px' } }}>
      <Statistic
        title={title}
        value={metric.value}
        precision={precision}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ fontSize: 28, fontWeight: 600 }}
      />
      <div style={{ marginTop: 8, fontSize: 13, color: trendColor }}>
        <span style={{ marginRight: 4 }}>{trendSymbol}</span>
        {metric.compare.value}%
        <span style={{ color: '#8c8c8c', marginLeft: 8 }}>{metric.compare.label}</span>
      </div>
    </Card>
  );
}
