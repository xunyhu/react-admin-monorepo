import { PageDesignModel, type PageDesignStatus } from '../models/pageDesign.model';

function isStatus(v: any): v is PageDesignStatus {
  return v === 'draft' || v === 'published';
}

function toMillis(ts: any) {
  const d = ts instanceof Date ? ts : new Date(ts);
  const n = d.getTime();
  return Number.isFinite(n) ? n : Date.now();
}

export const PageDesignService = {
  async list(params: {
    page: number;
    pageSize: number;
    q?: string;
    status?: string;
  }) {
    const { page, pageSize, q } = params;
    const status = params.status && isStatus(params.status) ? params.status : undefined;

    const data = await PageDesignModel.list({ page, pageSize, q, status });

    return {
      list: data.list.map((x) => ({
        id: x.id,
        name: x.name,
        description: x.description,
        status: x.status,
        schemaVersion: x.schema_version,
        updatedAt: toMillis(x.updated_at),
      })),
      total: data.total,
    };
  },

  async getById(id: string) {
    const row = await PageDesignModel.findById(id);
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status,
      schemaVersion: row.schema_version,
      schema: JSON.parse(row.schema_json || '{"blocks":[]}'),
      createdAt: toMillis(row.created_at),
      updatedAt: toMillis(row.updated_at),
      publishedAt: row.published_at ? toMillis(row.published_at) : null,
    };
  },

  async create(input: {
    name: string;
    description?: string;
    status?: string;
    schemaVersion?: number;
    schema: any;
    createdBy?: number | null;
  }) {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const status: PageDesignStatus = isStatus(input.status) ? input.status : 'draft';
    const schemaVersion = Number.isFinite(input.schemaVersion) ? Number(input.schemaVersion) : 1;
    const schemaJson = JSON.stringify(input.schema ?? { blocks: [] });

    await PageDesignModel.create({
      id,
      name: input.name,
      description: input.description,
      status,
      schemaVersion,
      schemaJson,
      createdBy: input.createdBy ?? null,
    });

    return id;
  },

  async update(
    id: string,
    input: {
      name: string;
      description?: string;
      status?: string;
      schemaVersion?: number;
      schema: any;
      updatedBy?: number | null;
    }
  ) {
    const status: PageDesignStatus = isStatus(input.status) ? input.status : 'draft';
    const schemaVersion = Number.isFinite(input.schemaVersion) ? Number(input.schemaVersion) : 1;
    const schemaJson = JSON.stringify(input.schema ?? { blocks: [] });

    await PageDesignModel.update(id, {
      name: input.name,
      description: input.description,
      status,
      schemaVersion,
      schemaJson,
      updatedBy: input.updatedBy ?? null,
    });
  },

  async remove(id: string) {
    await PageDesignModel.remove(id);
  },
};

