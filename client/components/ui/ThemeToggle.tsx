import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedText } from '../themed-text';
import { IconSymbol } from './icon-symbol';
import { Colors } from '@/constants/theme';

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compact]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <IconSymbol
        name={theme === 'dark' ? 'sun.max.fill' : 'moon.fill'}
        size={24}
        color={theme === 'dark' ? Colors.dark.icon : Colors.light.icon}
      />
      {!compact && (
        <ThemedText style={styles.text} variant="medium">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  compact: {
    padding: 4,
  },
  text: {
    fontSize: 14,
  },
});





