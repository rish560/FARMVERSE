import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, CloudRain, Sprout, Wheat } from 'lucide-react';
import { useState } from 'react';
import { useSmartAlerts } from '../../hooks/useSmartAlerts';

const SEVERITY_STYLES = {
  urgent: {
    accentBorder: 'border-l-rose-500',
    bg: 'bg-rose-50/60 dark:bg-rose-500/5',
    iconWrap: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
    badge: 'bg-rose-600 text-white',
    label: 'Urgent',
    tab: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
  warning: {
    accentBorder: 'border-l-amber-500',
    bg: 'bg-amber-50/60 dark:bg-amber-500/5',
    iconWrap: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    badge: 'bg-amber-500 text-white',
    label: 'Attention',
    tab: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  info: {
    accentBorder: 'border-l-sky-500',
    bg: 'bg-sky-50/60 dark:bg-sky-500/5',
    iconWrap: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
    badge: 'bg-sky-500 text-white',
    label: 'Info',
    tab: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
    dot: 'bg-sky-500',
  },
};

const TYPE_ICON = {
  weather: CloudRain,
  harvest: Wheat,
  sowing: Sprout,
  status: AlertTriangle,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardFade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const SmartAlertsPanel = () => {
  const { alerts, loading, error } = useSmartAlerts();
  const [filter, setFilter] = useState('all');

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-400">
        Could not load alerts right now. Please try again later.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-12 text-center dark:border-emerald-900/40 dark:bg-slate-900">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </span>
        <p className="text-base font-semibold text-emerald-800 dark:text-emerald-300">All clear</p>
        <p className="max-w-xs text-xs text-emerald-700/80 dark:text-emerald-400/80">
          No weather, harvesting, sowing, or farm-status alerts right now. We'll let you know the moment something needs your attention.
        </p>
      </div>
    );
  }

  const urgentCount = alerts.filter((a) => a.severity === 'urgent').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const infoCount = alerts.filter((a) => a.severity === 'info').length;

  const visibleAlerts = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);

  const TABS = [
    { key: 'all', label: 'All', count: alerts.length, tone: 'bg-gray-900 text-white dark:bg-slate-100 dark:text-slate-900' },
    { key: 'urgent', label: 'Urgent', count: urgentCount, tone: SEVERITY_STYLES.urgent.tab },
    { key: 'warning', label: 'Attention', count: warningCount, tone: SEVERITY_STYLES.warning.tab },
    { key: 'info', label: 'Info', count: infoCount, tone: SEVERITY_STYLES.info.tab },
  ].filter((tab) => tab.key === 'all' || tab.count > 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === tab.key ? tab.tone : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label} <span className="opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      <motion.div key={filter} variants={container} initial="hidden" animate="show" className="space-y-3">
        {visibleAlerts.map((alert) => {
          const style = SEVERITY_STYLES[alert.severity];
          const Icon = TYPE_ICON[alert.type] || AlertTriangle;

          return (
            <motion.div
              key={alert.id}
              variants={cardFade}
              className={`flex items-start gap-4 rounded-2xl border border-gray-100 border-l-4 p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 ${style.accentBorder} ${style.bg}`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.iconWrap}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{alert.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.badge}`}>
                    {style.label}
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-gray-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {alert.farmName}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-gray-600 dark:text-gray-400">{alert.message}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
