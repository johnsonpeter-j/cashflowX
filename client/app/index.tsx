import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/themed-view';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    // User is authenticated - redirect to dashboard
    return <Redirect href="/(main-screen)/dashboard" />;
  } else {
    // User is not authenticated - redirect to sign-in
    return <Redirect href="/(auth)/" />;
  }
}
