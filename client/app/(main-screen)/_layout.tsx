import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { MainLayout } from '@/components/layout/MainLayout';

export default function MainScreenLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/" />;
  }

  return (
    <MainLayout>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="transaction" />
        <Stack.Screen name="category" />
        <Stack.Screen name="subcategory" />
        <Stack.Screen name="budget" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="change-password" />
    </Stack>
    </MainLayout>
  );
}



