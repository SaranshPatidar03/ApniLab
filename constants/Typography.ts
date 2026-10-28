import { TextStyle, Platform } from 'react-native';

/**
 * ApniLab Centralized Typography System
 * Features Inter for Latin text and Noto Sans Devanagari for Hindi text.
 */

export const FontFamilies = {
  // Inter (English / Latin)
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',

  // Noto Sans Devanagari (Hindi)
  devanagariRegular: 'NotoSansDevanagari_400Regular',
  devanagariMedium: 'NotoSansDevanagari_500Medium',
  devanagariSemiBold: 'NotoSansDevanagari_600SemiBold',
  devanagariBold: 'NotoSansDevanagari_700Bold',

  // Monospace (Code / Formulas / Bits)
  mono: 'SpaceMono',
};

export type FontWeightToken = 'regular' | 'medium' | 'semiBold' | 'bold';

/**
 * Returns the appropriate font family based on weight and active language.
 * Ensures 100% pristine glyph rendering for both English and Hindi.
 */
export function getFontFamily(
  weight: FontWeightToken = 'regular',
  isHindi: boolean = false
): string {
  if (isHindi) {
    switch (weight) {
      case 'medium':
        return FontFamilies.devanagariMedium;
      case 'semiBold':
        return FontFamilies.devanagariSemiBold;
      case 'bold':
        return FontFamilies.devanagariBold;
      case 'regular':
      default:
        return FontFamilies.devanagariRegular;
    }
  }

  switch (weight) {
    case 'medium':
      return FontFamilies.interMedium;
    case 'semiBold':
      return FontFamilies.interSemiBold;
    case 'bold':
      return FontFamilies.interBold;
    case 'regular':
    default:
      return FontFamilies.interRegular;
  }
}

/**
 * Centralized Typography scale
 */
export const Typography = {
  // Headings
  h1: {
    fontFamily: FontFamilies.interBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontFamily: FontFamilies.interBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontFamily: FontFamilies.interSemiBold,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,
  h4: {
    fontFamily: FontFamilies.interSemiBold,
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,

  // Body text
  body: {
    fontFamily: FontFamilies.interRegular,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodyMedium: {
    fontFamily: FontFamilies.interMedium,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodyBold: {
    fontFamily: FontFamilies.interBold,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodySmall: {
    fontFamily: FontFamilies.interRegular,
    fontSize: 12,
    lineHeight: 17,
  } as TextStyle,
  bodySmallMedium: {
    fontFamily: FontFamilies.interMedium,
    fontSize: 12,
    lineHeight: 17,
  } as TextStyle,

  // Subtitles & Captions
  subtitle: {
    fontFamily: FontFamilies.interRegular,
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,
  caption: {
    fontFamily: FontFamilies.interMedium,
    fontSize: 11,
    lineHeight: 15,
  } as TextStyle,
  badge: {
    fontFamily: FontFamilies.interSemiBold,
    fontSize: 11,
    lineHeight: 14,
  } as TextStyle,

  // Interactive UI
  button: {
    fontFamily: FontFamilies.interSemiBold,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  buttonSmall: {
    fontFamily: FontFamilies.interSemiBold,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
  input: {
    fontFamily: FontFamilies.interRegular,
    fontSize: 15,
    lineHeight: 20,
  } as TextStyle,
  inputLabel: {
    fontFamily: FontFamilies.interMedium,
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,

  // Code & Technical
  mono: {
    fontFamily: FontFamilies.mono,
    fontSize: 13,
  } as TextStyle,
};

export default Typography;
