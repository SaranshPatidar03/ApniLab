import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors, { ColorTheme, ThemeMode } from '@/constants/Colors';

const THEME_STORAGE_KEY = '@apnilab_theme_mode';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  theme: ColorTheme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  setThemeMode: () => {},
  toggleTheme: () => {},
  theme: Colors.light,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  // Load persisted theme on mount
  useEffect(() => {
    async function loadStoredTheme() {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setThemeModeState(stored);
        }
      } catch {
        // Fallback to default light mode if storage read fails
      }
    }
    loadStoredTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    // Only accept exactly 'light' or 'dark'
    if (mode !== 'light' && mode !== 'dark') return;
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Storage write error ignored
    }
  };

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
  };

  const isDark = themeMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        toggleTheme,
        theme,
        isDark,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
