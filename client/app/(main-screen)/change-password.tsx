import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, TextInput } from '@/components/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { globalStyles } from '@/styles/global';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/use-form';
import { z } from 'zod';
import { validationSchemas } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/store/hooks';
import { changePasswordThunk } from '@/store/user/user.thunk';

// Change password form validation schema
const changePasswordSchema = z
  .object({
    currentPassword: validationSchemas.requiredString.min(1, 'Current password is required'),
    password: validationSchemas.password,
    confirmPassword: validationSchemas.requiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordScreen() {
  const colorScheme = useColorScheme();
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const isDark = colorScheme === 'dark';
  const { token } = useAuth();
  const toast = useToast();
  const dispatch = useAppDispatch();

  const { values, errors, isSubmitting, setValue, handleSubmit, getFieldError } = useForm<ChangePasswordFormData>({
    initialValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      try {
        if (!token) {
          toast.showError('Authentication required. Please sign in again.');
          return;
        }

        await dispatch(
          changePasswordThunk({
            data: {
              currentPassword: values.currentPassword,
              newPassword: values.password,
              confirmPassword: values.confirmPassword,
            },
            token,
          })
        ).unwrap();
        
        toast.showSuccess('Password changed successfully!');
        
        // Clear form
        setValue('currentPassword', '');
        setValue('password', '');
        setValue('confirmPassword', '');
      } catch (error: any) {
        console.error('Change password error:', error);
        toast.showError(error || 'Failed to change password. Please try again.');
      }
    },
  });

  // Responsive container width
  const containerMaxWidth = isMobile ? '100%' : isTablet ? 600 : 500;
  const horizontalPadding = isMobile ? Spacing.md : isTablet ? Spacing.lg : Spacing.xl;

  return (
    <ThemedView style={[globalStyles.container, isDark && globalStyles.containerDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, { maxWidth: containerMaxWidth, alignSelf: 'center', width: '100%' }]}>
            {/* Header Section */}
            <View style={styles.header}>
              <ThemedText type="heading1" style={[styles.title, globalStyles.marginBottomSm]}>
                Change Password
              </ThemedText>
              <ThemedText type="secondary" style={styles.subtitle}>
                Enter your current password and choose a new one
              </ThemedText>
            </View>

            {/* Form Card */}
            <ThemedView style={[globalStyles.card, isDark && globalStyles.cardDark, styles.formCard]}>
              {/* Current Password Field */}
              <TextInput
                label="Current Password"
                placeholder="Enter your current password"
                required
                secureTextEntry
                autoCapitalize="none"
                value={values.currentPassword}
                onChangeText={(text) => setValue('currentPassword', text)}
                error={getFieldError('currentPassword')}
              />

              {/* New Password Field */}
              <TextInput
                label="New Password"
                placeholder="Enter your new password"
                required
                secureTextEntry
                autoCapitalize="none"
                value={values.password}
                onChangeText={(text) => setValue('password', text)}
                error={getFieldError('password')}
                helperText="Password must be at least 8 characters long"
              />

              {/* Confirm Password Field */}
              <TextInput
                label="Confirm New Password"
                placeholder="Confirm your new password"
                required
                secureTextEntry
                autoCapitalize="none"
                value={values.confirmPassword}
                onChangeText={(text) => setValue('confirmPassword', text)}
                error={getFieldError('confirmPassword')}
              />

              {/* Change Password Button */}
              <Button
                title={isSubmitting ? 'Changing Password...' : 'Change Password'}
                fullWidth
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={handleSubmit}
                style={[globalStyles.marginTopMd, globalStyles.marginBottomMd]}
              />
            </ThemedView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Spacing.xl,
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
});

