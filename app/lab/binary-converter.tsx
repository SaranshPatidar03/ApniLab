import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import { Badge } from '@/src/components/Badge';
import { ChatbotFab } from '@/src/components/ChatbotFab';
import { ChatbotModal } from '@/src/components/ChatbotModal';
import { ExperimentKnowledgeCheck, QuizQuestion } from '@/src/components/ExperimentKnowledgeCheck';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

interface DivisionStep {
  step: number;
  quotientBefore: number;
  quotientAfter: number;
  remainder: number;
}

// Pure module-level function — avoids react-hooks/purity lint errors
function getBinaryQuizQuestions(isHindi: boolean): QuizQuestion[] {
  return [
    {
      question: isHindi
        ? 'दशमलव संख्या 10 को बाइनरी (आधार-2) में क्या होगा?'
        : 'What is the binary (base-2) representation of the decimal number 10?',
      options: isHindi
        ? ['1010', '1001', '1100', '0101']
        : ['1010', '1001', '1100', '0101'],
      correctIndex: 0,
      explanation: isHindi
        ? '10 को 2 से क्रमशः भाग करने पर शेषफल (नीचे से ऊपर): 0, 1, 0, 1 → 1010₂'
        : 'Dividing 10 by 2 repeatedly gives remainders (bottom to top): 0, 1, 0, 1 → 1010₂',
    },
    {
      question: isHindi
        ? 'बाइनरी संख्या 1111 का दशमलव मान क्या है?'
        : 'What is the decimal value of the binary number 1111?',
      options: isHindi
        ? ['15', '16', '14', '7']
        : ['15', '16', '14', '7'],
      correctIndex: 0,
      explanation: isHindi
        ? '1111₂ = 1×8 + 1×4 + 1×2 + 1×1 = 8+4+2+1 = 15'
        : '1111₂ = 1×8 + 1×4 + 1×2 + 1×1 = 8+4+2+1 = 15',
    },
    {
      question: isHindi
        ? 'किसी 8-बिट बाइनरी संख्या में सबसे बाईं बिट (MSB) का स्थानीय मान क्या होता है?'
        : 'What is the place value of the leftmost bit (MSB) in an 8-bit binary number?',
      options: isHindi
        ? ['128', '64', '256', '8']
        : ['128', '64', '256', '8'],
      correctIndex: 0,
      explanation: isHindi
        ? '8-बिट संख्या में बिट की स्थिति 7 से 0 होती है। MSB = 2⁷ = 128'
        : 'In an 8-bit number, bit positions run from 7 to 0. MSB = 2⁷ = 128',
    },
  ];
}

export default function BinaryConverterScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // State
  const [inputText, setInputText] = useState<string>('42');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeBits, setActiveBits] = useState<number[]>([0, 0, 1, 0, 1, 0, 1, 0]); // 8-bit array for 42: 00101010

  // Quiz Mode State
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Parse decimal value
  const decimalValue = useMemo(() => {
    return activeBits.reduce((acc, bit, idx) => {
      const power = 7 - idx;
      return acc + bit * Math.pow(2, power);
    }, 0);
  }, [activeBits]);

  // Derived Representations
  const binaryString = useMemo(() => {
    return activeBits.join('');
  }, [activeBits]);

  const hexString = useMemo(() => {
    return decimalValue.toString(16).toUpperCase();
  }, [decimalValue]);

  const octalString = useMemo(() => {
    return decimalValue.toString(8);
  }, [decimalValue]);

  // Successive Division by 2 Calculation
  const divisionSteps = useMemo(() => {
    const steps: DivisionStep[] = [];
    let num = decimalValue;
    let stepCount = 1;

    if (num === 0) {
      return [
        {
          step: 1,
          quotientBefore: 0,
          quotientAfter: 0,
          remainder: 0,
        },
      ];
    }

    while (num > 0) {
      const quotientAfter = Math.floor(num / 2);
      const remainder = num % 2;
      steps.push({
        step: stepCount,
        quotientBefore: num,
        quotientAfter,
        remainder,
      });
      num = quotientAfter;
      stepCount++;
    }

    return steps;
  }, [decimalValue]);

  // Handle direct decimal text input
  const handleApplyDecimal = (textToApply?: string) => {
    const raw = textToApply !== undefined ? textToApply : inputText;
    const trimmed = raw.trim();

    if (!trimmed) {
      setErrorMessage(t('err_enter_between'));
      return;
    }

    if (!/^\d+$/.test(trimmed)) {
      setErrorMessage(t('err_invalid_input'));
      return;
    }

    const num = parseInt(trimmed, 10);
    if (num < 0 || num > 255) {
      setErrorMessage(t('err_range'));
      return;
    }

    setErrorMessage(null);
    setInputText(trimmed);

    const newBits = [];
    for (let i = 7; i >= 0; i--) {
      newBits.push((num >> i) & 1);
    }
    setActiveBits(newBits);
  };

  // Toggle individual bit
  const handleToggleBit = (index: number) => {
    const updated = [...activeBits];
    updated[index] = updated[index] === 1 ? 0 : 1;
    setActiveBits(updated);

    const newDec = updated.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 7 - idx), 0);
    setInputText(newDec.toString());
    setErrorMessage(null);

    if (targetNumber !== null) {
      if (newDec === targetNumber) {
        setQuizFeedback(t('quiz_success', { number: targetNumber }));
        setQuizScore((prev) => prev + 1);
      } else {
        setQuizFeedback(null);
      }
    }
  };

  const handleNewChallenge = () => {
    const random = Math.floor(Math.random() * 200) + 1;
    setTargetNumber(random);
    setQuizFeedback(null);
    setActiveBits([0, 0, 0, 0, 0, 0, 0, 0]);
    setInputText('0');
  };

  const handleEndChallenge = () => {
    setTargetNumber(null);
    setQuizFeedback(null);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Navigation */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={theme.textSecondary} />
            <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>{t('all_labs')}</Text>
          </TouchableOpacity>
          <Badge label={t('cat_math')} variant="info" />
        </View>

        {/* Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>{t('binary_title')}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('binary_subtitle')}
          </Text>
        </View>

        {/* Primary Decimal Input Card */}
        <View style={[styles.inputCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardHeader, { color: theme.textSecondary }]}>{t('enter_decimal')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              value={inputText}
              onChangeText={(val) => {
                setInputText(val);
                setErrorMessage(null);
              }}
              placeholder="e.g. 42"
              placeholderTextColor={theme.textMuted}
              keyboardType="number-pad"
              maxLength={3}
            />
            <TouchableOpacity
              style={[styles.convertBtn, { backgroundColor: theme.primary }]}
              onPress={() => handleApplyDecimal()}
              activeOpacity={0.8}>
              <Text style={styles.convertBtnText}>{t('convert_btn')}</Text>
              <Ionicons name="swap-horizontal" size={16} color={BrandColors.white} />
            </TouchableOpacity>
          </View>

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={BrandColors.rose} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Quick preset buttons */}
          <View style={[styles.presetsRow, { borderTopColor: theme.borderSubtle }]}>
            <Text style={[styles.presetLabel, { color: theme.textMuted }]}>{t('quick_presets')}</Text>
            {[7, 15, 32, 64, 127, 255].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.presetPill, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleApplyDecimal(val.toString())}>
                <Text style={[styles.presetPillText, { color: theme.textSecondary }]}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interactive 8-Bit Switchboard */}
        <View style={[styles.switchboardCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.switchboardHeader}>
            <View style={styles.switchboardTitleRow}>
              <Ionicons name="git-commit-outline" size={18} color={BrandColors.cyan} />
              <Text style={[styles.switchboardTitle, { color: theme.text }]}>{t('switchboard_title')}</Text>
            </View>
            <Text style={[styles.instructionHint, { color: theme.tint }]}>{t('tap_bit_hint')}</Text>
          </View>

          {/* 8 Bits Grid */}
          <View style={styles.bitsGrid}>
            {activeBits.map((bit, idx) => {
              const power = 7 - idx;
              const placeValue = Math.pow(2, power);
              const isOn = bit === 1;

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.bitColumn,
                    { backgroundColor: theme.cardAlt, borderColor: theme.border },
                    isOn && [styles.bitColumnActive, { backgroundColor: theme.primaryLight, borderColor: theme.tint }],
                  ]}
                  onPress={() => handleToggleBit(idx)}
                  activeOpacity={0.7}>
                  {/* Bit State Indicator */}
                  <View
                    style={[
                      styles.bitBox,
                      isOn
                        ? [styles.bitBoxOn, { backgroundColor: theme.primary }]
                        : [styles.bitBoxOff, { backgroundColor: isDark ? '#334155' : BrandColors.slate200 }],
                    ]}>
                    <Text style={[styles.bitDigit, { color: isOn ? BrandColors.white : theme.textMuted }]}>
                      {bit}
                    </Text>
                  </View>

                  {/* Place Value / Power */}
                  <Text style={[styles.placeValue, { color: isOn ? theme.tint : theme.textMuted }]}>
                    {placeValue}
                  </Text>
                  <Text style={[styles.powerLabel, { color: theme.textMuted }]}>2^{power}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Positional Sum Equation */}
          <View style={[styles.equationCard, { backgroundColor: theme.cardAlt }]}>
            <Text style={[styles.equationLabel, { color: theme.textMuted }]}>{t('positional_sum')}</Text>
            <Text style={[styles.equationFormula, { color: theme.textSecondary }]}>
              {activeBits
                .map((bit, idx) => (bit === 1 ? Math.pow(2, 7 - idx) : null))
                .filter(Boolean)
                .join(' + ') || '0'}{' '}
              = <Text style={[styles.boldDecimal, { color: theme.tint }]}>{decimalValue}</Text>
            </Text>
          </View>
        </View>

        {/* Multi-Base Representation Display */}
        <View style={styles.representationsGrid}>
          {/* Binary */}
          <View
            style={[
              styles.baseCard,
              {
                backgroundColor: isDark ? BrandColors.cyanDarkBg : BrandColors.cyanLight,
                borderColor: BrandColors.cyan,
              },
            ]}>
            <Text style={[styles.baseTitle, { color: BrandColors.cyan }]}>{t('base_binary')}</Text>
            <Text style={[styles.baseValueText, { color: theme.text }]}>{binaryString}</Text>
            <Text style={[styles.baseSub, { color: theme.textMuted }]}>{t('bit_byte_sub')}</Text>
          </View>

          {/* Hexadecimal */}
          <View style={[styles.baseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.baseTitle}>{t('base_hex')}</Text>
            <Text style={[styles.baseValueText, { color: BrandColors.purple }]}>
              0x{hexString.padStart(2, '0')}
            </Text>
            <Text style={[styles.baseSub, { color: theme.textMuted }]}>
              {binaryString.slice(0, 4)} {binaryString.slice(4)}
            </Text>
          </View>

          {/* Octal */}
          <View style={[styles.baseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.baseTitle}>{t('base_octal')}</Text>
            <Text style={[styles.baseValueText, { color: BrandColors.emerald }]}>
              {octalString.padStart(3, '0')}
            </Text>
            <Text style={[styles.baseSub, { color: theme.textMuted }]}>{t('base8_radix')}</Text>
          </View>
        </View>

        {/* Practice Challenge Mode */}
        <View style={[styles.quizCard, { backgroundColor: theme.card, borderColor: isDark ? theme.border : BrandColors.amberLight }]}>
          <View style={styles.quizHeader}>
            <View style={styles.quizTitleRow}>
              <Ionicons name="trophy-outline" size={20} color={BrandColors.amber} />
              <Text style={[styles.quizTitle, { color: theme.text }]}>{t('quiz_title')}</Text>
            </View>
            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>{t('quiz_score', { score: quizScore })}</Text>
            </View>
          </View>

          {targetNumber === null ? (
            <View style={styles.quizStartPrompt}>
              <Text style={[styles.quizDesc, { color: theme.textSecondary }]}>
                {t('quiz_desc')}
              </Text>
              <TouchableOpacity
                style={styles.quizStartBtn}
                onPress={handleNewChallenge}
                activeOpacity={0.8}>
                <Text style={styles.quizStartBtnText}>{t('start_challenge')}</Text>
                <Ionicons name="play" size={16} color={BrandColors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.activeQuizBox}>
              <Text style={[styles.targetLabel, { color: theme.textMuted }]}>{t('target_to_form')}</Text>
              <Text style={[styles.targetNumberDisplay, { color: theme.tint }]}>{targetNumber}</Text>
              <Text style={[styles.targetHint, { color: theme.textSecondary }]}>
                {t('current_switchboard', { val: decimalValue })}
              </Text>

              {quizFeedback && (
                <View style={[styles.feedbackBox, { backgroundColor: isDark ? BrandColors.emeraldDarkBg : BrandColors.emeraldLight }]}>
                  <Text style={[styles.feedbackText, { color: isDark ? '#34D399' : BrandColors.emerald }]}>{quizFeedback}</Text>
                  <TouchableOpacity
                    style={styles.nextChallengeBtn}
                    onPress={handleNewChallenge}>
                    <Text style={styles.nextChallengeBtnText}>{t('next_number')}</Text>
                    <Ionicons name="arrow-forward" size={14} color={BrandColors.white} />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.endQuizBtn} onPress={handleEndChallenge}>
                <Text style={[styles.endQuizBtnText, { color: theme.textMuted }]}>{t('quit_challenge')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Step-by-Step Division by 2 Table */}
        <View style={[styles.stepsSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.stepsHeaderRow}>
            <Ionicons name="calculator-outline" size={18} color={theme.tint} />
            <Text style={[styles.sectionHeader, { color: theme.text }]}>{t('division_trace_title')}</Text>
          </View>
          <Text style={[styles.stepsSubtitle, { color: theme.textMuted }]}>
            {t('division_sub', { num: decimalValue })}
          </Text>

          <View style={[styles.stepsTable, { borderColor: theme.border }]}>
            <View style={[styles.tableHeaderRow, { backgroundColor: theme.cardAlt }]}>
              <Text style={[styles.stepCol, styles.tableHeaderCol, { color: theme.textSecondary }]}>{t('col_step')}</Text>
              <Text style={[styles.stepCol, styles.tableHeaderCol, { color: theme.textSecondary }]}>{t('col_division')}</Text>
              <Text style={[styles.stepCol, styles.tableHeaderCol, { color: theme.textSecondary }]}>{t('col_quotient')}</Text>
              <Text style={[styles.stepCol, styles.tableHeaderCol, { color: theme.textSecondary }]}>{t('col_remainder')}</Text>
            </View>

            {divisionSteps.map((s, index) => (
              <View
                key={s.step}
                style={[
                  styles.stepRow,
                  { borderTopColor: theme.borderSubtle },
                  index % 2 === 1 && { backgroundColor: theme.cardAlt },
                ]}>
                <Text style={[styles.stepCol, styles.stepIndex, { color: theme.tint }]}>#{s.step}</Text>
                <Text style={[styles.stepCol, { color: theme.text }]}>
                  {s.quotientBefore} ÷ 2
                </Text>
                <Text style={[styles.stepCol, { color: theme.text }]}>{s.quotientAfter}</Text>
                <View style={[styles.stepCol, styles.remainderCol]}>
                  <View style={[styles.remainderBadge, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.remainderText, { color: theme.tint }]}>{s.remainder}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.readingHint, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="arrow-up" size={16} color={theme.tint} />
            <Text style={[styles.readingHintText, { color: theme.text }]}>
              {t('read_remainders_hint', {
                binary: divisionSteps
                  .map((s) => s.remainder)
                  .reverse()
                  .join(''),
              })}
            </Text>
          </View>
        </View>

        {/* Theory Explanation */}
        <View style={[styles.theoryBox, { backgroundColor: theme.cardAlt }]}>
          <View style={styles.theoryTitleRow}>
            <Ionicons name="information-circle-outline" size={18} color={theme.tint} />
            <Text style={[styles.theoryTitle, { color: theme.text }]}>{t('cs_concept_title')}</Text>
          </View>
          <Text style={[styles.theoryBody, { color: theme.textSecondary }]}>
            {t('cs_concept_body')}
          </Text>
        </View>

        {/* Knowledge Check Quiz */}
        <ExperimentKnowledgeCheck questions={getBinaryQuizQuestions(isHindi)} />
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  inputCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '800',
  },
  convertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  convertBtnText: {
    color: BrandColors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.roseLight,
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    color: BrandColors.rose,
    fontWeight: '600',
    flex: 1,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  presetPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  presetPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  switchboardCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  switchboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  switchboardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchboardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  instructionHint: {
    fontSize: 11,
    fontWeight: '600',
  },
  bitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  bitColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  bitColumnActive: {
    borderWidth: 1,
  },
  bitBox: {
    width: 32,
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  bitBoxOn: {},
  bitBoxOff: {},
  bitDigit: {
    fontSize: 20,
    fontWeight: '900',
  },
  placeValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  powerLabel: {
    fontSize: 9,
    marginTop: 2,
  },
  equationCard: {
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
  },
  equationLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  equationFormula: {
    fontSize: 13,
    fontWeight: '600',
  },
  boldDecimal: {
    fontSize: 15,
    fontWeight: '900',
  },
  representationsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  baseCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  baseTitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  baseValueText: {
    fontSize: 16,
    fontWeight: '900',
    marginVertical: 4,
  },
  baseSub: {
    fontSize: 9,
    textAlign: 'center',
  },
  quizCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quizTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  scorePill: {
    backgroundColor: BrandColors.amberLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.amber,
  },
  quizStartPrompt: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  quizDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  quizStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.amber,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  quizStartBtnText: {
    color: BrandColors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  activeQuizBox: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  targetNumberDisplay: {
    fontSize: 36,
    fontWeight: '900',
    marginVertical: 4,
  },
  targetHint: {
    fontSize: 12,
  },
  feedbackBox: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  feedbackText: {
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 6,
  },
  nextChallengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.emerald,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  nextChallengeBtnText: {
    color: BrandColors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  endQuizBtn: {
    marginTop: 10,
    paddingVertical: 4,
  },
  endQuizBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepsSection: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  stepsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
  },
  stepsSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  stepsTable: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderCol: {
    fontWeight: '700',
  },
  stepRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  stepCol: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  stepIndex: {
    fontWeight: '700',
  },
  remainderCol: {
    alignItems: 'center',
  },
  remainderBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainderText: {
    fontSize: 12,
    fontWeight: '800',
  },
  readingHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  readingHintText: {
    fontSize: 12,
    flex: 1,
  },
  theoryBox: {
    padding: 14,
    borderRadius: 14,
  },
  theoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  theoryTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  theoryBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
});
