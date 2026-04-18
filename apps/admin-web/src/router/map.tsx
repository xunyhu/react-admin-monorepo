import Dashboard from '@/pages/dashboard';
import User from '@/pages/user';
import Role from '@/pages/role';
import Menu from '@/pages/menu';

const componentMap: Record<string, any> = {
  dashboard: Dashboard,
  user: User,
  role: Role,
  menu: Menu,
};

export function generateRoutes(menus: any[]) {
  const routes: any[] = [];

  const dfs = (list: any[], parentPath: string = '') => {
    list.forEach((item) => {
      if (item.type === 2) return;

      if (item.path) {
        const Component = componentMap[item.code];

        routes.push({
          path: parentPath ? `${parentPath}${item.path}` : item.path,
          element: Component ? <Component /> : <div>页面开发中</div>,
        });
      }

      if (item.children?.length) {
        dfs(item.children, item.path ?? item.path);
      }
    });
  };

  dfs(menus);

  console.log('generateRoutes - 生成的路由列表：', routes);

  return routes;
}

function transform(menu: any) {
  if (menu.type !== 1) return null;

  const hasChildren = menu.children?.length > 0;

  const path = menu.path.replace(/^\//, '');

  console.log(
    `transform - 处理菜单: ${menu.name}, path: ${path}, hasChildren: ${hasChildren}`
  );
  if (hasChildren) {
    return {
      path,
      children: menu.children.map(transform).filter(Boolean),
    };
  }

  const Component = componentMap[menu.code];

  console.log(
    `生成路由 - path: ${path}, component: ${Component ? menu.code : '开发中'}`
  );

  return {
    path,
    element: Component ? <Component /> : <div>页面开发中</div>,
  };
}
