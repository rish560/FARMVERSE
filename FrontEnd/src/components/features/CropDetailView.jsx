import { motion } from 'framer-motion';
import { CalendarClock, MapPin, Sprout, Wheat } from 'lucide-react';

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const fieldFade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const FieldRow = ({ icon: Icon, label, value, accent = 'emerald' }) => (
  <motion.div
    variants={fieldFade}
    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900"
  >
    <span
      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        accent === 'amber'
          ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
          : accent === 'sky'
          ? 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400'
          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
      }`}
    >
      <Icon className="h-4.5 w-4.5" />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{value || '\u2014'}</p>
    </div>
  </motion.div>
);

// Focused crop detail view: crop name, farm, sowing date, harvesting date --
// exactly what a "crop" is now that it's derived from a farm's currentCrop
// field, instead of the old stale fields (growth stage, health, yield) that
// no longer exist on the record.
export const CropDetailView = ({ record, t }) => {
  const sowing = formatDate(record.sowingDate);
  const harvesting = formatDate(record.harvestingDate);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 px-6 py-7 text-white shadow-lg shadow-amber-900/10"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(120deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 28px)',
          }}
        />
        <div className="relative flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Wheat className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-50/80">
              {t('cropColumnLabel')}
            </p>
            <h3 className="text-2xl font-bold leading-tight">{record.name || record.crop || '\u2014'}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-amber-50/90">
              <MapPin className="h-3.5 w-3.5" />
              {record.farm || record.farmName || '\u2014'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2">
        <FieldRow icon={Sprout} label={t('sowingDateLabel')} value={sowing} accent="emerald" />
        <FieldRow icon={CalendarClock} label={t('harvestingDateLabel')} value={harvesting} accent="amber" />
      </motion.div>
    </div>
  );
};
