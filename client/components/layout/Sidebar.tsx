import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'square.grid.2x2', route: '/(main-screen)/dashboard' },
  { label: 'Transaction', icon: 'arrow.left.arrow.right', route: '/(main-screen)/transaction' },
  { label: 'Category', icon: 'folder', route: '/(main-screen)/category' },
  { label: 'Subcategory', icon: 'subcategory', route: '/(main-screen)/subcategory' },
  { label: 'Budget', icon: 'chart.pie', route: '/(main-screen)/budget' },
  { label: 'Settings', icon: 'gearshape', route: '/(main-screen)/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onToggle, onClose }: SidebarProps) {
  const colorScheme = useColorScheme();
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isDark = colorScheme === 'dark';

  const [slideAnim] = useState(new Animated.Value(isMobile ? -Dimensions.get('window').width : 0));

  React.useEffect(() => {
    if (isMobile) {
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : -Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, isMobile]);

  const handleMenuItemPress = (route: string) => {
    router.push(route as any);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const isActive = (route: string) => {
    return pathname === route;
  };

  // Mobile: Drawer overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <TouchableOpacity
            style={styles.backdrop} // Full screen backdrop
            activeOpacity={1}
            onPress={onClose}
          />
        )}
        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            styles.mobileSidebar,
            {
              backgroundColor: isDark ? Colors.dark.backgroundSecondary : Colors.light.background,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.mobileSidebarContent}>
            {/* AppBar space for mobile - to push content below AppBar */}
            <View style={{ height: 64 }} />
            {/* Menu Items */}
            <View style={styles.mobileMenuItems}>
              {menuItems.map((item) => {
                const active = isActive(item.route);
                return (
                  <TouchableOpacity
                    key={item.route}
                    style={[
                      styles.menuItem,
                      active && {
                        backgroundColor: isDark
                          ? Colors.dark.primary + '20'
                          : Colors.light.primary + '15',
                      },
                    ]}
                    onPress={() => handleMenuItemPress(item.route)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name={item.icon as any}
                      size={24}
                      color={
                        active
                          ? Colors.light.primary
                          : isDark
                            ? Colors.dark.icon
                            : Colors.light.icon
                      }
                    />
                    <ThemedText
                      type={active ? 'defaultSemiBold' : 'default'}
                      style={[
                        styles.menuItemText,
                        active && { color: Colors.light.primary },
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </>
    );
  }

  // Tablet/Laptop: Collapsible sidebar
  const sidebarWidth = isOpen ? 240 : 72;

  return (
    <ThemedView
      style={[
        styles.sidebar,
        styles.desktopSidebar,
        {
          width: sidebarWidth,
          backgroundColor: isDark ? Colors.dark.backgroundSecondary : Colors.light.background,
          borderRightColor: isDark ? Colors.dark.border : Colors.light.border,
        },
      ]}
    >
      <View style={styles.sidebarContent}>
        {/* Toggle Button - Right aligned when open, centered when closed */}
        <View
          style={[
            (isTablet || isLaptop) && styles.toggleButtonContainer,
            !isOpen && (isTablet || isLaptop) && styles.toggleButtonContainerClosed,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.toggleButton,
              (isTablet || isLaptop) && isOpen && styles.toggleButtonRight,
              (isTablet || isLaptop) && !isOpen && styles.toggleButtonCentered,
            ]}
            onPress={onToggle}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={isOpen ? 'chevron.left' : 'chevron.right'}
              size={20}
              color={isDark ? Colors.dark.icon : Colors.light.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItems}>
          {menuItems.map((item) => {
            const active = isActive(item.route);
            return (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.menuItem,
                  !isOpen && styles.menuItemCollapsed,
                  active && {
                    backgroundColor: isDark
                      ? Colors.dark.primary + '20'
                      : Colors.light.primary + '15',
                  },
                ]}
                onPress={() => handleMenuItemPress(item.route)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={item.icon as any}
                  size={24}
                  color={
                    active
                      ? Colors.light.primary
                      : isDark
                        ? Colors.dark.icon
                        : Colors.light.icon
                  }
                />
                {isOpen && (
                  <ThemedText
                    type={active ? 'defaultSemiBold' : 'default'}
                    style={[
                      styles.menuItemText,
                      active && { color: Colors.light.primary },
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebar: {
    ...Shadows.lg,
  },
  mobileSidebar: {
    position: 'absolute',
    top: 0, // Start from top of screen for mobile drawer
    left: 0,
    bottom: 0,
    zIndex: 999,
    width: Dimensions.get('window').width * 0.8,
    maxWidth: 320,
    // Ensure background is fully opaque and covers entire area
    overflow: 'hidden',
  },
  desktopSidebar: {
    height: '100%',
    borderRightWidth: 1,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  mobileSidebarContent: {
    flex: 1,
    paddingTop: 0, // No top padding for mobile - no toggle button, menu starts immediately
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  toggleButtonContainerClosed: {
    justifyContent: 'center',
  },
  toggleButton: {
    padding: Spacing.sm,
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  toggleButtonRight: {
    marginHorizontal: 0,
    marginBottom: 0,
    marginLeft: 'auto',
  },
  toggleButtonCentered: {
    marginHorizontal: 0,
    marginBottom: Spacing.md,
    alignSelf: 'center',
  },
  userSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  userName: {
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: 12,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  mobileMenuItems: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: 0, // No top padding for mobile - menu starts immediately
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  menuItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  menuItemText: {
    fontSize: 14,
  },
});

