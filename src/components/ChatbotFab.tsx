import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';
import { AppIcon } from './AppIcon';

interface ChatbotFabProps {
  onPress: () => void;
  bottomOffset?: number;
}

export function ChatbotFab({ onPress, bottomOffset = 20 }: ChatbotFabProps) {
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          backgroundColor: theme.card,
          borderColor: theme.primary,
          bottom: bottomOffset,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={t('assistant_title')}>
      <AppIcon name="bot" size={24} isDark={isDark} />
      <Text
        style={[
          styles.label,
          { color: theme.text, fontFamily: getFontFamily('bold', isHindi) },
        ]}>
        {t('assistant_fab_label')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  label: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
});
