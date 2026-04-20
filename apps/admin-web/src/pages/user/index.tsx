import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  Tag,
  message,
} from 'antd';
import dayjs from 'dayjs';

import { getUsers, addUser, deleteUser, updateUser } from '@/api/user';
import { getRoles } from '@/api/role';

import BtnPermission from '@/components/BtnPermission';
import PageHeader from '@/components/PageHeader';

export default function UserPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);

  const [form] = Form.useForm();

  const [roles, setRoles] = useState<any[]>([]);

  const loadData = async (p = page, ps = pageSize) => {
    setLoading(true);

    try {
      const res = await getUsers({
        page: p,
        pageSize: ps,
        username: keyword,
      });

      setList(res.data.list);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    const res = await getRoles();
    setRoles(
      res.data.map((i: any) => ({
        label: i.name,
        value: i.id,
      }))
    );
  };

  useEffect(() => {
    loadData(1, pageSize);
    fetchRoles();
  }, []);

  const handleAddOrEdit = async () => {
    const values = await form.validateFields();

    if (editId) {
      // 编辑逻辑
      await updateUser({
        id: editId,
        ...values,
      });

      message.success('更新成功');
    } else {
      // 新增逻辑
      await addUser({
        ...values,
        status: 1,
      });

      message.success('创建成功');
    }

    setOpen(false);
    setEditId(null);
    form.resetFields();
    loadData(page, pageSize);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    message.success('删除成功');
    loadData();
  };

  const handleSearch = (val: string) => {
    setKeyword(val);
    setPage(1);
    loadData(1, pageSize);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },

    { title: '用户名', dataIndex: 'username' },

    { title: '邮箱', dataIndex: 'email' },

    {
      title: '角色',
      dataIndex: 'role_name',
      width: 150,
      render: (text: any) => <Tag color="blue">{text}</Tag>,
    },

    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (t: string) => dayjs(t).format('YYYY-MM-DD HH:mm'),
    },

    {
      title: '更新时间',
      dataIndex: 'updated_at',
      render: (t: string) => dayjs(t).format('YYYY-MM-DD HH:mm'),
    },

    {
      title: '操作',
      width: 220,
      render: (_: any, record: any) => (
        <Space>
          <BtnPermission code="user:edit">
            <Button
              type="link"
              onClick={() => {
                setOpen(true);
                setEditId(record.id);

                form.setFieldsValue({
                  username: record.username,
                  email: record.email,
                  name: record.name,
                  role: record.role_name,
                });
              }}
            >
              编辑
            </Button>
          </BtnPermission>
          <BtnPermission code="user:delete">
            <Button danger type="link" onClick={() => handleDelete(record.id)}>
              删除
            </Button>
          </BtnPermission>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 6 }}>
      <PageHeader
        title="用户管理"
        extra={
          <Space>
            <BtnPermission code="user:add">
              <Button type="primary" onClick={() => setOpen(true)}>
                新增用户
              </Button>
            </BtnPermission>

            <Input.Search
              placeholder="用户名"
              allowClear
              style={{ width: 260 }}
              onSearch={handleSearch}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  handleSearch(val);
                }
              }}
            />
          </Space>
        }
      />

      {/* 表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
            loadData(p, ps);
          },
        }}
      />

      {/* 新增用户弹窗 */}
      <Modal
        title={editId ? '编辑用户' : '新增用户'}
        open={open}
        onOk={handleAddOrEdit}
        onCancel={() => {
          setOpen(false);
          setEditId(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item name="name" rules={[{ required: true }]} label="姓名">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="邮箱">
            <Input />
          </Form.Item>

          <Form.Item name="role" label="角色" required>
            <Select options={roles} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
