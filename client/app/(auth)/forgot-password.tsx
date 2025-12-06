import { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions, ScrollView, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemeToggle } from '@/components/theme-toggle';
import { useThemeColor } from '@/hooks/use-theme-color';
import { forgotPassword } from '@/store/auth/auth.thunk';
import type { AppDispatch, RootState } from '@/store';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const maxWidth = isTablet ? 500 : width;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const insets = useSafeAreaInsets();
  
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#ddd', dark: '#333' }, 'background');
  const errorBorderColor = '#ef4444';
  const inputBgColor = useThemeColor({ light: '#fff', dark: '#1a1a1a' }, 'background');
  const buttonColor = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'tint');
  const errorColor = '#ef4444';

  const validateEmail = (emailValue: string): string => {
    if (!emailValue.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleForgotPassword = async () => {
    // Validate email
    const emailErr = validateEmail(email);
    setEmailError(emailErr);

    // If there are validation errors, don't proceed
    if (emailErr) {
      return;
    }

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      Alert.alert(
        'Success',
        'If the email exists, a temporary password has been sent',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(auth)/index' as any),
          },
        ]
      );
    } catch (err) {
      // Handle API errors
      const errorMessage = error || 'An error occurred';
      setEmailError(errorMessage);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <ThemeToggle />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { maxWidth }]}>
          <ThemedText type="title" style={styles.title}>Forgot Password</ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter your email address and we'll send you a temporary password.
          </ThemedText>
          
          <View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBgColor,
                  borderColor: emailError ? errorBorderColor : borderColor,
                  color: textColor,
                }
              ]}
              placeholder="Email"
              placeholderTextColor={useThemeColor({ light: '#999', dark: '#666' }, 'icon')}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />
            <View style={styles.errorContainer}>
              {emailError ? (
                <Text style={[styles.errorText, { color: errorColor }]}>
                  {emailError}
                </Text>
              ) : (
                <View style={styles.errorPlaceholder} />
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: buttonColor },
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleForgotPassword}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Send Reset Link</ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles.links}>
            <TouchableOpacity 
              onPress={() => router.push('/' as any)} 
              activeOpacity={0.7}
            >
              <ThemedText type="link">Back to Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: isTablet ? 40 : 32,
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.7,
    fontSize: isTablet ? 18 : 16,
    paddingHorizontal: 20,
  },
  input: {
    height: isTablet ? 56 : 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: isTablet ? 18 : 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  errorContainer: {
    minHeight: 20,
    marginTop: 4,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorPlaceholder: {
    height: 20,
  },
  button: {
    paddingVertical: isTablet ? 18 : 15,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0a7ea4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  },
  links: {
    marginTop: 24,
    alignItems: 'center',
  },
});
