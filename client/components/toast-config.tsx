import React from 'react';
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

/**
 * Custom toast configuration
 * Provides styled toast messages for success, error, info, and warning
 * Supports light/dark mode
 */
export const toastConfig = {
  success: (props: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: '#4CAF50',
          backgroundColor: '#4CAF50',
          height: 60,
          alignSelf: 'flex-end',
          marginRight: 16,
          marginTop: 16,
          maxWidth: '85%',
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#FFFFFF',
        }}
        text2Style={{
          fontSize: 13,
          color: '#FFFFFF',
        }}
      />
    );
  },
  
  error: (props: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: '#F44336',
          backgroundColor: '#F44336',
          height: 60,
          alignSelf: 'flex-end',
          marginRight: 16,
          marginTop: 16,
          maxWidth: '85%',
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#FFFFFF',
        }}
        text2Style={{
          fontSize: 13,
          color: '#FFFFFF',
        }}
      />
    );
  },
  
  info: (props: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
      <InfoToast
        {...props}
        style={{
          borderLeftColor: '#2196F3',
          backgroundColor: '#2196F3',
          height: 60,
          alignSelf: 'flex-end',
          marginRight: 16,
          marginTop: 16,
          maxWidth: '85%',
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#FFFFFF',
        }}
        text2Style={{
          fontSize: 13,
          color: '#FFFFFF',
        }}
      />
    );
  },
  
  warning: (props: any) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: '#FF9800',
          backgroundColor: '#FF9800',
          height: 60,
          alignSelf: 'flex-end',
          marginRight: 16,
          marginTop: 16,
          maxWidth: '85%',
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#FFFFFF',
        }}
        text2Style={{
          fontSize: 13,
          color: '#FFFFFF',
        }}
      />
    );
  },
};

