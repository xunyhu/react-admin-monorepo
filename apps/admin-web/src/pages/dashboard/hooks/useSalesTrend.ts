import { useCallback, useEffect, useState } from 'react';

import { getSalesTrend } from '@/api/dashboard';
import type { SalesTrendItem } from '../types';

export function useSalesTrend() {
  const [data, setData] = useState<SalesTrendItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getSalesTrend();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    refresh: loadData,
  };
}
