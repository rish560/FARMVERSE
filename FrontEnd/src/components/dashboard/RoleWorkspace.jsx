import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../ui/Card';
import { StatCard } from '../ui/StatCard';

const ACTION_CHIP_COLORS = [
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
  'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400',
];

const HERO_GRADIENTS = {
  emerald: 'from-emerald-600 via-green-600 to-emerald-700 shadow-emerald-900/20',
  violet: 'from-violet-600 via-purple-600 to-violet-700 shadow-violet-900/20',
  sky: 'from-sky-600 via-blue-600 to-sky-700 shadow-sky-900/20',
  amber: 'from-amber-500 via-orange-500 to-amber-600 shadow-amber-900/20',
};

// heroColor: 'emerald' | 'violet' | 'sky' | 'amber' -- lets each role's
// dashboard have its own signature hero color, matching the same bold
// gradient + texture treatment used on the farm/crop detail views.
export const RoleWorkspace = ({ eyebrow, title, summary, stats, actions, heroIcon: HeroIcon, heroColor = 'emerald' }) => {
  const { t } = useLanguage();
  const gradient = HERO_GRADIENTS[heroColor] || HERO_GRADIENTS.emerald;

  return (
    <div className="space-y-6">
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} px-6 py-8 text-white shadow-lg sm:px-8`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(120deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 28px)',
          }}
        />
        <div className="relative flex items-start gap-4">
          {HeroIcon && (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <HeroIcon className="h-7 w-7" />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">{eyebrow}</p>
            <h2 className="mt-1 text-3xl font-bold leading-tight">{title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85">{summary}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title: label, value, icon, to, color }) => <StatCard key={label} title={label} value={value} subtitle={t('liveWorkspaceMetric')} icon={icon} to={to} color={color} />)}
      </div>

      <Card className="space-y-4">
        <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400">{t('quickWork')}</p><h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-gray-100">{t('openWorkspace')}</h3></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map(({ label, to, icon: Icon }, i) => (
            <Link key={to} to={to} className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm font-medium text-slate-700 dark:text-gray-300 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 dark:hover:border-emerald-500/40 hover:bg-emerald-50 hover:shadow-md dark:hover:bg-emerald-500/10">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${ACTION_CHIP_COLORS[i % ACTION_CHIP_COLORS.length]}`}>
                <Icon className="h-4.5 w-4.5" />
              </span>
              <p className="mt-3">{label}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};
