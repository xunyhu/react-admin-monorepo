import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';

import {
  getMemberList,
  updateMember,
  updateMemberStatus,
} from '@/api/member';
import type { MemberFormValues, MemberItem, MemberSearchValues } from '../types';

export function useMemberList() {
  const [list, setList] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<MemberSearchValues>({});

  const loadData = useCallback(
    async (
      nextPage = page,
      nextPageSize = pageSize,
      params: MemberSearchValues = searchParams
    ) => {
      setLoading(true);

      try {
        const { dateRange, ...rest } = params;
        const res = await getMemberList({
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

  const handleSearch = (values: MemberSearchValues) => {
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

  const handleUpdate = async (id: number, values: MemberFormValues) => {
    await updateMember(id, values);
    message.success('会员信息已更新');
    loadData(page, pageSize, searchParams);
  };

  const handleDisable = async (id: number) => {
    await updateMemberStatus(id, { status: 'disabled' });
    message.success('会员已禁用');
    loadData(page, pageSize, searchParams);
  };

  const handleEnable = async (id: number) => {
    await updateMemberStatus(id, { status: 'active' });
    message.success('会员已启用');
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
    handleUpdate,
    handleDisable,
    handleEnable,
    refresh,
  };
}
