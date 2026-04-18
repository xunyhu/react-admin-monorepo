import { query } from '../db';

export const UserModel = {
  // 根据用户ID查询用户信息
  async findById(userId: number) {
    const rows = await query<any[]>(
      `
      SELECT id, name, email, status
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
      [userId]
    );

    return rows[0] || null;
  },
  async findByUsername(username: string) {
    const rows = await query<any[]>(
      `
      SELECT id, name, username, password, email, status
      FROM users
      WHERE username = ?
      LIMIT 1
    `,
      [username]
    );

    return rows?.[0] || null;
  },
  // 查询用户角色
  async findRolesByUserId(userId: number) {
    return await query<any[]>(
      `
    SELECT r.*
    FROM roles r
    INNER JOIN user_role ur ON ur.role_id = r.id
    WHERE ur.user_id = ?
    `,
      [userId]
    );
  },
  // 增
  async create(user: {
    name: string;
    username: string;
    password: string;
    email?: string;
  }) {
    const result = await query<any>(
      `
      INSERT INTO users (name, username, password, email, status)
      VALUES (?, ?, ?, ?, 1)
    `,
      [user.name, user.username, user.password, user.email]
    );

    return result.insertId;
  },
  // 删
  async delete(id: number) {
    await query(
      `
      DELETE FROM users WHERE id = ?
    `,
      [id]
    );
  },
  // 改
  async update(
    id: number,
    user: {
      name?: string;
      email?: string;
      status?: number;
    }
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (user.name) {
      fields.push('name = ?');
      values.push(user.name);
    }

    if (user.email) {
      fields.push('email = ?');
      values.push(user.email);
    }

    if (user.status !== undefined) {
      fields.push('status = ?');
      values.push(user.status);
    }

    if (fields.length === 0) return;

    await query(
      `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ?
    `,
      [...values, id]
    );
  },
  // 查
  async findList(params: {
    page: number;
    pageSize: number;
    username?: string;
    status?: number;
  }) {
    const { page, pageSize, username, status } = params;

    const offset = (page - 1) * pageSize;

    let where = 'WHERE 1=1';
    const values: any[] = [];

    if (username) {
      where += ' AND username LIKE ?';
      values.push(`%${username}%`);
    }

    if (status !== undefined) {
      where += ' AND status = ?';
      values.push(status);
    }

    // 查询列表
    const list = await query<any[]>(
      `
        SELECT id, name, username, email, status, created_at
        FROM users
        ${where}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `,
      [...values, pageSize, offset]
    );

    // 查询总数
    const totalResult = await query<any[]>(
      `
        SELECT COUNT(*) as total
        FROM users
        ${where}
      `,
      values
    );

    return {
      list,
      total: totalResult[0].total,
    };
  },
};
