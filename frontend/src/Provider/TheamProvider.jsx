import { useEffect, useMemo, useState } from 'react';
import { THEAM_MODES, THEAM_STORAGE_KEY, TheamContext } from '../context/TheamContext';

const getStoredMode = () => {
  if (typeof window === 'undefined') {
    return 'default';
  }

  const storedMode = window.localStorage.getItem(THEAM_STORAGE_KEY);
  return THEAM_MODES.includes(storedMode) ? storedMode : 'default';
};

const getSystemMode = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export const TheamProvider = ({ children }) => {
  const [mode, setMode] = useState(getStoredMode);
  const [systemMode, setSystemMode] = useState(getSystemMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (event) => {
      setSystemMode(event.matches ? 'light' : 'dark');
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (mode === 'default') {
      window.localStorage.removeItem(THEAM_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEAM_STORAGE_KEY, mode);
    }
  }, [mode]);

  const resolvedMode = mode === 'default' ? systemMode : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedMode;
    root.dataset.themeMode = mode;
    root.style.colorScheme = resolvedMode;
  }, [mode, resolvedMode]);

  const value = useMemo(
    () => ({
      mode,
      modes: THEAM_MODES,
      resolvedMode,
      setMode,
      isDark: resolvedMode === 'dark',
      isLight: resolvedMode === 'light',
    }),
    [mode, resolvedMode],
  );

  return <TheamContext.Provider value={value}>{children}</TheamContext.Provider>;
};
