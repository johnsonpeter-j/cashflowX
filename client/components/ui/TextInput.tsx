import React, { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { ThemedText } from '../themed-text';
import { Colors } from '@/constants/theme';
import { useResponsiveStyles } from '@/hooks/use-responsive-styles';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export function TextInput({ label, error, required, style, onFocus, onBlur, placeholderTextColor, secureTextEntry, ...props }: TextInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;
  const responsiveStyles = useResponsiveStyles();
  const isPasswordField = secureTextEntry;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Always use theme placeholder color unless explicitly overridden
  const finalPlaceholderColor = placeholderTextColor || (isDark ? Colors.dark.placeholder : Colors.light.placeholder);

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={[responsiveStyles.label, isDark && responsiveStyles.labelDark, styles.label]}>
          {label}
          {required && <ThemedText style={[responsiveStyles.label, isDark && responsiveStyles.labelDark, { color: Colors.light.error }]}> *</ThemedText>}
        </ThemedText>
      )}
      <View style={styles.inputWrapper}>
        <RNTextInput
          {...props}
          secureTextEntry={isPasswordField && !showPassword}
          style={[
            globalStyles.input,
            isDark && globalStyles.inputDark,
            isFocused && !hasError && (isDark ? globalStyles.inputFocusedDark : globalStyles.inputFocused),
            hasError && (isDark ? globalStyles.inputErrorDark : globalStyles.inputError),
            responsiveStyles.input, // Apply responsive font size last to override
            isPasswordField && styles.passwordInput,
            style,
          ]}
          placeholderTextColor={finalPlaceholderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isPasswordField && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isDark ? Colors.dark.textSecondary : Colors.light.textSecondary}
            />
          </TouchableOpacity>
        )}
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
  inputWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 4,
    zIndex: 1,
  },
  errorTextEmpty: {
    opacity: 0,
  },
});
