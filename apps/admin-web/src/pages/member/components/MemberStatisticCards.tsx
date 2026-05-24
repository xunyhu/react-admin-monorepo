import { Card, Col, Row, Statistic } from 'antd';

interface MemberStatisticCardsProps {
  orderCount: number;
  totalSpent: number;
  lastOrderAt?: string;
  points: number;
}

export default function MemberStatisticCards({
  orderCount,
  totalSpent,
  lastOrderAt,
  points,
}: MemberStatisticCardsProps) {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} lg={6}>
        <Card size="small">
          <Statistic title="累计订单数" value={orderCount} suffix="单" />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card size="small">
          <Statistic
            title="累计消费金额"
            value={totalSpent}
            precision={2}
            prefix="¥"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card size="small">
          <Statistic
            title="最近下单时间"
            value={lastOrderAt || '-'}
            valueStyle={{ fontSize: 16 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card size="small">
          <Statistic title="当前积分" value={points} />
        </Card>
      </Col>
    </Row>
  );
}
