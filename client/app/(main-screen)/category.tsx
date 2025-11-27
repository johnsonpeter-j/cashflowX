import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, FlatList, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Colors, Shadows, BorderRadius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategoriesThunk } from '@/store/category/category.thunk';
import { RootState } from '@/store';
import { CategoryDialog } from '@/components/category/CategoryDialog';
import { DeleteCategoryDialog } from '@/components/category/DeleteCategoryDialog';
import { CategoryCard } from '@/components/category/CategoryCard';
import { CategorySkeletonList } from '@/components/category/CategorySkeletonList';
import { CategoryEmptyState } from '@/components/category/CategoryEmptyState';
import { globalStyles } from '@/styles/global';
import { useResponsive } from '@/hooks/use-responsive';
import { Category } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export default function CategoryScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';
  const dispatch = useDispatch();
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const toast = useToast();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  const { categories, isLoading, error } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(getAllCategoriesThunk() as any);
  }, [dispatch]);



  const handleAddPress = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditDialogVisible(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogVisible(false);
    setEditingCategory(null);
  };

  const handleDeletePress = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setCategoryToDelete(null);
  };

  const renderCategoryCard = ({ item }: { item: Category }) => {
    // Use flex: 1 for equal width cards, gap will be handled by columnWrapperStyle
    const cardWidth = isMobile ? '100%' : undefined;
    return (
      <CategoryCard
        category={item}
        onEdit={handleEdit}
        onDelete={handleDeletePress}
        width={cardWidth}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="heading1">Categories</ThemedText>
        {!isLoading && categories.length > 0 && (
          <ThemedText type="secondary" style={styles.countText}>
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </ThemedText>
        )}
      </View>

      {isLoading ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CategorySkeletonList />
        </ScrollView>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons 
            name="alert-circle-outline" 
            size={48} 
            color={isDark ? Colors.dark.error : Colors.light.error} 
          />
          <ThemedText 
            type="secondary" 
            style={[styles.errorText, { color: isDark ? Colors.dark.error : Colors.light.error }]}
          >
            {error}
          </ThemedText>
        </View>
      ) : categories.length === 0 ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <CategoryEmptyState />
        </ScrollView>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item._id}
          numColumns={isMobile ? 1 : isTablet ? 2 : 3}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={!isMobile ? styles.row : undefined}
          showsVerticalScrollIndicator={false}
          key={isMobile ? '1' : isTablet ? '2' : '3'} // Force re-render on layout change
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: Math.max(insets.bottom, Spacing.lg) + Spacing.md,
            right: Spacing.lg,
            backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary,
          },
        ]}
        onPress={handleAddPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Create Category Dialog */}
      <CategoryDialog
        visible={dialogVisible}
        mode="create"
        onClose={handleCloseDialog}
      />

      {/* Edit Category Dialog */}
      <CategoryDialog
        visible={editDialogVisible}
        mode="edit"
        category={editingCategory}
        onClose={handleCloseEditDialog}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        visible={deleteConfirmVisible}
        category={categoryToDelete}
        onClose={handleCancelDelete}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  countText: {
    marginTop: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  listContainer: {
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  row: {
    justifyContent: 'flex-start',
    gap: Spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  formContainer: {
    gap: Spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
});

