const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const PERMISSION_KEY = 'permissions';
const ROLE_KEY = 'roles';
const MENU_KEY = 'menus';

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setUserCache = (user: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserCache = () => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setPermissionCache = (permissions: string[]) => {
  localStorage.setItem(PERMISSION_KEY, JSON.stringify(permissions));
};

export const getPermissionCache = () => {
  const data = localStorage.getItem(PERMISSION_KEY);
  return data ? JSON.parse(data) : [];
};

export const setMenuCache = (menus: any[]) => {
  localStorage.setItem(MENU_KEY, JSON.stringify(menus));
};

export const getMenuCache = () => {
  const data = localStorage.getItem(MENU_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearAllCache = () => {
  localStorage.clear();
};
