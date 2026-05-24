import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@/layouts';
import Login from '@/pages/login';
import Page404 from '@/pages/404';
import { generateRoutes } from './map';
import RolePermissionPage from '@/pages/role/RolePermissionPage';
import PageDesignCreatePage from '@/pages/pageDesign/create';
import OrderDetailPage from '@/pages/order/detail';
import MemberDetailPage from '@/pages/member/detail';
import RequireAuth from '@/components/RequireAuth';

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
      path: '/pageDesign/create',
      element: (
        <RequireAuth>
          <PageDesignCreatePage />
        </RequireAuth>
      ),
    },
    {
      path: '/',
      element: (
        <RequireAuth>
          <Layout />
        </RequireAuth>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: '/system/role/:roleId',
          element: <RolePermissionPage />,
        },
        {
          path: '/order/detail/:id',
          element: <OrderDetailPage />,
        },
        {
          path: '/member/detail/:id',
          element: <MemberDetailPage />,
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
