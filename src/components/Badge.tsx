import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrandColors } from '@/constants/Colors';
import { useTheme } from '@/src/context/ThemeContext';

import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'purple' | 'neutral';
  size?: 'small' | 'medium';
}

export function Badge({ label, variant = 'primary', size = 'small' }: BadgeProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: isDark ? BrandColors.emeraldDarkBg : BrandColors.emeraldLight,
          text: isDark ? '#34D399' : BrandColors.emerald,
        };
      case 'warning':
        return {
          bg: isDark ? BrandColors.amberDarkBg : BrandColors.amberLight,
          text: isDark ? '#FBBF24' : BrandColors.amber,
        };
      case 'info':
        return {
          bg: isDark ? BrandColors.cyanDarkBg : BrandColors.cyanLight,
          text: isDark ? '#38BDF8' : BrandColors.cyan,
        };
      case 'purple':
        return {
          bg: isDark ? BrandColors.purpleDarkBg : BrandColors.purpleLight,
          text: isDark ? '#A78BFA' : BrandColors.purple,
        };
      case 'neutral':
        return {
          bg: isDark ? '#1E293B' : BrandColors.slate100,
          text: isDark ? '#94A3B8' : BrandColors.slate600,
        };
      case 'primary':
      default:
        return {
          bg: isDark ? BrandColors.indigo950 : BrandColors.indigo50,
          text: isDark ? BrandColors.indigoLight : BrandColors.indigo,
        };
    }
  };

  const { bg, text } = getColors();
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall ? styles.small : styles.medium]}>
      <Text
        style={[
          styles.label,
          { color: text, fontFamily: getFontFamily('semiBold', isHindi) },
          isSmall ? styles.smallText : styles.mediumText,
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  medium: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 12,
  },
});
