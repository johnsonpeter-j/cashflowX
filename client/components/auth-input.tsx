import React, { useEffect, useRef } from 'react';
import { TextInput, StyleSheet, View, TextInputProps, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from './themed-text';

interface AuthInputProps extends TextInputProps {
  label?: string;
  error?: string;
  showValidIcon?: boolean;
}

export function AuthInput({ label, error, showValidIcon, style, value, ...props }: AuthInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const bgColor = colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5';
  const borderColor = error 
    ? '#F44336' 
    : colorScheme === 'dark' 
      ? '#404040' 
      : '#E0E0E0';
  const inputRef = useRef<any>(null);
  
  // Determine if we should show the valid icon
  // For email fields, check if it's a valid email format
  const isValid = React.useMemo(() => {
    if (!showValidIcon || !value || error) return false;
    
    const trimmedValue = value.toString().trim();
    if (trimmedValue.length === 0) return false;
    
    const emailRegex = /\S+@\S+\.\S+/;
    if (props.keyboardType === 'email-address' || props.autoComplete === 'email') {
      return emailRegex.test(trimmedValue);
    }
    
    return true;
  }, [showValidIcon, value, error, props.keyboardType, props.autoComplete]);

  // Inject global web-specific styles to override browser autofill
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = `auth-input-autofill-styles-${colorScheme}`;
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      // More aggressive CSS with higher specificity - target all possible selectors
      // Also target normal state to prevent Chrome from applying autofill styles
      styleElement.textContent = `
        /* Target all auth inputs - normal state */
        input[data-testid="auth-input"] {
          background-color: ${bgColor} !important;
          color: ${theme.text} !important;
          border-color: ${borderColor} !important;
          border-width: 1px !important;
          border-style: solid !important;
        }
        /* Target all auth inputs - autofill state */
        input[data-testid="auth-input"]:-webkit-autofill,
        input[data-testid="auth-input"]:-webkit-autofill:hover,
        input[data-testid="auth-input"]:-webkit-autofill:focus,
        input[data-testid="auth-input"]:-webkit-autofill:active,
        input[data-testid="auth-input"]:-webkit-autofill:selection,
        input[data-testid="auth-input"]:-internal-autofill-selected {
          -webkit-box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          -webkit-text-fill-color: ${theme.text} !important;
          box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          background-color: ${bgColor} !important;
          background-image: none !important;
          border-color: ${borderColor} !important;
          border-width: 1px !important;
          border-style: solid !important;
          transition: background-color 5000s ease-in-out 0s, background-image 5000s ease-in-out 0s !important;
          caret-color: ${theme.text} !important;
        }
        /* Specific email input targeting - normal state */
        input[type="email"][data-testid="auth-input"] {
          background-color: ${bgColor} !important;
          color: ${theme.text} !important;
          border-color: ${borderColor} !important;
        }
        /* Specific email input targeting - autofill state */
        input[type="email"][data-testid="auth-input"]:-webkit-autofill,
        input[type="email"][data-testid="auth-input"]:-webkit-autofill:hover,
        input[type="email"][data-testid="auth-input"]:-webkit-autofill:focus,
        input[type="email"][data-testid="auth-input"]:-webkit-autofill:active,
        input[type="email"][data-testid="auth-input"]:-webkit-autofill:selection,
        input[type="email"][data-testid="auth-input"]:-internal-autofill-selected {
          -webkit-box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          -webkit-text-fill-color: ${theme.text} !important;
          box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          background-color: ${bgColor} !important;
          background-image: none !important;
          border-color: ${borderColor} !important;
          border-width: 1px !important;
          border-style: solid !important;
          caret-color: ${theme.text} !important;
        }
        /* Specific password input targeting - normal state */
        input[type="password"][data-testid="auth-input"] {
          background-color: ${bgColor} !important;
          color: ${theme.text} !important;
          border-color: ${borderColor} !important;
        }
        /* Specific password input targeting - autofill state */
        input[type="password"][data-testid="auth-input"]:-webkit-autofill,
        input[type="password"][data-testid="auth-input"]:-webkit-autofill:hover,
        input[type="password"][data-testid="auth-input"]:-webkit-autofill:focus,
        input[type="password"][data-testid="auth-input"]:-webkit-autofill:active,
        input[type="password"][data-testid="auth-input"]:-webkit-autofill:selection,
        input[type="password"][data-testid="auth-input"]:-internal-autofill-selected {
          -webkit-box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          -webkit-text-fill-color: ${theme.text} !important;
          box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          background-color: ${bgColor} !important;
          background-image: none !important;
          border-color: ${borderColor} !important;
          border-width: 1px !important;
          border-style: solid !important;
          caret-color: ${theme.text} !important;
        }
        /* Fallback for inputs without data-testid - normal state */
        input[autocomplete="email"] {
          background-color: ${bgColor} !important;
          border-color: ${borderColor} !important;
        }
        /* Fallback for inputs without data-testid - autofill state */
        input[autocomplete="email"]:-webkit-autofill,
        input[autocomplete="email"]:-webkit-autofill:hover,
        input[autocomplete="email"]:-webkit-autofill:focus,
        input[autocomplete="email"]:-webkit-autofill:active,
        input[autocomplete="email"]:-internal-autofill-selected {
          -webkit-box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          -webkit-text-fill-color: ${theme.text} !important;
          box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          background-color: ${bgColor} !important;
          border-color: ${borderColor} !important;
          caret-color: ${theme.text} !important;
        }
        input[autocomplete="password"] {
          background-color: ${bgColor} !important;
          border-color: ${borderColor} !important;
        }
        input[autocomplete="password"]:-webkit-autofill,
        input[autocomplete="password"]:-webkit-autofill:hover,
        input[autocomplete="password"]:-webkit-autofill:focus,
        input[autocomplete="password"]:-webkit-autofill:active,
        input[autocomplete="password"]:-internal-autofill-selected {
          -webkit-box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          -webkit-text-fill-color: ${theme.text} !important;
          box-shadow: 0 0 0 1000px ${bgColor} inset !important;
          background-color: ${bgColor} !important;
          border-color: ${borderColor} !important;
          caret-color: ${theme.text} !important;
        }
      `;
      
      // Cleanup old style elements when color scheme changes
      return () => {
        const oldStyleId = colorScheme === 'dark' ? 'auth-input-autofill-styles-light' : 'auth-input-autofill-styles-dark';
        const oldStyleElement = document.getElementById(oldStyleId);
        if (oldStyleElement) {
          oldStyleElement.remove();
        }
      };
    }
  }, [bgColor, theme.text, borderColor, colorScheme]);

  // Function to force reapply styles to override Chrome autofill
  const forceApplyStyles = React.useCallback(() => {
    if (Platform.OS === 'web' && inputRef.current) {
      const applyStyles = () => {
        const inputElement = inputRef.current as any;
        if (inputElement) {
          // Try multiple ways to access the DOM element
          let domNode: HTMLElement | null = null;
          
          // Method 1: Direct access via _internalFiberInstanceHandleDEV
          if (inputElement._internalFiberInstanceHandleDEV?.stateNode) {
            domNode = inputElement._internalFiberInstanceHandleDEV.stateNode;
          }
          // Method 2: Access via parent
          else if (inputElement._nativeNode) {
            domNode = inputElement._nativeNode;
          }
          // Method 3: Find by data attribute (use a more specific selector)
          else if (typeof document !== 'undefined') {
            // Try to find the specific input by checking all inputs with the testid
            const inputs = document.querySelectorAll('input[data-testid="auth-input"]');
            // Find the one that matches our value or is focused
            for (let i = 0; i < inputs.length; i++) {
              const input = inputs[i] as HTMLInputElement;
              if (input.value === value || input === document.activeElement) {
                domNode = input;
                break;
              }
            }
            // Fallback to first one if not found
            if (!domNode && inputs.length > 0) {
              domNode = inputs[0] as HTMLElement;
            }
          }
          
          if (domNode && domNode.style) {
            // Force apply all styles with !important
            domNode.style.setProperty('background-color', bgColor, 'important');
            domNode.style.setProperty('color', theme.text, 'important');
            domNode.style.setProperty('border-color', borderColor, 'important');
            domNode.style.setProperty('-webkit-box-shadow', `0 0 0 1000px ${bgColor} inset`, 'important');
            domNode.style.setProperty('-webkit-text-fill-color', theme.text, 'important');
            domNode.style.setProperty('box-shadow', `0 0 0 1000px ${bgColor} inset`, 'important');
            domNode.style.setProperty('background-image', 'none', 'important');
            domNode.style.setProperty('caret-color', theme.text, 'important');
            // Also set computed style directly
            if ((domNode as any).setAttribute) {
              (domNode as any).setAttribute('style', 
                `background-color: ${bgColor} !important; ` +
                `color: ${theme.text} !important; ` +
                `border-color: ${borderColor} !important; ` +
                `-webkit-box-shadow: 0 0 0 1000px ${bgColor} inset !important; ` +
                `-webkit-text-fill-color: ${theme.text} !important; ` +
                `box-shadow: 0 0 0 1000px ${bgColor} inset !important; ` +
                `background-image: none !important; ` +
                `caret-color: ${theme.text} !important;`
              );
            }
          }
        }
      };
      
      // Apply immediately
      applyStyles();
      
      // Apply again after a short delay to catch autofill
      setTimeout(applyStyles, 50);
      setTimeout(applyStyles, 100);
      setTimeout(applyStyles, 200);
      setTimeout(applyStyles, 500);
    }
  }, [bgColor, theme.text, borderColor, value]);

  // Reapply styles when value changes (for autofill detection)
  useEffect(() => {
    if (Platform.OS === 'web' && value) {
      forceApplyStyles();
    }
  }, [value, forceApplyStyles]);

  const handleFocus = () => {
    forceApplyStyles();
  };

  const handleChange = (text: string) => {
    // Call original onChange if provided
    props.onChangeText?.(text);
    
    // Force reapply styles after change
    setTimeout(() => {
      forceApplyStyles();
    }, 10);
  };

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText style={styles.label}>{label}</ThemedText>
      ) : null}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          testID="auth-input"
          data-testid="auth-input"
          value={value}
          onFocus={(e) => {
            handleFocus();
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            handleFocus();
            props.onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              backgroundColor: bgColor,
              color: theme.text,
              borderColor: borderColor,
              paddingRight: isValid ? 50 : 16,
            },
            error && styles.inputError,
            Platform.OS === 'web' && styles.webInput,
            Platform.OS === 'web' && {
              // Additional web-specific inline styles
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
              appearance: 'none',
              outline: 'none',
              boxShadow: `0 0 0 1000px ${bgColor} inset`,
            },
            style,
          ]}
          placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
          {...props}
          onChangeText={handleChange}
        />
        {isValid ? (
          <View style={styles.iconContainer}>
            <View style={[
              styles.iconWrapper,
              Platform.OS === 'web' ? {
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              } : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }
            ]}>
              <MaterialIcons name="email" size={16} color="#E8E8E8" />
              <View style={styles.checkmarkContainer}>
                <MaterialIcons name="check" size={8} color="#4DD0E1" />
              </View>
            </View>
          </View>
        ) : null}
      </View>
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    outlineStyle: 'none', // Remove web outline
  },
  webInput: {
    // Web-specific styles to ensure consistency
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    appearance: 'none',
  },
  inputError: {
    borderColor: '#F44336',
  },
  iconContainer: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4DD0E1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4DD0E1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
});

