import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui';
import { Category } from '@/types/api';
import { deleteCategoryThunk, getAllCategoriesThunk } from '@/store/category/category.thunk';
import { useToast } from '@/hooks/use-toast';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface DeleteCategoryDialogProps {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteCategoryDialog({ visible, category, onClose, onSuccess }: DeleteCategoryDialogProps) {
  const dispatch = useDispatch();
  const toast = useToast();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleConfirmDelete = async () => {
    if (!category) return;
    
    try {
      await dispatch(deleteCategoryThunk(category._id) as any).unwrap();
      toast.showSuccess('Category deleted successfully!');
      onClose();
      // Refresh categories list
      dispatch(getAllCategoriesThunk() as any);
      onSuccess?.();
    } catch (error) {
      console.error('Delete category error:', error);
      toast.showError(typeof error === 'string' ? error : 'Failed to delete category. Please try again.');
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title="Delete Category"
    >
      <View style={styles.deleteConfirmContainer}>
        <ThemedText type="default" style={styles.deleteConfirmText}>
          Are you sure you want to delete "{category?.name}"? This action cannot be undone.
        </ThemedText>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={onClose}
            style={styles.cancelButton}
          />
          <Button
            title="Delete"
            onPress={handleConfirmDelete}
            style={[styles.deleteButton, { backgroundColor: isDark ? Colors.dark.error : Colors.light.error }]}
          />
        </View>
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  deleteConfirmContainer: {
    gap: Spacing.md,
  },
  deleteConfirmText: {
    marginBottom: Spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
});


