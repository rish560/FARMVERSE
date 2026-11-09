import { CalendarDays, KeyRound, Mail, MapPin, Pencil, Phone, ShieldCheck, UserCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { normalizeRole } from '../config/roleRoutes';

const inputClass =
  'mt-1.5 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none transition focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-green-100';

const ROLE_LABEL_KEYS = {
  ADMIN: 'adminRole',
  FARM_MANAGER: 'farmManagerRole',
  GUEST: 'guestRole',
};

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const profile = user || {
    fullName: t('guestUserFallback'),
    email: 'guest@farmverse.com',
    role: t('guestRole'),
    phone: '',
    address: '',
    joinedAt: '14 July 2026',
  };

  const translatedRole = user
    ? (ROLE_LABEL_KEYS[normalizeRole(user.role)] ? t(ROLE_LABEL_KEYS[normalizeRole(user.role)]) : user.role)
    : profile.role;

  const [dialog, setDialog] = useState(null);
  const [draft, setDraft] = useState(profile);

  const details = [
    [UserCircle, t('fullNameLabel'), profile.fullName],
    [Mail, t('emailLabel'), profile.email],
    [ShieldCheck, t('roleLabel'), translatedRole],
    [Phone, t('phoneNumberLabel'), profile.phone || t('notProvided')],
    [MapPin, t('addressLabel'), profile.address || t('notProvided')],
    [CalendarDays, t('joinDateLabel'), profile.joinedAt || t('accountActive')],
  ];

  const save = (e) => {
    e.preventDefault();
    updateProfile(draft);
    setDialog(null);
    addToast(
      dialog === 'password' ? t('passwordUpdatedToast') : t('profileUpdatedToast'),
      'success',
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <Card className="overflow-hidden p-0">
        {/* Cover */}
        <div className="relative h-40 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80"
            alt="Agriculture field"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
        </div>

        <div className="relative px-6 pb-6 pt-4 sm:px-8">
          {/* Avatar */}
          <div className="absolute -top-8 left-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 shadow-md sm:left-8">
            <UserCircle className="h-10 w-10" />
          </div>

          <div className="flex flex-col justify-between gap-4 pt-10 sm:flex-row sm:items-center sm:pt-4">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{profile.fullName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => { setDraft(profile); setDialog('profile'); }}
                className="gap-1.5 px-3.5 py-2 text-sm"
              >
                <Pencil className="h-3.5 w-3.5" /> {t('editProfileButton')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setDialog('password')}
                className="gap-1.5 px-3.5 py-2 text-sm"
              >
                <KeyRound className="h-3.5 w-3.5" /> {t('changePasswordButton')}
              </Button>
            </div>
          </div>

          {/* Details grid */}
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {details.map(([Icon, label, value]) => (
              <div key={label} className="rounded-lg border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Icon className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  {label}
                </div>
                <p className="mt-1.5 font-medium text-gray-900 dark:text-gray-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Edit modal */}
      {dialog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
        >
          <Card className="w-full max-w-md" hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400">
                  {t('accountSettingsLabel')}
                </p>
                <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {dialog === 'profile' ? t('editProfileButton') : t('changePasswordButton')}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => setDialog(null)}
                className="rounded-lg border border-gray-200 dark:border-slate-700 p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={save} className="mt-5 space-y-4">
              {dialog === 'profile' ? (
                <>
                  {[
                    ['fullName', t('fullNameLabel')],
                    ['phone', t('phoneNumberLabel')],
                    ['address', t('addressLabel')],
                  ].map(([key, label]) => (
                    <label key={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                      <input
                        required
                        value={draft[key] || ''}
                        onChange={(e) => setDraft((curr) => ({ ...curr, [key]: e.target.value }))}
                        className={inputClass}
                      />
                    </label>
                  ))}
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('currentPasswordLabel')}
                    <input required type="password" className={inputClass} />
                  </label>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('newPasswordLabel')}
                    <input required minLength={8} type="password" className={inputClass} />
                  </label>
                </>
              )}
              <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-slate-800 pt-4">
                <Button variant="secondary" type="button" onClick={() => setDialog(null)} className="px-4 py-2 text-sm">
                  {t('cancelButton')}
                </Button>
                <Button type="submit" className="px-4 py-2 text-sm">
                  {t('saveChangesButton')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
