import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import { router } from 'expo-router';
import { useToast } from '@/hooks/use-toast';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, signOut } = useAuth();
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.showSuccess('Signed out successfully');
      router.replace('/(auth)/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.showError('Failed to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="heading1" style={styles.title}>
          Dashboard
        </ThemedText>
        {user && (
          <ThemedText type="secondary" style={styles.subtitle}>
            Welcome back, {user.name}!
          </ThemedText>
        )}
        <ThemedText type="secondary" style={styles.subtitle}>
          Welcome to your CashFlowX dashboard
        </ThemedText>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Sign Out"
            variant="secondary"
            onPress={handleSignOut}
            style={styles.signOutButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
    width: '100%',
    maxWidth: 300,
  },
  signOutButton: {
    marginTop: Spacing.md,
  },
});



