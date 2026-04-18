import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@/layouts';
import Login from '@/pages/login';
import Page404 from '@/pages/404';
import { generateRoutes } from './map';
import RolePermissionPage from '@/pages/role/RolePermissionPage';

export function createAppRouter(menus: any[]) {
  const dynamicRoutes = (generateRoutes(menus || []) || []).filter(
    (route): route is Exclude<typeof route, null> => route !== null
  );

  return createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: '/role-permission/:roleId',
          element: <RolePermissionPage />,
        },
        ...dynamicRoutes,
      ],
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ]);
}
