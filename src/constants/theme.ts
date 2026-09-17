export interface ThemeColors {
  background: string;
  surface: string;
  surfaceLight: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  border: string;
  borderFocus: string;
  error: string;
  success: string;
  warning: string;
  heartActive: string;
  inputBg: string;
  tabBarBg: string;
  tabBarActive: string;
  tabBarInactive: string;
  modalOverlay: string;
  shadowColor: string;
}

export const lightColors: ThemeColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceLight: '#F1F5F9',
  cardBg: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#4F46E5', // Indigo 600
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  accent: '#EC4899', // Pink 500
  border: '#E2E8F0',
  borderFocus: '#6366F1',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  heartActive: '#F43F5E',
  inputBg: '#F8FAFC',
  tabBarBg: '#FFFFFF',
  tabBarActive: '#4F46E5',
  tabBarInactive: '#64748B',
  modalOverlay: 'rgba(15, 23, 42, 0.6)',
  shadowColor: '#64748B',
};

export const darkColors: ThemeColors = {
  background: '#0B0F19',
  surface: '#111827',
  surfaceLight: '#1F2937',
  cardBg: '#1E293B',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  primary: '#6366F1', // Indigo 500
  primaryLight: '#312E81',
  primaryDark: '#4338CA',
  accent: '#F472B6',
  border: '#374151',
  borderFocus: '#818CF8',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  heartActive: '#FB7185',
  inputBg: '#1F2937',
  tabBarBg: '#111827',
  tabBarActive: '#818CF8',
  tabBarInactive: '#9CA3AF',
  modalOverlay: 'rgba(0, 0, 0, 0.75)',
  shadowColor: '#000000',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const },
};
