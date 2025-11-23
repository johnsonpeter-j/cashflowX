import { Platform } from 'react-native';

// Inter font family (will be loaded via expo-font)
export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// CashFlowX Color Palette
export const Colors = {
  light: {
    // Primary colors
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    
    // Text colors
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    // Border colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Status colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // UI elements
    card: '#FFFFFF',
    input: '#FFFFFF',
    inputBorder: '#D1D5DB',
    placeholder: '#9CA3AF', // Muted gray - placeholder text (lighter than input text)
    
    // Tab bar
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#6366F1',
    tint: '#6366F1',
    icon: '#6B7280',
  },
  dark: {
    // Primary colors
    primary: '#818CF8',
    primaryDark: '#6366F1',
    primaryLight: '#A5B4FC',
    
    // Background colors
    background: '#111827',
    backgroundSecondary: '#1F2937',
    backgroundTertiary: '#374151',
    
    // Text colors
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    
    // Border colors
    border: '#374151',
    borderLight: '#4B5563',
    
    // Status colors
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    
    // UI elements
    card: '#1F2937',
    input: '#1F2937',
    inputBorder: '#374151',
    placeholder: '#6B7280', // Muted gray - placeholder text color for dark mode
    
    // Tab bar
    tabIconDefault: '#6B7280',
    tabIconSelected: '#818CF8',
    tint: '#818CF8',
    icon: '#9CA3AF',
  },
};

// Spacing scale (8px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Typography scale - Mobile sizes (reduced)
export const TypographyMobile = {
  xs: {
    fontSize: 11,
    lineHeight: 15,
  },
  sm: {
    fontSize: 13,
    lineHeight: 18,
  },
  base: {
    fontSize: 14,
    lineHeight: 20,
  },
  lg: {
    fontSize: 16,
    lineHeight: 24,
  },
  xl: {
    fontSize: 18,
    lineHeight: 26,
  },
  '2xl': {
    fontSize: 20,
    lineHeight: 28,
  },
  '3xl': {
    fontSize: 24,
    lineHeight: 32,
  },
  '4xl': {
    fontSize: 28,
    lineHeight: 36,
  },
};

// Typography scale - Desktop/Tablet sizes
export const Typography = {
  xs: {
    fontSize: 12,
    lineHeight: 16,
  },
  sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 18,
    lineHeight: 28,
  },
  xl: {
    fontSize: 20,
    lineHeight: 28,
  },
  '2xl': {
    fontSize: 24,
    lineHeight: 32,
  },
  '3xl': {
    fontSize: 30,
    lineHeight: 36,
  },
  '4xl': {
    fontSize: 36,
    lineHeight: 44,
  },
};

// Shadows
export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
    android: {
      elevation: 8,
    },
    web: {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  }),
};

// Responsive breakpoints
export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  laptop: 1024,
};
