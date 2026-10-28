import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { getFontFamily } from '@/constants/Typography';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language, setLanguage, isHindi } = useLanguage();
  const { continueAsGuest } = useAuth();

  const handleGuestEntry = async () => {
    await continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Bar with Language Switcher */}
        <View style={styles.topBar}>
          {/* Quick Language Toggle Pill */}
          <View style={[styles.langToggleBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
            <TouchableOpacity
              style={[
                styles.langOption,
                language === 'en' && [styles.langOptionActive, { backgroundColor: theme.card }],
              ]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.langOptionText,
                  {
                    color: language === 'en' ? theme.text : theme.textMuted,
                    fontFamily: getFontFamily(language === 'en' ? 'bold' : 'regular', false),
                  },
                ]}>
                EN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langOption,
                language === 'hi' && [styles.langOptionActive, { backgroundColor: theme.card }],
              ]}
              onPress={() => setLanguage('hi')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.langOptionText,
                  {
                    color: language === 'hi' ? theme.text : theme.textMuted,
                    fontFamily: getFontFamily(language === 'hi' ? 'bold' : 'regular', true),
                  },
                ]}>
                हिन्दी
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Branding Section with Scientist Illustration */}
        <View style={styles.heroSection}>
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/apnilab-scientist.png')}
              style={styles.scientistImage}
              resizeMode="contain"
              accessibilityLabel="Scientist in lab coat holding laboratory glassware"
            />
          </View>
          <Text style={[styles.appTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            ApniLab
          </Text>
          <Text style={[styles.tagline, { color: theme.tint, fontFamily: getFontFamily('semiBold', isHindi) }]}>
            {t('tagline')}
          </Text>
        </View>

        {/* Feature Cards Showcase */}
        <View style={[styles.featuresCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.featureRow}>
            <View style={[styles.featureIconBox, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="flash-outline" size={18} color={theme.tint} />
            </View>
            <Text style={[styles.featureText, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
              {t('auth_feat_simulators')}
            </Text>
          </View>

          <View style={[styles.featureDivider, { backgroundColor: theme.borderSubtle }]} />

          <View style={styles.featureRow}>
            <View style={[styles.featureIconBox, { backgroundColor: isDark ? BrandColors.cyanDarkBg : BrandColors.cyanLight }]}>
              <Ionicons name="school-outline" size={18} color={BrandColors.cyan} />
            </View>
            <Text style={[styles.featureText, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
              {t('auth_feat_curriculum')}
            </Text>
          </View>

          <View style={[styles.featureDivider, { backgroundColor: theme.borderSubtle }]} />

          <View style={styles.featureRow}>
            <View style={[styles.featureIconBox, { backgroundColor: isDark ? BrandColors.emeraldDarkBg : BrandColors.emeraldLight }]}>
              <Ionicons name="cloud-offline-outline" size={18} color={BrandColors.emerald} />
            </View>
            <Text style={[styles.featureText, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
              {t('auth_feat_offline')}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {/* 1. Primary: Sign in */}
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/(auth)/login' as any)}
            activeOpacity={0.85}>
            <Text style={[styles.primaryBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('auth_login_btn')}
            </Text>
            <Ionicons name="log-in-outline" size={18} color={BrandColors.white} />
          </TouchableOpacity>

          {/* 2. Secondary: Create Account */}
          <TouchableOpacity
            style={[styles.secondaryBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/(auth)/signup' as any)}
            activeOpacity={0.85}>
            <Text style={[styles.secondaryBtnText, { color: theme.text, fontFamily: getFontFamily('semiBold', isHindi) }]}>
              {t('auth_signup_btn')}
            </Text>
            <Ionicons name="person-add-outline" size={18} color={theme.tint} />
          </TouchableOpacity>

          {/* 3. Guest Entry Link */}
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={handleGuestEntry}
            activeOpacity={0.7}>
            <Text style={[styles.guestBtnText, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
              {t('auth_guest_btn')}
            </Text>
            <Text style={[styles.guestHint, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
              {t('auth_guest_hint')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 14,
  },
  langToggleBox: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    gap: 2,
  },
  langOption: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  langOptionActive: {
    ...Platform.select({
      android: { elevation: 1 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  langOptionText: {
    fontSize: 11,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scientistImage: {
    width: 120,
    height: 120,
  },
  appTitle: {
    fontSize: 30,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    marginTop: 2,
  },
  featuresCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  featureIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  featureDivider: {
    height: 1,
    marginVertical: 6,
  },
  actionSection: {
    gap: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      android: { elevation: 3 },
    }),
  },
  primaryBtnText: {
    color: BrandColors.white,
    fontSize: 15,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 15,
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  guestBtnText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  guestHint: {
    fontSize: 11,
    marginTop: 4,
  },
});
