import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';

export default function ModalScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
        <Ionicons name="flask" size={32} color={theme.tint} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{t('modal_about_title')}</Text>
      <Text style={[styles.tagline, { color: theme.tint }]}>{t('tagline')}</Text>

      <Text style={[styles.body, { color: theme.textSecondary }]}>
        {t('modal_body')}
      </Text>

      <View style={[styles.infoBox, { backgroundColor: theme.cardAlt }]}>
        <Text style={[styles.infoRow, { color: theme.textSecondary }]}>
          {t('modal_feat_1')}
        </Text>
        <Text style={[styles.infoRow, { color: theme.textSecondary }]}>
          {t('modal_feat_2')}
        </Text>
        <Text style={[styles.infoRow, { color: theme.textSecondary }]}>
          {t('modal_feat_3')}
        </Text>
        <Text style={[styles.infoRow, { color: theme.textSecondary }]}>
          {t('modal_feat_4')}
        </Text>
        <Text style={[styles.infoRow, { color: theme.textSecondary }]}>
          {t('modal_feat_5')}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.closeBtn, { backgroundColor: theme.primary }]}
        onPress={() => router.back()}>
        <Text style={styles.closeBtnText}>{t('return_to_app')}</Text>
      </TouchableOpacity>

      <StatusBar style={theme.statusBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 14,
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 24,
    gap: 8,
  },
  infoRow: {
    fontSize: 13,
  },
  closeBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: BrandColors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
