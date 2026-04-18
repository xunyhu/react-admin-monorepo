import { hasPermission } from '@/utils/permission';

interface Props {
  code: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function Permission({ code, children, fallback = null }: Props) {
  if (!hasPermission(code)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
