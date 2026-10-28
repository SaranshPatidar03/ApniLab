import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';
import { StudentProfile } from '../types/lab';
import { AppIcon } from './AppIcon';

interface CurriculumProgressCardProps {
  student: StudentProfile;
  totalLabsCount: number;
}

export function CurriculumProgressCard({ student, totalLabsCount }: CurriculumProgressCardProps) {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const completed = student.labsCompleted || 6;
  const total = Math.max(totalLabsCount, 13);
  const percent = Math.min(100, Math.round((completed / total) * 100));

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('curriculum_progress')}
          </Text>
          <Text style={[styles.subText, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('curriculum_progress_sub', { completed, total })}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => router.push('/(tabs)/learning' as any)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('view_all')}>
          <Text style={[styles.detailsText, { color: theme.tint, fontFamily: getFontFamily('semiBold', isHindi) }]}>
            {t('view_all')}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={theme.tint} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressRow}>
        <View style={[styles.progressBarBg, { backgroundColor: isDark ? theme.border : BrandColors.slate200 }]}>
          <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: theme.tint }]} />
        </View>
        <Text style={[styles.percentLabel, { color: theme.tint, fontFamily: getFontFamily('bold', false) }]}>
          {percent}%
        </Text>
      </View>

      {/* Metrics Grid */}
      <View style={[styles.metricsGrid, { borderTopColor: theme.borderSubtle }]}>
        {/* 1. Completed Practicals */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrap}>
            <AppIcon name="completed" size={20} isDark={isDark} />
          </View>
          <Text style={[styles.metricValue, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
            {completed}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
            {t('metric_completed')}
          </Text>
        </View>

        <View style={[styles.gridDivider, { backgroundColor: theme.borderSubtle }]} />

        {/* 2. Practice Time */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrap}>
            <AppIcon name="lab-hours" size={20} isDark={isDark} />
          </View>
          <Text style={[styles.metricValue, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
            {student.hoursPracticed}h
          </Text>
          <Text style={[styles.metricLabel, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
            {t('metric_hours')}
          </Text>
        </View>

        <View style={[styles.gridDivider, { backgroundColor: theme.borderSubtle }]} />

        {/* 3. Active Streak */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrap}>
            <AppIcon name="active-streak" size={20} isDark={isDark} />
          </View>
          <Text style={[styles.metricValue, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
            {student.streakDays} {t('days')}
          </Text>
          <Text style={[styles.metricLabel, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
            {t('metric_streak')}
          </Text>
        </View>

        <View style={[styles.gridDivider, { backgroundColor: theme.borderSubtle }]} />

        {/* 4. Average Score */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrap}>
            <AppIcon name="avg-score" size={20} isDark={isDark} />
          </View>
          <Text style={[styles.metricValue, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
            {student.averageScore}%
          </Text>
          <Text style={[styles.metricLabel, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
            {t('metric_score')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 2,
  },
  detailsText: {
    fontSize: 13,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentLabel: {
    fontSize: 13,
    minWidth: 36,
    textAlign: 'right',
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricIconWrap: {
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10.5,
    textAlign: 'center',
  },
  gridDivider: {
    width: 1,
    height: 28,
  },
});

