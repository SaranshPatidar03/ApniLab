import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';
import { AppIcon, AppIconName } from './AppIcon';

interface DisciplineCardProps {
  title: string;
  subtitle: string;
  labCount: number;
  iconName: AppIconName;
  accentColor: string;
  onPress: () => void;
}

export function DisciplineCard({
  title,
  subtitle,
  labCount,
  iconName,
  accentColor,
  onPress,
}: DisciplineCardProps) {
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${labCount} experiments`}>
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: `${accentColor}${isDark ? '25' : '15'}` }]}>
          <AppIcon name={iconName} size={28} isDark={isDark} />
        </View>

        <View style={[styles.countBadge, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
          <Text style={[styles.countText, { color: theme.textSecondary, fontFamily: getFontFamily('semiBold', false) }]}>
            {t('experiments_count', { count: labCount })}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]} numberOfLines={1}>
        {title}
      </Text>

      <Text style={[styles.subtitle, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]} numberOfLines={2}>
        {subtitle}
      </Text>

      <View style={styles.arrowRow}>
        <Text style={[styles.exploreText, { color: accentColor, fontFamily: getFontFamily('semiBold', isHindi) }]}>
          {t('all_labs')}
        </Text>
        <Ionicons name="arrow-forward" size={13} color={accentColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
  },
  title: {
    fontSize: 15,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 11.5,
    lineHeight: 16,
    minHeight: 32,
    marginBottom: 10,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreText: {
    fontSize: 12,
  },
});

