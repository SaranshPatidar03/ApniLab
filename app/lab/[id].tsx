import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLocalizedLab } from '@/src/data/mockLabs';
import { BrandColors } from '@/constants/Colors';
import { Badge } from '@/src/components/Badge';
import { AppIcon } from '@/src/components/AppIcon';
import { ExperimentKnowledgeCheck, QuizQuestion } from '@/src/components/ExperimentKnowledgeCheck';
import { ChatbotFab } from '@/src/components/ChatbotFab';
import { ChatbotModal } from '@/src/components/ChatbotModal';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

const OBSOLETE_EXPERIMENT_IDS = ['sorting-algorithms', 'logic-gates', 'op-amp'];

function getLabQuizQuestions(labId: string, isHindi: boolean): QuizQuestion[] {
  if (labId === 'simple-pendulum') {
    return [
      {
        question: isHindi
          ? 'यदि सरल लोलक के धागे की लंबाई 4 गुना कर दी जाए, तो आवर्तकाल (Time Period) पर क्या प्रभाव पड़ेगा?'
          : 'If the length of a simple pendulum is increased 4 times, what happens to its time period?',
        options: isHindi
          ? ['आवर्तकाल 2 गुना हो जाएगा', 'आवर्तकाल 4 गुना हो जाएगा', 'आवर्तकाल आधा हो जाएगा', 'कोई परिवर्तन नहीं']
          : ['Time period doubles (2x)', 'Time period quadruples (4x)', 'Time period is halved', 'No change'],
        correctIndex: 0,
        explanation: isHindi
          ? 'T = 2π√(L/g) के अनुसार, आवर्तकाल लंबाई के वर्गमूल के आनुपातिक (T ∝ √L) होता है। √4 = 2।'
          : 'Since T = 2π√(L/g), period is proportional to √L. Increasing L by 4 increases T by √4 = 2.',
      },
      {
        question: isHindi
          ? 'क्या छोटे कोणों के लिए लोलक के बॉब का द्रव्यमान आवर्तकाल को प्रभावित करता है?'
          : 'Does the mass of the bob affect the time period of oscillation for small angles?',
        options: isHindi
          ? ['नहीं, आवर्तकाल बॉब के द्रव्यमान से स्वतंत्र होता है', 'हाँ, भारी बॉब तेजी से दोलन करता है', 'हाँ, हल्का बॉब तेजी से दोलन करता है', 'यह केवल हवा के दबाव पर निर्भर है']
          : ['No, period is independent of bob mass', 'Yes, heavier bobs swing faster', 'Yes, lighter bobs swing faster', 'Depends on temperature'],
        correctIndex: 0,
        explanation: isHindi
          ? 'सरल लोलक का आवर्तकाल सूत्र T = 2π√(L/g) में द्रव्यमान (m) नहीं आता, अतः यह बॉब के द्रव्यमान पर निर्भर नहीं करता।'
          : 'The equation T = 2π√(L/g) contains no mass term, confirming the period is independent of bob mass.',
      },
    ];
  }
  if (labId === 'acids-bases') {
    return [
      {
        question: isHindi
          ? 'अम्लीय विलयन में नीला लिटमस पेपर किस रंग में बदल जाता है?'
          : 'What color does blue litmus paper turn when dipped into an acidic solution?',
        options: isHindi
          ? ['लाल (Red)', 'हरा (Green)', 'पीला (Yellow)', 'नीला ही रहता है']
          : ['Red', 'Green', 'Yellow', 'Remains blue'],
        correctIndex: 0,
        explanation: isHindi
          ? 'अम्ल नीले लिटमस को लाल कर देते हैं, जबकि क्षार लाल लिटमस को नीला कर देते हैं।'
          : 'Acids turn blue litmus paper red, while bases turn red litmus paper blue.',
      },
      {
        question: isHindi
          ? 'उदासीन (Neutral) जलीय विलयन का 25°C पर pH मान क्या होता है?'
          : 'What is the pH value of a neutral aqueous solution at 25°C?',
        options: ['pH 7', 'pH 1', 'pH 14', 'pH 0'],
        correctIndex: 0,
        explanation: isHindi
          ? 'शुद्ध जल एवं उदासीन विलयनों का pH ठीक 7 होता है।'
          : 'Pure water and neutral solutions have a pH of exactly 7 at room temperature.',
      },
    ];
  }
  return [
    {
      question: isHindi
        ? 'प्रयोग करते समय त्रुटियों (Errors) को न्यूनतम करने के लिए क्या सबसे महत्वपूर्ण है?'
        : 'What is the most effective laboratory practice to minimize experimental errors?',
      options: isHindi
        ? ['कई प्रेक्षण लेकर औसत निकालना', 'केवल एक त्वरित प्रेक्षण लेना', 'उपकरण को बिना कैलिब्रेट किए उपयोग करना', 'प्रेक्षण तालिका खाली छोड़ना']
        : ['Taking multiple trials and computing mean', 'Taking only one fast observation', 'Skipping zero-error check', 'Estimating readings without measuring'],
      correctIndex: 0,
      explanation: isHindi
        ? 'अनेक प्रेक्षण लेकर औसत निकालने से यादृच्छिक त्रुटियां (Random errors) कम हो जाती हैं।'
        : 'Repeating observations across multiple trials and averaging reduces random experimental error.',
    },
    {
      question: isHindi
        ? 'प्रायोगिक कार्य में सावधानी और सुरक्षा नियमों का पालन क्यों आवश्यक है?'
        : 'Why are safety precautions strictly observed during school laboratory experiments?',
      options: isHindi
        ? ['उपकरणों की सुरक्षा एवं सटीक निष्कर्ष प्राप्त करने हेतु', 'केवल औपचारिकता पूरी करने के लिए', 'समय बर्बाद करने के लिए', 'कोई कारण नहीं']
        : ['To protect apparatus, ensure student safety, and achieve reliable empirical results', 'Just a theoretical formality', 'No real impact', 'To increase experiment duration'],
      correctIndex: 0,
      explanation: isHindi
        ? 'सुरक्षा नियमों का पालन करने से प्रयोगशाला दुर्घटनाओं से बचाव होता है और प्रेक्षण सटीक आते हैं।'
        : 'Adhering to safety rules prevents equipment damage, protects students, and ensures empirical accuracy.',
    },
  ];
}

export default function LabDetailScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'apparatus' | 'procedure' | 'quiz'>('overview');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [checkedApparatus, setCheckedApparatus] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Check if route ID points to an obsolete college or CS experiment
  const isObsolete = OBSOLETE_EXPERIMENT_IDS.includes(id as string);

  // Find lab from localized school catalog
  const foundLab = getLocalizedLab(id as string, language);
  const labId = foundLab?.id || (id as string) || '';

  const toggleApparatusCheck = (idx: number) => {
    setCheckedApparatus((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleMarkCompleted = () => {
    setIsCompleted(true);
    Alert.alert(
      isHindi ? 'अभिनंदन!' : 'Congratulations!',
      isHindi
        ? 'प्रयोग आपके लर्निंग जर्नल में पूर्ण के रूप में दर्ज हो गया है।'
        : 'Experiment marked as completed in your student practical journal!',
      [{ text: t('ok') }]
    );
  };

  const labQuizQuestions = getLabQuizQuestions(labId, isHindi);

  if (isObsolete || (!foundLab && id && !['ohms-law', 'binary-converter'].includes(id as string))) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.scrollContent}>
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/explore' as any)}>
              <Ionicons name="arrow-back" size={20} color={theme.textSecondary} />
              <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>
                {t('back')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.obsoleteCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.obsoleteIconBox, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="school" size={40} color={theme.tint} />
            </View>
            <Text style={[styles.obsoleteTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('obsolete_lab_title')}
            </Text>
            <Text style={[styles.obsoleteDesc, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
              {t('obsolete_lab_desc')}
            </Text>
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: theme.primary, marginTop: 20 }]}
              onPress={() => router.replace('/(tabs)/explore' as any)}>
              <Text style={[styles.primaryActionBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                {t('explore_school_labs')}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={BrandColors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const lab = foundLab || {
    id: id || 'unknown',
    title: isHindi ? 'स्कूली विज्ञान प्रयोग' : 'School Science Experiment',
    category: 'Physics' as const,
    difficulty: 'Beginner' as const,
    duration: isHindi ? '20 मिनट' : '20 mins',
    description: isHindi
      ? 'स्कूली विज्ञान पाठ्यक्रम के अनुसार प्रायोगिक कार्यविधि और सत्यापन।'
      : 'Practical procedure and observation verification for school science.',
    route: `/lab/${id}`,
    isInteractive: false,
    rating: 4.8,
    enrolledCount: 920,
    iconName: 'flask-outline',
    badgeColor: theme.primary,
    apparatus: isHindi
      ? ['मानक प्रयोगशाला उपकरण', 'सुरक्षा चश्मा', 'मापक पैमाना']
      : ['Standard School Lab Equipment', 'Safety Goggles', 'Measuring Scale'],
    objectives: isHindi
      ? ['वैज्ञानिक सिद्धांत को समझें।', 'अवलोकन दर्ज करें और निष्कर्ष निकालें।']
      : ['Understand foundational scientific principle.', 'Record observations and draw empirical conclusions.'],
    theory: isHindi
      ? 'व्यावहारिक विज्ञान प्रयोग सैद्धांतिक अवधारणाओं को प्रत्यक्ष अनुभव और अवलोकन से जोड़ते हैं।'
      : 'Practical science experiments connect theoretical concepts with hands-on observation.',
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

  const handleLaunchExperiment = () => {
    if (lab.id === 'ohms-law') {
      router.push('/lab/ohms-law' as any);
    } else if (lab.id === 'binary-converter') {
      router.push('/lab/binary-converter' as any);
    } else {
      Alert.alert(
        t('staging_alert_title'),
        t('staging_alert_body', { title: lab.title }),
        [
          { text: t('try_ohms'), onPress: () => router.push('/lab/ohms-law' as any) },
          { text: t('try_binary'), onPress: () => router.push('/lab/binary-converter' as any) },
          { text: t('ok'), style: 'cancel' },
        ]
      );
    }
  };

  const renderHeaderIcon = () => {
    if (lab.id === 'ohms-law') {
      return <AppIcon name="ohms-law" size={32} isDark={isDark} />;
    }
    if (lab.id === 'simple-pendulum') {
      return <AppIcon name="pendulum" size={32} isDark={isDark} />;
    }
    return (
      <Ionicons
        name={(lab.iconName as any) || 'flask-outline'}
        size={28}
        color={lab.badgeColor || theme.tint}
      />
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={theme.textSecondary} />
            <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>
              {t('back')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookmarkBtn}
            onPress={() => setIsBookmarked(!isBookmarked)}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? theme.tint : theme.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Hero Header Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.heroTopRow}>
            <View style={styles.categoryRow}>
              <Badge label={getTranslatedCategory(lab.category)} variant={getCategoryVariant(lab.category)} />
              <Badge label={getTranslatedDifficulty(lab.difficulty)} variant="warning" />
              {lab.isInteractive && <Badge label={t('interactive_badge')} variant="primary" />}
            </View>
            <View style={[styles.heroIconBox, { backgroundColor: theme.primaryLight }]}>
              {renderHeaderIcon()}
            </View>
          </View>

          <Text style={[styles.labTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {lab.title}
          </Text>
          <Text style={[styles.labDescription, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
            {lab.description}
          </Text>

          <View style={[styles.statsRow, { borderTopColor: theme.borderSubtle }]}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color={theme.textMuted} />
              <Text style={[styles.statText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', false) }]}>
                {lab.duration}
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color={BrandColors.amber} />
              <Text style={[styles.statText, { color: theme.textSecondary, fontFamily: getFontFamily('semiBold', false) }]}>
                {lab.rating} / 5.0
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={16} color={theme.textMuted} />
              <Text style={[styles.statText, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                {lab.enrolledCount} {t('students')}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Controls */}
        <View style={[styles.tabBar, { backgroundColor: theme.cardAlt }]}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'overview' && [styles.tabItemActive, { backgroundColor: theme.card }]]}
            onPress={() => setActiveTab('overview')}>
            <Text
              style={[
                styles.tabItemText,
                { color: activeTab === 'overview' ? theme.tint : theme.textMuted },
                activeTab === 'overview' && styles.tabItemTextActive,
                { fontFamily: getFontFamily(activeTab === 'overview' ? 'bold' : 'medium', isHindi) },
              ]}>
              {t('tab_objectives')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'apparatus' && [styles.tabItemActive, { backgroundColor: theme.card }]]}
            onPress={() => setActiveTab('apparatus')}>
            <Text
              style={[
                styles.tabItemText,
                { color: activeTab === 'apparatus' ? theme.tint : theme.textMuted },
                activeTab === 'apparatus' && styles.tabItemTextActive,
                { fontFamily: getFontFamily(activeTab === 'apparatus' ? 'bold' : 'medium', isHindi) },
              ]}>
              {t('tab_apparatus')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'procedure' && [styles.tabItemActive, { backgroundColor: theme.card }]]}
            onPress={() => setActiveTab('procedure')}>
            <Text
              style={[
                styles.tabItemText,
                { color: activeTab === 'procedure' ? theme.tint : theme.textMuted },
                activeTab === 'procedure' && styles.tabItemTextActive,
                { fontFamily: getFontFamily(activeTab === 'procedure' ? 'bold' : 'medium', isHindi) },
              ]}>
              {t('tab_theory')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'quiz' && [styles.tabItemActive, { backgroundColor: theme.card }]]}
            onPress={() => setActiveTab('quiz')}>
            <Text
              style={[
                styles.tabItemText,
                { color: activeTab === 'quiz' ? theme.tint : theme.textMuted },
                activeTab === 'quiz' && styles.tabItemTextActive,
                { fontFamily: getFontFamily(activeTab === 'quiz' ? 'bold' : 'medium', isHindi) },
              ]}>
              {isHindi ? 'प्रश्नोत्तरी' : 'Quiz'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <View style={[styles.tabContentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.contentHeader, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('learning_objectives_header')}
            </Text>
            {lab.objectives.map((obj, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <View style={[styles.bulletDot, { backgroundColor: theme.tint }]} />
                <Text style={[styles.bulletText, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {obj}
                </Text>
              </View>
            ))}

            {!lab.isInteractive && (
              <View style={[styles.guidedNoticeBox, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: theme.primaryBorder }]}>
                <Ionicons name="information-circle-outline" size={18} color={theme.tint} />
                <Text style={[styles.guidedNoticeText, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {t('guided_activity_notice')}
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'apparatus' && (
          <View style={[styles.tabContentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.apparatusHeaderRow}>
              <Text style={[styles.contentHeader, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                {t('apparatus_header')}
              </Text>
              <Text style={[styles.apparatusHint, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('apparatus_tap_hint')}
              </Text>
            </View>

            {lab.apparatus.map((app, idx) => {
              const isChecked = !!checkedApparatus[idx];
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.apparatusItem,
                    { borderBottomColor: theme.borderSubtle },
                    isChecked && { backgroundColor: isDark ? '#064E3B20' : '#ECFDF5' },
                  ]}
                  onPress={() => toggleApparatusCheck(idx)}
                  activeOpacity={0.7}>
                  <Ionicons
                    name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isChecked ? '#10B981' : theme.textMuted}
                  />
                  <Text
                    style={[
                      styles.apparatusText,
                      {
                        color: isChecked ? theme.text : theme.textSecondary,
                        fontFamily: getFontFamily(isChecked ? 'semiBold' : 'medium', isHindi),
                      },
                    ]}>
                    {app}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {lab.safety && lab.safety.length > 0 && (
              <View style={styles.safetySection}>
                <View style={styles.safetyHeaderRow}>
                  <Ionicons name="shield-checkmark" size={18} color="#EF4444" />
                  <Text style={[styles.safetyHeaderText, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('safety_header')}
                  </Text>
                </View>
                {lab.safety.map((rule, idx) => (
                  <View key={idx} style={styles.safetyItem}>
                    <Ionicons name="alert-circle-outline" size={15} color="#EF4444" style={styles.safetyIcon} />
                    <Text style={[styles.safetyText, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'procedure' && (
          <View style={[styles.tabContentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.contentHeader, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('theory_header')}
            </Text>
            <Text style={[styles.theoryBody, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
              {lab.theory}
            </Text>
          </View>
        )}

        {activeTab === 'quiz' && (
          <ExperimentKnowledgeCheck questions={labQuizQuestions} />
        )}

        {/* Primary CTA */}
        <TouchableOpacity
          style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
          onPress={handleLaunchExperiment}
          activeOpacity={0.85}>
          <Text style={[styles.primaryActionBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
            {lab.isInteractive ? t('launch_interactive') : t('launch_lab')}
          </Text>
          <Ionicons name="play-circle" size={20} color={BrandColors.white} />
        </TouchableOpacity>

        {/* Mark as Completed Action */}
        <TouchableOpacity
          style={[
            styles.completeActionBtn,
            isCompleted
              ? { backgroundColor: '#10B981', borderColor: '#10B981' }
              : { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={handleMarkCompleted}
          activeOpacity={0.8}>
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={18}
            color={isCompleted ? BrandColors.white : theme.text}
          />
          <Text
            style={[
              styles.completeActionBtnText,
              {
                color: isCompleted ? BrandColors.white : theme.text,
                fontFamily: getFontFamily('bold', isHindi),
              },
            ]}>
            {isCompleted
              ? isHindi
                ? '✓ प्रयोग पूर्ण चिह्नित'
                : '✓ Experiment Completed'
              : t('mark_as_completed')}
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 6,
  },
  backText: {
    fontSize: 14,
  },
  bookmarkBtn: {
    padding: 6,
  },
  heroCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  labTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 6,
  },
  labDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 16,
  },
  statText: {
    fontSize: 12,
  },
  tabBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    marginBottom: 14,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {},
  tabItemText: {
    fontSize: 13,
  },
  tabItemTextActive: {
    fontWeight: '700',
  },
  tabContentCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 18,
  },
  contentHeader: {
    fontSize: 16,
    marginBottom: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  guidedNoticeBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  guidedNoticeText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  apparatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  apparatusText: {
    fontSize: 13,
    flex: 1,
  },
  safetySection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
  },
  safetyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  safetyHeaderText: {
    fontSize: 14,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 6,
  },
  safetyIcon: {
    marginTop: 2,
  },
  safetyText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  theoryBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryActionBtnText: {
    color: BrandColors.white,
    fontSize: 15,
  },
  apparatusHeaderRow: {
    marginBottom: 8,
  },
  apparatusHint: {
    fontSize: 11.5,
    marginTop: -2,
    marginBottom: 6,
  },
  completeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  completeActionBtnText: {
    fontSize: 14,
  },
  obsoleteCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  obsoleteIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  obsoleteTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  obsoleteDesc: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
