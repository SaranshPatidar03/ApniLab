import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getLocalizedStudent } from '@/src/data/mockLabs';
import { BrandColors } from '@/constants/Colors';
import { ChatbotFab } from '@/src/components/ChatbotFab';
import { ChatbotModal } from '@/src/components/ChatbotModal';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth, getDisplayProfile } from '@/src/context/AuthContext';
import { getFontFamily } from '@/constants/Typography';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const isHindi = language === 'hi';
  const { user, logout, updateProfile, resetToDefaultProfile } = useAuth();

  const [offlineMode, setOfflineMode] = useState<boolean>(true);
  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  const [labReminders, setLabReminders] = useState<boolean>(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Edit Profile Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editRollNo, setEditRollNo] = useState('');

  const localizedStudent = getLocalizedStudent(language);
  const displayProfile = getDisplayProfile(user, language);
  const studentName = displayProfile.name;
  const studentEmail = user?.email || 'student@apnilab.app';
  const studentCollege = displayProfile.college;
  const studentDept = displayProfile.department;
  const isGuest = user?.isGuest ?? true;

  const handleSupportPress = () => {
    Alert.alert(
      t('support_dialog_title'),
      t('support_dialog_body'),
      [{ text: t('got_it') }]
    );
  };

  const handleAboutPress = () => {
    Alert.alert(
      t('about_dialog_title'),
      t('about_dialog_body'),
      [{ text: t('close') }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout_confirm_title'),
      t('logout_confirm_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('auth_logout_btn'),
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome' as any);
          },
        },
      ]
    );
  };

  const handleOpenEditModal = () => {
    setEditName(displayProfile.isCustom ? (user?.name || '') : '');
    setEditCollege(displayProfile.isCustom ? (user?.college || '') : '');
    setEditDept(displayProfile.isCustom ? (user?.department || '') : '');
    setEditRollNo(displayProfile.isCustom ? (user?.rollNo || '') : '');
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    const trimmedName = editName.trim();
    if (trimmedName.length > 0) {
      await updateProfile({
        name: trimmedName,
        college: editCollege.trim() || undefined,
        department: editDept.trim() || undefined,
        rollNo: editRollNo.trim() || undefined,
      });
      setIsEditModalVisible(false);
      Alert.alert(t('profile_title'), t('profile_saved_success'));
    } else {
      Alert.alert(t('profile_title'), t('auth_err_name_required'));
    }
  };

  const handleResetProfile = async () => {
    await resetToDefaultProfile();
    setIsEditModalVisible(false);
    Alert.alert(t('profile_title'), t('profile_saved_success'));
  };

  const avatarInitials = studentName
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AL';

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('profile_title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('profile_subtitle')}
          </Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
              <Text style={[styles.avatarInitials, { fontFamily: getFontFamily('bold', false) }]}>
                {avatarInitials}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.studentName, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {studentName}
                </Text>
                <View
                  style={[
                    styles.demoBadge,
                    {
                      backgroundColor: isGuest ? theme.primaryLight : (isDark ? '#064E3B' : '#ECFDF5'),
                      borderColor: isGuest ? theme.primaryBorder : (isDark ? '#059669' : '#10B981'),
                    },
                  ]}>
                  <Text
                    style={[
                      styles.demoBadgeText,
                      {
                        color: isGuest ? theme.tint : (isDark ? '#34D399' : '#059669'),
                        fontFamily: getFontFamily('semiBold', isHindi),
                      },
                    ]}>
                    {isGuest ? t('guest_student_badge') : t('verified_student_badge')}
                  </Text>
                </View>
              </View>
              <Text style={[styles.studentEmail, { color: theme.tint, fontFamily: getFontFamily('medium', false) }]}>
                {studentEmail}
              </Text>
              <Text style={[styles.studentDept, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                {studentDept}
              </Text>
            </View>
          </View>

          <View style={[styles.collegeInfoBox, { backgroundColor: theme.cardAlt }]}>
            <View style={styles.collegeRow}>
              <Ionicons name="business-outline" size={16} color={theme.tint} />
              <View style={styles.collegeTextCol}>
                <Text style={[styles.collegeLabel, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
                  {t('label_college_name')}
                </Text>
                <Text style={[styles.collegeText, { color: theme.text, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                  {studentCollege}
                </Text>
              </View>
            </View>
            <View style={styles.collegeRow}>
              <Ionicons name="school-outline" size={16} color={theme.tint} />
              <Text style={[styles.semesterText, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                {localizedStudent.semester} • {t('roll_no', { rollNo: displayProfile.rollNo })}
              </Text>
            </View>
          </View>

          {/* Edit Profile Action Bar */}
          <View style={styles.editBarContainer}>
            <TouchableOpacity
              style={[styles.editProfileBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
              onPress={handleOpenEditModal}
              activeOpacity={0.75}>
              <Ionicons name="pencil" size={13} color={theme.tint} />
              <Text style={[styles.editProfileBtnText, { color: theme.tint, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                {t('edit_profile')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Account Authentication Action within Card */}
          <View style={[styles.sessionActionRow, { borderTopColor: theme.borderSubtle }]}>
            {isGuest ? (
              <View style={styles.guestPromptContainer}>
                <View style={styles.guestTextCol}>
                  <Text style={[styles.guestPromptTitle, { color: theme.text, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                    {t('auth_guest_status')}
                  </Text>
                  <Text style={[styles.guestPromptSub, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                    {t('auth_sign_in_prompt')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.sessionBtnPrimary, { backgroundColor: theme.primary }]}
                  onPress={() => router.push('/(auth)/welcome' as any)}
                  activeOpacity={0.8}>
                  <Ionicons name="log-in-outline" size={16} color={BrandColors.white} />
                  <Text style={[styles.sessionBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('auth_login_btn')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.authStatusContainer}>
                <View style={styles.authStatusCol}>
                  <View style={styles.activePill}>
                    <View style={styles.greenDot} />
                    <Text style={[styles.activePillText, { color: isDark ? '#34D399' : '#059669', fontFamily: getFontFamily('medium', isHindi) }]}>
                      {t('active_session_badge')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.logoutBtn, { borderColor: isDark ? '#EF4444' : '#FCA5A5' }]}
                  onPress={handleLogout}
                  activeOpacity={0.8}>
                  <Ionicons name="log-out-outline" size={16} color={isDark ? '#F87171' : '#DC2626'} />
                  <Text style={[styles.logoutBtnText, { color: isDark ? '#F87171' : '#DC2626', fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('auth_logout_btn')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* 1. Language Selector Section (Exactly English and Hindi) */}
        <View style={styles.themeSection}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="language-outline" size={18} color={theme.tint} />
            <Text style={[styles.sectionHeader, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('language_title')}
            </Text>
          </View>

          <View style={[styles.themeSelectorCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.themeInstruction, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
              {t('language_instruction')}
            </Text>

            {/* Exactly Two Options: English and Hindi */}
            <View style={[styles.themeSegmentRow, { backgroundColor: theme.cardAlt }]}>
              {/* Option 1: English */}
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  language === 'en' && [styles.themeOptionBtnActive, { backgroundColor: theme.card, borderColor: theme.primary }],
                ]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.8}>
                <Ionicons
                  name="globe-outline"
                  size={19}
                  color={language === 'en' ? theme.primary : theme.textMuted}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: language === 'en' ? theme.text : theme.textMuted, fontFamily: getFontFamily(language === 'en' ? 'bold' : 'medium', false) },
                  ]}>
                  {t('lang_en')}
                </Text>
                {language === 'en' && (
                  <View style={[styles.activeCheckDot, { backgroundColor: BrandColors.indigo }]}>
                    <Ionicons name="checkmark" size={12} color={BrandColors.white} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Option 2: Hindi */}
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  language === 'hi' && [styles.themeOptionBtnActive, { backgroundColor: theme.card, borderColor: theme.tint }],
                ]}
                onPress={() => setLanguage('hi')}
                activeOpacity={0.8}>
                <Ionicons
                  name="language"
                  size={19}
                  color={language === 'hi' ? theme.tint : theme.textMuted}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: language === 'hi' ? theme.text : theme.textMuted, fontFamily: getFontFamily(language === 'hi' ? 'bold' : 'medium', true) },
                  ]}>
                  {t('lang_hi')}
                </Text>
                {language === 'hi' && (
                  <View style={[styles.activeCheckDot, { backgroundColor: BrandColors.indigo }]}>
                    <Ionicons name="checkmark" size={12} color={BrandColors.white} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Appearance / Theme Section (Exactly Light and Dark) */}
        <View style={styles.themeSection}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="color-palette-outline" size={18} color={theme.tint} />
            <Text style={[styles.sectionHeader, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
              {t('appearance_title')}
            </Text>
          </View>

          <View style={[styles.themeSelectorCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.themeInstruction, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
              {t('appearance_instruction', { mode: themeMode === 'dark' ? t('theme_dark') : t('theme_light') })}
            </Text>

            {/* Exactly Two Options: Light and Dark */}
            <View style={[styles.themeSegmentRow, { backgroundColor: theme.cardAlt }]}>
              {/* Option 1: Light */}
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  themeMode === 'light' && [styles.themeOptionBtnActive, { backgroundColor: theme.card, borderColor: theme.primary }],
                ]}
                onPress={() => setThemeMode('light')}
                activeOpacity={0.8}>
                <Ionicons
                  name={themeMode === 'light' ? 'sunny' : 'sunny-outline'}
                  size={20}
                  color={themeMode === 'light' ? BrandColors.amber : theme.textMuted}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: themeMode === 'light' ? theme.text : theme.textMuted, fontFamily: getFontFamily(themeMode === 'light' ? 'bold' : 'medium', isHindi) },
                  ]}>
                  {t('theme_light')}
                </Text>
                {themeMode === 'light' && (
                  <View style={[styles.activeCheckDot, { backgroundColor: BrandColors.indigo }]}>
                    <Ionicons name="checkmark" size={12} color={BrandColors.white} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Option 2: Dark */}
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  themeMode === 'dark' && [styles.themeOptionBtnActive, { backgroundColor: theme.card, borderColor: theme.tint }],
                ]}
                onPress={() => setThemeMode('dark')}
                activeOpacity={0.8}>
                <Ionicons
                  name={themeMode === 'dark' ? 'moon' : 'moon-outline'}
                  size={20}
                  color={themeMode === 'dark' ? BrandColors.indigoLight : theme.textMuted}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: themeMode === 'dark' ? theme.text : theme.textMuted, fontFamily: getFontFamily(themeMode === 'dark' ? 'bold' : 'medium', isHindi) },
                  ]}>
                  {t('theme_dark')}
                </Text>
                {themeMode === 'dark' && (
                  <View style={[styles.activeCheckDot, { backgroundColor: BrandColors.indigoLight }]}>
                    <Ionicons name="checkmark" size={12} color={BrandColors.slate900} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Academic Performance Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionHeader, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('performance_record')}
          </Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="checkmark-done" size={22} color={theme.tint} />
              <Text style={[styles.statBigNum, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
                {localizedStudent.labsCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('completed_labs_label')}
              </Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="time" size={22} color={BrandColors.cyan} />
              <Text style={[styles.statBigNum, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
                {localizedStudent.hoursPracticed}h
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('lab_time_label')}
              </Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="ribbon" size={22} color={BrandColors.emerald} />
              <Text style={[styles.statBigNum, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
                {localizedStudent.averageScore}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('average_score_label')}
              </Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="flame" size={22} color={BrandColors.amber} />
              <Text style={[styles.statBigNum, { color: theme.text, fontFamily: getFontFamily('bold', false) }]}>
                {localizedStudent.streakDays}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                {t('streak_label')}
              </Text>
            </View>
          </View>
        </View>

        {/* Application Preferences & Settings */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionHeader, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('experiment_preferences')}
          </Text>

          <View style={[styles.settingsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Setting: Offline Simulator */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabelRow}>
                <Ionicons name="cloud-offline-outline" size={20} color={theme.tint} />
                <View style={styles.settingTexts}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                    {t('setting_offline')}
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                    {t('setting_offline_desc')}
                  </Text>
                </View>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={BrandColors.white}
              />
            </View>

            {/* Setting: Interactive Sound Effects */}
            <View style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: theme.borderSubtle }]}>
              <View style={styles.settingLabelRow}>
                <Ionicons name="volume-medium-outline" size={20} color={theme.tint} />
                <View style={styles.settingTexts}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                    {t('setting_audio')}
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                    {t('setting_audio_desc')}
                  </Text>
                </View>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={BrandColors.white}
              />
            </View>

            {/* Setting: Study Reminders */}
            <View style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: theme.borderSubtle }]}>
              <View style={styles.settingLabelRow}>
                <Ionicons name="notifications-outline" size={20} color={theme.tint} />
                <View style={styles.settingTexts}>
                  <Text style={[styles.settingTitle, { color: theme.text, fontFamily: getFontFamily('semiBold', isHindi) }]}>
                    {t('setting_reminders')}
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                    {t('setting_reminders_desc')}
                  </Text>
                </View>
              </View>
              <Switch
                value={labReminders}
                onValueChange={setLabReminders}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={BrandColors.white}
              />
            </View>
          </View>
        </View>

        {/* Support & About Links */}
        <View style={styles.linksSection}>
          <Text style={[styles.sectionHeader, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
            {t('help_info')}
          </Text>

          <View style={[styles.linksCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity style={styles.linkRow} onPress={handleSupportPress}>
              <View style={styles.linkLeft}>
                <Ionicons name="help-circle-outline" size={20} color={theme.textSecondary} />
                <Text style={[styles.linkText, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                  {t('student_support')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.linkRow, { borderTopWidth: 1, borderTopColor: theme.borderSubtle }]}
              onPress={handleAboutPress}>
              <View style={styles.linkLeft}>
                <Ionicons name="information-circle-outline" size={20} color={theme.textSecondary} />
                <Text style={[styles.linkText, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                  {t('about_app')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Footer */}
        <View style={styles.appFooter}>
          <Text style={[styles.appFooterText, { color: theme.tint, fontFamily: getFontFamily('semiBold', false) }]}>
            {t('appName')} • {t('tagline')}
          </Text>
          <Text style={[styles.appFooterSub, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
            {t('designedFor')}
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <View style={[styles.modalContentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleCol}>
                <Text style={[styles.modalTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {t('edit_profile')}
                </Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSecondary, fontFamily: getFontFamily('regular', isHindi) }]}>
                  {t('edit_profile_desc')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}>
                <Ionicons name="close" size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              {/* 1. Username Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                  {t('label_username')}
                </Text>
                <TextInput
                  style={[styles.modalTextInput, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder, fontFamily: getFontFamily('regular', isHindi) }]}
                  placeholder={t('enter_username_placeholder')}
                  placeholderTextColor={theme.textMuted}
                  value={editName}
                  onChangeText={setEditName}
                />
              </View>

              {/* 2. College Name Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                  {t('label_college_name')}
                </Text>
                <TextInput
                  style={[styles.modalTextInput, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder, fontFamily: getFontFamily('regular', isHindi) }]}
                  placeholder={t('enter_college_placeholder')}
                  placeholderTextColor={theme.textMuted}
                  value={editCollege}
                  onChangeText={setEditCollege}
                />
              </View>

              {/* 3. Department Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                  {t('department_label')}
                </Text>
                <TextInput
                  style={[styles.modalTextInput, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder, fontFamily: getFontFamily('regular', isHindi) }]}
                  placeholder="e.g. Computer Science & Engineering"
                  placeholderTextColor={theme.textMuted}
                  value={editDept}
                  onChangeText={setEditDept}
                />
              </View>

              {/* 4. Roll Number Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}>
                  {t('roll_no_label')}
                </Text>
                <TextInput
                  style={[styles.modalTextInput, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.inputBorder, fontFamily: getFontFamily('regular', false) }]}
                  placeholder="e.g. AP-2026-001"
                  placeholderTextColor={theme.textMuted}
                  value={editRollNo}
                  onChangeText={setEditRollNo}
                />
              </View>

              {/* Modal Action Buttons */}
              <View style={styles.modalActionsCol}>
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                  onPress={handleSaveProfile}
                  activeOpacity={0.85}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={BrandColors.white} />
                  <Text style={[styles.saveBtnText, { fontFamily: getFontFamily('bold', isHindi) }]}>
                    {t('save_profile')}
                  </Text>
                </TouchableOpacity>

                {displayProfile.isCustom && (
                  <TouchableOpacity
                    style={[styles.resetBtn, { borderColor: theme.border }]}
                    onPress={handleResetProfile}
                    activeOpacity={0.75}>
                    <Ionicons name="refresh-outline" size={16} color={theme.textSecondary} />
                    <Text style={[styles.resetBtnText, { color: theme.textSecondary, fontFamily: getFontFamily('medium', isHindi) }]}>
                      {t('reset_to_default_profile')}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsEditModalVisible(false)}
                  activeOpacity={0.7}>
                  <Text style={[styles.cancelBtnText, { color: theme.textMuted, fontFamily: getFontFamily('medium', isHindi) }]}>
                    {t('cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: BrandColors.white,
    fontSize: 22,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  studentName: {
    fontSize: 18,
  },
  demoBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  demoBadgeText: {
    fontSize: 10,
  },
  studentEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  studentDept: {
    fontSize: 12,
    marginTop: 2,
  },
  collegeInfoBox: {
    padding: 12,
    borderRadius: 10,
    gap: 6,
  },
  collegeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collegeText: {
    fontSize: 12,
  },
  semesterText: {
    fontSize: 12,
  },
  sessionActionRow: {
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 12,
  },
  guestPromptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  guestTextCol: {
    flex: 1,
  },
  guestPromptTitle: {
    fontSize: 13,
  },
  guestPromptSub: {
    fontSize: 11,
    marginTop: 2,
  },
  sessionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  sessionBtnText: {
    color: BrandColors.white,
    fontSize: 12,
  },
  authStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authStatusCol: {
    flex: 1,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  activePillText: {
    fontSize: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  logoutBtnText: {
    fontSize: 12,
  },
  themeSection: {
    marginBottom: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  themeSelectorCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  themeInstruction: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 17,
  },
  themeSegmentRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 6,
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 9,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  themeOptionBtnActive: {
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  themeOptionText: {
    fontSize: 14,
  },
  activeCheckDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 15,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  statBigNum: {
    fontSize: 20,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  settingsSection: {
    marginBottom: 18,
  },
  settingsCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  linksSection: {
    marginBottom: 20,
  },
  linksCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkText: {
    fontSize: 13,
  },
  appFooter: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  appFooterText: {
    fontSize: 12,
  },
  appFooterSub: {
    fontSize: 10,
    marginTop: 2,
  },
  collegeTextCol: {
    flex: 1,
    marginLeft: 6,
  },
  collegeLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  editBarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  editProfileBtnText: {
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalHeaderTitleCol: {
    flex: 1,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 18,
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  modalTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalActionsCol: {
    gap: 10,
    marginTop: 8,
    paddingBottom: 20,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  resetBtnText: {
    fontSize: 13,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelBtnText: {
    fontSize: 13,
  },
});
