import { Table, Button, Modal, Form, Input, Space, message, Tag } from 'antd';
import { useEffect, useState } from 'react';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getRoleUserCount,
} from '@/api/role';
import { useNavigate } from 'react-router-dom';

export default function RoleListPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const [form] = Form.useForm();

  // 获取角色 + 用户数
  const fetchRoles = async () => {
    setLoading(true);

    const res = await getRoles();

    // 👇 关键：补用户数（后端可以优化成 join）
    const list = await Promise.all(
      res.data.map(async (r: any) => {
        const countRes = await getRoleUserCount(r.id);
        return {
          ...r,
          userCount: countRes.data,
        };
      })
    );

    setRoles(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // 打开弹窗
  const openModal = (role?: any) => {
    setEditingRole(role || null);
    setOpen(true);

    if (role) {
      form.setFieldsValue(role);
    } else {
      form.resetFields();
    }
  };

  // 保存
  const handleOk = async () => {
    const values = await form.validateFields();

    if (editingRole) {
      await updateRole(editingRole.id, values);
      message.success('更新成功');
    } else {
      await createRole(values);
      message.success('创建成功');
    }

    setOpen(false);
    fetchRoles();
  };

  // 删除
  const handleDelete = async (id: number) => {
    await deleteRole(id);
    message.success('删除成功');
    fetchRoles();
  };

  return (
    <div>
      {/* 顶部标题 + 新增按钮 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>角色管理</h2>

        <Button type="primary" onClick={() => openModal()}>
          + 新增角色
        </Button>
      </div>

      {/* 表格 */}
      <Table
        rowKey="id"
        dataSource={roles}
        loading={loading}
        pagination={false}
        columns={[
          {
            title: '角色标识',
            dataIndex: 'code',
            width: 150,
            render: (text) => <Tag color="blue">{text}</Tag>,
          },
          {
            title: '角色名称',
            dataIndex: 'name',
            width: 150,
          },
          {
            title: '用户数',
            dataIndex: 'userCount',
            width: 120,
            render: (count) => <span>{count || 0} 人</span>,
          },
          {
            title: '角色描述',
            dataIndex: 'description',
            width: 300,
          },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                {/* <Button type="link" onClick={() => openModal(record)}>
                  编辑
                </Button> */}

                <Button
                  type="link"
                  onClick={() => navigate(`/system/role/${record.id}`)}
                >
                  权限
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

      {/* 弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="角色标识" name="code" rules={[{ required: true }]}>
            <Input placeholder="如：admin / editor" />
          </Form.Item>

          <Form.Item
            label="角色描述"
            name="description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
