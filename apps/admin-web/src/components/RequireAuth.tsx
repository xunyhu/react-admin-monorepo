import { Navigate } from 'react-router-dom';
import { getToken } from '@/utils/auth';
import { JSX } from 'react';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
