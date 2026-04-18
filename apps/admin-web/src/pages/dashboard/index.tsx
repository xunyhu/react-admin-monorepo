import { Card, Col, Row, Typography, Progress } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

const { Title } = Typography;

export default function Dashboard() {
  const lineOption = useMemo(() => {
    return {
      title: { text: '访问趋势' },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: { type: 'value' },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'line',
          smooth: true,
        },
      ],
    };
  }, []);

  const pieOption = useMemo(() => {
    return {
      title: { text: '技术栈占比', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: [
            { value: 40, name: 'React' },
            { value: 25, name: 'TypeScript' },
            { value: 20, name: 'Node.js' },
            { value: 15, name: 'Other' },
          ],
        },
      ],
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>🚀 技术 Dashboard</Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <ReactECharts option={lineOption} />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <ReactECharts option={pieOption} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }} title="技术能力评估">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            React
            <Progress percent={90} />
          </Col>

          <Col span={12}>
            TypeScript
            <Progress percent={85} />
          </Col>

          <Col span={12}>
            Monorepo
            <Progress percent={80} />
          </Col>

          <Col span={12}>
            Node.js
            <Progress percent={75} />
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 24 }} title="项目架构说明">
        <p>✔ React + TypeScript 构建前端系统</p>
        <p>✔ Monorepo 管理多模块结构</p>
        <p>✔ Axios 封装统一请求层</p>
        <p>✔ JWT 登录 + 权限控制体系</p>
        <p>✔ ECharts 数据可视化展示</p>
      </Card>
    </div>
  );
}
