import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, BorderRadius, Spacing } from '@/constants/theme';

// Custom toast components with theme support
export const toastConfig = {
  success: (props: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <BaseToast
        {...props}
        style={[
          styles.toast,
          isDark && styles.toastDark,
          styles.successToast,
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[
          styles.text1,
          isDark && styles.text1Dark,
        ]}
        text2Style={[
          styles.text2,
          isDark && styles.text2Dark,
        ]}
        renderLeadingIcon={() => (
          <View style={[styles.iconContainer, { backgroundColor: (isDark ? Colors.dark.success : Colors.light.success) + '20' }]}>
            <Ionicons name="checkmark-circle" size={20} color={isDark ? Colors.dark.success : Colors.light.success} />
          </View>
        )}
      />
    );
  },

  error: (props: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <ErrorToast
        {...props}
        style={[
          styles.toast,
          isDark && styles.toastDark,
          styles.errorToast,
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[
          styles.text1,
          isDark && styles.text1Dark,
        ]}
        text2Style={[
          styles.text2,
          isDark && styles.text2Dark,
        ]}
        renderLeadingIcon={() => (
          <View style={[styles.iconContainer, { backgroundColor: (isDark ? Colors.dark.error : Colors.light.error) + '20' }]}>
            <Ionicons name="close-circle" size={20} color={isDark ? Colors.dark.error : Colors.light.error} />
          </View>
        )}
      />
    );
  },

  warning: (props: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <BaseToast
        {...props}
        style={[
          styles.toast,
          isDark && styles.toastDark,
          styles.warningToast,
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[
          styles.text1,
          isDark && styles.text1Dark,
        ]}
        text2Style={[
          styles.text2,
          isDark && styles.text2Dark,
        ]}
        renderLeadingIcon={() => (
          <View style={[styles.iconContainer, { backgroundColor: (isDark ? Colors.dark.warning : Colors.light.warning) + '20' }]}>
            <Ionicons name="warning" size={20} color={isDark ? Colors.dark.warning : Colors.light.warning} />
          </View>
        )}
      />
    );
  },

  info: (props: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <InfoToast
        {...props}
        style={[
          styles.toast,
          isDark && styles.toastDark,
          styles.infoToast,
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[
          styles.text1,
          isDark && styles.text1Dark,
        ]}
        text2Style={[
          styles.text2,
          isDark && styles.text2Dark,
        ]}
        renderLeadingIcon={() => (
          <View style={[styles.iconContainer, { backgroundColor: (isDark ? Colors.dark.info : Colors.light.info) + '20' }]}>
            <Ionicons name="information-circle" size={20} color={isDark ? Colors.dark.info : Colors.light.info} />
          </View>
        )}
      />
    );
  },
};

const styles = StyleSheet.create({
  toast: {
    height: 'auto',
    minHeight: 60,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: 'flex-end',
    marginRight: Spacing.md,
    maxWidth: '90%',
  },
  toastDark: {
    backgroundColor: Colors.dark.card,
    borderLeftColor: Colors.dark.primary,
  },
  successToast: {
    borderLeftColor: Colors.light.success,
  },
  errorToast: {
    borderLeftColor: Colors.light.error,
  },
  warningToast: {
    borderLeftColor: Colors.light.warning,
  },
  infoToast: {
    borderLeftColor: Colors.light.info,
  },
  contentContainer: {
    paddingHorizontal: 0,
    flex: 1,
  },
  text1: {
    fontSize: 14,
    fontFamily: FontFamily.semibold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  text1Dark: {
    color: Colors.dark.text,
  },
  text2: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    flexShrink: 1,
  },
  text2Dark: {
    color: Colors.dark.textSecondary,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
});
