import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const fallbackThemeValue = {
  theme: 'light',
  setTheme: () => {},
};

const ThemeContext = createContext(fallbackThemeValue);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return fallbackThemeValue.theme;
    return localStorage.getItem('farmverse-theme') || fallbackThemeValue.theme;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('light', 'dark', 'earth');
    document.documentElement.classList.add(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmverse-theme', theme);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
