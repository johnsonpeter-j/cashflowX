import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: ColorSchemeName;
  themePreference: Theme;
  setThemePreference: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<Theme>('auto');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    // Load saved theme preference
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
        setThemePreferenceState(saved as Theme);
      }
    });

    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const setThemePreference = async (theme: Theme) => {
    setThemePreferenceState(theme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  const toggleTheme = () => {
    const currentTheme = themePreference === 'auto' 
      ? (systemTheme || 'light')
      : themePreference;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setThemePreference(newTheme);
  };

  const theme: ColorSchemeName = themePreference === 'auto' 
    ? systemTheme || 'light'
    : themePreference;

  return (
    <ThemeContext.Provider value={{ theme, themePreference, setThemePreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

