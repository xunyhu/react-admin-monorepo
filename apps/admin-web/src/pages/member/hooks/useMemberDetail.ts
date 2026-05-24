import { useCallback, useEffect, useState } from 'react';

import { getMemberDetail } from '@/api/member';
import type { MemberDetail } from '../types';

export function useMemberDetail(id: number | undefined) {
  const [detail, setDetail] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      const res = await getMemberDetail(id);
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
