import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  NotoSansDevanagari_400Regular,
  NotoSansDevanagari_500Medium,
  NotoSansDevanagari_600SemiBold,
  NotoSansDevanagari_700Bold,
} from '@expo-google-fonts/noto-sans-devanagari';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/src/context/LanguageContext';
import { ThemeProvider, useTheme } from '@/src/context/ThemeContext';
import { AuthProvider } from '@/src/context/AuthContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  anchor: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    NotoSansDevanagari_400Regular,
    NotoSansDevanagari_500Medium,
    NotoSansDevanagari_600SemiBold,
    NotoSansDevanagari_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { isDark, theme } = useTheme();

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={theme.statusBar} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen
          name="lab/ohms-law"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="lab/binary-converter"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="lab/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </NavigationThemeProvider>
  );
}
