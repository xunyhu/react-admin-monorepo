import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';

import { deleteProduct, getProducts } from '@/api/product';
import type { Product, ProductSearchValues } from './types';

export function useProductList() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<ProductSearchValues>({});

  const loadData = useCallback(
    async (
      nextPage = page,
      nextPageSize = pageSize,
      params: ProductSearchValues = searchParams
    ) => {
      setLoading(true);

      try {
        const res = await getProducts({
          page: nextPage,
          pageSize: nextPageSize,
          ...params,
        });

        setList(res.data.list);
        setTotal(res.data.total);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchParams]
  );

  useEffect(() => {
    loadData(1, pageSize, {});
  }, []);

  const handleSearch = (values: ProductSearchValues) => {
    setSearchParams(values);
    setPage(1);
    loadData(1, pageSize, values);
  };

  const handleReset = () => {
    setSearchParams({});
    setPage(1);
    loadData(1, pageSize, {});
  };

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
    loadData(nextPage, nextPageSize, searchParams);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    message.success('删除成功');
    loadData(page, pageSize, searchParams);
  };

  const refresh = () => {
    loadData(page, pageSize, searchParams);
  };

  return {
    list,
    loading,
    page,
    pageSize,
    total,
    handleSearch,
    handleReset,
    handlePageChange,
    handleDelete,
    refresh,
  };
}
