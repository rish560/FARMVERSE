import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Unauthorized } from '../pages/Unauthorized';
import { ManagerDashboard } from '../pages/FarmManager/ManagerDashboard';
import { AdminDashboard } from '../pages/Admin/AdminDashboard';
import { roleRoutes, normalizeRole } from '../config/roleRoutes';

// Valid roles: ADMIN | FARM_MANAGER | GUEST  (FARMER removed)
const roleHomeMap = {
  FARM_MANAGER: roleRoutes.FARM_MANAGER,
  ADMIN: roleRoutes.ADMIN,
  GUEST: roleRoutes.GUEST,
};

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/unauthorized', element: <Unauthorized /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['FARM_MANAGER', 'ADMIN', 'GUEST', 'USER']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={roleRoutes.ADMIN} replace /> },
      { path: 'manager', element: <ManagerDashboard /> },
      { path: 'admin', element: <AdminDashboard /> },
    ],
  },
  { path: '*', element: <div className="flex min-h-screen items-center justify-center text-2xl font-semibold text-slate-700">404 • Page not found</div> },
]);

export const getRoleHomeRoute = (role) => roleHomeMap[normalizeRole(role)] || '/login';

