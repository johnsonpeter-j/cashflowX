import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import { Breakpoints } from '@/constants/theme';

export type DeviceType = 'mobile' | 'tablet' | 'laptop';

export function useResponsive() {
  const [dimensions, setDimensions] = useState(() => {
    // On web, use window.innerWidth for more accurate viewport detection
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return Dimensions.get('window');
  });

  useEffect(() => {
    const updateDimensions = ({ window }: { window: { width: number; height: number } }) => {
      setDimensions(window);
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);

    // For web, also listen to window resize
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handleResize);
      return () => {
        subscription?.remove();
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => subscription?.remove();
  }, []);

  const width = dimensions.width;
  const height = dimensions.height;

  const isMobile = width < Breakpoints.tablet;
  const isTablet = width >= Breakpoints.tablet && width < Breakpoints.laptop;
  const isLaptop = width >= Breakpoints.laptop;

  const deviceType: DeviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'laptop';

  return {
    width,
    height,
    isMobile,
    isTablet,
    isLaptop,
    deviceType,
    isWeb: Platform.OS === 'web',
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  };
}

export function useResponsiveValue<T>(values: { mobile: T; tablet?: T; laptop?: T }): T {
  const { isMobile, isTablet, isLaptop } = useResponsive();

  if (isMobile) return values.mobile;
  if (isTablet) return values.tablet ?? values.mobile;
  if (isLaptop) return values.laptop ?? values.tablet ?? values.mobile;

  return values.mobile;
}


