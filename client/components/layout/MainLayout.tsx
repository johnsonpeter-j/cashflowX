import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { Sidebar } from './Sidebar';
import { AppBar } from './AppBar';
import { useResponsive } from '@/hooks/use-responsive';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const colorScheme = useColorScheme();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Open by default on tablet/laptop
  const isDark = colorScheme === 'dark';

  // Update sidebar state when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const handleMenuPress = () => {
    // Toggle sidebar on mobile (open/close)
    setSidebarOpen((prev) => !prev);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Calculate sidebar width for content margin
  const sidebarWidth = isMobile ? 0 : sidebarOpen ? 240 : 72;

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
        },
      ]}
    >
      {/* AppBar - Full width at top */}
      <AppBar
        onMenuPress={handleMenuPress}
        onToggleSidebar={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
      />

      {/* Content Row - Sidebar + Main Content */}
      <View style={styles.contentRow}>
        {/* Sidebar - Part of flex layout on tablet/laptop, overlay on mobile */}
        {!isMobile && (
          <View style={{ width: sidebarWidth, flexShrink: 0 }}>
            <Sidebar
              isOpen={sidebarOpen}
              onToggle={handleSidebarToggle}
              onClose={handleSidebarClose}
            />
          </View>
        )}

        {/* Mobile Sidebar (overlay) */}
        {isMobile && (
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={handleSidebarToggle}
            onClose={handleSidebarClose}
          />
        )}

        {/* Main Content Area - Adjusts width automatically */}
        <View style={styles.contentArea}>
          {/* Page Content */}
          <View style={styles.pageContent}>{children}</View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentArea: {
    flex: 1,
    minWidth: 0, // Prevents flex overflow
  },
  pageContent: {
    flex: 1,
    overflow: 'hidden',
  },
});
