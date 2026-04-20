import { MenuModel } from '../models/menu.model';

export const MenuService = {
  async getAll() {
    const list = await MenuModel.getAll();
    return list;
  },
  async getTree() {
    const list = await MenuModel.getTree();

    return list;
  },
  async createMenu(data: any) {
    return await MenuModel.create(data);
  },

  async updateMenu(id: number, data: any) {
    return await MenuModel.update(id, data);
  },

  async deleteMenus(ids: number[]) {
    await MenuModel.deleteMenus(ids);
    return true;
  },
};
