import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext({ locale: 'en', setLocale: () => {}, t: (key) => key });

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem('farmverse-locale') || 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmverse-locale', locale);
    }
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: (key) => translations[locale]?.[key] || translations.en[key] || key,
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
