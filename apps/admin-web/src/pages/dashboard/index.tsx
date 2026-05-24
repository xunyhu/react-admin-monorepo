import { Col, Row } from 'antd';

import PageHeader from '@/components/PageHeader';

import CategoryPieChart from './components/CategoryPieChart';
import LowStockAlert from './components/LowStockAlert';
import OrderChart from './components/OrderChart';
import RealtimePanel from './components/RealtimePanel';
import SalesChart from './components/SalesChart';
import StatCard from './components/StatCard';
import TopProductTable from './components/TopProductTable';
import UserChart from './components/UserChart';
import { useDashboardCharts } from './hooks/useDashboardCharts';
import { useDashboardOverview } from './hooks/useDashboardOverview';
import { useSalesTrend } from './hooks/useSalesTrend';

export default function DashboardPage() {
  const { data: overview, loading: overviewLoading } = useDashboardOverview();
  const { data: salesTrend, loading: salesLoading } = useSalesTrend();
  const { data: chartsData, loading: chartsLoading } = useDashboardCharts();

  const loading = overviewLoading || salesLoading || chartsLoading;

  return (
    <div style={{ padding: 6 }}>
      <PageHeader title="数据看板" />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title="今日销售额"
            metric={overview?.todaySales ?? { value: 0, compare: { value: 0, direction: 'up', label: '较昨日' } }}
            prefix="¥"
            precision={2}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title="今日订单数"
            metric={overview?.todayOrders ?? { value: 0, compare: { value: 0, direction: 'up', label: '较昨日' } }}
            suffix="单"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title="今日新增用户"
            metric={overview?.todayNewUsers ?? { value: 0, compare: { value: 0, direction: 'up', label: '较昨日' } }}
            suffix="人"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title="本月销售额"
            metric={overview?.monthSales ?? { value: 0, compare: { value: 0, direction: 'up', label: '较上月' } }}
            prefix="¥"
            precision={2}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title="支付转化率"
            metric={overview?.payConversionRate ?? { value: 0, compare: { value: 0, direction: 'up', label: '较上周' } }}
            suffix="%"
            precision={1}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard
            title="退款率"
            metric={overview?.refundRate ?? { value: 0, compare: { value: 0, direction: 'down', label: '较上周' } }}
            suffix="%"
            precision={1}
            loading={loading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={12}>
          <SalesChart data={salesTrend} loading={salesLoading} />
        </Col>
        <Col xs={24} xl={12}>
          <OrderChart data={chartsData.orderTrend} loading={chartsLoading} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={12}>
          <UserChart data={chartsData.userTrend} loading={chartsLoading} />
        </Col>
        <Col xs={24} xl={12}>
          <CategoryPieChart data={chartsData.categoryStats} loading={chartsLoading} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={14}>
          <TopProductTable data={chartsData.topProducts} loading={chartsLoading} />
        </Col>
        <Col xs={24} xl={10}>
          <LowStockAlert data={chartsData.lowStock} loading={chartsLoading} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <RealtimePanel data={chartsData.realtime} loading={chartsLoading} />
        </Col>
      </Row>
    </div>
  );
}
