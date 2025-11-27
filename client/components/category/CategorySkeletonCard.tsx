import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Skeleton } from '@/components/ui/Skeleton';
import { globalStyles } from '@/styles/global';
import { Colors, Spacing } from '@/constants/theme';

interface CategorySkeletonCardProps {
  width?: string | number;
}

export function CategorySkeletonCard({ width }: CategorySkeletonCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.card,
        isDark && globalStyles.cardDark,
        width && { width },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Skeleton width={36} height={36} borderRadius={18} style={{ marginRight: Spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Skeleton width="60%" height={18} borderRadius={4} style={{ marginBottom: 4 }} />
            <Skeleton width="80%" height={14} borderRadius={4} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <Skeleton width={32} height={32} borderRadius={16} />
        </View>
      </View>
      <View style={[styles.cardFooter, { borderTopColor: isDark ? Colors.dark.border : Colors.light.border }]}>
        <View style={styles.cardDateContainer}>
          <Skeleton width={50} height={12} borderRadius={4} />
          <Skeleton width={60} height={12} borderRadius={4} />
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
});


