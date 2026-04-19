import { Tree, Card, Button, Select, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoles, getMenuTree, getRoleMenus, saveRoleMenus } from '@/api/role';

export default function RolePermissionPage() {
  const { roleId: id } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const [roles, setRoles] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<number[]>([]); // 新增
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = roleId === 1;

  // 辅助：获取所有后代ID（不包括自身）
  const getAllDescendantIds = (node: any): number[] => {
    let ids: number[] = [];
    if (node.children) {
      node.children.forEach((child: any) => {
        ids.push(child.id);
        ids.push(...getAllDescendantIds(child));
      });
    }
    return ids;
  };

  // 计算半选节点（type=1 且部分子节点被选中）
  const computeHalfChecked = (checked: number[], tree: any[]): number[] => {
    const halfChecked: number[] = [];
    const dfs = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.type === 1 && node.children?.length) {
          const descendantIds = getAllDescendantIds(node);
          const checkedChildren = descendantIds.filter((id) =>
            checked.includes(id)
          );
          if (
            checkedChildren.length > 0 &&
            checkedChildren.length < descendantIds.length
          ) {
            halfChecked.push(node.id);
          }
        }
        if (node.children) dfs(node.children);
      }
    };
    dfs(tree);
    return halfChecked;
  };

  // 获取所有节点ID（用于展开）
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

  // 加载角色列表 & 菜单树
  useEffect(() => {
    Promise.all([getRoles(), getMenuTree()]).then(([rolesRes, menuRes]) => {
      setRoles(rolesRes.data);
      setTreeData(menuRes.data);
      setExpandedKeys(getAllKeys(menuRes.data));
    });
  }, []);

  // 自动选中路由中的角色
  useEffect(() => {
    if (roles.length === 0) return;
    if (!id) return;
    const parsedId = Number(id);
    const roleExists = roles.some((r) => r.id === parsedId);
    if (roleExists && roleId !== parsedId) {
      setRoleId(parsedId);
      loadRoleMenus(parsedId);
    }
  }, [roles, id]);

  const loadRoleMenus = async (roleId: number) => {
    setLoading(true);
    try {
      const res = await getRoleMenus(roleId);
      setCheckedKeys(res.data);
      setHalfCheckedKeys(computeHalfChecked(res.data, treeData));
    } finally {
      setLoading(false);
    }
  };

  const onRoleChange = async (id: number) => {
    setRoleId(id);
    await loadRoleMenus(id);
  };

  // checkStrictly=true 时，onCheck 参数可能是 { checked, halfChecked } 或数组
  const onCheck = (checkedValue: any) => {
    if (isSuperAdmin) {
      message.warning('超级管理员权限不可修改');
      return;
    }
    const newChecked = Array.isArray(checkedValue)
      ? checkedValue
      : checkedValue.checked;
    setCheckedKeys(newChecked);
    setHalfCheckedKeys(computeHalfChecked(newChecked, treeData));
  };

  // 辅助函数：根据选中的子节点，获取需要自动选中的父节点（type=1 且部分子节点被选中）
  const getAutoParentKeys = (checkedKeys: number[], tree: any[]): number[] => {
    const parentIds: number[] = [];
    const dfs = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0 && node.type === 1) {
          const descendantIds = getAllDescendantIds(node);
          const hasCheckedDescendant = descendantIds.some((id) =>
            checkedKeys.includes(id)
          );
          if (hasCheckedDescendant && !checkedKeys.includes(node.id)) {
            parentIds.push(node.id);
          }
        }
        if (node.children) dfs(node.children);
      }
    };
    dfs(tree);
    return parentIds;
  };

  const handleSave = async () => {
    if (!roleId) return message.warning('请选择角色');
    if (isSuperAdmin) {
      message.warning('超级管理员权限不可修改');
      return;
    }
    const autoParentKeys = getAutoParentKeys(checkedKeys, treeData);
    const finalMenuIds = [...new Set([...checkedKeys, ...autoParentKeys])];
    await saveRoleMenus({ roleId, menuIds: finalMenuIds });
    message.success('保存成功');
  };

  const handleGoBack = () => {
    navigate('/system/role');
  };

  console.log('checkedKeys', checkedKeys);
  console.log('halfCheckedKeys', halfCheckedKeys);

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Card
        title="角色选择"
        style={{ width: 260 }}
        extra={
          <Button type="link" onClick={handleGoBack} style={{ padding: 0 }}>
            返回
          </Button>
        }
      >
        <Select
          style={{ width: '100%' }}
          placeholder="请选择角色"
          value={roleId}
          onChange={onRoleChange}
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
        />
        {isSuperAdmin && (
          <div style={{ marginTop: 8, color: '#ff4d4f', fontSize: 12 }}>
            ⚠️ 超级管理员权限不可编辑
          </div>
        )}
      </Card>

      <Card
        title="权限分配"
        style={{ flex: 1 }}
        extra={
          <Button type="primary" onClick={handleSave} disabled={isSuperAdmin}>
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
            halfCheckedKeys={halfCheckedKeys} // 新增：手动控制半选
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as number[])}
            onCheck={onCheck}
            disabled={isSuperAdmin}
            checkStrictly={true} // 改为 true，取消自动联动
            fieldNames={{
              title: 'name',
              key: 'id',
              children: 'children',
            }}
          />
        )}
      </Card>
    </div>
  );
}
