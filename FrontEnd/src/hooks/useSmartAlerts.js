import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFarms } from '../api/farmApi';
import { getFarmWeather } from '../api/weatherApi';
import { buildFarmAlerts, sortAlerts } from '../utils/smartAlerts';

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

/**
 * Shared alert-fetching hook -- used by both the sidebar bell badge (just
 * needs the count) and the full Notifications page (needs the full list).
 * Keeping this in one place means both always agree on what counts as an
 * alert, instead of two separate implementations drifting apart.
 */
export const useSmartAlerts = () => {
  const { user, role } = useAuth();
  const [alerts, setAlerts] = useState(null); // null = loading
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Guests don't get operational alerts (same rule as the bell icon click handler).
    if (role === 'GUEST') {
      setAlerts([]);
      return undefined;
    }

    const load = async () => {
      try {
        const allFarms = await getFarms();
        if (cancelled) return;

        const scopedFarms =
          role === 'ADMIN' ? allFarms : allFarms.filter((f) => belongsToManager(f, user));

        const farmsWithLocation = scopedFarms.filter((f) => f.location);

        const weatherResults = await Promise.allSettled(
          farmsWithLocation.map((f) => getFarmWeather(f.location))
        );

        if (cancelled) return;

        const weatherByFarmId = new Map();
        farmsWithLocation.forEach((f, i) => {
          const result = weatherResults[i];
          weatherByFarmId.set(f.id, result.status === 'fulfilled' ? result.value : null);
        });

        const allAlerts = scopedFarms.flatMap((f) =>
          buildFarmAlerts(f, weatherByFarmId.get(f.id) || null)
        );

        setAlerts(sortAlerts(allAlerts));
      } catch {
        if (!cancelled) setError(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, role]);

  return { alerts, error, loading: alerts === null && !error };
};
