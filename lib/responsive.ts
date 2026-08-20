import { useEffect, useState } from 'react';
import { Dimensions, PixelRatio, ScaledSize } from 'react-native';

// Design was authored against a 390pt-wide reference device (iPhone 13/14 class).
const GUIDELINE_BASE_WIDTH = 390;
const GUIDELINE_BASE_HEIGHT = 844;

const getWindow = () => Dimensions.get('window');

export const scale = (size: number) => {
  const { width } = getWindow();
  return (width / GUIDELINE_BASE_WIDTH) * size;
};

export const verticalScale = (size: number) => {
  const { height } = getWindow();
  return (height / GUIDELINE_BASE_HEIGHT) * size;
};

// Softened scale so paddings/fonts don't grow or shrink linearly with width,
// which keeps the design intact on very small or very large screens.
export const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

export const moderateVerticalScale = (size: number, factor = 0.5) => {
  return size + (verticalScale(size) - size) * factor;
};

// Clamp font scaling so text never becomes unreadably small or absurdly large.
export const scaleFont = (size: number, min = size * 0.88, max = size * 1.2) => {
  const value = moderateScale(size, 0.3);
  return Math.min(Math.max(value, min), max);
};

export const breakpoints = {
  small: 360, // compact phones (e.g. iPhone SE)
  regular: 400, // standard phones (e.g. iPhone 11/13/14)
  large: 430, // large phones (e.g. Pro Max)
  tablet: 768, // tablets / web
};

export type DeviceSize = 'small' | 'regular' | 'large' | 'tablet';

// Uses the shorter viewport dimension for tablet detection so landscape phones
// (e.g. 844x390) aren't misclassified as tablets based on width alone.
export const getDeviceSize = (width: number, height: number = width): DeviceSize => {
  const shortestSide = Math.min(width, height);

  if (shortestSide >= breakpoints.tablet) return 'tablet';
  if (width >= breakpoints.large) return 'large';
  if (width >= breakpoints.regular) return 'regular';
  return 'small';
};

// Maximum readable content width so layouts don't stretch edge-to-edge on tablets/web.
export const MAX_CONTENT_WIDTH = 520;

interface ResponsiveInfo {
  width: number;
  height: number;
  isSmallDevice: boolean;
  isTablet: boolean;
  deviceSize: DeviceSize;
  fontScale: number;
}

const buildInfo = (window: ScaledSize): ResponsiveInfo => ({
  width: window.width,
  height: window.height,
  isSmallDevice: window.width < breakpoints.regular,
  isTablet: Math.min(window.width, window.height) >= breakpoints.tablet,
  deviceSize: getDeviceSize(window.width, window.height),
  fontScale: PixelRatio.getFontScale(),
});

export const useResponsive = (): ResponsiveInfo => {
  const [info, setInfo] = useState<ResponsiveInfo>(() => buildInfo(getWindow()));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setInfo(buildInfo(window));
    });

    return () => subscription.remove();
  }, []);

  return info;
};
