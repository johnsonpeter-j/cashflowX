import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useToast } from '@/hooks/use-toast';
import { Image } from 'expo-image';

interface ProfilePopoverProps {
  visible: boolean;
  onClose: () => void;
  anchorPosition?: { x: number; y: number };
}

export function ProfilePopover({ visible, onClose, anchorPosition }: ProfilePopoverProps) {
  const colorScheme = useColorScheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const isDark = colorScheme === 'dark';

  const handleProfilePress = () => {
    onClose();
    router.push('/(main-screen)/profile');
  };

  const handleChangePasswordPress = () => {
    onClose();
    router.push('/(main-screen)/change-password');
  };

  const handleLogoutPress = async () => {
    try {
      onClose(); // Close popover first
      await signOut(); // Clear AsyncStorage and Redux state
      toast.showSuccess('Signed out successfully');
      // Use replace to redirect (not navigate) - this clears navigation history and state
      router.replace('/(auth)/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.showError('Failed to sign out. Please try again.');
    }
  };

  const menuItems = [
    { label: 'Profile', icon: 'person', onPress: handleProfilePress },
    { label: 'Change Password', icon: 'lock', onPress: handleChangePasswordPress },
    { label: 'Logout', icon: 'logout', onPress: handleLogoutPress, isDestructive: true },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <ThemedView
              style={[
                styles.popover,
                {
                  backgroundColor: isDark ? Colors.dark.backgroundSecondary : Colors.light.background,
                  borderColor: isDark ? Colors.dark.border : Colors.light.border,
                  ...Shadows.lg,
                },
              ]}
            >
              {/* Profile Info Section */}
              <View
                style={[
                  styles.profileSection,
                  { borderBottomColor: isDark ? Colors.dark.border : Colors.light.border },
                ]}
              >
                {user?.profileImageUrl ? (
                  <Image
                    source={{ uri: user.profileImageUrl }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: Colors.light.primary }]}>
                    <ThemedText type="defaultSemiBold" style={styles.avatarText}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </ThemedText>
                  </View>
                )}
                <View style={styles.profileInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.userName}>
                    {user?.name || 'User'}
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.userEmail}>
                    {user?.email || ''}
                  </ThemedText>
                </View>
              </View>

              {/* Menu Items */}
              <View style={styles.menuItems}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      styles.menuItem,
                      index < menuItems.length - 1 && {
                        borderBottomColor: isDark ? Colors.dark.border : Colors.light.border,
                        borderBottomWidth: 1,
                      },
                    ]}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconContainer}>
                      <IconSymbol
                        name={item.icon as any}
                        size={20}
                        color={
                          item.isDestructive
                            ? Colors.light.error
                            : isDark
                              ? Colors.dark.icon
                              : Colors.light.icon
                        }
                      />
                    </View>
                    <ThemedText
                      style={[
                        styles.menuItemText,
                        item.isDestructive && { color: Colors.light.error },
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ThemedView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 64 + Spacing.xs, // Below AppBar + small offset
    paddingRight: Spacing.md,
  },
  popover: {
    width: 280,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: 12,
  },
  menuItems: {
    paddingVertical: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  menuItemText: {
    fontSize: 14,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
});

