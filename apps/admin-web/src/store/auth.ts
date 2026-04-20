import { create } from 'zustand';
import { setToken, setUserCache, setPermissionCache, setRoleCache } from '@/utils/auth';

export const useAuthStore = create<any>((set) => ({
  token: null,
  user: null,
  roles: [],
  permissions: [],

  setAuth: (data: any) => {
    set({
      token: data.token,
      user: data.user,
      roles: data.roles,
      permissions: data.permissions,
    });

    setToken(data.token);
    setUserCache(data.user);
    setPermissionCache(data.permissions);
    setRoleCache(data.roles || []);
  },

  hydrate: (cache: any) => {
    set(cache);
  },
}));
