import { motion } from 'framer-motion';
import { Droplets, MapPin, Ruler, Sprout, User, Wheat } from 'lucide-react';
import { FarmForecastStrip } from './FarmForecastStrip';

const STATUS_STYLES = {
  healthy: { pill: 'bg-white/15 text-white border-white/30', dot: 'bg-emerald-300' },
  attention: { pill: 'bg-white/15 text-white border-white/30', dot: 'bg-amber-300' },
  other: { pill: 'bg-white/15 text-white border-white/30', dot: 'bg-rose-300' },
};

const statusGroup = (status) => {
  if (['Healthy', 'Excellent', 'Active'].includes(status)) return 'healthy';
  if (['Needs Attention', 'Good', 'Average', 'Stable'].includes(status)) return 'attention';
  return 'other';
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const fieldFade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// A single field row: icon chip + label + value, the repeating unit that
// gives this view its "farm record ledger" character.
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

export const FarmDetailView = ({ record, t, translateStatusValue }) => {
  const group = statusGroup(record.status);
  const tone = STATUS_STYLES[group];
  const sowing = formatDate(record.sowingDate);
  const harvesting = formatDate(record.harvestingDate);
  const statusLabel = translateStatusValue(t, 'farms', 'status', record.status) || record.status;

  return (
    <div className="space-y-5">
      {/* Hero header -- the one bold element; everything below stays quiet */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 px-6 py-7 text-white shadow-lg shadow-emerald-900/10"
      >
        {/* Ambient field-row texture, quiet in the background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(120deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 28px)',
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Sprout className="h-7 w-7" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-50/80">
                {record.currentCrop || t('cropCurrentCropLabel')}
              </p>
              <h3 className="text-2xl font-bold leading-tight">{record.name || record.farmName}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-emerald-50/90">
                <MapPin className="h-3.5 w-3.5" />
                {record.location}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${tone.pill}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
            {statusLabel}
          </span>
        </div>
      </motion.div>

      {/* Field ledger */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2">
        <FieldRow icon={User} label={t('farmerNameLabel')} value={record.farmerName || record.owner} />
        <FieldRow icon={Ruler} label={t('areaLabel').replace(/\s*\(.*\)$/, '')} value={record.area} />
        <FieldRow icon={Droplets} label={t('waterSourceLabel')} value={record.waterSource} accent="sky" />
        <FieldRow icon={Wheat} label={t('cropCurrentCropLabel')} value={record.currentCrop} />
        <FieldRow icon={Sprout} label={t('sowingDateLabel')} value={sowing} accent="amber" />
        <FieldRow icon={Wheat} label={t('harvestingDateLabel')} value={harvesting} accent="amber" />
      </motion.div>

      {/* Live forecast for the farm's location */}
      {record.location && <FarmForecastStrip location={record.location} />}
    </div>
  );
};
