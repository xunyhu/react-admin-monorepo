import { query } from '../db';

export type PageDesignStatus = 'draft' | 'published';

export type PageDesignRow = {
  id: string;
  name: string;
  description: string | null;
  status: PageDesignStatus;
  schema_version: number;
  schema_json: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  created_by: number | null;
  updated_by: number | null;
};

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS page_designs (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description VARCHAR(255) NULL,
      status ENUM('draft','published') NOT NULL DEFAULT 'draft',
      schema_version INT NOT NULL DEFAULT 1,
      schema_json LONGTEXT NOT NULL,
      published_at TIMESTAMP NULL DEFAULT NULL,
      created_by BIGINT NULL,
      updated_by BIGINT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status_updated (status, updated_at),
      INDEX idx_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

let ensured = false;
async function ensureOnce() {
  if (ensured) return;
  ensured = true;
  await ensureTable();
}

export const PageDesignModel = {
  async list(params: {
    page: number;
    pageSize: number;
    q?: string;
    status?: PageDesignStatus;
  }) {
    await ensureOnce();

    const { page, pageSize, q, status } = params;
    const offset = (page - 1) * pageSize;

    let where = 'WHERE 1=1';
    const values: any[] = [];

    if (q) {
      where += ' AND name LIKE ?';
      values.push(`%${q}%`);
    }
    if (status) {
      where += ' AND status = ?';
      values.push(status);
    }

    const list = await query<any[]>(
      `
        SELECT id, name, description, status, schema_version, updated_at
        FROM page_designs
        ${where}
        ORDER BY updated_at DESC
        LIMIT ? OFFSET ?
      `,
      [...values, pageSize, offset]
    );

    const totalResult = await query<any[]>(
      `
        SELECT COUNT(*) as total
        FROM page_designs
        ${where}
      `,
      values
    );

    return { list, total: totalResult?.[0]?.total ?? 0 };
  },

  async findById(id: string) {
    await ensureOnce();
    const rows = await query<PageDesignRow[]>(
      `
        SELECT *
        FROM page_designs
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    );
    return rows?.[0] || null;
  },

  async create(data: {
    id: string;
    name: string;
    description?: string;
    status: PageDesignStatus;
    schemaVersion: number;
    schemaJson: string;
    createdBy?: number | null;
  }) {
    await ensureOnce();

    const publishedAt = data.status === 'published' ? new Date() : null;
    await query(
      `
        INSERT INTO page_designs
          (id, name, description, status, schema_version, schema_json, published_at, created_by, updated_by)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.id,
        data.name,
        data.description ?? null,
        data.status,
        data.schemaVersion,
        data.schemaJson,
        publishedAt,
        data.createdBy ?? null,
        data.createdBy ?? null,
      ]
    );
  },

  async update(
    id: string,
    data: {
      name: string;
      description?: string;
      status: PageDesignStatus;
      schemaVersion: number;
      schemaJson: string;
      updatedBy?: number | null;
    }
  ) {
    await ensureOnce();

    const publishedAt = data.status === 'published' ? new Date() : null;
    await query(
      `
        UPDATE page_designs
        SET
          name = ?,
          description = ?,
          status = ?,
          schema_version = ?,
          schema_json = ?,
          published_at = ?,
          updated_by = ?
        WHERE id = ?
      `,
      [
        data.name,
        data.description ?? null,
        data.status,
        data.schemaVersion,
        data.schemaJson,
        publishedAt,
        data.updatedBy ?? null,
        id,
      ]
    );
  },

  async remove(id: string) {
    await ensureOnce();
    await query(`DELETE FROM page_designs WHERE id = ?`, [id]);
  },
};

