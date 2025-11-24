import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import { router } from 'expo-router';
import { useToast } from '@/hooks/use-toast';

export default function SettingsScreen() {
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
      <ThemedText type="heading1">Settings</ThemedText>
      {user && (
        <View style={styles.userInfo}>
          <ThemedText type="defaultSemiBold">Name: {user.name}</ThemedText>
          <ThemedText type="secondary">Email: {user.email}</ThemedText>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Out"
          variant="secondary"
          onPress={handleSignOut}
          style={styles.signOutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  userInfo: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
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

