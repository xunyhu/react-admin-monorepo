import { useAuthStore } from '@/store/auth';

/**
 * 是否有权限
 */
export function hasPermission(code: string) {
  const permissions = useAuthStore.getState().permissions || [];
  return permissions.includes(code);
}

/**
 * 是否有角色
 */
export function hasRole(role: string) {
  const roles = useAuthStore.getState().roles || [];
  return roles.includes(role);
}

/**
 * 判断是否有任意权限
 */
export function hasAnyPermission(codes: string[]): boolean {
  const permissions = useAuthStore.getState().permissions || [];
  return codes.some((c) => permissions.includes(c));
}
