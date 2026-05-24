import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import type { UserTrendItem } from '../types';

interface UserChartProps {
  data: UserTrendItem[];
  loading?: boolean;
}

export default function UserChart({ data, loading }: UserChartProps) {
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          return `${item.name}<br/>新增用户：${item.value} 人`;
        },
      },
      grid: { left: 48, right: 24, top: 40, bottom: 32 },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.date),
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '新增用户',
          type: 'bar',
          barWidth: '45%',
          data: data.map((item) => item.count),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#722ed1' },
                { offset: 1, color: '#b37feb' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }),
    [data]
  );

  return (
    <Card title="用户增长（近7天）" loading={loading}>
      <ReactECharts option={option} style={{ height: 320 }} />
    </Card>
  );
}
