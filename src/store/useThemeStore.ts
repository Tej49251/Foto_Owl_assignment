import { create } from 'zustand';
import { lightColors, darkColors, ThemeColors } from '../constants/theme';
import { getItem, setItem, StorageKeys } from '../services/storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'light',
  colors: lightColors,
  isDark: false,

  loadTheme: async () => {
    try {
      const savedTheme = await getItem<ThemeMode>(StorageKeys.THEME_MODE);
      const mode = savedTheme || 'light';
      set({
        themeMode: mode,
        colors: mode === 'dark' ? darkColors : lightColors,
        isDark: mode === 'dark',
      });
    } catch (e) {
      console.error('Error loading theme:', e);
    }
  },

  toggleTheme: async () => {
    const { themeMode } = get();
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    const colors = newMode === 'dark' ? darkColors : lightColors;

    set({
      themeMode: newMode,
      colors,
      isDark: newMode === 'dark',
    });

    await setItem(StorageKeys.THEME_MODE, newMode);
  },
}));
