import request from '@/utils/request';
import type {
  Product,
  ProductFormValues,
  ProductListParams,
  ProductListResult,
} from '@/pages/product/types';

export const getProducts = (params: ProductListParams) =>
  request.get<ProductListResult>('/products', { params });

export const createProduct = (data: ProductFormValues) =>
  request.post<{ id: number }>('/products', data);

export const updateProduct = (id: number, data: ProductFormValues) =>
  request.put(`/products/${id}`, data);

export const deleteProduct = (id: number) => request.delete(`/products/${id}`);

export type { Product, ProductFormValues, ProductListParams, ProductListResult };
