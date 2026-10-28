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
import { useLocalSearchParams } from 'expo-router';
import { getLocalizedLabs } from '@/src/data/mockLabs';
import { LabCategory, CATEGORIES } from '@/src/types/lab';
import { BrandColors } from '@/constants/Colors';
import { LabCard } from '@/src/components/LabCard';
import { ChatbotFab } from '@/src/components/ChatbotFab';
import { ChatbotModal } from '@/src/components/ChatbotModal';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

export default function ExploreScreen() {
  const { theme } = useTheme();
  const { t, language, isHindi } = useLanguage();
  const params = useLocalSearchParams<{ category?: string }>();

  const initialCat = (params.category && CATEGORIES.includes(params.category as LabCategory))
    ? (params.category as LabCategory)
    : 'All';

  const [selectedCategory, setSelectedCategory] = useState<LabCategory>(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [onlyInteractive, setOnlyInteractive] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const allLabs = getLocalizedLabs(language);

  // Filter laboratories based on category, difficulty, interactive toggle, and search query
  const filteredLabs = useMemo(() => {
    return allLabs.filter((lab) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || lab.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === 'All' || lab.difficulty === selectedDifficulty;

      // Interactive only filter
      const matchesInteractive = !onlyInteractive || lab.isInteractive;

      // Search query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        lab.title.toLowerCase().includes(query) ||
        lab.description.toLowerCase().includes(query) ||
        lab.category.toLowerCase().includes(query);

      return matchesCategory && matchesDifficulty && matchesInteractive && matchesSearch;
    });
  }, [allLabs, selectedCategory, selectedDifficulty, onlyInteractive, searchQuery]);

  const getCategoryLabel = (cat: LabCategory) => {
    switch (cat) {
      case 'All':
        return t('cat_all');
      case 'Physics':
        return t('cat_physics');
      case 'Chemistry':
        return t('cat_chemistry');
      case 'Biology':
        return t('cat_biology');
      case 'Mathematics':
        return t('cat_math');
      default:
        return cat;
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'All':
        return t('all');
      case 'Beginner':
        return t('diff_beginner');
      case 'Intermediate':
        return t('diff_intermediate');
      default:
        return diff;
    }
  };

  const getCategoryCount = (cat: LabCategory) => {
    if (cat === 'All') return allLabs.length;
    return allLabs.filter((l) => l.category === cat).length;
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('explore_title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('explore_subtitle')}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={19} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontFamily: getFontFamily('regular', isHindi) }]}
            placeholder={t('explore_search_placeholder')}
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills (School Subjects) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${getCategoryLabel(cat)}, ${count} experiments`}>
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isSelected ? BrandColors.white : theme.textSecondary,
                      fontFamily: getFontFamily(isSelected ? 'bold' : 'semiBold', isHindi),
                    },
                  ]}>
                  {getCategoryLabel(cat)} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Quick Filter Meta Row: Interactive simulator chip + Difficulty filters */}
        <View style={styles.filterMetaRow}>
          <TouchableOpacity
            style={[
              styles.interactiveChip,
              onlyInteractive
                ? { backgroundColor: theme.primary, borderColor: theme.primary }
                : { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setOnlyInteractive(!onlyInteractive)}
            activeOpacity={0.8}>
            <Ionicons
              name="sparkles"
              size={12}
              color={onlyInteractive ? BrandColors.white : theme.tint}
            />
            <Text
              style={[
                styles.interactiveChipText,
                {
                  color: onlyInteractive ? BrandColors.white : theme.textSecondary,
                  fontFamily: getFontFamily(onlyInteractive ? 'bold' : 'medium', isHindi),
                },
              ]}>
              {t('filter_interactive_only')}
            </Text>
          </TouchableOpacity>

          <View style={styles.difficultyChips}>
            {['All', 'Beginner', 'Intermediate'].map((diff) => {
              const isActive = selectedDifficulty === diff;
              return (
                <TouchableOpacity
                  key={diff}
                  style={[
                    styles.difficultyChip,
                    { backgroundColor: theme.cardAlt, borderColor: theme.border },
                    isActive && { backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder },
                  ]}
                  onPress={() => setSelectedDifficulty(diff)}>
                  <Text
                    style={[
                      styles.difficultyChipText,
                      {
                        color: isActive ? theme.tint : theme.textMuted,
                        fontFamily: getFontFamily(isActive ? 'bold' : 'medium', isHindi),
                      },
                    ]}>
                    {getDifficultyLabel(diff)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Results Counter */}
        <View style={styles.countRow}>
          <Text style={[styles.resultsCount, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('showing_experiments', { count: filteredLabs.length })}
          </Text>
        </View>

        {/* Lab List */}
        {filteredLabs.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="flask-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('no_matching_labs')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
              {t('adjust_filter_tip')}
            </Text>
            <TouchableOpacity
              style={[styles.resetFiltersBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setOnlyInteractive(false);
                setSearchQuery('');
              }}>
              <Text style={[styles.resetFiltersBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                {t('reset_filters')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredLabs.map((lab) => <LabCard key={lab.id} lab={lab} />)
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
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  categoryPillsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 6,
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 12.5,
  },
  filterMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  interactiveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  interactiveChipText: {
    fontSize: 11.5,
  },
  difficultyChips: {
    flexDirection: 'row',
    gap: 6,
  },
  difficultyChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  difficultyChipText: {
    fontSize: 11,
  },
  countRow: {
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    marginTop: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 6,
  },
  resetFiltersBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  resetFiltersBtnText: {
    color: BrandColors.white,
    fontSize: 13,
  },
});
