import { useMemo } from 'react';
import { useResponsive } from './use-responsive';
import { getTypography } from '@/utils/typography';
import { FontFamily, Colors } from '@/constants/theme';

export function useResponsiveStyles() {
  const { isMobile } = useResponsive();
  const Typography = useMemo(() => getTypography(isMobile), [isMobile]);

  return useMemo(() => ({
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
    input: {
      fontFamily: FontFamily.regular,
      fontSize: Typography.base.fontSize,
      lineHeight: Typography.base.lineHeight,
    },
    buttonText: {
      fontFamily: FontFamily.semibold,
      fontSize: Typography.base.fontSize,
    },
    errorText: {
      fontFamily: FontFamily.regular,
      fontSize: Typography.sm.fontSize,
      color: Colors.light.error,
    },
    errorTextDark: {
      color: Colors.dark.error,
    },
    label: {
      fontFamily: FontFamily.medium,
      fontSize: Typography.sm.fontSize,
      color: Colors.light.text,
    },
    labelDark: {
      color: Colors.dark.text,
    },
  }), [Typography]);
}







