import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { SmartAlertsPanel } from '../components/features/SmartAlertsPanel';
import { FarmMap } from '../components/features/FarmMap';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { farms } from '../mock/data';

export const RecordFormPage = ({ type }) => {
  const [saved, setSaved] = useState(false);
  const label = type === 'farm' ? 'Farm' : 'Crop';
  return (
    <Card className="max-w-3xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400">Farm management</p>
        <h2 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">Add {label}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a record for one of your assigned farms.</p>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); setSaved(true); }} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} name
          <input required className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-900" placeholder={`Enter ${label.toLowerCase()} name`} />
        </label>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {type === 'farm' ? 'Location' : 'Assigned farm'}
          <input required className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-900" placeholder={type === 'farm' ? 'City or region' : 'Select farm'} />
        </label>
        {type === 'farm' && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 md:col-span-2">
            Current Crop / Crop Data
            <input className="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-900" placeholder="e.g. Tomato, Rice, Wheat" />
          </label>
        )}
        <div className="md:col-span-2">
          <Button type="submit">Save {label}</Button>
        </div>
      </form>
      {saved && (
        <p className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" /> {label} form is complete.
        </p>
      )}
    </Card>
  );
};

export const FarmMapPage = () => <FarmMap farms={farms} />;
export const NotificationsPage = () => (
  <div className="space-y-6">
    <Card className="border-rose-100 dark:border-rose-500/30 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(255,241,242,0.9))] dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(76,5,25,0.3))]">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-400">Alerts &amp; Reminders</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-gray-100">Stay ahead of your farms</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-gray-400">
        Real-time alerts generated from your farms&apos; live weather, sowing and harvesting dates, and status &mdash; nothing here is pre-written or fake.
      </p>
    </Card>
    <SmartAlertsPanel />
  </div>
);
