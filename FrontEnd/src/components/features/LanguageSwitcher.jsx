import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useLanguage();

  return (
    <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      <Languages className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
      <span className="font-medium">{t('language')}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
        className="bg-transparent text-sm font-medium outline-none dark:text-slate-200 dark:[color-scheme:dark]"
      >
        <option value="en">English</option>
        {/* <option value="ta">தமிழ்</option> */}
        <option value="hi">हिंदी</option>
      </select>
    </label>
  );
};