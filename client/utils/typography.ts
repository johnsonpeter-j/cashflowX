import { Typography, TypographyMobile } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';

// Get responsive typography based on device type
export function getResponsiveTypography() {
  const { isMobile } = useResponsive();
  return isMobile ? TypographyMobile : Typography;
}

// Helper function to get responsive font size (can be used outside components)
export function getTypography(isMobile: boolean) {
  return isMobile ? TypographyMobile : Typography;
}





