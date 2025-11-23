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
import { signInThunk } from '@/store/slices/authSlice';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Sign-in form validation schema
const signInSchema = z.object({
  email: validationSchemas.email,
  password: validationSchemas.password,
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();
  const { signIn } = useAuth();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const toast = useToast();

  const { values, errors, isSubmitting, setValue, handleSubmit, getFieldError } = useForm<SignInFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(signInThunk({
          email: values.email,
          password: values.password,
        })).unwrap();

        if (result) {
          await signIn(result);
          toast.showSuccess('Sign in successful!');
          // Navigate to dashboard after successful sign in
          router.replace('/(main-screen)/dashboard');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        toast.showError(typeof error === 'string' ? error : 'An error occurred while signing in. Please try again.');
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
                Welcome Back
              </ThemedText>
              <ThemedText type="secondary" style={styles.subtitle}>
                Sign in to your CashFlowX account
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

              <TextInput
                label="Password"
                placeholder="Enter your password"
                required
                secureTextEntry
                value={values.password}
                onChangeText={(text) => setValue('password', text)}
                error={getFieldError('password')}
              />

              {/* Forgot Password Link */}
              <View style={styles.forgotPasswordContainer}>
                <Button
                  title="Forgot Password?"
                  variant="text"
                  onPress={() => {
                    router.push('/(auth)/forgot-password');
                  }}
                  style={styles.forgotPasswordButton}
                />
              </View>

              {/* Sign In Button */}
              <Button
                title={isSubmitting || isLoading ? 'Signing in...' : 'Sign In'}
                fullWidth
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
                onPress={handleSubmit}
                style={[globalStyles.marginTopSm, globalStyles.marginBottomMd]}
              />
            </ThemedView>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <ThemedText type="secondary" style={styles.signUpText}>
                Don't have an account?{' '}
              </ThemedText>
              <Button
                title="Sign Up"
                variant="text"
                onPress={() => {
                  router.push('/(auth)/signup');
                }}
                style={styles.signUpButton}
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  forgotPasswordButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: 0,
    minHeight: 0,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  signUpText: {
    // Font size handled by ThemedText component
  },
  signUpButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: 0,
    minHeight: 0,
  },
});



