import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedText } from '../themed-text';
import { IconSymbol } from './icon-symbol';
import { Colors } from '@/constants/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <IconSymbol
        name={theme === 'dark' ? 'sun.max.fill' : 'moon.fill'}
        size={24}
        color={theme === 'dark' ? Colors.dark.icon : Colors.light.icon}
      />
      <ThemedText style={styles.text} variant="medium">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </ThemedText>
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
  text: {
    fontSize: 14,
  },
});





