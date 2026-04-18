import { RoleModel } from '../models/role.model';
import { query } from '../db';

export const RoleService = {
  async getRoles() {
    return await RoleModel.findAll();
  },

  async createRole(data: any) {
    return await RoleModel.create(data);
  },

  async updateRole(id: number, data: any) {
    return await RoleModel.update(id, data);
  },

  async deleteRole(id: number) {
    await RoleModel.remove(id);

    // 2. 清理 user_role（防脏数据）
    await query(`DELETE FROM user_role WHERE role_id = ?`, [id]);

    // 3. 清理 role_menu
    await query(`DELETE FROM role_menu WHERE role_id = ?`, [id]);

    return true;
  },

  async getRoleUserCount(roleId: number) {
    return await RoleModel.getRoleUserCount(roleId);
  },

  async getRoleMenus(roleId: number) {
    return await RoleModel.getRoleMenus(roleId);
  },

  async saveMenus(roleId: number, menuIds: number[]) {
    return await RoleModel.saveMenus(roleId, menuIds);
  },
};
