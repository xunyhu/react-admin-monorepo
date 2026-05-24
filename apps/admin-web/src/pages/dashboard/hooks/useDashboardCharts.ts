import { useCallback, useEffect, useState } from 'react';

import { getDashboardCharts } from '@/api/dashboard';
import type { DashboardChartsData } from '../types';

const emptyChartsData: DashboardChartsData = {
  orderTrend: [],
  userTrend: [],
  topProducts: [],
  categoryStats: [],
  lowStock: [],
  realtime: {
    recentOrders: [],
    recentPayments: [],
    recentUsers: [],
  },
};

export function useDashboardCharts() {
  const [data, setData] = useState<DashboardChartsData>(emptyChartsData);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getDashboardCharts();
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
