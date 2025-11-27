import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog } from '@/components/ui/Dialog';
import { TextInput, Button, Select } from '@/components/ui';
import { CategoryType, Category } from '@/types/api';
import { createCategoryThunk, updateCategoryThunk, getAllCategoriesThunk } from '@/store/category/category.thunk';
import { useForm } from '@/hooks/use-form';
import { z } from 'zod';
import { validationSchemas } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';
import { Spacing } from '@/constants/theme';

const categorySchema = z.object({
  name: validationSchemas.requiredString.min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Category type is required',
  }),
});

type CategoryFormData = z.infer<typeof categorySchema>;

type CategoryDialogMode = 'create' | 'edit' | 'view';

interface CategoryDialogProps {
  visible: boolean;
  mode: CategoryDialogMode;
  category?: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CategoryDialog({ visible, mode, category, onClose, onSuccess }: CategoryDialogProps) {
  const dispatch = useDispatch();
  const toast = useToast();
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const prevVisibleRef = useRef(false);
  const prevCategoryIdRef = useRef<string | undefined>(undefined);

  // Get initial values based on mode and category
  const getInitialValues = (): CategoryFormData => {
    if (category && (mode === 'edit' || mode === 'view')) {
      return {
        name: category.name,
        description: category.description || '',
        type: category.type,
      };
    }
    return {
      name: '',
      description: '',
      type: 'INCOME' as CategoryType,
    };
  };

  const { values, errors, isSubmitting, setValue, handleSubmit, getFieldError, reset } = useForm<CategoryFormData>({
    initialValues: getInitialValues(),
    validationSchema: categorySchema,
    onSubmit: async (values) => {
      if (mode === 'create') {
        try {
          await dispatch(createCategoryThunk({
            name: values.name,
            description: values.description || undefined,
            type: values.type,
          }) as any).unwrap();
          toast.showSuccess('Category created successfully!');
          onClose();
          reset();
          dispatch(getAllCategoriesThunk() as any);
          onSuccess?.();
        } catch (error) {
          console.error('Create category error:', error);
          toast.showError(typeof error === 'string' ? error : 'Failed to create category. Please try again.');
        }
      } else if (mode === 'edit' && category) {
        try {
          await dispatch(updateCategoryThunk({
            id: category._id,
            data: {
              name: values.name,
              description: values.description || undefined,
              type: values.type,
            },
          }) as any).unwrap();
          toast.showSuccess('Category updated successfully!');
          onClose();
          reset();
          dispatch(getAllCategoriesThunk() as any);
          onSuccess?.();
        } catch (error) {
          console.error('Update category error:', error);
          toast.showError(typeof error === 'string' ? error : 'Failed to update category. Please try again.');
        }
      }
    },
  });

  // Update form values when dialog opens or category changes
  useEffect(() => {
    const dialogJustOpened = visible && !prevVisibleRef.current;
    const categoryChanged = category?._id !== prevCategoryIdRef.current;
    
    // Reset form when dialog opens or category changes
    if (visible && (dialogJustOpened || categoryChanged)) {
      if (category && (isEditMode || isViewMode)) {
        // Set form values with new category data
        setValue('name', category.name);
        setValue('description', category.description || '');
        setValue('type', category.type);
      } else if (mode === 'create') {
        // Reset to empty form for create mode
        reset();
      }
    }
    
    prevVisibleRef.current = visible;
    prevCategoryIdRef.current = category?._id;
  }, [visible, category?._id, mode, isEditMode, isViewMode, setValue, reset]);

  const handleClose = () => {
    onClose();
    if (mode === 'create') {
      reset();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create Category';
      case 'edit':
        return 'Edit Category';
      case 'view':
        return 'Category Details';
      default:
        return 'Category';
    }
  };

  const getSubmitButtonTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create';
      case 'edit':
        return 'Update';
      default:
        return 'Save';
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={handleClose}
      title={getTitle()}
    >
      <View>
        <TextInput
          label="Category Name"
          placeholder="Enter category name"
          value={values.name}
          onChangeText={(text) => setValue('name', text)}
          error={getFieldError('name')}
          required
          autoFocus={!isViewMode}
          editable={!isViewMode}
        />

        {isViewMode ? (
          <View style={styles.viewFieldContainer}>
            <TextInput
              label="Type"
              value={values.type === 'INCOME' ? 'Income' : 'Expense'}
              editable={false}
            />
          </View>
        ) : (
          <Select<CategoryType>
            label="Type"
            options={[
              { label: 'Income', value: 'INCOME' },
              { label: 'Expense', value: 'EXPENSE' },
            ]}
            value={values.type}
            onValueChange={(value) => setValue('type', value)}
            error={getFieldError('type')}
            required
            disabled={isViewMode}
          />
        )}

        <TextInput
          label="Description"
          placeholder="Enter category description (optional)"
          value={values.description}
          onChangeText={(text) => setValue('description', text)}
          error={getFieldError('description')}
          multiline
          numberOfLines={4}
          style={styles.textArea}
          editable={!isViewMode}
        />

        {!isViewMode && (
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleClose}
              style={styles.cancelButton}
              disabled={isSubmitting}
            />
            <Button
              title={getSubmitButtonTitle()}
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.createButton}
            />
          </View>
        )}
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
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
  viewFieldContainer: {
    marginBottom: 0,
  },
});

