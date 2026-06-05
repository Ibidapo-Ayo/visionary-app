export const colors = {
  background: '#050505',
  backgroundElevated: '#121212',
  surface: 'rgba(255,255,255,0.06)',
  surfaceStrong: 'rgba(255,255,255,0.12)',
  surfaceMuted: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.18)',
  borderSoft: 'rgba(255,255,255,0.1)',
  textPrimary: '#FFFFFF',
  textSecondary: '#D9D2C8',
  textMuted: '#A69C90',
  primary: '#FF7A1A',
  primaryStrong: '#FF8F34',
  primarySoft: 'rgba(255,122,26,0.2)',
  accentGreen: '#35D07F',
  accentGreenSoft: 'rgba(53,208,127,0.22)',
  accentWhite: '#FDFBF6',
  success: '#35D07F',
  danger: '#FF6E62',
  black: '#050505',
  white: '#FFFFFF',
  // Backward-compatible aliases
  accentGold: '#FF8F34',
  accentAmber: '#FF7A1A',
  accentViolet: '#1E1E1E',
  accentTeal: '#35D07F',
};

export const gradients = {
  screen: ['#050505', '#0F0D0A', '#1A120B'] as const,
  hero: ['rgba(255,122,26,0.42)', 'rgba(255,122,26,0.18)', 'rgba(0,0,0,0)'] as const,
  cta: ['#FF8F34', '#FF7A1A', '#E9600A'] as const,
  warm: ['rgba(53,208,127,0.45)', 'rgba(53,208,127,0.05)'] as const,
  success: ['#35D07F', '#1EA963'] as const,
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
};

export const typography = {
  display: { fontSize: 34, lineHeight: 42 },
  h1: { fontSize: 28, lineHeight: 35 },
  h2: { fontSize: 22, lineHeight: 29 },
  h3: { fontSize: 18, lineHeight: 24 },
  body: { fontSize: 15, lineHeight: 22 },
  bodySm: { fontSize: 13, lineHeight: 19 },
  caption: { fontSize: 11, lineHeight: 16 },
};

export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  strong: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 14,
  },
  glow: {
    shadowColor: '#FF7A1A',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
};

export const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
