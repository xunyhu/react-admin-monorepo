import type { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: '无线蓝牙耳机',
    category: '数码',
    price: 299.0,
    stock: 120,
    status: 1,
    created_at: '2026-01-10 10:00:00',
  },
  {
    id: 2,
    name: '纯棉 T 恤',
    category: '服装',
    price: 89.0,
    stock: 500,
    status: 1,
    created_at: '2026-01-11 14:30:00',
  },
  {
    id: 3,
    name: '有机坚果礼盒',
    category: '食品',
    price: 158.0,
    stock: 80,
    status: 0,
    created_at: '2026-01-12 09:15:00',
  },
  {
    id: 4,
    name: '北欧风台灯',
    category: '家居',
    price: 199.0,
    stock: 45,
    status: 1,
    created_at: '2026-01-13 16:20:00',
  },
  {
    id: 5,
    name: '前端架构实战',
    category: '图书',
    price: 68.0,
    stock: 200,
    status: 1,
    created_at: '2026-01-14 11:45:00',
  },
];

export function filterMockProducts(params: {
  page: number;
  pageSize: number;
  name?: string;
  category?: string;
  status?: number;
}) {
  const { page, pageSize, name, category, status } = params;

  let filtered = [...mockProducts];

  if (name) {
    filtered = filtered.filter((item) => item.name.includes(name));
  }

  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (status !== undefined) {
    filtered = filtered.filter((item) => item.status === status);
  }

  const start = (page - 1) * pageSize;

  return {
    list: filtered.slice(start, start + pageSize),
    total: filtered.length,
  };
}
