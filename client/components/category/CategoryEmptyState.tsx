import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export function CategoryEmptyState() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="folder-outline" 
        size={64} 
        color={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary} 
      />
      <ThemedText type="heading3" style={styles.emptyTitle}>
        No Categories Yet
      </ThemedText>
      <ThemedText type="secondary" style={styles.emptyDescription}>
        Get started by creating your first category
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    minHeight: 400,
  },
  emptyTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    textAlign: 'center',
  },
});


