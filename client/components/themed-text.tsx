import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FontFamily, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { getTypography } from '@/utils/typography';
import { useResponsiveStyles } from '@/hooks/use-responsive-styles';
import { globalStyles } from '@/styles/global';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'link' | 'secondary';
  variant?: 'regular' | 'medium' | 'semibold' | 'bold';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  variant = 'regular',
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const { isMobile } = useResponsive();
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const isDark = colorScheme === 'dark';
  const Typography = getTypography(isMobile);
  const responsiveStyles = useResponsiveStyles();

  const getFontFamily = () => {
    switch (variant) {
      case 'medium':
        return FontFamily.medium;
      case 'semibold':
        return FontFamily.semibold;
      case 'bold':
        return FontFamily.bold;
      default:
        return FontFamily.regular;
    }
  };

  return (
    <Text
      style={[
        { color, fontFamily: getFontFamily() },
        type === 'default' && { fontSize: Typography.base.fontSize, lineHeight: Typography.base.lineHeight },
        type === 'title' && [
          responsiveStyles.heading1,
          isDark && responsiveStyles.heading1Dark,
        ],
        type === 'subtitle' && [
          responsiveStyles.heading4,
          isDark && responsiveStyles.heading4Dark,
        ],
        type === 'heading1' && [
          responsiveStyles.heading1,
          isDark && responsiveStyles.heading1Dark,
        ],
        type === 'heading2' && [
          responsiveStyles.heading2,
          isDark && responsiveStyles.heading2Dark,
        ],
        type === 'heading3' && [
          responsiveStyles.heading3,
          isDark && responsiveStyles.heading3Dark,
        ],
        type === 'heading4' && [
          responsiveStyles.heading4,
          isDark && responsiveStyles.heading4Dark,
        ],
        type === 'link' && { fontSize: Typography.base.fontSize, lineHeight: Typography.base.lineHeight, color: Colors.light.primary, fontFamily: FontFamily.medium },
        type === 'secondary' && [
          responsiveStyles.textSecondary,
          isDark && responsiveStyles.textSecondaryDark,
        ],
        style,
      ]}
      {...rest}
    />
  );
}
