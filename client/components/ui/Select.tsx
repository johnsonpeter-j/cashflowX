import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { ThemedText } from '../themed-text';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useResponsiveStyles } from '@/hooks/use-responsive-styles';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface SelectProps<T = string> {
  label?: string;
  options: SelectOption<T>[];
  value?: T;
  onValueChange: (value: T) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function Select<T = string>({
  label,
  options,
  value,
  onValueChange,
  error,
  required,
  disabled = false,
}: SelectProps<T>) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const hasError = !!error;
  const responsiveStyles = useResponsiveStyles();

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={[responsiveStyles.label, isDark && responsiveStyles.labelDark, styles.label]}>
          {label}
          {required && <ThemedText style={[responsiveStyles.label, isDark && responsiveStyles.labelDark, { color: Colors.light.error }]}> *</ThemedText>}
        </ThemedText>
      )}
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <TouchableOpacity
              key={String(option.value)}
              onPress={() => !disabled && onValueChange(option.value)}
              disabled={disabled}
              style={[
                styles.option,
                isSelected && [
                  globalStyles.button,
                  isDark && globalStyles.buttonDark,
                ],
                !isSelected && [
                  styles.optionUnselected,
                  {
                    backgroundColor: isDark ? Colors.dark.input : Colors.light.input,
                    borderColor: isDark ? Colors.dark.inputBorder : Colors.light.inputBorder,
                  },
                ],
                hasError && (isDark ? globalStyles.inputErrorDark : globalStyles.inputError),
                disabled && globalStyles.buttonDisabled,
              ]}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  isSelected && globalStyles.buttonText,
                  !isSelected && {
                    color: isDark ? Colors.dark.text : Colors.light.text,
                  },
                ]}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
      <ThemedText style={[responsiveStyles.errorText, isDark && responsiveStyles.errorTextDark, !hasError && styles.errorTextEmpty]}>
        {error || ' '}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    marginBottom: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderWidth: 1,
  },
  optionUnselected: {
    backgroundColor: 'transparent',
  },
  optionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  errorTextEmpty: {
    opacity: 0,
  },
});


