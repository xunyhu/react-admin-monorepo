import { Timeline } from 'antd';

import type { OrderLog } from '../types';

interface OrderTimelineProps {
  logs: OrderLog[];
}

const LOG_COLOR: Record<OrderLog['type'], string> = {
  created: 'gray',
  paid: 'green',
  shipped: 'blue',
  received: 'green',
};

export default function OrderTimeline({ logs }: OrderTimelineProps) {
  return (
    <Timeline
      items={logs.map((log) => ({
        color: LOG_COLOR[log.type],
        children: (
          <div>
            <div>{log.content}</div>
            <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
              {log.time}
            </div>
          </div>
        ),
      }))}
    />
  );
}
