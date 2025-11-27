import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { globalStyles } from '@/styles/global';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Category } from '@/types/api';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  width?: string | number;
}

export function CategoryCard({ category, onEdit, onDelete, width }: CategoryCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.card,
        isDark && globalStyles.cardDark,
        width ? { width } : { flex: 1 },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconContainer, { backgroundColor: isDark ? Colors.dark.primary + '20' : Colors.light.primary + '20' }]}>
            <Ionicons 
              name="folder" 
              size={20} 
              color={isDark ? Colors.dark.primary : Colors.light.primary} 
            />
          </View>
          <View style={styles.cardTitleContainer}>
            <ThemedText type="heading4" style={styles.cardTitle}>
              {category.name}
            </ThemedText>
            {category.description && (
              <ThemedText type="secondary" style={styles.cardDescription} numberOfLines={1}>
                {category.description}
              </ThemedText>
            )}
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => onEdit(category)}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="pencil"
              size={16}
              color={isDark ? Colors.dark.primary : Colors.light.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(category)}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color={isDark ? Colors.dark.error : Colors.light.error}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.cardFooter, { borderTopColor: isDark ? Colors.dark.border : Colors.light.border }]}>
        <View style={styles.cardDateContainer}>
          <ThemedText type="secondary" style={styles.cardDateLabel}>
            Created:
          </ThemedText>
          <ThemedText type="secondary" style={styles.cardDate}>
            {new Date(category.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    marginHorizontal: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.xs,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.xs,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
  },
  cardDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cardDateLabel: {
    fontSize: 11,
  },
  cardDate: {
    fontSize: 11,
  },
});


