import { Navigate } from 'react-router-dom';
import { getToken } from '@/utils/auth';

export const RequireAuth = ({ children }: any) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
