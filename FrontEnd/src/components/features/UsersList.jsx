import { motion } from 'framer-motion';
import { Mail, Pencil, Phone, Trash2 } from 'lucide-react';

const ROLE_BADGE = {
  Admin: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-800',
  'Farm Manager': 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-800',
  Guest: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

const AVATAR_GRADIENT = {
  Admin: 'bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-sm shadow-violet-500/30',
  'Farm Manager': 'bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-sm shadow-sky-500/30',
  Guest: 'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-sm shadow-slate-500/20',
};

const ROW_ACCENT = {
  Admin: 'hover:bg-violet-50/40 dark:hover:bg-violet-500/5',
  'Farm Manager': 'hover:bg-sky-50/40 dark:hover:bg-sky-500/5',
  Guest: 'hover:bg-slate-50 dark:hover:bg-slate-800/30',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

const rowFade = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const initials = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';

// Replaces the generic gray data table (and the earlier card-grid layout)
// for the users resource (Admins, Farm Managers, Guests, Manage Users) with
// a clean, role-colored, sticky-header table.
export const UsersList = ({ rows, canEdit, canDelete, onEdit, onDelete, roleLabel, t }) => {
  if (!rows.length) {
    return (
      <div className="px-5 py-14 text-center text-sm text-gray-500 dark:text-gray-500">
        {t('noRecordsFoundMessage')}
      </div>
    );
  }

  const hasActionsColumn = rows.some((item) => canEdit(item) || canDelete(item));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-gray-400">
            <th className="px-5 py-3 font-semibold">{t('fullNameLabel')}</th>
            <th className="px-5 py-3 font-semibold">{t('roleLabel')}</th>
            <th className="px-5 py-3 font-semibold">{t('emailLabel')}</th>
            <th className="px-5 py-3 font-semibold">{t('phoneLabel')}</th>
            {hasActionsColumn && (
              <th className="px-5 py-3 text-right font-semibold">{t('actionsLabel')}</th>
            )}
          </tr>
        </thead>
        <motion.tbody variants={container} initial="hidden" animate="show">
          {rows.map((item) => {
            const badgeTone = ROLE_BADGE[item.role] || ROLE_BADGE.Guest;
            const avatarTone = AVATAR_GRADIENT[item.role] || AVATAR_GRADIENT.Guest;
            const rowTone = ROW_ACCENT[item.role] || ROW_ACCENT.Guest;

            return (
              <motion.tr
                key={item.id}
                variants={rowFade}
                className={`border-b border-gray-50 transition-colors last:border-b-0 dark:border-slate-800/60 ${rowTone}`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarTone}`}>
                      {initials(item.fullName)}
                    </span>
                    <span className="truncate font-semibold text-gray-900 dark:text-gray-100">
                      {item.fullName || '\u2014'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeTone}`}>
                    {roleLabel(item.role)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">
                  {item.email ? (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className="truncate">{item.email}</span>
                    </span>
                  ) : (
                    <span className="text-gray-300 dark:text-gray-600">&mdash;</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">
                  {item.phoneNumber ? (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className="truncate">{item.phoneNumber}</span>
                    </span>
                  ) : (
                    <span className="text-gray-300 dark:text-gray-600">&mdash;</span>
                  )}
                </td>
                {hasActionsColumn && (
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit(item) && (
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          aria-label={`${t('editButton')} ${item.fullName || ''}`}
                          className="flex items-center gap-1.5 rounded-lg border border-green-200 px-2.5 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-500/10"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {t('editButton')}
                        </button>
                      )}
                      {canDelete(item) && (
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          aria-label={`${t('deleteButton')} ${item.fullName || ''}`}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {t('deleteButton')}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
};
