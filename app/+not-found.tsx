import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { useLanguage } from '@/src/context/LanguageContext';
import { useTheme } from '@/src/context/ThemeContext';
import { getFontFamily } from '@/constants/Typography';

export default function NotFoundScreen() {
  const { t, isHindi } = useLanguage();
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: t('not_found_title') }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
          {t('not_found_message')}
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: theme.tint, fontFamily: getFontFamily('semiBold', isHindi) }]}>
            {t('go_to_home')}
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  link: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  linkText: {
    fontSize: 15,
  },
});
