import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import type { SalesTrendItem } from '../types';

interface SalesChartProps {
  data: SalesTrendItem[];
  loading?: boolean;
}

export default function SalesChart({ data, loading }: SalesChartProps) {
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          return `${item.name}<br/>销售额：¥${item.value.toLocaleString()}`;
        },
      },
      grid: { left: 48, right: 24, top: 40, bottom: 32 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((item) => item.date),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `${(value / 10000).toFixed(0)}万`,
        },
      },
      series: [
        {
          name: '销售额',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.amount),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(22, 119, 255, 0.35)' },
                { offset: 1, color: 'rgba(22, 119, 255, 0.02)' },
              ],
            },
          },
          lineStyle: { width: 3, color: '#1677ff' },
          itemStyle: { color: '#1677ff' },
        },
      ],
    }),
    [data]
  );

  return (
    <Card title="销售趋势（近7天）" loading={loading}>
      <ReactECharts option={option} style={{ height: 320 }} />
    </Card>
  );
}
