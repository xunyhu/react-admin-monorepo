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

  async create(data: any) {
    // 1. 先插入主菜单数据
    const result = await query(
      `INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.code || data.permission,
        data.path,
        data.component || null,
        data.parent_id || null,
        data.type,
        data.permission || data.code,
        data.sort || 0,
      ]
    );

    const insertedId = result.insertId;

    // 新增菜单后，默认赋给超级管理员角色（role_id = 1）
    await query(`INSERT INTO role_menu (role_id, menu_id) VALUES (?, ?)`, [
      1,
      insertedId,
    ]);

    if (data.type === 1) {
      const viewResult = await query(
        `INSERT INTO menus (name, code, path, component, parent_id, type, permission, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `${data.name}查看页面`,
          `${data.code}:view`,
          data.path,
          data.component || null,
          insertedId,
          2,
          `${data.permission}:view`,
          data.sort || 0,
        ]
      );

      const viewInsertedId = (viewResult as any).insertId;
      await query(`INSERT INTO role_menu (role_id, menu_id) VALUES (?, ?)`, [
        1,
        viewInsertedId,
      ]);
    }

    return insertedId;
  },

  // 更新
  update(id: number, data: any) {
    return query(
      `UPDATE menus
       SET name=?, type=?, code=?, path=?, component=?, parent_id=?, permission=?, sort=?
       WHERE id=?`,
      [
        data.name,
        data.type,
        data.code || data.permission,
        data.path,
        data.component || null,
        data.parent_id || null,
        data.permission || data.code,
        data.sort || 0,
        id,
      ]
    );
  },

  // 删除
  delete(id: number) {
    return query(`DELETE FROM menus WHERE id=?`, [id]);
  },

  async deleteMenus(ids: number[]) {
    const uniqueIds = Array.from(
      new Set(ids.map((x) => Number(x)).filter((x) => Number.isFinite(x)))
    );

    if (uniqueIds.length === 0) return;

    // 1) 先清理 role_menu，避免外键/脏数据
    await query(`DELETE FROM role_menu WHERE menu_id IN (?)`, [uniqueIds]);
    // 2) 再删除 menus
    await query(`DELETE FROM menus WHERE id IN (?)`, [uniqueIds]);
  },
};
