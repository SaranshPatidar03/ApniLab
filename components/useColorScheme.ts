import { useTheme } from '@/src/context/ThemeContext';

export const useColorScheme = (): 'light' | 'dark' => {
  const { themeMode } = useTheme();
  return themeMode;
};
