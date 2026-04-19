import { query } from '../db';

export const RoleModel = {
  async findRolesByUserId(userId: number) {
    // 查询用户的角色信息
    return query<any[]>(
      `
      SELECT r.id, r.name, r.code, r.level
      FROM roles r
      JOIN user_role ur ON ur.role_id = r.id
      WHERE ur.user_id = ?
    `,
      [userId]
    );
  },

  async findAll() {
    return query(`SELECT * FROM roles ORDER BY id DESC`);
  },

  async create(data: any) {
    return query(`INSERT INTO roles (name, code) VALUES (?, ?)`, [
      data.name,
      data.code,
    ]);
  },

  async update(id: number, data: any) {
    return query(`UPDATE roles SET name=?, code=? WHERE id=?`, [
      data.name,
      data.code,
      id,
    ]);
  },

  async remove(id: number) {
    return query(`DELETE FROM roles WHERE id=?`, [id]);
  },

  async getRoleUserCount(roleId: number) {
    const rows = await query(
      `SELECT COUNT(*) as count FROM user_role WHERE role_id = ?`,
      [roleId]
    );
    return rows[0].count;
  },

  async getRoleMenus(roleId: number) {
    const rows = await query(
      `SELECT menu_id FROM role_menu WHERE role_id = ?`,
      [roleId]
    );
    // console.log('roleId', roleId);
    // console.log('rows', rows);
    return rows.map((r: { menu_id: number }) => r.menu_id);
  },

  async saveMenus(roleId: number, menuIds: number[]) {
    // console.log(roleId, menuIds);
    await query(`DELETE FROM role_menu WHERE role_id = ?`, [roleId]);
    if (menuIds.length) {
      const values = menuIds.map((id) => [roleId, id]);

      await query(`INSERT INTO role_menu (role_id, menu_id) VALUES ?`, [
        values,
      ]);
    }
  },
};
