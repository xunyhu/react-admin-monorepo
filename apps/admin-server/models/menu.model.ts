import { query } from '../db';
import { buildTree } from '../utils/tree';

export const MenuModel = {
  // 获取用户菜单
  async findMenusByUserId(userId: number) {
    return query(
      `
      SELECT m.*
      FROM menus m
      JOIN role_menu rm ON rm.menu_id = m.id
      JOIN user_role ur ON ur.role_id = rm.role_id
      WHERE ur.user_id = ?
    `,
      [userId]
    );
  },

  // 获取用户权限
  async findPermissionsByUserId(userId: number) {
    return query(
      `
      SELECT DISTINCT m.permission
      FROM menus m
      JOIN role_menu rm ON rm.menu_id = m.id
      JOIN user_role ur ON ur.role_id = rm.role_id
      WHERE ur.user_id = ?
      AND m.permission IS NOT NULL
    `,
      [userId]
    );
  },

  async getAll() {
    const list = await query(`SELECT * FROM menus`);
    return list;
  },

  async getTree() {
    const list = await query(`SELECT * FROM menus`);

    return buildTree(list);
  },

  create(data: any) {
    return query(
      `INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.code,
        data.path,
        data.component,
        data.parent_id || null,
        data.type,
        data.permission,
        data.sort || 0,
      ]
    );
  },

  // 更新
  update(id: number, data: any) {
    return query(
      `UPDATE menus
       SET name=?, code=?, path=?, component=?, parent_id=?, type=?, permission=?, sort=?
       WHERE id=?`,
      [
        data.name,
        data.code,
        data.path,
        data.component,
        data.parent_id || null,
        data.type,
        data.permission,
        data.sort || 0,
        id,
      ]
    );
  },

  // 删除
  delete(id: number) {
    return query(`DELETE FROM menus WHERE id=?`, [id]);
  },

  async deleteMenu(id: number) {
    // 1. 删除子菜单
    await query(`DELETE FROM menus WHERE parent_id = ?`, [id]);

    // 2. 删除自己
    await MenuModel.delete(id);

    // 3. 清理 role_menu（避免脏数据）
    await query(`DELETE FROM role_menu WHERE menu_id = ?`, [id]);
  },
};
