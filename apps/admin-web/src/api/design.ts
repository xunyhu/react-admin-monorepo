import request from '@/utils/request';

export type DesignStatus = 'draft' | 'published';

export type DesignListItem = {
  id: string;
  name: string;
  description?: string | null;
  status: DesignStatus;
  schemaVersion: number;
  updatedAt: number;
};

export type DesignSchema = {
  blocks: Array<{ id: string; type: string; props: Record<string, any> }>;
};

export function getDesignPages(params?: {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: DesignStatus;
}) {
  return request.get('/design/pages', { params });
}

export function createDesignPage(data: {
  name: string;
  description?: string;
  status: DesignStatus;
  schemaVersion?: number;
  schema: DesignSchema;
}) {
  return request.post('/design/pages', data);
}

export function getDesignPageDetail(id: string) {
  return request.get(`/design/pages/${encodeURIComponent(id)}`);
}

export function updateDesignPage(
  id: string,
  data: {
    name: string;
    description?: string;
    status: DesignStatus;
    schemaVersion?: number;
    schema: DesignSchema;
  }
) {
  return request.put(`/design/pages/${encodeURIComponent(id)}`, data);
}

export function deleteDesignPage(id: string) {
  return request.delete(`/design/pages/${encodeURIComponent(id)}`);
}

