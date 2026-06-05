export const colors = {
  primary: '#fbbf24',
  secondary: '#10b981',
  background: '#111226',
  surface: '#1a1f3a',
  border: '#2d3a5a',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  heading: {
    h1: { fontSize: 28 },
    h2: { fontSize: 22 },
    h3: { fontSize: 18 },
  },
  body: {
    medium: { fontSize: 14 },
    small: { fontSize: 12 },
  },
  caption: {
    large: { fontSize: 13 },
    medium: { fontSize: 12 },
  },
};

export const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};
