import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { globalStyles } from '@/styles/global';
import { ThemedText } from '../themed-text';
import { Colors } from '@/constants/theme';
import { useResponsiveStyles } from '@/hooks/use-responsive-styles';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'text';
  loading?: boolean;
  fullWidth?: boolean;
  style?: TouchableOpacityProps['style'];
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  fullWidth = false,
  style,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const { isMobile } = useResponsive();
  const isDark = colorScheme === 'dark';
  const isDisabled = disabled || loading;
  const responsiveStyles = useResponsiveStyles();

  const buttonStyle = variant === 'primary' 
    ? [globalStyles.button, isDark && globalStyles.buttonDark]
    : variant === 'secondary'
    ? [globalStyles.button, globalStyles.buttonSecondary, isDark && globalStyles.buttonSecondaryDark]
    : [styles.textButton];

  const textStyle = variant === 'primary'
    ? [globalStyles.buttonText, responsiveStyles.buttonText] // Responsive last to override
    : variant === 'secondary'
    ? [globalStyles.buttonText, globalStyles.buttonSecondaryText, isDark && globalStyles.buttonSecondaryTextDark, responsiveStyles.buttonText] // Responsive last
    : [{ fontSize: isMobile ? 13 : 14 }, styles.textButtonText, isDark && styles.textButtonTextDark];

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        isDisabled && globalStyles.buttonDisabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small"
            color={variant === 'primary' ? '#FFFFFF' : variant === 'secondary' ? (isDark ? '#818CF8' : '#6366F1') : (isDark ? '#818CF8' : '#6366F1')} 
            style={styles.loadingSpinner}
          />
          <ThemedText style={textStyle}>{title}</ThemedText>
        </View>
      ) : (
        <ThemedText style={textStyle}>{title}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
    borderWidth: 0,
  },
  textButtonText: {
    color: Colors.light.primary,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  textButtonTextDark: {
    color: Colors.dark.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingSpinner: {
    marginRight: 0,
  },
});

