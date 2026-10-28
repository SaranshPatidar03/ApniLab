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
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'simulators' | 'physics' | 'chemistry' | 'biology' | 'math'
  >('all');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const allLabs = getLocalizedLabs(language);
  const progressList = getLocalizedProgress(language);
  const student = getLocalizedStudent(language);

  const physicsCount = useMemo(() => allLabs.filter((l) => l.category === 'Physics').length, [allLabs]);
  const chemistryCount = useMemo(() => allLabs.filter((l) => l.category === 'Chemistry').length, [allLabs]);
  const biologyCount = useMemo(() => allLabs.filter((l) => l.category === 'Biology').length, [allLabs]);
  const mathCount = useMemo(() => allLabs.filter((l) => l.category === 'Mathematics').length, [allLabs]);

  const completedCount = progressList.filter((p) => p.status === 'completed').length;
  const continueLab = progressList.find((p) => p.status === 'in-progress');

  const filteredLabs = useMemo(() => {
    let result = allLabs;
    if (selectedCategory === 'simulators') result = result.filter((l) => l.isInteractive);
    else if (selectedCategory === 'physics') result = result.filter((l) => l.category === 'Physics');
    else if (selectedCategory === 'chemistry') result = result.filter((l) => l.category === 'Chemistry');
    else if (selectedCategory === 'biology') result = result.filter((l) => l.category === 'Biology');
    else if (selectedCategory === 'math') result = result.filter((l) => l.category === 'Mathematics');

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
  }, [allLabs, searchQuery, selectedCategory]);

  const isFiltering = searchQuery.trim().length > 0 || selectedCategory !== 'all';

  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  // Category filter chips config
  const filterChips: {
    key: typeof selectedCategory;
    label: string;
    count?: number;
    color: string;
  }[] = [
    { key: 'all', label: t('cat_all'), count: allLabs.length, color: theme.primary },
    { key: 'simulators', label: isHindi ? 'सिमुलेटर' : 'Simulators', color: BrandColors.indigo },
    { key: 'physics', label: t('cat_physics'), count: physicsCount, color: BrandColors.indigo },
    { key: 'chemistry', label: t('cat_chemistry'), count: chemistryCount, color: '#E11D48' },
    { key: 'biology', label: t('cat_biology'), count: biologyCount, color: '#10B981' },
    { key: 'math', label: t('cat_math'), count: mathCount, color: '#0284C7' },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
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

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.langPill, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={toggleLanguage}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Switch Language">
              <Ionicons name="language" size={14} color={theme.tint} />
              <Text style={[styles.langPillText, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
                {language === 'en' ? 'हिन्दी' : 'EN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.profileBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/(tabs)/profile' as any)}
              activeOpacity={0.7}
              accessibilityRole="button">
              <Ionicons name="person-outline" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SEARCH BAR ── */}
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={18} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontFamily: getFontFamily('regular', isHindi) }]}
            placeholder={isHindi ? 'प्रयोग खोजें…' : 'Search experiments…'}
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

        {/* ── CATEGORY FILTER CHIPS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}>
          {filterChips.map((chip) => {
            const active = selectedCategory === chip.key;
            return (
              <TouchableOpacity
                key={chip.key}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? chip.color : theme.card,
                    borderColor: active ? chip.color : theme.border,
                  },
                ]}
                onPress={() => setSelectedCategory(active && chip.key !== 'all' ? 'all' : chip.key)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: active ? BrandColors.white : theme.textSecondary,
                      fontFamily: getFontFamily(active ? 'bold' : 'medium', isHindi),
                    },
                  ]}>
                  {chip.label}{chip.count !== undefined ? ` (${chip.count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isFiltering ? (
          /* ── FILTERED RESULTS ── */
          <View>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                {searchQuery.trim()
                  ? t('search_results_title', { count: filteredLabs.length })
                  : isHindi ? `${filteredLabs.length} प्रयोग` : `${filteredLabs.length} Experiments`}
              </Text>
              <TouchableOpacity
                onPress={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                <Text style={[styles.seeAll, { color: theme.tint, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                  {t('reset')}
                </Text>
              </TouchableOpacity>
            </View>

            {filteredLabs.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="search-outline" size={40} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {t('no_experiments_found')}
                </Text>
                <Text style={[styles.emptyDesc, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {t('search_tip')}
                </Text>
              </View>
            ) : (
              filteredLabs.map((lab) => <LabCard key={lab.id} lab={lab} />)
            )}
          </View>
        ) : (
          <>
            {/* ── PROGRESS SUMMARY STRIP ── */}
            <View style={[styles.progressStrip, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.progressStatItem}>
                <Text style={[styles.progressStatNum, { color: theme.tint, fontFamily: getFontFamily('bold', false) }]}>
                  {completedCount}
                </Text>
                <Text style={[styles.progressStatLabel, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {isHindi ? 'पूर्ण' : 'Done'}
                </Text>
              </View>
              <View style={[styles.progressDivider, { backgroundColor: theme.border }]} />
              <View style={styles.progressStatItem}>
                <Text style={[styles.progressStatNum, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
                  {allLabs.length}
                </Text>
                <Text style={[styles.progressStatLabel, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {isHindi ? 'कुल लैब्स' : 'Total Labs'}
                </Text>
              </View>
              <View style={[styles.progressDivider, { backgroundColor: theme.border }]} />
              <View style={styles.progressStatItem}>
                <Text style={[styles.progressStatNum, { color: BrandColors.amber, fontFamily: getFontFamily('bold', false) }]}>
                  {student.streakDays}🔥
                </Text>
                <Text style={[styles.progressStatLabel, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {isHindi ? 'दिन स्ट्रीक' : 'Day Streak'}
                </Text>
              </View>
              <View style={[styles.progressDivider, { backgroundColor: theme.border }]} />
              <View style={styles.progressStatItem}>
                <Text style={[styles.progressStatNum, { color: BrandColors.emerald, fontFamily: getFontFamily('bold', false) }]}>
                  {student.averageScore}%
                </Text>
                <Text style={[styles.progressStatLabel, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {isHindi ? 'औसत' : 'Avg Score'}
                </Text>
              </View>
            </View>

            {/* ── CONTINUE LEARNING (only if actually in progress) ── */}
            {continueLab && (
              <View style={styles.section}>
                <View style={styles.sectionRow}>
                  <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('continue_section_title')}
                  </Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/learning' as any)}>
                    <Text style={[styles.seeAll, { color: theme.tint, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                      {t('view_all')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.continueCard, { backgroundColor: theme.card, borderColor: theme.primaryBorder }]}
                  onPress={() => router.push(continueLab.route as any)}
                  activeOpacity={0.88}>
                  <View style={styles.continueCardInner}>
                    <View style={[styles.continueIconBox, { backgroundColor: theme.primaryLight }]}>
                      <Ionicons name="play-circle" size={22} color={theme.tint} />
                    </View>
                    <View style={styles.continueMeta}>
                      <Badge
                        label={
                          continueLab.category === 'Physics' ? t('cat_physics') :
                          continueLab.category === 'Chemistry' ? t('cat_chemistry') :
                          continueLab.category === 'Biology' ? t('cat_biology') :
                          t('cat_math')
                        }
                        variant="primary"
                      />
                      <Text
                        style={[styles.continueTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}
                        numberOfLines={1}>
                        {continueLab.title}
                      </Text>
                      <View style={styles.continueProgressRow}>
                        <View style={[styles.continueBarBg, { backgroundColor: isDark ? theme.border : BrandColors.slate200 }]}>
                          <View style={[styles.continueBarFill, { width: `${continueLab.progress}%`, backgroundColor: theme.tint }]} />
                        </View>
                        <Text style={[styles.continuePercent, { color: theme.tint, fontFamily: getFontFamily('bold', false) }]}>
                          {continueLab.progress}%
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* ── SUBJECT DISCIPLINES ── */}
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {t('disciplines_title')}
                </Text>
              </View>

              <View style={styles.disciplinesGrid}>
                <DisciplineCard
                  title={t('cat_physics')}
                  subtitle={t('sub_physics_desc')}
                  labCount={physicsCount}
                  iconName="physics"
                  accentColor={BrandColors.indigo}
                  onPress={() => router.push({ pathname: '/(tabs)/explore', params: { category: 'Physics' } })}
                />
                <DisciplineCard
                  title={t('cat_chemistry')}
                  subtitle={t('sub_chemistry_desc')}
                  labCount={chemistryCount}
                  iconName="chemistry"
                  accentColor="#E11D48"
                  onPress={() => router.push({ pathname: '/(tabs)/explore', params: { category: 'Chemistry' } })}
                />
                <DisciplineCard
                  title={t('cat_biology')}
                  subtitle={t('sub_biology_desc')}
                  labCount={biologyCount}
                  iconName="biology"
                  accentColor="#10B981"
                  onPress={() => router.push({ pathname: '/(tabs)/explore', params: { category: 'Biology' } })}
                />
                <DisciplineCard
                  title={t('cat_math')}
                  subtitle={t('sub_math_desc')}
                  labCount={mathCount}
                  iconName="mathematics"
                  accentColor="#0284C7"
                  onPress={() => router.push({ pathname: '/(tabs)/explore', params: { category: 'Mathematics' } })}
                />
              </View>
            </View>

            {/* ── POPULAR EXPERIMENTS (first 4) ── */}
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {t('popular_section_title')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
                  <Text style={[styles.seeAll, { color: theme.tint, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                    {t('view_all')} ({allLabs.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {allLabs.slice(0, 4).map((lab) => <LabCard key={lab.id} lab={lab} />)}
            </View>
          </>
        )}
      </ScrollView>

      <ChatbotFab onPress={() => setIsChatbotOpen(true)} bottomOffset={16} />
      <ChatbotModal visible={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 96,
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 14,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 21,
    letterSpacing: -0.3,
  },
  brandTagline: {
    fontSize: 11,
    marginTop: 1,
  },
  headerRight: {
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
  langPillText: { fontSize: 12 },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  // ── Search ──────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  // ── Filter chips ─────────────────────────────────────────
  chipsRow: {
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: { fontSize: 12 },

  // ── Section layout ───────────────────────────────────────
  section: { marginBottom: 24 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16 },
  seeAll: { fontSize: 13 },

  // ── Progress strip ───────────────────────────────────────
  progressStrip: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  progressStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  progressStatNum: { fontSize: 16 },
  progressStatLabel: { fontSize: 10 },
  progressDivider: {
    width: 1,
    height: 28,
    marginHorizontal: 2,
  },

  // ── Continue card ────────────────────────────────────────
  continueCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  continueCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  continueIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueMeta: { flex: 1, gap: 4 },
  continueTitle: { fontSize: 14, marginTop: 2 },
  continueProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  continueBarBg: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  continueBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  continuePercent: { fontSize: 11, minWidth: 34, textAlign: 'right' },

  // ── Disciplines grid ─────────────────────────────────────
  disciplinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // ── Empty state ──────────────────────────────────────────
  emptyState: {
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  emptyTitle: { fontSize: 15, marginTop: 4 },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
