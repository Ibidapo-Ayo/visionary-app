export const colors = {
  background: '#F4F7F5',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceStrong: '#EEF4F0',
  surfaceMuted: '#F8FBF9',
  border: '#D5E1D8',
  borderSoft: '#E5EEE8',
  textPrimary: '#000000',
  textSecondary: '#2D3A33',
  textMuted: '#718078',
  primary: '#D85A16',
  primaryStrong: '#A84413',
  primarySoft: 'rgba(216,90,22,0.14)',
  accentGreen: '#0A9336',
  accentGreenSoft: 'rgba(10,147,54,0.16)',
  accentWhite: '#FFFFFF',
  success: '#0A9336',
  danger: '#D94E00',
  black: '#000000',
  white: '#FFFFFF',
  accentOrange: '#FF6B09',
  // Backward-compatible aliases
  accentGold: '#FF6B09',
  accentAmber: '#FF6B09',
  accentViolet: '#1D3326',
  accentTeal: '#0A9336',
};

export const gradients = {
  screen: ['#F8FCF9', '#F2F8F4', '#EDF5F0'] as const,
  hero: ['rgba(216,90,22,0.2)', 'rgba(216,90,22,0.06)', 'rgba(255,255,255,0.82)'] as const,
  cta: ['#D85A16', '#D85A16', '#D85A16'] as const,
  warm: ['rgba(255,107,9,0.22)', 'rgba(255,107,9,0.04)'] as const,
  success: ['#1DA74A', '#0A9336'] as const,
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 14,
  md: 18,
  lg: 28,
  xl: 36,
  xxl: 48,
};

export const radius = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 34,
  pill: 999,
};

export const typography = {
  display: { fontSize: 42, lineHeight: 50 },
  h1: { fontSize: 34, lineHeight: 42 },
  h2: { fontSize: 26, lineHeight: 34 },
  h3: { fontSize: 20, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24 },
  bodySm: { fontSize: 14, lineHeight: 21 },
  caption: { fontSize: 11, lineHeight: 16 },
};

export const shadows = {
  soft: {
    shadowColor: '#09130C',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  strong: {
    shadowColor: '#09130C',
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  glow: {
    shadowColor: '#D85A16',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
