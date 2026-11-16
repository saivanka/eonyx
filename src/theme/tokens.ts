// Design tokens — eonyx design system (light + dark).
// Every colour, radius and type size in the app comes from here.

export const palette = {
  light: {
    bg: '#F6F4F1',
    surface: '#FFFFFF',
    surfaceAlt: '#EEEAE4',
    text: '#121212',
    textMuted: '#6E6862',
    textFaint: '#A59E96',
    border: '#E3DDD4',
    accent: '#121212',
    accentText: '#FFFFFF',
    highlight: '#A8844A',
    success: '#2F7D5B',
    danger: '#C0392B',
    overlay: 'rgba(18,18,18,0.35)',
    tabBar: '#FFFFFF',
  },
  dark: {
    bg: '#0B0B0C',
    surface: '#161618',
    surfaceAlt: '#202023',
    text: '#F5F3F0',
    textMuted: '#9C968F',
    textFaint: '#68635E',
    border: '#2A2A2E',
    accent: '#F5F3F0',
    accentText: '#0B0B0C',
    highlight: '#D9B47E',
    success: '#4CAF84',
    danger: '#E8735F',
    overlay: 'rgba(0,0,0,0.6)',
    tabBar: '#121214',
  },
} as const;

export type ThemeColors = { [K in keyof typeof palette.light]: string };

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

// 18 text styles, mirrored from the case study's type scale.
export const type = {
  display: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
  h1: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.semibold, fontSize: 21, lineHeight: 27, letterSpacing: -0.3 },
  h3: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 23 },
  h4: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21 },
  titleLg: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24 },
  bodyLg: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 21 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  labelStrong: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17 },
  captionStrong: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 17 },
  micro: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 15, letterSpacing: 0.4 },
  overline: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 15, letterSpacing: 1.2 },
  price: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
  priceLg: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28 },
  button: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, letterSpacing: 0.2 },
} as const;

export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 40 } as const;

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const gutter = 20;
