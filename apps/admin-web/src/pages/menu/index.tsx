import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
  Tag,
  Popconfirm,
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

  // 将扁平数据转换为树形结构
  const getTreeData = (list: any[]) => {
    const map = new Map();
    const roots: any[] = [];

    // 先转成 map
    list.forEach((item) => {
      map.set(item.id, { ...item, key: item.id, children: [] });
    });

    // 组装树
    list.forEach((item) => {
      const node = map.get(item.id);
      if (!item.parent_id || item.parent_id === 0 || !map.has(item.parent_id)) {
        roots.push(node);
      } else {
        const parent = map.get(item.parent_id);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    // 按 sort 排序
    const sortChildren = (nodes: any[]) => {
      nodes.sort((a, b) => (a.sort || 0) - (b.sort || 0));
      nodes.forEach((node) => {
        if (node.children && node.children.length) {
          sortChildren(node.children);
        }
      });
    };
    sortChildren(roots);

    return roots;
  };

  const openModal = (menu?: any) => {
    setEditing(menu || null);
    setOpen(true);

    if (menu) {
      form.setFieldsValue(menu);
    } else {
      form.resetFields();
      form.setFieldsValue({
        type: 1,
        parent_id: 0,
        sort: menu?.sort || 0,
      });
    }
  };

  // 添加子菜单
  const addChildMenu = (parent: any) => {
    setEditing(null);
    setOpen(true);
    form.resetFields();
    form.setFieldsValue({
      parent_id: parent.id,
      type: 1,
      sort: 0,
    });
  };

  // 添加子按钮
  const addChildButton = (parent: any) => {
    setEditing(null);
    setOpen(true);
    form.resetFields();
    form.setFieldsValue({
      parent_id: parent.id,
      type: 2,
      sort: 0,
    });
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    if (editing) {
      await updateMenu(editing.id, { ...editing, ...values });
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

  const findParentName = (list: any[], parentId: number): string => {
    const parent = list.find((item) => item.id === parentId);
    if (!parent) return '顶级菜单';
    return parent.name;
  };

  const treeData = getTreeData(menus);

  return (
    <div style={{ padding: 24 }}>
      {/* header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>菜单管理</h2>

        <Button type="primary" onClick={() => openModal()}>
          + 新增根菜单
        </Button>
      </div>

      {/* 树形表格 */}
      <Table
        rowKey="id"
        dataSource={treeData}
        pagination={false}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
            width: 250,
            render: (text, record) => (
              <Space>
                {record.type === 1 ? (
                  <span style={{ fontWeight: 500 }}>{text}</span>
                ) : (
                  <>
                    <span>{text}</span>
                  </>
                )}
                {record.type === 1 && (
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    菜单
                  </Tag>
                )}
                {record.type === 2 && <Tag color="orange">按钮</Tag>}
              </Space>
            ),
          },
          {
            title: '路由/权限码',
            width: 200,
            render: (_, record) => {
              if (record.type === 1) {
                return record.path || '-';
              }
              return record.permission || '-';
            },
          },
          // {
          //   title: '组件/标识',
          //   width: 200,
          //   render: (_, record) => {
          //     if (record.type === 1) {
          //       return record.component || '-';
          //     }
          //     return record.code || '-';
          //   },
          // },
          {
            title: '父级',
            width: 120,
            render: (_, record) => {
              if (!record.parent_id || record.parent_id === 0) {
                return <Tag>顶级</Tag>;
              }
              return findParentName(menus, record.parent_id);
            },
          },
          {
            title: '排序',
            dataIndex: 'sort',
            width: 80,
            align: 'center',
          },
          {
            title: '操作',
            width: 280,
            fixed: 'right',
            render: (_, record) => (
              <Space size="small">
                {record.type === 1 && (
                  <>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => addChildMenu(record)}
                    >
                      添加子菜单
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => addChildButton(record)}
                    >
                      添加按钮
                    </Button>
                  </>
                )}
                <Button
                  type="link"
                  size="small"
                  onClick={() => openModal(record)}
                >
                  编辑
                </Button>
                <Popconfirm
                  title="确定删除吗？"
                  description={
                    record.children?.length
                      ? `该菜单下有 ${record.children.length} 个子项，删除后子项也将被删除，确定继续吗？`
                      : '删除后不可恢复'
                  }
                  onConfirm={() => handleDelete(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger type="link" size="small">
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        scroll={{ x: 1200 }}
      />

      {/* 编辑/新增弹窗 */}
      <Modal
        title={editing ? '编辑菜单' : '新增菜单'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select
              disabled={!!editing}
              options={[
                { label: '菜单', value: 1 },
                { label: '按钮', value: 2 },
              ]}
              onChange={(val) => {
                if (val === 2) {
                  form.setFieldsValue({
                    path: undefined,
                    component: undefined,
                  });
                } else {
                  form.setFieldsValue({
                    permission: undefined,
                    code: undefined,
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.type !== curr.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              return (
                <>
                  {type === 1 ? (
                    <>
                      <Form.Item
                        name="path"
                        label="路由"
                        rules={[{ required: true, message: '请输入路由路径' }]}
                      >
                        <Input
                          placeholder="例如: /user/list"
                          disabled={!!editing}
                        />
                      </Form.Item>

                      <Form.Item name="component" label="组件名">
                        <Input placeholder="例如: user/List" />
                      </Form.Item>

                      <Form.Item name="code" label="权限标识" required>
                        <Input disabled={!!editing} />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item
                        name="permission"
                        label="权限标识"
                        rules={[{ required: true, message: '请输入权限标识' }]}
                      >
                        <Input placeholder="例如: user:list" />
                      </Form.Item>

                      <Form.Item name="component" label="组件路径" hidden>
                        <Input />
                      </Form.Item>
                    </>
                  )}
                </>
              );
            }}
          </Form.Item>

          <Form.Item name="parent_id" label="父级ID" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序号' }]}
            extra="数字越小越靠前"
          >
            <InputNumber min={0} max={9999} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
