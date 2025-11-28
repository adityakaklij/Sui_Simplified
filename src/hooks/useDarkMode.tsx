import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check if user has a preference in localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Otherwise, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  return [isDark, setIsDark] as const;
};

