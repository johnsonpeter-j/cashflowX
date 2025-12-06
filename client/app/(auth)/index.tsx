import { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions, ScrollView, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemeToggle } from '@/components/theme-toggle';
import { useThemeColor } from '@/hooks/use-theme-color';
import { signIn } from '@/store/auth/auth.thunk';
import type { AppDispatch, RootState } from '@/store';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const maxWidth = isTablet ? 500 : width;

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const insets = useSafeAreaInsets();
  
  const backgroundColor = useThemeColor({}, 'background');
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

  const validatePassword = (passwordValue: string): string => {
    if (!passwordValue) {
      return 'Password is required';
    }
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleSignIn = async () => {
    // Validate fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    // If there are validation errors, don't proceed
    if (emailErr || passwordErr) {
      return;
    }

    try {
      await dispatch(signIn({ email, password })).unwrap();
      router.replace('/(tabs)' as any);
    } catch (err) {
      // Handle API errors - could be email/password specific
      const errorMessage = error || 'An error occurred';
      if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('invalid')) {
        setEmailError(errorMessage);
      } else if (errorMessage.toLowerCase().includes('password')) {
        setPasswordError(errorMessage);
      } else {
        // General error - could show as a general error or on both fields
        setPasswordError(errorMessage);
      }
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
          <ThemedText type="title" style={styles.title}>Sign In</ThemedText>
          
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
          
          <View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBgColor,
                  borderColor: passwordError ? errorBorderColor : borderColor,
                  color: textColor,
                }
              ]}
              placeholder="Password"
              placeholderTextColor={useThemeColor({ light: '#999', dark: '#666' }, 'icon')}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
            />
            <View style={styles.errorContainer}>
              {passwordError ? (
                <Text style={[styles.errorText, { color: errorColor }]}>
                  {passwordError}
                </Text>
              ) : (
                <View style={styles.errorPlaceholder} />
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.forgotPasswordLink}
            onPress={() => router.push('./forgot-password')} 
            activeOpacity={0.7}
          >
            <ThemedText type="link">Forgot Password?</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: buttonColor },
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles.links}>
            <TouchableOpacity onPress={() => router.push('./sign-up')} activeOpacity={0.7}>
              <ThemedText type="link">Don't have an account? Sign Up</ThemedText>
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
    marginBottom: 30,
    textAlign: 'center',
    fontSize: isTablet ? 40 : 32,
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
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorPlaceholder: {
    height: 20,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
  },
  button: {
    paddingVertical: isTablet ? 18 : 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
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
    gap: 12,
  },
});
