import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import {
  PAY_STATUS_OPTIONS,
  SHIPPING_STATUS_OPTIONS,
  type OrderSearchValues,
} from '../types';

interface OrderSearchProps {
  onSearch: (values: OrderSearchValues) => void;
  onReset: () => void;
}

interface SearchFormValues extends Omit<OrderSearchValues, 'dateRange'> {
  dateRange?: [Dayjs, Dayjs];
}

export default function OrderSearch({ onSearch, onReset }: OrderSearchProps) {
  const [form] = Form.useForm<SearchFormValues>();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleFinish = (values: SearchFormValues) => {
    const { dateRange, ...rest } = values;

    onSearch({
      ...rest,
      dateRange: dateRange
        ? [
            dateRange[0].format('YYYY-MM-DD'),
            dateRange[1].format('YYYY-MM-DD'),
          ]
        : undefined,
    });
  };

  return (
    <Form
      form={form}
      layout="inline"
      style={{ marginBottom: 16, rowGap: 12 }}
      onFinish={handleFinish}
    >
      <Form.Item name="orderNo" label="订单号">
        <Input placeholder="请输入订单号" allowClear style={{ width: 180 }} />
      </Form.Item>

      <Form.Item name="nickname" label="用户昵称">
        <Input placeholder="请输入用户昵称" allowClear style={{ width: 160 }} />
      </Form.Item>

      <Form.Item name="phone" label="手机号">
        <Input placeholder="请输入手机号" allowClear style={{ width: 160 }} />
      </Form.Item>

      <Form.Item name="payStatus" label="支付状态">
        <Select
          placeholder="请选择"
          allowClear
          style={{ width: 130 }}
          options={PAY_STATUS_OPTIONS}
        />
      </Form.Item>

      <Form.Item name="shippingStatus" label="发货状态">
        <Select
          placeholder="请选择"
          allowClear
          style={{ width: 130 }}
          options={SHIPPING_STATUS_OPTIONS}
        />
      </Form.Item>

      <Form.Item name="dateRange" label="下单时间">
        <DatePicker.RangePicker
          style={{ width: 260 }}
          disabledDate={(current) => current && current > dayjs().endOf('day')}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
