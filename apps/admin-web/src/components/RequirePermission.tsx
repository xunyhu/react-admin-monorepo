import { Navigate } from 'react-router-dom';
import { hasPermission } from '@/utils/permission';

interface Props {
  code: string;
  children: React.ReactNode;
}

export default function RequirePermission({ code, children }: Props) {
  if (!hasPermission(code)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
