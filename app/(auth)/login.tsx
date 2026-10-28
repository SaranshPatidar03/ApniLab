import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import { getFontFamily } from '@/constants/Typography';

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t, isHindi } = useLanguage();
  const { login, continueAsGuest } = useAuth();

  // Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError(t('auth_err_email_invalid'));
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!password || password.length < 6) {
      setPasswordError(t('auth_err_password_short'));
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  const handleLoginSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate realistic asynchronous validation delay
    setTimeout(async () => {
      const result = await login(email, password);
      setIsSubmitting(false);

      if (result.success) {
        router.replace('/(tabs)');
      }
    }, 600);
  };

  const handleGuestEntry = async () => {
    await continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Back Navigation Button */}
          <View style={styles.navBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color={theme.textSecondary} />
              <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>
                {t('back')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Header Title */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('auth_login_title')}
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                {t('auth_email_label')}
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.inputBg, borderColor: emailError ? BrandColors.rose : theme.inputBorder },
                ]}>
                <Ionicons name="mail-outline" size={18} color={emailError ? BrandColors.rose : theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.text, fontFamily: getFontFamily('regular', false) }]}
                  placeholder={t('auth_email_placeholder')}
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) setEmailError(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                {email.length > 0 && (
                  <TouchableOpacity onPress={() => setEmail('')}>
                    <Ionicons name="close-circle" size={16} color={theme.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
              {emailError && (
                <Text style={[styles.errorText, { color: BrandColors.rose, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {emailError}
                </Text>
              )}
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                {t('auth_password_label')}
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.inputBg, borderColor: passwordError ? BrandColors.rose : theme.inputBorder },
                ]}>
                <Ionicons name="lock-closed-outline" size={18} color={passwordError ? BrandColors.rose : theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.text, fontFamily: getFontFamily('regular', false) }]}
                  placeholder={t('auth_password_placeholder')}
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (passwordError) setPasswordError(null);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {passwordError && (
                <Text style={[styles.errorText, { color: BrandColors.rose, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {passwordError}
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: theme.primary }, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleLoginSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}>
              {isSubmitting ? (
                <View style={styles.submittingRow}>
                  <ActivityIndicator size="small" color={BrandColors.white} />
                  <Text style={[styles.submitBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('auth_signing_in')}
                  </Text>
                </View>
              ) : (
                <View style={styles.submittingRow}>
                  <Text style={[styles.submitBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('auth_sign_in_submit')}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={BrandColors.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Navigation to Sign Up */}
          <View style={styles.switchNavRow}>
            <Text style={[styles.switchNavText, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
              {t('auth_no_account')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
              <Text style={[styles.switchNavAction, { color: theme.tint, fontFamily: getFontFamily('bold', isHindi) }]}>
                {' '}{t('auth_signup_btn')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guest Navigation Alternative */}
          <TouchableOpacity style={styles.guestLink} onPress={handleGuestEntry}>
            <Text style={[styles.guestLinkText, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
              {t('auth_guest_btn')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 14,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    letterSpacing: -0.4,
  },
  formCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 16,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
  },
  errorText: {
    fontSize: 11,
    marginTop: 2,
  },
  submitBtn: {
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: BrandColors.white,
    fontSize: 15,
  },
  switchNavRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  switchNavText: {
    fontSize: 13,
  },
  switchNavAction: {
    fontSize: 13,
  },
  guestLink: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  guestLinkText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
