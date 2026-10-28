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

export default function SignUpScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t, isHindi } = useLanguage();
  const { signup } = useAuth();

  // Form State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Error States
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim() || name.trim().length < 2) {
      setNameError(t('auth_err_name_required'));
      isValid = false;
    } else {
      setNameError(null);
    }

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

    if (password !== confirmPassword) {
      setConfirmPasswordError(t('auth_err_passwords_mismatch'));
      isValid = false;
    } else {
      setConfirmPasswordError(null);
    }

    if (!agreeTerms) {
      setTermsError(t('auth_err_terms_required'));
      isValid = false;
    } else {
      setTermsError(null);
    }

    return isValid;
  };

  const handleSignUpSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(async () => {
      const result = await signup({
        name,
        email,
        password,
        college,
      });
      setIsSubmitting(false);

      if (result.success) {
        router.replace('/(tabs)');
      }
    }, 600);
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

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('auth_signup_title')}
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                {t('auth_name_label')}
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.inputBg, borderColor: nameError ? BrandColors.rose : theme.inputBorder },
                ]}>
                <Ionicons name="person-outline" size={18} color={nameError ? BrandColors.rose : theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.text, fontFamily: getFontFamily('regular', isHindi) }]}
                  placeholder={t('auth_name_placeholder')}
                  placeholderTextColor={theme.textMuted}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (nameError) setNameError(null);
                  }}
                  autoCapitalize="words"
                />
              </View>
              {nameError && (
                <Text style={[styles.errorText, { color: BrandColors.rose, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {nameError}
                </Text>
              )}
            </View>

            {/* Email Address */}
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
                />
              </View>
              {emailError && (
                <Text style={[styles.errorText, { color: BrandColors.rose, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {emailError}
                </Text>
              )}
            </View>

            {/* College Name (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                {t('auth_college_label')}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                <Ionicons name="business-outline" size={18} color={theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.text, fontFamily: getFontFamily('regular', isHindi) }]}
                  placeholder={t('auth_college_placeholder')}
                  placeholderTextColor={theme.textMuted}
                  value={college}
                  onChangeText={setCollege}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Password */}
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

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                {t('auth_confirm_password_label')}
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.inputBg, borderColor: confirmPasswordError ? BrandColors.rose : theme.inputBorder },
                ]}>
                <Ionicons name="checkmark-circle-outline" size={18} color={confirmPasswordError ? BrandColors.rose : theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.text, fontFamily: getFontFamily('regular', false) }]}
                  placeholder={t('auth_confirm_password_placeholder')}
                  placeholderTextColor={theme.textMuted}
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (confirmPasswordError) setConfirmPasswordError(null);
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError && (
                <Text style={[styles.errorText, { color: BrandColors.rose, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {confirmPasswordError}
                </Text>
              )}
            </View>

            {/* Terms Agreement Checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => {
                setAgreeTerms(!agreeTerms);
                if (termsError) setTermsError(null);
              }}
              activeOpacity={0.8}>
              <View
                style={[
                  styles.checkbox,
                  { borderColor: agreeTerms ? theme.primary : theme.border },
                  agreeTerms && { backgroundColor: theme.primary },
                ]}>
                {agreeTerms && <Ionicons name="checkmark" size={14} color={BrandColors.white} />}
              </View>
              <Text style={[styles.termsText, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('auth_terms_agree')}
              </Text>
            </TouchableOpacity>
            {termsError && (
              <Text style={[styles.errorText, { color: BrandColors.rose, fontFamily: getFontFamily('regular', isHindi) }]}>
                {termsError}
              </Text>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: theme.primary }, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSignUpSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}>
              {isSubmitting ? (
                <View style={styles.submittingRow}>
                  <ActivityIndicator size="small" color={BrandColors.white} />
                  <Text style={[styles.submitBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('auth_signing_up')}
                  </Text>
                </View>
              ) : (
                <View style={styles.submittingRow}>
                  <Text style={[styles.submitBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('auth_sign_up_submit')}
                  </Text>
                  <Ionicons name="person-add" size={16} color={BrandColors.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Navigation to Login */}
          <View style={styles.switchNavRow}>
            <Text style={[styles.switchNavText, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
              {t('auth_has_account')}{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={[styles.switchNavAction, { color: theme.tint, fontFamily: getFontFamily('bold', isHindi) }]}>
                {t('auth_sign_in_link')}
              </Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 18,
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
    gap: 14,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  inputGroup: {
    gap: 5,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  errorText: {
    fontSize: 11,
    marginTop: 1,
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
    marginTop: 18,
  },
  switchNavText: {
    fontSize: 13,
  },
  switchNavAction: {
    fontSize: 13,
  },
});
