import { normalizeRole } from '../config/roleRoutes';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './Admin/AdminDashboard';
import { ManagerDashboard } from './FarmManager/ManagerDashboard';
import { GuestDashboard } from './Guest/GuestDashboard';

// Valid roles: ADMIN | FARM_MANAGER | GUEST  (FARMER removed)
export const RoleDashboard = () => {
  const { user } = useAuth();
  const dashboards = {
    ADMIN: AdminDashboard,
    FARM_MANAGER: ManagerDashboard,
    GUEST: GuestDashboard,
  };
  const Dashboard = dashboards[normalizeRole(user?.role)] || GuestDashboard;
  return <Dashboard />;
};
