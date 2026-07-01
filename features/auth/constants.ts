export const authColors = {
  primaryOrange: '#FF7A00',
  successGreen: '#16A34A',
  background: '#090909',
  cardSurface: '#121212',
  inputBackground: '#1A1A1A',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#FFFFFF',
  textSecondary: '#B7B7B7',
  placeholder: '#7A7A7A',
  error: '#EF4444',
  neutralIcon: '#FFFFFF',
} as const;

export const authRadius = {
  input: 18,
  card: 24,
  button: 18,
} as const;

export const authSpacing = {
  x1: 8,
  x2: 16,
  x3: 24,
  x4: 32,
  x5: 40,
  x6: 48,
  x7: 56,
} as const;

export const authTypography = {
  heading: 'text-[32px] leading-[38px] font-bold text-white',
  subheading: 'text-[16px] leading-[24px] font-normal text-[#B7B7B7]',
  inputText: 'text-[15px] leading-[20px] font-medium text-white',
  buttonText: 'text-[16px] leading-[20px] font-semibold text-white',
  caption: 'text-[13px] leading-[18px] font-normal text-[#B7B7B7]',
} as const;
