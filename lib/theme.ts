export const colors = {
  background: '#060B1B',
  backgroundElevated: '#0B1530',
  surface: 'rgba(255,255,255,0.08)',
  surfaceStrong: 'rgba(255,255,255,0.14)',
  surfaceMuted: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.2)',
  borderSoft: 'rgba(255,255,255,0.12)',
  textPrimary: '#F8FAFF',
  textSecondary: '#B5C0DE',
  textMuted: '#8A97BD',
  primary: '#79A8FF',
  accentGold: '#F8C66D',
  accentAmber: '#F19A63',
  accentViolet: '#9D8DFF',
  accentTeal: '#52D2C6',
  success: '#5EE2B9',
  danger: '#FF7F93',
};

export const gradients = {
  screen: ['#060B1B', '#0B1530', '#111F3F'] as const,
  hero: ['rgba(121,168,255,0.45)', 'rgba(157,141,255,0.2)', 'rgba(82,210,198,0.05)'] as const,
  cta: ['#8DAEFF', '#7A7BFF', '#59D0C8'] as const,
  warm: ['#F8C66D', '#F19A63'] as const,
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
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  display: { fontSize: 34, lineHeight: 42 },
  h1: { fontSize: 28, lineHeight: 34 },
  h2: { fontSize: 22, lineHeight: 28 },
  h3: { fontSize: 18, lineHeight: 24 },
  body: { fontSize: 15, lineHeight: 22 },
  bodySm: { fontSize: 13, lineHeight: 19 },
  caption: { fontSize: 11, lineHeight: 16 },
};

export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  strong: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 14,
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
