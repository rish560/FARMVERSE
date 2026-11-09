import { BarChart3, MapPin, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { RoleWorkspace } from '../../components/dashboard/RoleWorkspace';
import { getFarms } from '../../api/farmApi';

// Matches a farm record to the currently logged-in Farm Manager,
// using the same ownership fields RecordManagement.jsx relies on.
const belongsToManager = (record, user) => {
  if (!record || !user) return false;
  const userIdStr = String(user.id || '').toLowerCase();
  const userNameStr = String(user.fullName || user.name || user.username || '').toLowerCase().trim();
  const userEmailStr = String(user.email || '').toLowerCase().trim();

  const ownerId = String(record.ownerId || record.owner_id || '').toLowerCase();
  const ownerName = String(record.owner || record.manager || record.farmerName || '').toLowerCase().trim();
  const ownerEmail = String(record.ownerEmail || '').toLowerCase().trim();

  return (
    (userIdStr && ownerId === userIdStr) ||
    (userNameStr && ownerName.includes(userNameStr)) ||
    (userEmailStr && (ownerEmail.includes(userEmailStr) || ownerName.includes(userEmailStr)))
  );
};

export const ManagerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [counts, setCounts] = useState({ farms: null });

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      const farmsResult = await getFarms().catch(() => null);
      if (cancelled) return;

      const myFarms = farmsResult
        ? farmsResult.filter((farm) => belongsToManager(farm, user))
        : null;

      setCounts({ farms: myFarms ? myFarms.length : null });
    };

    loadCounts();
    return () => { cancelled = true; };
  }, [user]);

  const formatCount = (value) => (value === null ? '—' : String(value));

  return (
    <RoleWorkspace
      eyebrow={t('managerEyebrow')}
      title={t('managerTitle')}
      summary={t('managerSummary')}
      heroIcon={UserCog}
      heroColor="sky"
      stats={[
        { title: t('statAssignedFarms'), value: formatCount(counts.farms), icon: MapPin, to: '/dashboard/my-farms', color: 'sky' },
      ]}
      actions={[
        { label: t('myFarms'), to: '/dashboard/my-farms', icon: MapPin },
        { label: t('actionCropProduction'), to: '/dashboard/production', icon: BarChart3 },
        { label: t('viewFarms'), to: '/dashboard/farms', icon: MapPin },
      ]}
    />
  );
};
