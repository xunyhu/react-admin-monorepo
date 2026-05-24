import { query } from '../db';

export interface ProductRow {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface ProductListParams {
  page: number;
  pageSize: number;
  name?: string;
  category?: string;
  status?: number;
}

export interface ProductPayload {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: number;
}

export const ProductModel = {
  async findList(params: ProductListParams) {
    const { page, pageSize, name, category, status } = params;
    const offset = (page - 1) * pageSize;

    let where = 'WHERE 1=1';
    const values: Array<string | number> = [];

    if (name) {
      where += ' AND name LIKE ?';
      values.push(`%${name}%`);
    }

    if (category) {
      where += ' AND category = ?';
      values.push(category);
    }

    if (status !== undefined) {
      where += ' AND status = ?';
      values.push(status);
    }

    const list = await query<ProductRow[]>(
      `
      SELECT id, name, category, price, stock, status, created_at, updated_at
      FROM products
      ${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [...values, pageSize, offset]
    );

    const totalResult = await query<Array<{ total: number }>>(
      `
      SELECT COUNT(*) AS total
      FROM products
      ${where}
      `,
      values
    );

    return {
      list,
      total: totalResult[0]?.total ?? 0,
    };
  },

  async findById(id: number) {
    const rows = await query<ProductRow[]>(
      `
      SELECT id, name, category, price, stock, status, created_at, updated_at
      FROM products
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  },

  async create(data: ProductPayload) {
    const result = await query<{ insertId: number }>(
      `
      INSERT INTO products (name, category, price, stock, status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [data.name, data.category, data.price, data.stock, data.status]
    );

    return result.insertId;
  },

  async update(id: number, data: Partial<ProductPayload>) {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }

    if (data.category !== undefined) {
      fields.push('category = ?');
      values.push(data.category);
    }

    if (data.price !== undefined) {
      fields.push('price = ?');
      values.push(data.price);
    }

    if (data.stock !== undefined) {
      fields.push('stock = ?');
      values.push(data.stock);
    }

    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }

    if (fields.length === 0) return;

    await query(
      `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = ?
      `,
      [...values, id]
    );
  },

  async delete(id: number) {
    await query(`DELETE FROM products WHERE id = ?`, [id]);
  },
};
