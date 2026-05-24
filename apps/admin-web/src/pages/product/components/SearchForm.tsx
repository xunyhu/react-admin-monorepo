import { Button, Form, Input, Select, Space } from 'antd';

import {
  PRODUCT_CATEGORY_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  type ProductSearchValues,
} from '../types';

interface SearchFormProps {
  onSearch: (values: ProductSearchValues) => void;
  onReset: () => void;
}

export default function SearchForm({ onSearch, onReset }: SearchFormProps) {
  const [form] = Form.useForm<ProductSearchValues>();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form
      form={form}
      layout="inline"
      style={{ marginBottom: 16 }}
      onFinish={onSearch}
    >
      <Form.Item name="name" label="商品名称">
        <Input placeholder="请输入商品名称" allowClear style={{ width: 200 }} />
      </Form.Item>

      <Form.Item name="category" label="分类">
        <Select
          placeholder="请选择分类"
          allowClear
          style={{ width: 160 }}
          options={PRODUCT_CATEGORY_OPTIONS}
        />
      </Form.Item>

      <Form.Item name="status" label="状态">
        <Select
          placeholder="请选择状态"
          allowClear
          style={{ width: 140 }}
          options={PRODUCT_STATUS_OPTIONS}
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
