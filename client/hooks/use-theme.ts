import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Hook that returns the current theme, prioritizing the theme context if available
 */
export function useAppTheme() {
  try {
    const context = useThemeContext();
    return context.theme || 'light';
  } catch {
    // Fallback to system theme if context is not available
    return useColorScheme() || 'light';
  }
}

