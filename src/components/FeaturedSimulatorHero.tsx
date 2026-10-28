import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Rect, Circle, Line, Text as SvgText, Path } from 'react-native-svg';
import { BrandColors } from '@/constants/Colors';
import { Badge } from './Badge';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

export function FeaturedSimulatorHero() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const handleLaunch = () => {
    router.push('/lab/ohms-law' as any);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
          borderColor: isDark ? '#312E81' : BrandColors.indigo200,
        },
      ]}>
      {/* Top Banner Badges */}
      <View style={styles.topRow}>
        <View style={[styles.featuredPill, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="sparkles" size={13} color={theme.tint} />
          <Text style={[styles.featuredPillText, { color: theme.tint, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('hero_badge')}
          </Text>
        </View>

        <Badge label={isHindi ? 'कक्षा ९-१० • भौतिकी' : 'Class IX-X • Physics'} variant="primary" />
      </View>

      {/* Main Title & Description */}
      <View style={styles.textSection}>
        <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
          {isHindi ? "ओम का नियम और विद्युत परिपथ" : "Ohm's Law & DC Circuit Builder"}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
          {t('hero_desc')}
        </Text>
      </View>

      {/* Miniature Interactive Schematic Graphic */}
      <View style={[styles.schematicBox, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC', borderColor: theme.border }]}>
        <Svg width="100%" height={90} viewBox="0 0 320 90">
          {/* Outer circuit rectangle loop */}
          <Rect
            x="30"
            y="15"
            width="260"
            height="60"
            rx="6"
            fill="none"
            stroke={isDark ? '#475569' : '#94A3B8'}
            strokeWidth="2.5"
          />

          {/* DC Battery Symbol on Left */}
          <Line x1="30" y1="36" x2="30" y2="54" stroke={theme.tint} strokeWidth="4" strokeLinecap="round" />
          <Line x1="22" y1="41" x2="22" y2="49" stroke={isDark ? '#94A3B8' : '#64748B'} strokeWidth="3" strokeLinecap="round" />
          <SvgText x="14" y="47" fill={theme.tint} fontSize="10" fontWeight="bold">
            +
          </SvgText>

          {/* Resistor zig-zag on top wire */}
          <Path
            d="M 110 15 L 120 7 L 130 23 L 140 7 L 150 23 L 160 7 L 170 23 L 180 15"
            stroke="#EF4444"
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill="none"
          />
          <SvgText x="145" y="32" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">
            R = 100 Ω
          </SvgText>

          {/* Ammeter circle on right wire */}
          <Circle cx="290" cy="45" r="14" fill={theme.card} stroke="#10B981" strokeWidth="2" />
          <SvgText x="290" y="49" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle">
            A
          </SvgText>

          {/* Glowing Indicator Bulb on bottom wire */}
          <Circle cx="145" cy="75" r="13" fill="#FEF08A" opacity={0.35} />
          <Circle cx="145" cy="75" r="8" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
          {/* Filament cross inside bulb */}
          <Line x1="142" y1="72" x2="148" y2="78" stroke="#713F12" strokeWidth="1" />
          <Line x1="148" y1="72" x2="142" y2="78" stroke="#713F12" strokeWidth="1" />

          {/* Voltage and Current live pill badges */}
          <SvgText x="35" y="70" fill={theme.tint} fontSize="9" fontWeight="bold">
            5.0 V DC
          </SvgText>
          <SvgText x="235" y="70" fill="#10B981" fontSize="9" fontWeight="bold">
            50.0 mA
          </SvgText>
        </Svg>
      </View>

      {/* Meta Highlights Row */}
      <View style={styles.highlightsRow}>
        <View style={styles.highlightItem}>
          <Ionicons name="time-outline" size={14} color={theme.textMuted} />
          <Text style={[styles.highlightText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>
            {t('hero_stat_time')}
          </Text>
        </View>

        <View style={styles.highlightDivider} />

        <View style={styles.highlightItem}>
          <Ionicons name="star" size={14} color={BrandColors.amber} />
          <Text style={[styles.highlightText, { color: theme.textSecondary, fontFamily: getFontFamily('semiBold', false) }]}>
            {t('hero_stat_rating')}
          </Text>
        </View>

        <View style={styles.highlightDivider} />

        <View style={styles.highlightItem}>
          <Ionicons name="flash-outline" size={14} color="#10B981" />
          <Text style={[styles.highlightText, { color: '#10B981', fontFamily: getFontFamily('semiBold', isHindi) }]}>
            {t('hero_stat_interactive')}
          </Text>
        </View>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={[styles.launchBtn, { backgroundColor: theme.primary }]}
        onPress={handleLaunch}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={t('start_experiment')}>
        <Ionicons name="play" size={16} color={BrandColors.white} />
        <Text style={[styles.launchBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
          {t('start_experiment')}
        </Text>
        <Ionicons name="arrow-forward" size={16} color={BrandColors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  featuredPillText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  textSection: {
    marginBottom: 12,
  },
  title: {
    fontSize: 19,
    lineHeight: 25,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  schematicBox: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    marginBottom: 14,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  highlightDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
    opacity: 0.5,
  },
  highlightText: {
    fontSize: 12,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 8,
  },
  launchBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});

