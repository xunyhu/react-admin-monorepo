import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import type { OrderTrendItem } from '../types';

interface OrderChartProps {
  data: OrderTrendItem[];
  loading?: boolean;
}

export default function OrderChart({ data, loading }: OrderChartProps) {
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          return `${item.name}<br/>订单数：${item.value} 单`;
        },
      },
      grid: { left: 48, right: 24, top: 40, bottom: 32 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((item) => item.date),
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '订单数',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.count),
          lineStyle: { width: 3, color: '#52c41a' },
          itemStyle: { color: '#52c41a' },
        },
      ],
    }),
    [data]
  );

  return (
    <Card title="订单趋势（近7天）" loading={loading}>
      <ReactECharts option={option} style={{ height: 320 }} />
    </Card>
  );
}
