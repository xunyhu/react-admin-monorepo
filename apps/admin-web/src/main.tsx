import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { createAppRouter } from '@/router/dynamic';

import { useMenuStore } from '@/store/menu';
import { useAuthStore } from '@/store/auth';

import { getMenuCache, getPermissionCache, getRoleCache, getToken, getUserCache } from '@/utils/auth';
import 'antd/dist/reset.css';

function App() {
  const [router, setRouter] = useState<any>(null);

  const menus = useMenuStore((s) => s.menus);
  const setMenus = useMenuStore((s) => s.setMenus);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setRouter(createAppRouter([]));
      return;
    }

    useAuthStore.getState().hydrate({
      token,
      user: getUserCache(),
      roles: getRoleCache(),
      permissions: getPermissionCache(),
    });

    const cachedMenus = getMenuCache();

    if (cachedMenus.length) {
      setMenus(cachedMenus);
      setRouter(createAppRouter(cachedMenus));
      return;
    }

    setRouter(createAppRouter([]));
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    if (menus.length > 0) {
      setRouter(createAppRouter(menus));
    }
  }, [menus]);

  if (!router) return <div>Loading...</div>;

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
