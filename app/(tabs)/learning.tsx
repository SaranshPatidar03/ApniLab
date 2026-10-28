import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getLocalizedProgress, getLocalizedStudent } from '@/src/data/mockLabs';
import { BrandColors } from '@/constants/Colors';
import { Badge } from '@/src/components/Badge';
import { AppIcon } from '@/src/components/AppIcon';
import { ChatbotFab } from '@/src/components/ChatbotFab';
import { ChatbotModal } from '@/src/components/ChatbotModal';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

export default function MyLearningScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [filterTab, setFilterTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const progressItems = getLocalizedProgress(language);
  const student = getLocalizedStudent(language);

  const inProgressCount = progressItems.filter((i) => i.status === 'in-progress').length;
  const completedCount = progressItems.filter((i) => i.status === 'completed').length;

  const filteredItems = progressItems.filter((item) => {
    if (filterTab === 'in-progress') return item.status === 'in-progress';
    if (filterTab === 'completed') return item.status === 'completed';
    return true;
  });

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

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('learning_title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('learning_subtitle')}
          </Text>
        </View>

        {/* Learning Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { fontFamily: getFontFamily('semiBold', isHindi) }]}>
            {t('semester_progress_title')}
          </Text>
          <View style={styles.summaryMainRow}>
            <View>
              <Text style={[styles.summaryHugeNum, { fontFamily: getFontFamily('bold', false) }]}>
                {completedCount} / {progressItems.length}
              </Text>
              <Text style={[styles.summarySub, { fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('required_labs_completed')}
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <AppIcon name="active-streak" size={18} isDark={true} />
              <Text style={[styles.streakBadgeText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                {t('day_streak', { count: student.streakDays })}
              </Text>
            </View>
          </View>

          {/* Overall semester progress bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.round((completedCount / (progressItems.length || 1)) * 100)}%` },
              ]}
            />
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { fontFamily: getFontFamily('bold', false) }]}>
                {student.hoursPracticed} hrs
              </Text>
              <Text style={[styles.metricDesc, { fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('practice_time')}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { fontFamily: getFontFamily('bold', false) }]}>
                {student.averageScore}%
              </Text>
              <Text style={[styles.metricDesc, { fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('avg_lab_score')}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { fontFamily: getFontFamily('bold', false) }]}>
                {inProgressCount}
              </Text>
              <Text style={[styles.metricDesc, { fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('in_progress')}
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Segmented Control */}
        <View style={[styles.filterBar, { backgroundColor: theme.cardAlt }]}>
          <TouchableOpacity
            style={[styles.filterBtn, filterTab === 'all' && [styles.filterBtnActive, { backgroundColor: theme.card }]]}
            onPress={() => setFilterTab('all')}>
            <Text
              style={[
                styles.filterBtnText,
                {
                  color: filterTab === 'all' ? theme.tint : theme.textMuted,
                  fontFamily: getFontFamily(filterTab === 'all' ? 'bold' : 'medium', isHindi),
                },
                filterTab === 'all' && styles.filterBtnTextActive,
              ]}>
              {t('filter_all', { count: progressItems.length })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filterTab === 'in-progress' && [styles.filterBtnActive, { backgroundColor: theme.card }]]}
            onPress={() => setFilterTab('in-progress')}>
            <Text
              style={[
                styles.filterBtnText,
                {
                  color: filterTab === 'in-progress' ? theme.tint : theme.textMuted,
                  fontFamily: getFontFamily(filterTab === 'in-progress' ? 'bold' : 'medium', isHindi),
                },
                filterTab === 'in-progress' && styles.filterBtnTextActive,
              ]}>
              {t('filter_in_progress', { count: inProgressCount })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filterTab === 'completed' && [styles.filterBtnActive, { backgroundColor: theme.card }]]}
            onPress={() => setFilterTab('completed')}>
            <Text
              style={[
                styles.filterBtnText,
                {
                  color: filterTab === 'completed' ? theme.tint : theme.textMuted,
                  fontFamily: getFontFamily(filterTab === 'completed' ? 'bold' : 'medium', isHindi),
                },
                filterTab === 'completed' && styles.filterBtnTextActive,
              ]}>
              {t('filter_completed', { count: completedCount })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Experiment Progress Cards */}
        <View style={styles.listSection}>
          {filteredItems.map((item) => {
            const isDone = item.status === 'completed';

            return (
              <View
                key={item.labId}
                style={[styles.labProgressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.cardTopRow}>
                  <View style={styles.metaLeft}>
                    <Badge
                      label={getTranslatedCategory(item.category)}
                      variant={getCategoryVariant(item.category)}
                    />
                    <Text style={[styles.accessTimeText, { color: theme.textMuted, fontFamily: getFontFamily('regular', false) }]}>
                      {item.lastAccessed}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      isDone
                        ? { backgroundColor: isDark ? BrandColors.emeraldDarkBg : BrandColors.emeraldLight }
                        : { backgroundColor: theme.primaryLight },
                    ]}>
                    {isDone ? (
                      <AppIcon name="completed" size={14} isDark={isDark} />
                    ) : (
                      <Ionicons name="time-outline" size={13} color={theme.tint} />
                    )}
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color: isDone ? (isDark ? '#34D399' : BrandColors.emerald) : theme.tint,
                          fontFamily: getFontFamily('bold', isHindi),
                        },
                      ]}>
                      {isDone ? t('completed') : `${item.progress}%`}
                    </Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={[styles.itemTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {item.title}
                </Text>

                {/* Progress bar or score */}
                {isDone ? (
                  <View style={styles.completedMetaRow}>
                    <View style={styles.scoreRow}>
                      <AppIcon name="avg-score" size={16} isDark={isDark} />
                      <Text style={[styles.scoreLabel, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>
                        {t('experiment_score')}
                      </Text>
                      <Text style={[styles.scoreValue, { fontFamily: getFontFamily('bold', false) }]}>
                        {item.score} / 100
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.reviewBtn, { backgroundColor: theme.cardAlt }]}
                      onPress={() => router.push(item.route as any)}>
                      <Text style={[styles.reviewBtnText, { color: theme.textSecondary, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                        {t('review_lab')}
                      </Text>
                      <Ionicons name="refresh-outline" size={14} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.inProgressRow}>
                    <View style={styles.progressBarWrapper}>
                      <View style={[styles.progressBg, { backgroundColor: isDark ? theme.border : BrandColors.slate200 }]}>
                        <View
                          style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: theme.tint }]}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.continueActionBtn, { backgroundColor: theme.primary }]}
                      onPress={() => router.push(item.route as any)}>
                      <Text style={[styles.continueActionBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                        {t('resume')}
                      </Text>
                      <Ionicons name="arrow-forward" size={14} color={BrandColors.white} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Practical Lab Certification Notice Card */}
        <View style={[styles.certCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.certIconBox, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="school-outline" size={24} color={theme.tint} />
          </View>
          <View style={styles.certContent}>
            <Text style={[styles.certTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('cert_title')}
            </Text>
            <Text style={[styles.certDesc, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
              {t('cert_desc')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating ApniLab Assistant Trigger */}
      <ChatbotFab onPress={() => setIsChatbotOpen(true)} bottomOffset={16} />

      {/* Bilingual Student Help Chatbot Modal */}
      <ChatbotModal visible={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: BrandColors.indigo,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    ...Platform.select({
      android: { elevation: 3 },
    }),
  },
  summaryTitle: {
    fontSize: 10,
    color: BrandColors.indigo200,
    letterSpacing: 0.8,
  },
  summaryMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  summaryHugeNum: {
    fontSize: 32,
    color: BrandColors.white,
  },
  summarySub: {
    fontSize: 12,
    color: BrandColors.indigo100,
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  streakBadgeText: {
    color: BrandColors.white,
    fontSize: 12,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: BrandColors.white,
    borderRadius: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  metricCol: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    color: BrandColors.white,
  },
  metricDesc: {
    fontSize: 10,
    color: BrandColors.indigo200,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 10,
    marginBottom: 14,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterBtnActive: {
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  filterBtnText: {
    fontSize: 12,
  },
  filterBtnTextActive: {},
  listSection: {
    gap: 12,
  },
  labProgressCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accessTimeText: {
    fontSize: 11,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  statusPillText: {
    fontSize: 11,
  },
  itemTitle: {
    fontSize: 15,
    marginBottom: 12,
  },
  inProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarWrapper: {
    flex: 1,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  continueActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  continueActionBtnText: {
    color: BrandColors.white,
    fontSize: 12,
  },
  completedMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreLabel: {
    fontSize: 12,
  },
  scoreValue: {
    fontSize: 13,
    color: BrandColors.emerald,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  reviewBtnText: {
    fontSize: 12,
  },
  certCard: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginTop: 16,
    gap: 12,
    alignItems: 'center',
  },
  certIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  certContent: {
    flex: 1,
  },
  certTitle: {
    fontSize: 14,
  },
  certDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
});
