import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';

import {
  closeOrder,
  deleteOrder,
  getOrderList,
  shipOrder,
} from '@/api/order';
import type { OrderItem, OrderSearchValues } from '../types';

export function useOrderList() {
  const [list, setList] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<OrderSearchValues>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const loadData = useCallback(
    async (
      nextPage = page,
      nextPageSize = pageSize,
      params: OrderSearchValues = searchParams
    ) => {
      setLoading(true);

      try {
        const { dateRange, ...rest } = params;
        const res = await getOrderList({
          page: nextPage,
          pageSize: nextPageSize,
          ...rest,
          startTime: dateRange?.[0],
          endTime: dateRange?.[1],
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

  const handleSearch = (values: OrderSearchValues) => {
    setSearchParams(values);
    setPage(1);
    setSelectedRowKeys([]);
    loadData(1, pageSize, values);
  };

  const handleReset = () => {
    setSearchParams({});
    setPage(1);
    setSelectedRowKeys([]);
    loadData(1, pageSize, {});
  };

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
    loadData(nextPage, nextPageSize, searchParams);
  };

  const handleShip = async (id: number) => {
    await shipOrder(id);
    message.success('发货成功');
    loadData(page, pageSize, searchParams);
  };

  const handleClose = async (id: number) => {
    await closeOrder(id);
    message.success('订单已关闭');
    loadData(page, pageSize, searchParams);
  };

  const handleDelete = async (id: number) => {
    await deleteOrder(id);
    message.success('删除成功');
    setSelectedRowKeys((keys) => keys.filter((key) => key !== id));
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
    selectedRowKeys,
    setSelectedRowKeys,
    handleSearch,
    handleReset,
    handlePageChange,
    handleShip,
    handleClose,
    handleDelete,
    refresh,
  };
}
