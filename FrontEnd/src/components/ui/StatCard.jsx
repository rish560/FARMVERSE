import { Link } from 'react-router-dom';
import { Card } from './Card';

const ACCENTS = {
  emerald: { chip: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', value: 'text-emerald-700 dark:text-emerald-400', bar: 'from-emerald-400 to-emerald-600' },
  violet: { chip: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400', value: 'text-violet-700 dark:text-violet-400', bar: 'from-violet-400 to-violet-600' },
  sky: { chip: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400', value: 'text-sky-700 dark:text-sky-400', bar: 'from-sky-400 to-sky-600' },
  amber: { chip: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400', value: 'text-amber-700 dark:text-amber-400', bar: 'from-amber-400 to-amber-600' },
  rose: { chip: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400', value: 'text-rose-700 dark:text-rose-400', bar: 'from-rose-400 to-rose-600' },
};

export const StatCard = ({ title, value, subtitle, icon: Icon, to, color = 'emerald' }) => {
  const accent = ACCENTS[color] || ACCENTS.emerald;

  const content = (
    <>
      <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${accent.bar}`} />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.chip}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold tracking-tight ${accent.value}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="block transition hover:-translate-y-0.5">
        <Card className="relative flex flex-col gap-2 cursor-pointer overflow-hidden">
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="relative flex flex-col gap-2 overflow-hidden">
      {content}
    </Card>
  );
};
