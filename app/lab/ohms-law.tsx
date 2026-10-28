import React, { useState, useMemo, useRef } from 'react';
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
import Svg, { Rect, Circle, Line, Text as SvgText, Path } from 'react-native-svg';
import { BrandColors } from '@/constants/Colors';
import { Badge } from '@/src/components/Badge';
import { ExperimentKnowledgeCheck, QuizQuestion } from '@/src/components/ExperimentKnowledgeCheck';
import { ChatbotFab } from '@/src/components/ChatbotFab';
import { ChatbotModal } from '@/src/components/ChatbotModal';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

interface ObservationRecord {
  id: number;
  voltage: number;
  resistance: number;
  currentMa: number;
  powerMw: number;
}

export default function OhmsLawScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const observationCounter = useRef(10);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // State for Voltage (V) and Resistance (Ω)
  const [voltage, setVoltage] = useState<number>(5.0); // Volts
  const [resistance, setResistance] = useState<number>(100); // Ohms
  const [observations, setObservations] = useState<ObservationRecord[]>([
    { id: 1, voltage: 3.3, resistance: 100, currentMa: 33.0, powerMw: 108.9 },
    { id: 2, voltage: 5.0, resistance: 100, currentMa: 50.0, powerMw: 250.0 },
  ]);

  const ohmsQuizQuestions: QuizQuestion[] = useMemo(
    () => [
      {
        question: isHindi
          ? 'यदि प्रतिरोध (R) स्थिर रहे और वोल्टेज (V) को दोगुना कर दिया जाए, तो विद्युत धारा (I) पर क्या प्रभाव पड़ेगा?'
          : 'If Resistance (R) remains constant and DC Voltage (V) is doubled, what happens to Current (I)?',
        options: isHindi
          ? ['धारा आधी हो जाएगी', 'धारा दोगुनी हो जाएगी', 'धारा अपरिवर्तित रहेगी', 'धारा शून्य हो जाएगी']
          : ['Current is halved', 'Current is doubled', 'Current remains unchanged', 'Current drops to zero'],
        correctIndex: 1,
        explanation: isHindi
          ? 'ओम के नियम (V = I × R) के अनुसार, स्थिर प्रतिरोध पर धारा वोल्टेज के सीधे आनुपातिक (I ∝ V) होती है।'
          : "According to Ohm's Law (V = I × R), current is directly proportional to voltage (I ∝ V) when resistance is kept constant.",
      },
      {
        question: isHindi
          ? 'विद्युत प्रतिरोध (Electrical Resistance) की SI इकाई क्या है?'
          : 'What is the SI unit of electrical resistance?',
        options: isHindi
          ? ['एम्पीयर (A)', 'वोल्ट (V)', 'ओम (Ω)', 'वाट (W)']
          : ['Ampere (A)', 'Volt (V)', 'Ohm (Ω)', 'Watt (W)'],
        correctIndex: 2,
        explanation: isHindi
          ? 'प्रतिरोध की SI इकाई ओम (Ω) है, जिसका नाम जर्मन भौतिक विज्ञानी जॉर्ज साइमन ओम के नाम पर रखा गया है।'
          : "The SI unit of resistance is Ohm (Ω), named after German physicist Georg Simon Ohm.",
      },
      {
        question: isHindi
          ? 'विभवांतर (V) और धारा (I) के बीच खींचे गए ग्राफ का ढाल (Slope) क्या दर्शाता है?'
          : 'What does the slope of a Voltage (V) versus Current (I) graph represent?',
        options: isHindi
          ? ['विद्युत शक्ति (P)', 'विद्युत प्रतिरोध (R)', 'विद्युत धारिता (C)', 'कुल आवेश (Q)']
          : ['Electric Power (P)', 'Resistance (R)', 'Capacitance (C)', 'Electric Charge (Q)'],
        correctIndex: 1,
        explanation: isHindi
          ? 'ढाल = ΔV / ΔI = R (प्रतिरोध)। एक ओमिक चालक के लिए यह रेखा सीधी होती है।'
          : 'Slope = ΔV / ΔI = R (Resistance). For an ohmic conductor, this graph is a straight line through the origin.',
      },
    ],
    [isHindi]
  );

  // Derived Calculations: I = V / R, P = V * I
  const currentAmps = useMemo(() => {
    return resistance > 0 ? voltage / resistance : 0;
  }, [voltage, resistance]);

  const currentMa = useMemo(() => {
    return currentAmps * 1000;
  }, [currentAmps]);

  const powerWatts = useMemo(() => {
    return voltage * currentAmps;
  }, [voltage, currentAmps]);

  const powerMw = useMemo(() => {
    return powerWatts * 1000;
  }, [powerWatts]);

  // Visual cues based on current
  const isHighCurrent = currentAmps > 0.5; // > 500mA
  const bulbGlowOpacity = Math.min(1, Math.max(0.15, currentMa / 250));
  const bulbGlowRadius = Math.min(22, 10 + (currentMa / 250) * 12);

  // Stepper handlers
  const handleVoltageChange = (delta: number) => {
    setVoltage((prev) => {
      const next = Math.round((prev + delta) * 10) / 10;
      return Math.max(0.5, Math.min(24.0, next));
    });
  };

  const handleResistanceChange = (delta: number) => {
    setResistance((prev) => {
      const next = prev + delta;
      return Math.max(1, Math.min(1000, next));
    });
  };

  const handleLogObservation = () => {
    observationCounter.current += 1;
    const newRecord: ObservationRecord = {
      id: observationCounter.current,
      voltage: Math.round(voltage * 10) / 10,
      resistance,
      currentMa: Math.round(currentMa * 10) / 10,
      powerMw: Math.round(powerMw * 10) / 10,
    };
    setObservations((prev) => [newRecord, ...prev.slice(0, 7)]);
  };

  const clearObservations = () => {
    setObservations([]);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Breadcrumb / Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={theme.textSecondary} />
            <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>{t('all_labs')}</Text>
          </TouchableOpacity>
          <Badge label={t('cat_physics')} variant="primary" />
        </View>

        {/* Lab Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>{t('ohms_title')}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('ohms_subtitle')}
          </Text>
        </View>

        {/* Dynamic Circuit Diagram */}
        <View style={[styles.circuitCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.circuitHeader}>
            <View style={styles.circuitTitleRow}>
              <Ionicons name="hardware-chip-outline" size={18} color={theme.tint} />
              <Text style={[styles.circuitTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>{t('live_circuit')}</Text>
            </View>
            <View style={[styles.statusPill, isHighCurrent && styles.warningPill]}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isHighCurrent ? BrandColors.rose : BrandColors.emerald },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isHighCurrent ? BrandColors.rose : BrandColors.emerald, fontFamily: getFontFamily('semiBold', isHindi) },
                ]}>
                {isHighCurrent ? t('high_load') : t('circuit_active')}
              </Text>
            </View>
          </View>

          {/* SVG Circuit Canvas */}
          <View style={styles.svgContainer}>
            <Svg width="320" height="180" viewBox="0 0 320 180">
              {/* Loop Wires */}
              <Line x1="40" y1="30" x2="280" y2="30" stroke={theme.tint} strokeWidth="3" />
              <Line x1="280" y1="30" x2="280" y2="150" stroke={theme.tint} strokeWidth="3" />
              <Line x1="280" y1="150" x2="40" y2="150" stroke={theme.tint} strokeWidth="3" />
              <Line x1="40" y1="150" x2="40" y2="30" stroke={theme.tint} strokeWidth="3" />

              {/* DC Battery Symbol on Left */}
              <Rect x="30" y="70" width="20" height="40" fill={theme.card} />
              <Line x1="25" y1="80" x2="55" y2="80" stroke={theme.text} strokeWidth="4" />
              <Line x1="33" y1="92" x2="47" y2="92" stroke={theme.text} strokeWidth="4" />
              <Line x1="25" y1="104" x2="55" y2="104" stroke={theme.text} strokeWidth="4" />
              <SvgText x="6" y="94" fill={theme.tint} fontSize="11" fontWeight="bold">
                {voltage}V
              </SvgText>

              {/* Bulb with Glow on Top Wire */}
              <Rect x="140" y="18" width="40" height="24" fill={theme.card} />
              <Circle
                cx="160"
                cy="30"
                r={bulbGlowRadius}
                fill={BrandColors.amber}
                fillOpacity={bulbGlowOpacity * 0.4}
              />
              <Circle
                cx="160"
                cy="30"
                r="11"
                fill={bulbGlowOpacity > 0.4 ? BrandColors.amber : (isDark ? '#334155' : BrandColors.slate200)}
                stroke={theme.border}
                strokeWidth="1.5"
              />
              {/* Bulb Filament Cross */}
              <Line x1="154" y1="26" x2="166" y2="34" stroke={isDark ? '#CBD5E1' : BrandColors.slate800} strokeWidth="1" />
              <Line x1="166" y1="26" x2="154" y2="34" stroke={isDark ? '#CBD5E1' : BrandColors.slate800} strokeWidth="1" />
              <SvgText x="144" y="14" fill={theme.textSecondary} fontSize="10" fontWeight="600">
                {t('bulb_label')}
              </SvgText>

              {/* Resistor on Bottom Wire */}
              <Rect x="130" y="138" width="60" height="24" fill={theme.card} />
              <Path
                d="M 130 150 L 136 142 L 144 158 L 152 142 L 160 158 L 168 142 L 176 158 L 184 142 L 190 150"
                fill="none"
                stroke={BrandColors.purple}
                strokeWidth="2.5"
              />
              <SvgText x="138" y="174" fill={BrandColors.purple} fontSize="11" fontWeight="bold">
                {resistance}Ω
              </SvgText>

              {/* Digital Ammeter on Right Wire */}
              <Rect x="270" y="70" width="20" height="40" fill={theme.card} />
              <Circle cx="280" cy="90" r="16" fill={theme.cardAlt} stroke={theme.tint} strokeWidth="2" />
              <SvgText x="274" y="95" fill={theme.tint} fontSize="13" fontWeight="bold">
                A
              </SvgText>
            </Svg>
          </View>
        </View>

        {/* Calculated Result Display Card */}
        <View style={styles.resultCard}>
          <Text style={styles.formulaTitle}>{t('calculated_current_title')}</Text>
          <View style={styles.resultValueRow}>
            <Text style={styles.resultNumber}>
              {currentMa < 1000 ? currentMa.toFixed(1) : currentAmps.toFixed(3)}
            </Text>
            <Text style={styles.resultUnit}>{currentMa < 1000 ? 'mA' : 'A'}</Text>
          </View>

          <View style={styles.derivedMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>{t('power_dissipated')}</Text>
              <Text style={styles.metricValue}>
                {powerMw < 1000 ? `${powerMw.toFixed(1)} mW` : `${powerWatts.toFixed(2)} W`}
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>{t('load_resistance')}</Text>
              <Text style={styles.metricValue}>{resistance} Ω</Text>
            </View>
          </View>

          {isHighCurrent && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning-outline" size={16} color={BrandColors.rose} />
              <Text style={styles.warningBannerText}>
                {t('high_current_warning', { current: currentMa.toFixed(0) })}
              </Text>
            </View>
          )}
        </View>

        {/* Interactive Controls */}
        <View style={styles.controlsSection}>
          <Text style={[styles.sectionHeader, { color: theme.text }]}>{t('adjust_params')}</Text>

          {/* Voltage Control Card */}
          <View style={[styles.controlCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.controlTitleRow}>
              <View style={styles.labelWithIcon}>
                <Ionicons name="flash" size={18} color={theme.tint} />
                <Text style={[styles.controlLabel, { color: theme.text }]}>{t('voltage_source')}</Text>
              </View>
              <Text style={[styles.controlValueBadge, { color: theme.tint }]}>
                {t('volts_badge', { val: voltage.toFixed(1) })}
              </Text>
            </View>

            {/* Stepper Buttons */}
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleVoltageChange(-1.0)}
                activeOpacity={0.7}>
                <Ionicons name="remove" size={20} color={theme.text} />
                <Text style={[styles.stepBtnText, { color: theme.text }]}>-1.0V</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.stepBtnSmall, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleVoltageChange(-0.1)}
                activeOpacity={0.7}>
                <Text style={[styles.stepBtnText, { color: theme.text }]}>-0.1V</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.stepBtnSmall, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleVoltageChange(0.1)}
                activeOpacity={0.7}>
                <Text style={[styles.stepBtnText, { color: theme.text }]}>+0.1V</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleVoltageChange(1.0)}
                activeOpacity={0.7}>
                <Ionicons name="add" size={20} color={theme.text} />
                <Text style={[styles.stepBtnText, { color: theme.text }]}>+1.0V</Text>
              </TouchableOpacity>
            </View>

            {/* Preset Voltage Pills */}
            <View style={styles.presetRow}>
              <Text style={[styles.presetLabel, { color: theme.textMuted }]}>{t('presets')}</Text>
              {[1.5, 3.3, 5.0, 9.0, 12.0, 24.0].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetPill,
                    { backgroundColor: theme.cardAlt },
                    voltage === val && [styles.presetPillActive, { backgroundColor: theme.primaryLight, borderColor: theme.tint }],
                  ]}
                  onPress={() => setVoltage(val)}>
                  <Text
                    style={[
                      styles.presetPillText,
                      { color: theme.textSecondary },
                      voltage === val && { color: theme.tint, fontWeight: '700' },
                    ]}>
                    {val}V
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Resistance Control Card */}
          <View style={[styles.controlCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.controlTitleRow}>
              <View style={styles.labelWithIcon}>
                <Ionicons name="hardware-chip" size={18} color={BrandColors.purple} />
                <Text style={[styles.controlLabel, { color: theme.text }]}>{t('resistance_label')}</Text>
              </View>
              <Text style={[styles.controlValueBadge, { color: BrandColors.purple }]}>
                {resistance} Ω
              </Text>
            </View>

            {/* Stepper Buttons */}
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleResistanceChange(-50)}
                activeOpacity={0.7}>
                <Ionicons name="remove" size={20} color={theme.text} />
                <Text style={[styles.stepBtnText, { color: theme.text }]}>-50Ω</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.stepBtnSmall, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleResistanceChange(-10)}
                activeOpacity={0.7}>
                <Text style={[styles.stepBtnText, { color: theme.text }]}>-10Ω</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.stepBtnSmall, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleResistanceChange(10)}
                activeOpacity={0.7}>
                <Text style={[styles.stepBtnText, { color: theme.text }]}>+10Ω</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: theme.cardAlt }]}
                onPress={() => handleResistanceChange(50)}
                activeOpacity={0.7}>
                <Ionicons name="add" size={20} color={theme.text} />
                <Text style={[styles.stepBtnText, { color: theme.text }]}>+50Ω</Text>
              </TouchableOpacity>
            </View>

            {/* Preset Resistance Pills */}
            <View style={styles.presetRow}>
              <Text style={[styles.presetLabel, { color: theme.textMuted }]}>{t('presets')}</Text>
              {[10, 50, 100, 220, 470, 1000].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetPill,
                    { backgroundColor: theme.cardAlt },
                    resistance === val && [styles.presetPillActive, { backgroundColor: theme.primaryLight, borderColor: theme.tint }],
                  ]}
                  onPress={() => setResistance(val)}>
                  <Text
                    style={[
                      styles.presetPillText,
                      { color: theme.textSecondary },
                      resistance === val && { color: theme.tint, fontWeight: '700' },
                    ]}>
                    {val >= 1000 ? '1kΩ' : `${val}Ω`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Experiment Observation Table */}
        <View style={[styles.logSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.logHeaderRow}>
            <View>
              <Text style={[styles.sectionHeader, { color: theme.text }]}>{t('obs_log')}</Text>
              <Text style={[styles.logSubtitle, { color: theme.textMuted }]}>{t('obs_sub')}</Text>
            </View>
            <TouchableOpacity
              style={[styles.recordBtn, { backgroundColor: theme.primary }]}
              onPress={handleLogObservation}
              activeOpacity={0.8}>
              <Ionicons name="add-circle" size={18} color={BrandColors.white} />
              <Text style={styles.recordBtnText}>{t('log_point')}</Text>
            </TouchableOpacity>
          </View>

          {/* Table Header */}
          <View style={[styles.tableHeader, { backgroundColor: theme.cardAlt }]}>
            <Text style={[styles.tableCol, styles.tableColHeader, { color: theme.textSecondary }]}>{t('col_trial')}</Text>
            <Text style={[styles.tableCol, styles.tableColHeader, { color: theme.textSecondary }]}>{t('col_voltage')}</Text>
            <Text style={[styles.tableCol, styles.tableColHeader, { color: theme.textSecondary }]}>{t('col_resistance')}</Text>
            <Text style={[styles.tableCol, styles.tableColHeader, { color: theme.textSecondary }]}>{t('col_current')}</Text>
            <Text style={[styles.tableCol, styles.tableColHeader, { color: theme.textSecondary }]}>{t('col_power')}</Text>
          </View>

          {observations.length === 0 ? (
            <View style={styles.emptyTable}>
              <Text style={[styles.emptyTableText, { color: theme.textMuted }]}>{t('no_obs_logged')}</Text>
            </View>
          ) : (
            observations.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  { borderBottomColor: theme.borderSubtle },
                  index % 2 === 1 && { backgroundColor: theme.cardAlt },
                ]}>
                <Text style={[styles.tableCol, styles.trialCol, { color: theme.tint }]}>#{observations.length - index}</Text>
                <Text style={[styles.tableCol, { color: theme.text }]}>{item.voltage}V</Text>
                <Text style={[styles.tableCol, { color: theme.text }]}>{item.resistance}Ω</Text>
                <Text style={[styles.tableCol, styles.highlightCol, { color: theme.tint }]}>{item.currentMa}</Text>
                <Text style={[styles.tableCol, { color: theme.text }]}>{item.powerMw}</Text>
              </View>
            ))
          )}

          {observations.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearObservations}>
              <Text style={[styles.clearBtnText, { color: theme.textMuted }]}>{t('clear_table')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lab Theory & Formula Explanation */}
        <View style={[styles.theoryCard, { backgroundColor: isDark ? theme.card : BrandColors.indigo50, borderColor: isDark ? theme.border : BrandColors.indigo100 }]}>
          <View style={styles.theoryTitleRow}>
            <Ionicons name="book-outline" size={20} color={theme.tint} />
            <Text style={[styles.theoryTitle, { color: theme.tint }]}>{t('scientific_principle')}</Text>
          </View>
          <Text style={[styles.theoryText, { color: theme.textSecondary }]}>
            {t('ohms_principle_text')}
          </Text>

          <View style={[styles.formulaBox, { backgroundColor: theme.cardAlt, borderColor: theme.primaryBorder }]}>
            <Text style={[styles.formulaEquation, { color: theme.tint }]}>I = V / R</Text>
            <Text style={[styles.formulaDetails, { color: theme.textMuted }]}>
              {t('ohms_where')}
            </Text>
          </View>

          <Text style={[styles.keyTakeaway, { color: theme.textSecondary }]}>
            {t('ohms_takeaway')}
          </Text>
        </View>

        {/* Interactive Knowledge Check Quiz */}
        <ExperimentKnowledgeCheck questions={ohmsQuizQuestions} />
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
  circuitCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  circuitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  circuitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  circuitTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  warningPill: {
    backgroundColor: BrandColors.roseLight,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  resultCard: {
    backgroundColor: BrandColors.indigo,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
    ...Platform.select({
      android: { elevation: 3 },
    }),
  },
  formulaTitle: {
    color: BrandColors.indigo200,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  resultValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  resultNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: BrandColors.white,
  },
  resultUnit: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.indigo200,
    marginLeft: 6,
  },
  derivedMetrics: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    width: '100%',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  metricLabel: {
    fontSize: 10,
    color: BrandColors.indigo100,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: BrandColors.white,
    marginTop: 2,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  warningBannerText: {
    fontSize: 11,
    color: BrandColors.rose,
    fontWeight: '600',
  },
  controlsSection: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  controlCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  controlTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  controlValueBadge: {
    fontSize: 15,
    fontWeight: '800',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  stepBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  stepBtnSmall: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  stepBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginRight: 2,
  },
  presetPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  presetPillActive: {
    borderWidth: 1,
  },
  presetPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  logSection: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  logHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logSubtitle: {
    fontSize: 12,
    marginTop: -6,
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  recordBtnText: {
    color: BrandColors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  tableCol: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
  tableColHeader: {
    fontWeight: '700',
    fontSize: 11,
  },
  trialCol: {
    fontWeight: '700',
  },
  highlightCol: {
    fontWeight: '800',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
  },
  emptyTable: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  emptyTableText: {
    fontSize: 12,
  },
  clearBtn: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  theoryCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  theoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  theoryTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  theoryText: {
    fontSize: 13,
    lineHeight: 19,
  },
  boldText: {
    fontWeight: '700',
  },
  formulaBox: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  formulaEquation: {
    fontSize: 22,
    fontWeight: '900',
  },
  formulaDetails: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  keyTakeaway: {
    fontSize: 12,
    lineHeight: 18,
  },
});
