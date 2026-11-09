import { BarChart3, MapPin, ShieldCheck, Users, Wheat } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RoleWorkspace } from '../../components/dashboard/RoleWorkspace';
import { getFarms } from '../../api/farmApi';
import { getUsers } from '../../api/userApi';

export const AdminDashboard = () => {
  const { t } = useLanguage();
  const [counts, setCounts] = useState({ users: null, farms: null });

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      const [usersResult, farmsResult] = await Promise.allSettled([
        getUsers(),
        getFarms(),
      ]);

      if (cancelled) return;

      setCounts({
        users: usersResult.status === 'fulfilled' ? (usersResult.value || []).length : null,
        farms: farmsResult.status === 'fulfilled' ? (farmsResult.value || []).length : null,
      });
    };

    loadCounts();
    return () => { cancelled = true; };
  }, []);

  const formatCount = (value) => (value === null ? '—' : String(value));

  return (
    <RoleWorkspace
      eyebrow={t('adminEyebrow')}
      title={t('adminTitle')}
      summary={t('adminSummary')}
      heroIcon={ShieldCheck}
      heroColor="violet"
      stats={[
        { title: t('statRegisteredUsers'), value: formatCount(counts.users), icon: Users, to: '/dashboard/users', color: 'violet' },
        { title: t('statManagedFarms'), value: formatCount(counts.farms), icon: MapPin, to: '/dashboard/farms', color: 'emerald' },
      ]}
      actions={[
        { label: t('manageUsers'), to: '/dashboard/users', icon: Users },
        { label: t('viewAdmins'), to: '/dashboard/admins', icon: Users },
        { label: t('actionFarmManagers'), to: '/dashboard/farm-managers', icon: Users },
        { label: t('viewGuests'), to: '/dashboard/guests', icon: Users },
        { label: t('actionManageFarms'), to: '/dashboard/farms', icon: MapPin },
        { label: t('viewCrops'), to: '/dashboard/crops', icon: Wheat },
      ]}
    />
  );
};
