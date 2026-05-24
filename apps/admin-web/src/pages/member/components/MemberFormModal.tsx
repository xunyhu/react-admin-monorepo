import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

import {
  MEMBER_LEVEL_OPTIONS,
  type MemberFormValues,
  type MemberItem,
} from '../types';

interface MemberFormModalProps {
  open: boolean;
  editing: MemberItem | null;
  onCancel: () => void;
  onSubmit: (id: number, values: MemberFormValues) => Promise<void>;
}

export default function MemberFormModal({
  open,
  editing,
  onCancel,
  onSubmit,
}: MemberFormModalProps) {
  const [form] = Form.useForm<MemberFormValues>();

  useEffect(() => {
    if (!open) return;

    if (editing) {
      form.setFieldsValue({
        nickname: editing.nickname,
        phone: editing.phone,
        level: editing.level,
      });
    } else {
      form.resetFields();
    }
  }, [open, editing, form]);

  const handleOk = async () => {
    if (!editing) return;

    const values = await form.validateFields();
    await onSubmit(editing.id, values);
    onCancel();
  };

  return (
    <Modal
      title="编辑会员"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
      width={520}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nickname"
          label="用户昵称"
          rules={[{ required: true, message: '请输入用户昵称' }]}
        >
          <Input placeholder="请输入用户昵称" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>

        <Form.Item
          name="level"
          label="用户等级"
          rules={[{ required: true, message: '请选择用户等级' }]}
        >
          <Select placeholder="请选择用户等级" options={MEMBER_LEVEL_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
