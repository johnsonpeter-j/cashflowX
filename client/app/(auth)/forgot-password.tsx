import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, TextInput } from '@/components/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { useResponsive } from '@/hooks/use-responsive';
import { useForm } from '@/hooks/use-form';
import { z } from 'zod';
import { validationSchemas } from '@/utils/validation';
import { Spacing } from '@/constants/theme';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPasswordThunk } from '@/store/user/user.thunk';
import { useToast } from '@/hooks/use-toast';

// Forgot password form validation schema
const forgotPasswordSchema = z.object({
  email: validationSchemas.email,
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const toast = useToast();

  const { values, errors, isSubmitting, setValue, handleSubmit, getFieldError } = useForm<ForgotPasswordFormData>({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(forgotPasswordThunk({
          email: values.email,
        })).unwrap();

        if (result && result.success) {
          toast.showSuccess(
            result.message || 'A temporary password has been sent to your email address. Please check your inbox.',
            {
              onHide: () => router.back(),
            }
          );
        }
      } catch (error) {
        console.error('Forgot password error:', error);
        toast.showError(typeof error === 'string' ? error : 'An error occurred. Please check your connection and try again.');
      }
    },
  });

  // Responsive container width
  const containerMaxWidth = isMobile ? '100%' : isTablet ? 500 : 450;
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
                Forgot Password
              </ThemedText>
              <ThemedText type="secondary" style={styles.subtitle}>
                Enter your email address and we'll send you a temporary password
              </ThemedText>
            </View>

            {/* Form Card */}
            <ThemedView style={[globalStyles.card, isDark && globalStyles.cardDark, styles.formCard]}>
              <TextInput
                label="Email"
                placeholder="Enter your email"
                required
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={values.email}
                onChangeText={(text) => setValue('email', text)}
                error={getFieldError('email')}
              />

              {/* Send Temporary Password Button */}
              <Button
                title={isSubmitting || isLoading ? 'Sending...' : 'Send Temporary Password'}
                fullWidth
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
                onPress={handleSubmit}
                style={[globalStyles.marginTopSm, globalStyles.marginBottomMd]}
              />
            </ThemedView>

            {/* Back to Sign In Link */}
            <View style={styles.signInContainer}>
              <ThemedText type="secondary" style={styles.signInText}>
                Remember your password?{' '}
              </ThemedText>
              <Button
                title="Sign In"
                variant="text"
                onPress={() => {
                  router.back();
                }}
                style={styles.signInButton}
              />
            </View>
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
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  signInText: {
    // Font size handled by ThemedText component
  },
  signInButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: 0,
    minHeight: 0,
  },
});

