import { create } from 'zustand';
import { setMenuCache } from '@/utils/auth';

export const useMenuStore = create<any>((set) => ({
  menus: [],

  setMenus: (menus: any[]) => {
    set({ menus });
    setMenuCache(menus);
  },
}));
