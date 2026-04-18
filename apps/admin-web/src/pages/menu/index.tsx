import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import { getMenus, createMenu, updateMenu, deleteMenu } from '@/api/menu';

export default function MenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getMenus();
    setMenus(res.data);
  };

  const openModal = (menu?: any) => {
    setEditing(menu || null);
    setOpen(true);

    if (menu) {
      form.setFieldsValue(menu);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    if (editing) {
      await updateMenu(editing.id, values);
      message.success('更新成功');
    } else {
      await createMenu(values);
      message.success('创建成功');
    }

    setOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteMenu(id);
    message.success('删除成功');
    load();
  };

  return (
    <div>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>菜单管理</h2>

        <Button type="primary" onClick={() => openModal()}>
          + 新增菜单
        </Button>
      </div>

      {/* tree table */}
      <Table
        rowKey="id"
        dataSource={menus}
        pagination={false}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
          },
          {
            title: '路由',
            dataIndex: 'path',
          },
          {
            title: '权限码',
            dataIndex: 'permission',
          },
          {
            title: '类型',
            dataIndex: 'type',
            render: (type: number) =>
              type === 1 ? (
                <Tag color="blue">菜单</Tag>
              ) : (
                <Tag color="orange">按钮</Tag>
              ),
          },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => openModal(record)}>
                  编辑
                </Button>

                <Button
                  danger
                  type="link"
                  onClick={() => handleDelete(record.id)}
                >
                  删除
                </Button>
              </Space>
            ),
          },
        ]}
      />

      {/* modal */}
      <Modal
        title={editing ? '编辑菜单' : '新增菜单'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="类型">
            <Select
              options={[
                { label: '菜单', value: 1 },
                { label: '按钮', value: 2 },
              ]}
            />
          </Form.Item>

          <Form.Item name="path" label="路由">
            <Input />
          </Form.Item>

          <Form.Item name="component" label="组件路径">
            <Input />
          </Form.Item>

          <Form.Item name="permission" label="权限标识">
            <Input />
          </Form.Item>

          <Form.Item name="parent_id" label="父级ID">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
