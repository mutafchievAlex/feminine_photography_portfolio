import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const STORAGE_KEY = 'siteTheme';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'bw') {
      root.classList.add('theme-bw');
    } else {
      root.classList.remove('theme-bw');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme: () => setTheme((t) => (t === 'bw' ? 'default' : 'bw')) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
