import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { normalizeRole } from '../../config/roleRoutes';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const role = normalizeRole(user?.role);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
