import { useAuthStore } from '@/store/auth';

export function usePermission() {
  const permissions = useAuthStore((s) => s.permissions);

  const hasPermission = (code: string) => {
    return permissions.includes(code);
  };

  const hasAny = (codes: string[]) => {
    return codes.some((c) => permissions.includes(c));
  };

  return {
    hasPermission,
    hasAny,
  };
}
