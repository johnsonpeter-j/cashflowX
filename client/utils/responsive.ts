import { Dimensions, Platform, ScaledSize } from 'react-native';
import { Breakpoints } from '@/constants/theme';

type DeviceType = 'mobile' | 'tablet' | 'laptop';

let windowDimensions: ScaledSize = Dimensions.get('window');

// Update dimensions on resize (for web/tablet)
Dimensions.addEventListener('change', ({ window }) => {
  windowDimensions = window;
});

export function getDeviceType(): DeviceType {
  const width = windowDimensions.width;
  
  if (width >= Breakpoints.laptop) {
    return 'laptop';
  } else if (width >= Breakpoints.tablet) {
    return 'tablet';
  }
  return 'mobile';
}

export function useResponsiveValue<T>(
  mobile: T,
  tablet?: T,
  laptop?: T
): T {
  const deviceType = getDeviceType();
  
  if (deviceType === 'laptop' && laptop !== undefined) {
    return laptop;
  } else if (deviceType === 'tablet' && tablet !== undefined) {
    return tablet;
  }
  return mobile;
}

export function isMobile(): boolean {
  return getDeviceType() === 'mobile';
}

export function isTablet(): boolean {
  return getDeviceType() === 'tablet';
}

export function isLaptop(): boolean {
  return getDeviceType() === 'laptop';
}

export function getScreenWidth(): number {
  return windowDimensions.width;
}

export function getScreenHeight(): number {
  return windowDimensions.height;
}

// Responsive spacing multiplier
export function getSpacingMultiplier(): number {
  const deviceType = getDeviceType();
  if (deviceType === 'laptop') return 1.5;
  if (deviceType === 'tablet') return 1.25;
  return 1;
}

// Responsive font size multiplier
export function getFontMultiplier(): number {
  const deviceType = getDeviceType();
  if (deviceType === 'laptop') return 1.15;
  if (deviceType === 'tablet') return 1.1;
  return 1;
}

