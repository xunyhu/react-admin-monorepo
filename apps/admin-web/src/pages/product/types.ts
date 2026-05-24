export type ProductStatus = 0 | 1;

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  created_at?: string;
  updated_at?: string;
}

export interface ProductListParams {
  page: number;
  pageSize: number;
  name?: string;
  category?: string;
  status?: ProductStatus;
}

export interface ProductListResult {
  list: Product[];
  total: number;
}

export interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
}

export interface ProductSearchValues {
  name?: string;
  category?: string;
  status?: ProductStatus;
}

export const PRODUCT_STATUS_OPTIONS = [
  { label: '上架', value: 1 as ProductStatus },
  { label: '下架', value: 0 as ProductStatus },
];

export const PRODUCT_CATEGORY_OPTIONS = [
  { label: '数码', value: '数码' },
  { label: '服装', value: '服装' },
  { label: '食品', value: '食品' },
  { label: '家居', value: '家居' },
  { label: '图书', value: '图书' },
];
