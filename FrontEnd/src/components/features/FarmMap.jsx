import { MapPin, Navigation } from 'lucide-react';
import { useMemo } from 'react';
import { Card } from '../ui/Card';

const MAPS_EMBED_URL = 'https://www.google.com/maps?q=11.0168,76.9558&z=8&output=embed';

export const FarmMap = ({ farms = [] }) => {
  const centers = useMemo(() => farms.map((farm) => farm.location).join(' • '), [farms]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Field map</p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-gray-100">Google Maps farm locations</h3>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700">
          Live geo view
        </div>
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
        <iframe title="Farm locations" src={MAPS_EMBED_URL} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-600 dark:text-gray-400">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-gray-100">
          <Navigation className="h-4 w-4 text-emerald-700" />
          Managed regions
        </div>
        <p className="mt-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-700" />{centers || 'Coimbatore • Erode • Salem'}</p>
      </div>
    </Card>
  );
};
