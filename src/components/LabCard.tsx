import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LabItem } from '../types/lab';
import { getLocalizedLab } from '../data/mockLabs';
import { BrandColors } from '@/constants/Colors';
import { Badge } from './Badge';
import { AppIcon } from './AppIcon';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

interface LabCardProps {
  lab: LabItem;
  featured?: boolean;
}

export function LabCard({ lab, featured = false }: LabCardProps) {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const localized = getLocalizedLab(lab.id, language) || lab;

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'purple';
      default:
        return 'neutral';
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'Physics':
        return 'primary';
      case 'Chemistry':
        return 'warning';
      case 'Biology':
        return 'success';
      case 'Mathematics':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getTranslatedCategory = (category: string) => {
    switch (category) {
      case 'Physics':
        return t('cat_physics');
      case 'Chemistry':
        return t('cat_chemistry');
      case 'Biology':
        return t('cat_biology');
      case 'Mathematics':
        return t('cat_math');
      default:
        return category;
    }
  };

  const getTranslatedDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return t('diff_beginner');
      case 'Intermediate':
        return t('diff_intermediate');
      case 'Advanced':
        return t('diff_advanced');
      default:
        return difficulty;
    }
  };

  const handlePress = () => {
    router.push(lab.route as any);
  };

  // Render dedicated icon for each experiment using the stable iconName from lab data
  const renderLabIcon = () => {
    // Experiment-specific icons keyed by lab.id (iconName matches the experiment id)
    const experimentIconMap: Record<string, Parameters<typeof AppIcon>[0]['name']> = {
      'ohms-law': 'ohms-law',
      'simple-pendulum': 'pendulum',
      'reflection-light': 'reflection-light',
      'refraction-glass-slab': 'refraction-light',
      'magnetic-field-lines': 'bar-magnet',
      'acids-bases': 'acids-bases',
      'physical-chemical-changes': 'chem-changes',
      'separation-mixtures': 'separation-mixtures',
      'plant-animal-cell': 'plant-cell',
      'photosynthesis-starch': 'photosynthesis',
      'seed-germination': 'seed-germination',
      'binary-converter': 'binary-converter',
      'fractions-geometry': 'fractions-geometry',
    };

    const experimentIcon = experimentIconMap[lab.id];
    if (experimentIcon) {
      return <AppIcon name={experimentIcon} size={26} isDark={isDark} />;
    }

    // Subject-level fallback
    if (lab.category === 'Physics') return <AppIcon name="physics" size={26} isDark={isDark} />;
    if (lab.category === 'Chemistry') return <AppIcon name="chemistry" size={26} isDark={isDark} />;
    if (lab.category === 'Biology') return <AppIcon name="biology" size={26} isDark={isDark} />;
    if (lab.category === 'Mathematics') return <AppIcon name="mathematics" size={26} isDark={isDark} />;

    // Final fallback: generic flask icon
    return <Ionicons name="flask-outline" size={22} color={lab.badgeColor || theme.tint} />;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: featured ? theme.primaryBorder : theme.border,
        },
        featured && (isDark ? styles.featuredCardDark : styles.featuredCardLight),
      ]}>
      {/* Top Meta Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Badge label={getTranslatedCategory(lab.category)} variant={getCategoryVariant(lab.category)} />
          <View style={styles.spacer} />
          <Badge label={getTranslatedDifficulty(lab.difficulty)} variant={getDifficultyVariant(lab.difficulty)} />
        </View>

        {lab.isInteractive ? (
          <View style={[styles.simulatorTag, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="sparkles" size={12} color={theme.tint} />
            <Text style={[styles.simulatorText, { color: theme.tint, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('interactive_badge')}
            </Text>
          </View>
        ) : (
          <View style={[styles.simulatorTag, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <Ionicons name="book-outline" size={12} color={theme.textSecondary} />
            <Text style={[styles.simulatorText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>
              {t('guided_badge')}
            </Text>
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: lab.badgeColor
                  ? `${lab.badgeColor}${isDark ? '30' : '15'}`
                  : theme.primaryLight,
              },
            ]}>
            {renderLabIcon()}
          </View>
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}
              numberOfLines={2}>
              {localized.title}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={13} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textMuted, fontFamily: getFontFamily('regular', false) }]}>
                {localized.duration}
              </Text>
              <Text style={[styles.metaDot, { color: theme.border }]}>•</Text>
              <Ionicons name="star" size={13} color={BrandColors.amber} />
              <Text style={[styles.metaText, { color: theme.textMuted, fontFamily: getFontFamily('semiBold', false) }]}>
                {lab.rating}
              </Text>
              <Text style={[styles.metaDot, { color: theme.border }]}>•</Text>
              <Text style={[styles.metaText, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                {lab.enrolledCount} {t('students')}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.description, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}
          numberOfLines={featured ? 3 : 2}>
          {localized.description}
        </Text>
      </View>

      {/* Card Footer / Action Button */}
      <View style={[styles.footer, { borderTopColor: theme.borderSubtle }]}>
        <View style={styles.viewDetailsText}>
          <Text style={[styles.learnMore, { color: theme.textSecondary, fontFamily: getFontFamily('semiBold', isHindi) }]}>
            {t('view_details')}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.primary }]}
          onPress={handlePress}>
          <Text style={[styles.actionBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('open_experiment')}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={BrandColors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  featuredCardLight: {
    borderWidth: 1.5,
  },
  featuredCardDark: {
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  spacer: {
    width: 2,
  },
  simulatorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  simulatorText: {
    fontSize: 11,
  },
  content: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
  },
  metaDot: {
    fontSize: 12,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  viewDetailsText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMore: {
    fontSize: 13,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnText: {
    color: BrandColors.white,
    fontSize: 13,
  },
});
