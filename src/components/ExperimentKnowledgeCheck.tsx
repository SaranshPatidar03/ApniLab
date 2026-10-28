import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/Colors';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ExperimentKnowledgeCheckProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export function ExperimentKnowledgeCheck({ questions, onComplete }: ExperimentKnowledgeCheckProps) {
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
      if (onComplete) {
        onComplete(score + (selectedOption === currentQ.correctIndex ? 1 : 0));
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setIsFinished(false);
  };

  // Completed State
  if (isFinished) {
    const finalScore = score;
    const total = questions.length;
    const isPerfect = finalScore === total;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.card,
            borderColor: isDark ? theme.border : BrandColors.indigo200,
          },
        ]}>
        <View style={styles.completedBox}>
          <View
            style={[
              styles.trophyIconBox,
              { backgroundColor: isPerfect ? '#FEF3C7' : theme.primaryLight },
            ]}>
            <Ionicons
              name={isPerfect ? 'trophy' : 'ribbon-outline'}
              size={36}
              color={isPerfect ? '#F59E0B' : theme.tint}
            />
          </View>

          <Text style={[styles.completedTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('quiz_completed_title')}
          </Text>

          <Text style={[styles.completedDesc, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('quiz_completed_desc', { score: finalScore, total })}
          </Text>

          <View style={[styles.scoreBadge, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <Text style={[styles.scoreBadgeText, { color: theme.tint, fontFamily: getFontFamily('bold', false) }]}>
              {finalScore} / {total} ({Math.round((finalScore / total) * 100)}%)
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.restartBtn, { backgroundColor: theme.primary }]}
            onPress={handleRestart}
            activeOpacity={0.85}>
            <Ionicons name="refresh" size={16} color={BrandColors.white} />
            <Text style={[styles.restartBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('restart_quiz')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isCorrect = selectedOption === currentQ.correctIndex;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* Quiz Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="help-buoy-outline" size={20} color={theme.tint} />
          <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('experiment_quiz_title')}
          </Text>
        </View>

        <View style={[styles.progressPill, { backgroundColor: theme.cardAlt }]}>
          <Text style={[styles.progressText, { color: theme.textMuted, fontFamily: getFontFamily('semiBold', false) }]}>
            {t('question_progress', { current: currentIndex + 1, total: questions.length })}
          </Text>
        </View>
      </View>

      {/* Question Text */}
      <Text style={[styles.questionText, { color: theme.text, fontFamily: getFontFamily('semiBold', isHindi) }]}>
        {currentQ.question}
      </Text>

      {/* Options List */}
      <View style={styles.optionsList}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          let optBorderColor = theme.border;
          let optBgColor = theme.cardAlt;

          if (isAnswerChecked) {
            if (idx === currentQ.correctIndex) {
              optBorderColor = '#10B981';
              optBgColor = isDark ? '#064E3B' : '#ECFDF5';
            } else if (isSelected && !isCorrect) {
              optBorderColor = '#EF4444';
              optBgColor = isDark ? '#881337' : '#FFE4E6';
            }
          } else if (isSelected) {
            optBorderColor = theme.primary;
            optBgColor = theme.primaryLight;
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionItem,
                {
                  backgroundColor: optBgColor,
                  borderColor: optBorderColor,
                },
              ]}
              onPress={() => handleSelectOption(idx)}
              activeOpacity={0.8}
              disabled={isAnswerChecked}>
              <View
                style={[
                  styles.radioDot,
                  {
                    borderColor: isSelected ? theme.primary : theme.textMuted,
                    backgroundColor: isSelected ? theme.primary : 'transparent',
                  },
                ]}>
                {isSelected && <View style={styles.innerDot} />}
              </View>

              <Text
                style={[
                  styles.optionText,
                  {
                    color: theme.text,
                    fontFamily: getFontFamily(isSelected ? 'semiBold' : 'regular', isHindi),
                  },
                ]}>
                {opt}
              </Text>

              {isAnswerChecked && idx === currentQ.correctIndex && (
                <Ionicons name="checkmark-circle" size={18} color="#10B981" style={styles.feedbackIcon} />
              )}
              {isAnswerChecked && isSelected && !isCorrect && (
                <Ionicons name="close-circle" size={18} color="#EF4444" style={styles.feedbackIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback Banner after checking */}
      {isAnswerChecked && (
        <View
          style={[
            styles.feedbackBanner,
            {
              backgroundColor: isCorrect
                ? isDark ? '#064E3B' : '#ECFDF5'
                : isDark ? '#78350F' : '#FEF3C7',
              borderColor: isCorrect ? '#10B981' : '#F59E0B',
            },
          ]}>
          <Ionicons
            name={isCorrect ? 'checkmark-circle-outline' : 'information-circle-outline'}
            size={18}
            color={isCorrect ? '#10B981' : '#D97706'}
          />
          <View style={styles.feedbackTextCol}>
            <Text
              style={[
                styles.feedbackTitle,
                {
                  color: isCorrect ? '#047857' : '#B45309',
                  fontFamily: getFontFamily('bold', isHindi),
                },
              ]}>
              {isCorrect ? t('correct_feedback') : t('incorrect_feedback')}
            </Text>
            <Text
              style={[
                styles.explanationText,
                {
                  color: isCorrect ? '#065F46' : '#92400E',
                  fontFamily: getFontFamily('regular', isHindi),
                },
              ]}>
              {currentQ.explanation}
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {!isAnswerChecked ? (
          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor: selectedOption !== null ? theme.primary : theme.border,
              },
            ]}
            onPress={handleCheckAnswer}
            disabled={selectedOption === null}
            activeOpacity={0.85}>
            <Text
              style={[
                styles.submitBtnText,
                {
                  color: selectedOption !== null ? BrandColors.white : theme.textMuted,
                  fontFamily: getFontFamily('bold', isHindi),
                },
              ]}>
              {t('submit_answer')}
            </Text>
            <Ionicons
              name="checkmark"
              size={16}
              color={selectedOption !== null ? BrandColors.white : theme.textMuted}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.primary }]}
            onPress={handleNext}
            activeOpacity={0.85}>
            <Text style={[styles.submitBtnText, { color: BrandColors.white, fontFamily: getFontFamily('bold', isHindi) }]}>
              {currentIndex + 1 < questions.length ? t('next_question') : (isHindi ? 'परिणाम देखें' : 'View Results')}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={BrandColors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginTop: 20,
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
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 15,
  },
  progressPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 11,
  },
  questionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  optionsList: {
    gap: 8,
    marginBottom: 14,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 13.5,
    flex: 1,
  },
  feedbackIcon: {
    marginLeft: 6,
  },
  feedbackBanner: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 14,
  },
  feedbackTextCol: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 17,
  },
  actionRow: {
    alignItems: 'flex-end',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  submitBtnText: {
    fontSize: 13,
  },
  completedBox: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  trophyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  completedTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  completedDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginVertical: 4,
  },
  scoreBadgeText: {
    fontSize: 15,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    marginTop: 6,
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
});

