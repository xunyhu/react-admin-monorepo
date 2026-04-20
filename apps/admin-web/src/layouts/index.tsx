import { Layout, Menu, Button, Space, Modal, Typography } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { clearAllCache, getUserCache } from '@/utils/auth';
import { useMenuStore } from '@/store/menu';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const menus = useMenuStore((s) => s.menus);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const user = getUserCache();
  const currentUser = user?.username || '用户';

  const normalizedMenus = useMemo(() => {
    const loop = (list: any[], parentPath = ''): any[] =>
      list
        .filter((item) => item.type === 1)
        .sort((a, b) => a.sort - b.sort)
        .map((item) => {
          const fullPath = parentPath
            ? `${parentPath}${item.path.startsWith('/') ? '' : '/'}${item.path}`
            : item.path;

          const children = item.children?.length
            ? loop(item.children, fullPath)
            : [];

          return {
            ...item,
            path: fullPath,
            children,
          };
        });

    return loop(menus || []);
  }, [menus]);

  const formatMenus = (list: any[]): any[] =>
    list.map((item) => ({
      key: item.path,
      label: item.name,
      children: item.children?.length ? formatMenus(item.children) : undefined,
    }));

  const selectedKey = useMemo(() => {
    const pathname = location.pathname;

    const flatMenus = (list: any[]): any[] =>
      list.reduce((acc: any[], item: any) => {
        acc.push(item);
        if (item.children?.length) {
          acc.push(...flatMenus(item.children));
        }
        return acc;
      }, []);

    const allMenus = flatMenus(normalizedMenus);

    const match = allMenus
      .filter((m) => pathname.startsWith(m.path))
      .sort((a, b) => b.path.length - a.path.length)[0];

    return match?.path || pathname;
  }, [location.pathname, normalizedMenus]);

  useEffect(() => {
    const keys: string[] = [];

    const walk = (list: any[]) => {
      for (const item of list) {
        if (location.pathname.startsWith(item.path)) {
          keys.push(item.path);
        }
        if (item.children?.length) {
          walk(item.children);
        }
      }
    };

    walk(normalizedMenus);
    setOpenKeys(keys);
  }, [location.pathname, normalizedMenus]);

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      centered: true,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        clearAllCache();
        navigate('/login');
      },
    });
  };

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider width={220} theme="dark">
        <Menu
          theme="dark"
          mode="inline"
          items={formatMenus(normalizedMenus)}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          onClick={({ key }) => navigate(key as string)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
          }}
        >
          <div style={{ fontWeight: 500, fontSize: 16 }}>React System</div>

          <Space size="middle">
            <Text type="secondary">
              欢迎，<Text strong>{currentUser}</Text>
            </Text>
            <Button type="link" onClick={handleLogout}>
              退出登录
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            margin: 16,
            padding: 16,
            background: '#fff',
            borderRadius: 8,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
