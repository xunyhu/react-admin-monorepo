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
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = roleId === 1;

  // 加载角色列表 & 菜单树
  useEffect(() => {
    Promise.all([getRoles(), getMenuTree()]).then(([rolesRes, menuRes]) => {
      setRoles(rolesRes.data);
      setTreeData(menuRes.data);
      const allKeys = getAllKeys(menuRes.data);
      setExpandedKeys(allKeys);
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

  // 获取节点的所有子节点ID（不包括自身）
  const getAllChildIds = (node: any): number[] => {
    const childIds: number[] = [];
    const dfs = (n: any) => {
      if (n.children) {
        n.children.forEach((child: any) => {
          childIds.push(child.id);
          dfs(child);
        });
      }
    };
    dfs(node);
    return childIds;
  };

  // 处理后端返回的权限数据：移除那些子节点未全选的父节点
  const processCheckedKeys = (keys: number[], tree: any[]): number[] => {
    const nodeMap = new Map<number, any>();
    const buildMap = (nodes: any[]) => {
      nodes.forEach((node) => {
        nodeMap.set(node.id, node);
        if (node.children) buildMap(node.children);
      });
    };
    buildMap(tree);

    const toRemove: number[] = [];

    keys.forEach((key) => {
      const node = nodeMap.get(key);
      if (
        node &&
        node.type === 1 &&
        node.children &&
        node.children.length > 0
      ) {
        const childIds = getAllChildIds(node);
        const allChildrenChecked = childIds.every((childId) =>
          keys.includes(childId)
        );
        if (!allChildrenChecked) {
          toRemove.push(key);
        }
      }
    });

    return keys.filter((key) => !toRemove.includes(key));
  };

  const loadRoleMenus = async (roleId: number) => {
    setLoading(true);
    try {
      const res = await getRoleMenus(roleId);
      const processedKeys = processCheckedKeys(res.data, treeData);
      setCheckedKeys(processedKeys);
    } finally {
      setLoading(false);
    }
  };

  const onRoleChange = async (id: number) => {
    setRoleId(id);
    await loadRoleMenus(id);
  };

  const onCheck = (keys: any) => {
    if (isSuperAdmin) {
      message.warning('超级管理员权限不可修改');
      return;
    }
    setCheckedKeys(keys);
  };
  // 辅助函数：根据选中的子节点，获取需要自动选中的父节点（type=1 且部分子节点被选中）
  const getAutoParentKeys = (checkedKeys: number[], tree: any[]): number[] => {
    const parentIds: number[] = [];
    const dfs = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0 && node.type === 1) {
          // 收集所有子孙节点ID（递归）
          const getAllDescendantIds = (n: any): number[] => {
            let ids: number[] = [];
            if (n.children) {
              n.children.forEach((child: any) => {
                ids.push(child.id);
                ids.push(...getAllDescendantIds(child));
              });
            }
            return ids;
          };
          const descendantIds = getAllDescendantIds(node);
          // 检查是否有任何子孙节点被选中
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
    // 获取需要自动添加的父菜单ID
    const autoParentKeys = getAutoParentKeys(checkedKeys, treeData);
    // 合并去重
    const finalMenuIds = [...new Set([...checkedKeys, ...autoParentKeys])];
    await saveRoleMenus({ roleId, menuIds: finalMenuIds });
    message.success('保存成功');
  };

  const handleGoBack = () => {
    navigate('/system/role');
  };

  console.log('treeData', treeData);
  console.log('checkedKeys', checkedKeys);

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
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as number[])}
            onCheck={onCheck}
            disabled={isSuperAdmin}
            checkStrictly={false} // ← 保持父子联动
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
