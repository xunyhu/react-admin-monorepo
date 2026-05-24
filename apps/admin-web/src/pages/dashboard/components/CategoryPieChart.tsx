import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

import type { CategoryStatItem } from '../types';

interface CategoryPieChartProps {
  data: CategoryStatItem[];
  loading?: boolean;
}

export default function CategoryPieChart({ data, loading }: CategoryPieChartProps) {
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}% ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 16,
        top: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['42%', '68%'],
          center: ['38%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false },
          data: data.map((item) => ({
            name: item.name,
            value: item.value,
          })),
        },
      ],
    }),
    [data]
  );

  return (
    <Card title="热门分类占比" loading={loading}>
      <ReactECharts option={option} style={{ height: 320 }} />
    </Card>
  );
}
