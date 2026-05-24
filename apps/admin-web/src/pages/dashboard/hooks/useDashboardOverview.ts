import { useCallback, useEffect, useState } from 'react';

import { getDashboardOverview } from '@/api/dashboard';
import type { DashboardOverview } from '../types';

export function useDashboardOverview() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getDashboardOverview();
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
