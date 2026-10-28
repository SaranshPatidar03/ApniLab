/**
 * ApniLab Theme System
 * Primary: Indigo (#4F46E5 / #6366F1)
 * Exactly Two Theme Options: Light and Dark
 */

export type ThemeMode = 'light' | 'dark';

export interface ColorTheme {
  background: string;
  card: string;
  cardAlt: string;
  surface: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  primary: string;
  primaryLight: string;
  primaryBorder: string;
  inputBg: string;
  inputBorder: string;
  tabBarBg: string;
  tabBarBorder: string;
  statusBar: 'dark' | 'light';
}

export const BrandColors = {
  indigo: '#4F46E5',
  indigoDark: '#3730A3',
  indigoLight: '#6366F1',
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo200: '#C7D2FE',
  indigo950: '#1E1B4B',
  
  cyan: '#06B6D4',
  cyanLight: '#ECFEFF',
  cyanDarkBg: '#083344',
  emerald: '#10B981',
  emeraldLight: '#ECFDF5',
  emeraldDarkBg: '#064E3B',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  amberDarkBg: '#78350F',
  rose: '#F43F5E',
  roseLight: '#FFE4E6',
  roseDarkBg: '#881337',
  purple: '#8B5CF6',
  purpleLight: '#F3E8FF',
  purpleDarkBg: '#4C1D95',

  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#0B0F19',
  white: '#FFFFFF',
};

const lightTheme: ColorTheme = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  tint: BrandColors.indigo,
  tabIconDefault: '#94A3B8',
  tabIconSelected: BrandColors.indigo,
  primary: BrandColors.indigo,
  primaryLight: BrandColors.indigo50,
  primaryBorder: BrandColors.indigo200,
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E1',
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  statusBar: 'dark',
};

const darkTheme: ColorTheme = {
  background: '#0B0F19',
  card: '#1E293B',
  cardAlt: '#0F172A',
  surface: '#1E293B',
  border: '#334155',
  borderSubtle: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  tint: BrandColors.indigoLight,
  tabIconDefault: '#64748B',
  tabIconSelected: BrandColors.indigoLight,
  primary: BrandColors.indigoLight,
  primaryLight: BrandColors.indigo950,
  primaryBorder: BrandColors.indigoDark,
  inputBg: '#0F172A',
  inputBorder: '#334155',
  tabBarBg: '#0B0F19',
  tabBarBorder: '#1E293B',
  statusBar: 'light',
};

export default {
  light: lightTheme,
  dark: darkTheme,
};
