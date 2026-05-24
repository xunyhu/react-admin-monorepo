import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';

import { createProduct, updateProduct } from '@/api/product';
import {
  PRODUCT_CATEGORY_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  type Product,
  type ProductFormValues,
} from '../types';

interface ProductFormModalProps {
  open: boolean;
  editing: Product | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ProductFormModal({
  open,
  editing,
  onCancel,
  onSuccess,
}: ProductFormModalProps) {
  const [form] = Form.useForm<ProductFormValues>();

  useEffect(() => {
    if (!open) return;

    if (editing) {
      form.setFieldsValue({
        name: editing.name,
        category: editing.category,
        price: editing.price,
        stock: editing.stock,
        status: editing.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 1, stock: 0 });
    }
  }, [open, editing, form]);

  const handleOk = async () => {
    const values = await form.validateFields();

    if (editing) {
      await updateProduct(editing.id, values);
    } else {
      await createProduct(values);
    }

    onSuccess();
    onCancel();
  };

  return (
    <Modal
      title={editing ? '编辑商品' : '新增商品'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
      width={520}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder="请输入商品名称" />
        </Form.Item>

        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select
            placeholder="请选择分类"
            options={PRODUCT_CATEGORY_OPTIONS}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="价格"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber
            min={0}
            precision={2}
            addonBefore="¥"
            style={{ width: '100%' }}
            placeholder="请输入价格"
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="库存"
          rules={[{ required: true, message: '请输入库存' }]}
        >
          <InputNumber
            min={0}
            precision={0}
            style={{ width: '100%' }}
            placeholder="请输入库存"
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select options={PRODUCT_STATUS_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
