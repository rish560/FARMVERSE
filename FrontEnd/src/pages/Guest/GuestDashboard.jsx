import { Eye, MapPin, Wheat } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RoleWorkspace } from '../../components/dashboard/RoleWorkspace';
import { getFarms } from '../../api/farmApi';

export const GuestDashboard = () => {
  const { t } = useLanguage();
  const [counts, setCounts] = useState({ farms: null });

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      const farmsResult = await getFarms().catch(() => null);
      if (cancelled) return;

      setCounts({ farms: farmsResult ? farmsResult.length : null });
    };

    loadCounts();
    return () => { cancelled = true; };
  }, []);

  const formatCount = (value) => (value === null ? '—' : String(value));

  return (
    <RoleWorkspace
      eyebrow={t('guestEyebrow')}
      title={t('guestTitle')}
      summary={t('guestSummary')}
      heroIcon={Eye}
      heroColor="amber"
      stats={[
        { title: t('statFarmsAvailable'), value: formatCount(counts.farms), icon: MapPin, to: '/dashboard/farms', color: 'amber' },
      ]}
      actions={[
        { label: t('viewFarms'), to: '/dashboard/farms', icon: MapPin },
        { label: t('viewCrops'), to: '/dashboard/crops', icon: Wheat },
      ]}
    />
  );
};
