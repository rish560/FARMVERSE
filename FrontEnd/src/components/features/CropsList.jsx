import { motion } from 'framer-motion';
import { Eye, MapPin, Sprout } from 'lucide-react';

const STATUS_DOT = {
  healthy: 'bg-emerald-500',
  attention: 'bg-amber-500',
  other: 'bg-rose-500',
};

const statusGroup = (status) => {
  if (['Healthy', 'Excellent', 'Active'].includes(status)) return 'healthy';
  if (['Needs Attention', 'Good', 'Average', 'Stable'].includes(status)) return 'attention';
  return 'other';
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const rowFade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// Replaces the generic gray data table for the crops resource -- crops are
// just "name grown at a farm" now, so a photo-forward list reads far better
// than plain table text.
export const CropsList = ({ rows, getCropImage, onView, t }) => {
  if (!rows.length) {
    return (
      <div className="px-5 py-14 text-center text-sm text-gray-500 dark:text-gray-500">
        {t('noRecordsFoundMessage')}
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((item) => {
        const cropName = item.name || item.crop || item.cropName || '';
        const farmName = item.farm || item.farmName || '\u2014';
        const image = getCropImage(cropName);
        const dot = STATUS_DOT[statusGroup(item.status)];

        return (
          <motion.button
            key={item.id || item.cropId}
            type="button"
            variants={rowFade}
            onClick={() => onView(item)}
            className="group flex items-center gap-3.5 rounded-2xl border border-l-4 border-gray-100 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
            style={{ borderLeftColor: dot.includes('emerald') ? '#34d399' : dot.includes('amber') ? '#f59e0b' : '#f43f5e' }}
          >
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 via-lime-50 to-amber-50 dark:from-emerald-900/40 dark:via-slate-800 dark:to-slate-800">
              {image ? (
                <img src={image} alt={cropName} className="h-full w-full object-cover" />
              ) : (
                <Sprout className="h-6 w-6 text-emerald-600" />
              )}
              <span className={`absolute right-1 top-1 h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-900 ${dot}`} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{cropName || '\u2014'}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 shrink-0" />
                {farmName}
              </p>
            </div>

            <Eye className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-emerald-600 dark:text-gray-600" />
          </motion.button>
        );
      })}
    </motion.div>
  );
};
