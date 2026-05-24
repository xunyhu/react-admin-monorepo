import { useCallback, useEffect, useState } from 'react';

import { getOrderDetail } from '@/api/order';
import type { OrderDetail } from '../types';

export function useOrderDetail(id: number | undefined) {
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      const res = await getOrderDetail(id);
      setDetail(res.data);
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  return {
    detail,
    loading,
    refresh: loadDetail,
  };
}
