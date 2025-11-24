import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { ProfilePopover } from './ProfilePopover';

interface AppBarProps {
  onMenuPress?: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export function AppBar({ onMenuPress, onToggleSidebar, sidebarOpen }: AppBarProps) {
  const colorScheme = useColorScheme();
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const { user } = useAuth();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const [profilePopoverVisible, setProfilePopoverVisible] = useState(false);
  
  // Show toggle button only on mobile, not on tablet or laptop
  const showToggleButton = isMobile;

  const handleAvatarPress = () => {
    setProfilePopoverVisible(true);
  };

  return (
    <ThemedView
      style={[
        styles.appBar,
        {
          backgroundColor: isDark ? Colors.dark.backgroundSecondary : Colors.light.background,
          borderBottomColor: isDark ? Colors.dark.border : Colors.light.border,
        },
      ]}
    >
      <View style={styles.leftSection}>
        {/* Menu/Toggle Button - Show on mobile and tablet, but not on laptop */}
        {showToggleButton && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={isMobile ? onMenuPress : onToggleSidebar}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={(isMobile || isTablet) && sidebarOpen ? "xmark" : "line.3.horizontal"}
              size={24}
              color={isDark ? Colors.dark.icon : Colors.light.icon}
            />
          </TouchableOpacity>
        )}

        {/* Logo and App Name */}
        <View style={styles.logoSection}>
          {(isTablet || isLaptop) && (
            <View style={[styles.logoContainer, { backgroundColor: Colors.light.primary }]}>
              <ThemedText type="defaultSemiBold" style={styles.logoText}>
                CFX
              </ThemedText>
            </View>
          )}
          <ThemedText type="heading2" style={styles.appName}>
            CashFlowX
          </ThemedText>
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Theme Toggle */}
        <View style={styles.themeToggleContainer}>
          <ThemeToggle compact />
        </View>

        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleAvatarPress}
          activeOpacity={0.7}
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
        </TouchableOpacity>
      </View>

      {/* Profile Popover */}
      <ProfilePopover
        visible={profilePopoverVisible}
        onClose={() => setProfilePopoverVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    height: 64,
    zIndex: 100,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  themeToggleContainer: {
    // ThemeToggle has its own styling
  },
  avatarContainer: {
    padding: Spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

