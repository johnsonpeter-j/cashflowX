import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, FontFamily, Shadows } from '@/constants/theme';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  containerDark: {
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },

  // Card styles
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  cardDark: {
    backgroundColor: Colors.dark.card,
  },

  // Text styles with Inter font
  text: {
    fontFamily: FontFamily.regular,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    color: Colors.light.text,
  },
  textDark: {
    color: Colors.dark.text,
  },
  textSecondary: {
    fontFamily: FontFamily.regular,
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    color: Colors.light.textSecondary,
  },
  textSecondaryDark: {
    color: Colors.dark.textSecondary,
  },
  heading1: {
    fontFamily: FontFamily.bold,
    fontSize: Typography['4xl'].fontSize,
    lineHeight: Typography['4xl'].lineHeight,
    color: Colors.light.text,
  },
  heading1Dark: {
    color: Colors.dark.text,
  },
  heading2: {
    fontFamily: FontFamily.bold,
    fontSize: Typography['3xl'].fontSize,
    lineHeight: Typography['3xl'].lineHeight,
    color: Colors.light.text,
  },
  heading2Dark: {
    color: Colors.dark.text,
  },
  heading3: {
    fontFamily: FontFamily.semibold,
    fontSize: Typography['2xl'].fontSize,
    lineHeight: Typography['2xl'].lineHeight,
    color: Colors.light.text,
  },
  heading3Dark: {
    color: Colors.dark.text,
  },
  heading4: {
    fontFamily: FontFamily.semibold,
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    color: Colors.light.text,
  },
  heading4Dark: {
    color: Colors.dark.text,
  },

  // Input styles (fontSize will be overridden by responsive styles)
  input: {
    fontFamily: FontFamily.regular,
    color: Colors.light.text,
    backgroundColor: Colors.light.input,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  inputDark: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.input,
    borderColor: Colors.dark.inputBorder,
  },
  inputFocused: {
    borderColor: Colors.light.primary,
  },
  inputFocusedDark: {
    borderColor: Colors.dark.primary,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  inputErrorDark: {
    borderColor: Colors.dark.error,
  },

  // Button styles
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonDark: {
    backgroundColor: Colors.dark.primary,
  },
  buttonText: {
    fontFamily: FontFamily.semibold,
    fontSize: Typography.base.fontSize,
    color: '#FFFFFF',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  buttonSecondaryDark: {
    borderColor: Colors.dark.primary,
  },
  buttonSecondaryText: {
    color: Colors.light.primary,
  },
  buttonSecondaryTextDark: {
    color: Colors.dark.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Error text style
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: Typography.sm.fontSize,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
  errorTextDark: {
    color: Colors.dark.error,
  },

  // Label style
  label: {
    fontFamily: FontFamily.medium,
    fontSize: Typography.sm.fontSize,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  labelDark: {
    color: Colors.dark.text,
  },

  // Spacing utilities
  marginTopSm: {
    marginTop: Spacing.sm,
  },
  marginTopMd: {
    marginTop: Spacing.md,
  },
  marginTopLg: {
    marginTop: Spacing.lg,
  },
  marginBottomSm: {
    marginBottom: Spacing.sm,
  },
  marginBottomMd: {
    marginBottom: Spacing.md,
  },
  marginBottomLg: {
    marginBottom: Spacing.lg,
  },
  paddingSm: {
    padding: Spacing.sm,
  },
  paddingMd: {
    padding: Spacing.md,
  },
  paddingLg: {
    padding: Spacing.lg,
  },

  // Flex utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  gapSm: {
    gap: Spacing.sm,
  },
  gapMd: {
    gap: Spacing.md,
  },
  gapLg: {
    gap: Spacing.lg,
  },
});

// Responsive style helper
export function getResponsiveStyle(isMobile: boolean, isTablet: boolean, isLaptop: boolean) {
  return {
    paddingHorizontal: isMobile ? Spacing.md : isTablet ? Spacing.lg : Spacing.xl,
    maxWidth: isMobile ? '100%' : isTablet ? 768 : 1024,
  };
}

