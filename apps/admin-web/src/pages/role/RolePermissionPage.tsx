import { Tree, Card, Button, Select, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getRoles, getMenuTree, getRoleMenus, saveRoleMenus } from '@/api/role';

export default function RolePermissionPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);

  const [roleId, setRoleId] = useState<number | null>(null);

  const [checkedKeys, setCheckedKeys] = useState<any>({
    checked: [],
    halfChecked: [],
  });

  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRoles().then((res) => setRoles(res.data));

    getMenuTree().then((res) => {
      setTreeData(res.data);

      // 默认展开所有节点（企业级体验优化）
      const keys = getAllKeys(res.data);
      setExpandedKeys(keys);
    });
  }, []);

  const getAllKeys = (tree: any[]): number[] => {
    let keys: number[] = [];

    const dfs = (list: any[]) => {
      list.forEach((item) => {
        keys.push(item.id);
        if (item.children) dfs(item.children);
      });
    };

    dfs(tree);
    return keys;
  };

  const onRoleChange = async (id: number) => {
    setRoleId(id);
    setLoading(true);

    try {
      const res = await getRoleMenus(id);

      setCheckedKeys({
        checked: res.data, // 已选
        halfChecked: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const onCheck = (keys: any, info: any) => {
    setCheckedKeys({
      checked: keys.checked,
      halfChecked: keys.halfChecked,
    });
  };

  const handleSave = async () => {
    if (!roleId) return message.warning('请选择角色');

    const menuIds = [...checkedKeys.checked, ...checkedKeys.halfChecked];

    await saveRoleMenus({
      roleId,
      menuIds,
    });

    message.success('保存成功');
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* 左侧角色 */}
      <Card title="角色选择" style={{ width: 260 }}>
        <Select
          style={{ width: '100%' }}
          placeholder="请选择角色"
          onChange={onRoleChange}
          options={roles.map((r) => ({
            label: r.name,
            value: r.id,
          }))}
        />
      </Card>

      {/* 右侧权限树 */}
      <Card
        title="权限分配"
        style={{ flex: 1 }}
        extra={
          <Button type="primary" onClick={handleSave}>
            保存权限
          </Button>
        }
      >
        {loading ? (
          <Spin />
        ) : (
          <Tree
            checkable
            treeData={treeData}
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as number[])}
            onCheck={onCheck}
            fieldNames={{
              title: 'name',
              key: 'id',
              children: 'children',
            }}
            checkStrictly={false} // ⭐企业常用：父子联动
          />
        )}
      </Card>
    </div>
  );
}
