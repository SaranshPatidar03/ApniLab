import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  getLocalizedLabs,
  getLocalizedProgress,
  getLocalizedStudent,
} from '@/src/data/mockLabs';
import { BrandColors } from '@/constants/Colors';
import { LabCard } from '@/src/components/LabCard';
import { Badge } from '@/src/components/Badge';
import { FeaturedSimulatorHero } from '@/src/components/FeaturedSimulatorHero';
import { CurriculumProgressCard } from '@/src/components/CurriculumProgressCard';
import { DisciplineCard } from '@/src/components/DisciplineCard';
import { ChatbotModal } from '@/src/components/ChatbotModal';
import { ChatbotFab } from '@/src/components/ChatbotFab';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language, setLanguage, isHindi } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<'all' | 'simulators' | 'physics' | 'chemistry' | 'biology' | 'math'>('all');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const allLabs = getLocalizedLabs(language);
  const progressList = getLocalizedProgress(language);
  const student = getLocalizedStudent(language);

  // Subject Counts for Discipline Cards
  const physicsCount = useMemo(() => allLabs.filter((l) => l.category === 'Physics').length, [allLabs]);
  const chemistryCount = useMemo(() => allLabs.filter((l) => l.category === 'Chemistry').length, [allLabs]);
  const biologyCount = useMemo(() => allLabs.filter((l) => l.category === 'Biology').length, [allLabs]);
  const mathCount = useMemo(() => allLabs.filter((l) => l.category === 'Mathematics').length, [allLabs]);

  // Active lab in progress (e.g. Ohm's Law or first in progress)
  const continueLab = progressList.find((p) => p.status === 'in-progress') || progressList[0];

  // Filtered labs if search query is active or quick filter is applied
  const filteredLabs = useMemo(() => {
    let result = allLabs;

    // Quick filter
    if (selectedQuickFilter === 'simulators') {
      result = result.filter((l) => l.isInteractive);
    } else if (selectedQuickFilter === 'physics') {
      result = result.filter((l) => l.category === 'Physics');
    } else if (selectedQuickFilter === 'chemistry') {
      result = result.filter((l) => l.category === 'Chemistry');
    } else if (selectedQuickFilter === 'biology') {
      result = result.filter((l) => l.category === 'Biology');
    } else if (selectedQuickFilter === 'math') {
      result = result.filter((l) => l.category === 'Mathematics');
    }

    // Search query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (lab) =>
          lab.title.toLowerCase().includes(query) ||
          lab.category.toLowerCase().includes(query) ||
          lab.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [allLabs, searchQuery, selectedQuickFilter]);

  const isFiltering = searchQuery.trim().length > 0 || selectedQuickFilter !== 'all';

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Clean ApniLab Header */}
        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <View style={[styles.brandIconBox, { backgroundColor: theme.primary }]}>
              <Ionicons name="flask" size={18} color={BrandColors.white} />
            </View>
            <View>
              <Text style={[styles.brandName, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                {t('appName')}
              </Text>
              <Text style={[styles.brandTagline, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
                {isHindi ? 'स्कूली विज्ञान प्रयोगशाला' : 'School Science Lab'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            {/* Quick Language Toggle Pill */}
            <TouchableOpacity
              style={[
                styles.langPill,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={toggleLanguage}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Switch Language">
              <Ionicons name="language" size={14} color={theme.tint} />
              <Text style={[styles.langPillText, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
                {language === 'en' ? 'हिन्दी' : 'EN'}
              </Text>
            </TouchableOpacity>

            {/* Profile Avatar Button */}
            <TouchableOpacity
              style={[styles.profileBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/(tabs)/profile' as any)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t('tab_profile')}>
              <Ionicons name="person-outline" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={19} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontFamily: getFontFamily('regular', isHindi) }]}
            placeholder={t('search_placeholder')}
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Filter Chips Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsScroll}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedQuickFilter === 'all'
                ? { backgroundColor: theme.primary, borderColor: theme.primary }
                : { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setSelectedQuickFilter('all')}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.filterChipText,
                {
                  color: selectedQuickFilter === 'all' ? BrandColors.white : theme.textSecondary,
                  fontFamily: getFontFamily(selectedQuickFilter === 'all' ? 'bold' : 'medium', isHindi),
                },
              ]}>
              {t('cat_all')} ({allLabs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedQuickFilter === 'simulators'
                ? { backgroundColor: theme.primary, borderColor: theme.primary }
                : { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setSelectedQuickFilter(selectedQuickFilter === 'simulators' ? 'all' : 'simulators')}
            activeOpacity={0.8}>
            <Ionicons
              name="sparkles"
              size={12}
              color={selectedQuickFilter === 'simulators' ? BrandColors.white : theme.tint}
            />
            <Text
              style={[
                styles.filterChipText,
                {
                  color: selectedQuickFilter === 'simulators' ? BrandColors.white : theme.textSecondary,
                  fontFamily: getFontFamily(selectedQuickFilter === 'simulators' ? 'bold' : 'medium', isHindi),
                },
              ]}>
              {t('filter_interactive_only')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedQuickFilter === 'physics'
                ? { backgroundColor: BrandColors.indigo, borderColor: BrandColors.indigo }
                : { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setSelectedQuickFilter(selectedQuickFilter === 'physics' ? 'all' : 'physics')}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.filterChipText,
                {
                  color: selectedQuickFilter === 'physics' ? BrandColors.white : theme.textSecondary,
                  fontFamily: getFontFamily(selectedQuickFilter === 'physics' ? 'bold' : 'medium', isHindi),
                },
              ]}>
              {t('cat_physics')} ({physicsCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedQuickFilter === 'chemistry'
                ? { backgroundColor: '#E11D48', borderColor: '#E11D48' }
                : { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setSelectedQuickFilter(selectedQuickFilter === 'chemistry' ? 'all' : 'chemistry')}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.filterChipText,
                {
                  color: selectedQuickFilter === 'chemistry' ? BrandColors.white : theme.textSecondary,
                  fontFamily: getFontFamily(selectedQuickFilter === 'chemistry' ? 'bold' : 'medium', isHindi),
                },
              ]}>
              {t('cat_chemistry')} ({chemistryCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedQuickFilter === 'biology'
                ? { backgroundColor: '#10B981', borderColor: '#10B981' }
                : { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setSelectedQuickFilter(selectedQuickFilter === 'biology' ? 'all' : 'biology')}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.filterChipText,
                {
                  color: selectedQuickFilter === 'biology' ? BrandColors.white : theme.textSecondary,
                  fontFamily: getFontFamily(selectedQuickFilter === 'biology' ? 'bold' : 'medium', isHindi),
                },
              ]}>
              {t('cat_biology')} ({biologyCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedQuickFilter === 'math'
                ? { backgroundColor: '#0284C7', borderColor: '#0284C7' }
                : { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setSelectedQuickFilter(selectedQuickFilter === 'math' ? 'all' : 'math')}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.filterChipText,
                {
                  color: selectedQuickFilter === 'math' ? BrandColors.white : theme.textSecondary,
                  fontFamily: getFontFamily(selectedQuickFilter === 'math' ? 'bold' : 'medium', isHindi),
                },
              ]}>
              {t('cat_math')} ({mathCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* If filtered or searched, display filtered list directly */}
        {isFiltering ? (
          <View style={styles.filteredSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                {searchQuery.trim()
                  ? t('search_results_title', { count: filteredLabs.length })
                  : `${t('showing_experiments', { count: filteredLabs.length })}`}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSelectedQuickFilter('all');
                }}>
                <Text style={[styles.clearFilterText, { color: theme.tint, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                  {t('reset')}
                </Text>
              </TouchableOpacity>
            </View>

            {filteredLabs.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="search-outline" size={44} color={theme.textMuted} />
                <Text style={[styles.emptyStateTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {t('no_experiments_found')}
                </Text>
                <Text style={[styles.emptyStateText, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {t('search_tip')}
                </Text>
              </View>
            ) : (
              filteredLabs.map((lab) => <LabCard key={lab.id} lab={lab} />)
            )}
          </View>
        ) : (
          <>
            {/* 1. Visually Engaging Hero Featured Simulator Banner */}
            <FeaturedSimulatorHero />

            {/* 2. Real Student Curriculum Progress Card */}
            <CurriculumProgressCard student={student} totalLabsCount={allLabs.length} />

            {/* 3. Continue Learning Experiment Card */}
            {continueLab && (
              <View style={styles.sectionWrapper}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('continue_section_title')}
                  </Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/learning' as any)}>
                    <Text style={[styles.seeAllText, { color: theme.tint, fontFamily: getFontFamily('bold', isHindi) }]}>
                      {t('view_all')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.continueCard,
                    {
                      backgroundColor: isDark ? theme.card : '#FAF5FF',
                      borderColor: isDark ? theme.primaryBorder : BrandColors.indigo100,
                    },
                  ]}>
                  <View style={styles.continueTop}>
                    <View style={styles.continueTitleCol}>
                      <Badge
                        label={
                          continueLab.category === 'Physics'
                            ? t('cat_physics')
                            : continueLab.category === 'Chemistry'
                            ? t('cat_chemistry')
                            : continueLab.category === 'Biology'
                            ? t('cat_biology')
                            : t('cat_math')
                        }
                        variant="primary"
                      />
                      <Text
                        style={[styles.continueLabTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}
                        numberOfLines={2}>
                        {continueLab.title}
                      </Text>
                      <Text style={[styles.lastAccessedText, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                        {t('last_visited', { time: continueLab.lastAccessed })}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.resumeBtn, { backgroundColor: theme.primary }]}
                      onPress={() => router.push(continueLab.route as any)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={t('resume')}>
                      <Text style={[styles.resumeBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                        {t('resume')}
                      </Text>
                      <Ionicons name="arrow-forward" size={14} color={BrandColors.white} />
                    </TouchableOpacity>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBarBg, { backgroundColor: isDark ? theme.border : BrandColors.slate200 }]}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${continueLab.progress}%`, backgroundColor: theme.tint },
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressPercent, { color: theme.tint, fontFamily: getFontFamily('bold', false) }]}>
                      {t('done_percent', { percent: continueLab.progress })}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* 4. School Disciplines (Physics, Chemistry, Biology, Mathematics) */}
            <View style={styles.sectionWrapper}>
              <View style={styles.sectionHeaderCol}>
                <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {t('disciplines_title')}
                </Text>
                <Text style={[styles.sectionSubtitle, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {t('disciplines_subtitle')}
                </Text>
              </View>

              <View style={styles.disciplinesGrid}>
                {/* Physics */}
                <DisciplineCard
                  title={t('cat_physics')}
                  subtitle={t('sub_physics_desc')}
                  labCount={physicsCount}
                  iconName="physics"
                  accentColor={BrandColors.indigo}
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/explore',
                      params: { category: 'Physics' },
                    })
                  }
                />

                {/* Chemistry */}
                <DisciplineCard
                  title={t('cat_chemistry')}
                  subtitle={t('sub_chemistry_desc')}
                  labCount={chemistryCount}
                  iconName="chemistry"
                  accentColor="#E11D48"
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/explore',
                      params: { category: 'Chemistry' },
                    })
                  }
                />

                {/* Biology */}
                <DisciplineCard
                  title={t('cat_biology')}
                  subtitle={t('sub_biology_desc')}
                  labCount={biologyCount}
                  iconName="biology"
                  accentColor="#10B981"
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/explore',
                      params: { category: 'Biology' },
                    })
                  }
                />

                {/* Mathematics */}
                <DisciplineCard
                  title={t('cat_math')}
                  subtitle={t('sub_math_desc')}
                  labCount={mathCount}
                  iconName="mathematics"
                  accentColor="#0284C7"
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/explore',
                      params: { category: 'Mathematics' },
                    })
                  }
                />
              </View>
            </View>

            {/* 5. Popular School Experiments */}
            <View style={styles.sectionWrapper}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {t('popular_section_title')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
                  <Text style={[styles.seeAllText, { color: theme.tint, fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('view_all')} ({allLabs.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {allLabs.slice(1, 5).map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </View>
          </>
        )}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80, // Generous padding to avoid covering floating help FAB
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 6,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 22,
    letterSpacing: -0.4,
  },
  brandTagline: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
  },
  langPillText: {
    fontSize: 12,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterChipsScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    gap: 5,
  },
  filterChipText: {
    fontSize: 12,
  },
  sectionWrapper: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderCol: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
  },
  clearFilterText: {
    fontSize: 13,
  },
  disciplinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  continueCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  continueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  continueTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  continueLabTitle: {
    fontSize: 15,
    marginTop: 6,
    marginBottom: 2,
  },
  lastAccessedText: {
    fontSize: 11,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  resumeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 12,
    minWidth: 40,
    textAlign: 'right',
  },
  filteredSection: {
    marginBottom: 20,
  },
  emptyState: {
    borderRadius: 16,
    padding: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  emptyStateTitle: {
    fontSize: 16,
    marginTop: 4,
  },
  emptyStateText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
