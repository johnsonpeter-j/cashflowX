import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CategorySkeletonCard } from './CategorySkeletonCard';
import { Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';

export function CategorySkeletonList() {
  const { isMobile, isTablet } = useResponsive();
  const skeletonCount = isMobile ? 3 : isTablet ? 4 : 6;
  const cardWidth = isMobile ? '100%' : isTablet ? '48%' : '31%';

  return (
    <View style={styles.listContainer}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <CategorySkeletonCard key={index} width={cardWidth} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
});


