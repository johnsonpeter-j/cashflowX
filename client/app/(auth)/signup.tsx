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
import { signUpThunk } from '@/store/slices/authSlice';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Sign-up form validation schema
const signUpSchema = z.object({
  name: validationSchemas.requiredString.min(2, 'Name must be at least 2 characters'),
  email: validationSchemas.email,
  password: validationSchemas.password,
  confirmPassword: validationSchemas.requiredString,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();
  const { signIn } = useAuth();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const toast = useToast();

  const { values, errors, isSubmitting, setValue, handleSubmit, getFieldError } = useForm<SignUpFormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(signUpThunk({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        })).unwrap();

        if (result) {
          await signIn(result);
          toast.showSuccess('Account created successfully!');
          // Navigate to dashboard after successful sign up
          router.replace('/(main-screen)/dashboard');
        }
      } catch (error) {
        console.error('Sign up error:', error);
        toast.showError(typeof error === 'string' ? error : 'An error occurred while signing up. Please try again.');
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
                Create Account
              </ThemedText>
              <ThemedText type="secondary" style={styles.subtitle}>
                Sign up to get started with CashFlowX
              </ThemedText>
            </View>

            {/* Form Card */}
            <ThemedView style={[globalStyles.card, isDark && globalStyles.cardDark, styles.formCard]}>
              <TextInput
                label="Full Name"
                placeholder="Enter your full name"
                required
                autoCapitalize="words"
                value={values.name}
                onChangeText={(text) => setValue('name', text)}
                error={getFieldError('name')}
              />

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

              <TextInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                secureTextEntry
                value={values.confirmPassword}
                onChangeText={(text) => setValue('confirmPassword', text)}
                error={getFieldError('confirmPassword')}
              />

              {/* Sign Up Button */}
              <Button
                title={isSubmitting || isLoading ? 'Creating Account...' : 'Sign Up'}
                fullWidth
                disabled={isSubmitting || isLoading}
                loading={isSubmitting || isLoading}
                onPress={handleSubmit}
                style={[globalStyles.marginTopSm, globalStyles.marginBottomMd]}
              />
            </ThemedView>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <ThemedText type="secondary" style={styles.signInText}>
                Already have an account?{' '}
              </ThemedText>
              <Button
                title="Sign In"
                variant="text"
                onPress={() => {
                  router.push('/(auth)/');
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



