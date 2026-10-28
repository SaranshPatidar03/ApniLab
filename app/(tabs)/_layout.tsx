import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: (Platform.OS === 'android' ? 64 : 60) + insets.bottom,
          paddingBottom: (Platform.OS === 'android' ? 10 : 8) + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: getFontFamily('bold', isHindi),
        },
        headerShown: false,
      }}>
      {/* 1. Home Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color as string}
            />
          ),
        }}
      />

      {/* 2. Explore Labs */}
      <Tabs.Screen
        name="explore"
        options={{
          title: t('tab_explore'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={23}
              color={color as string}
            />
          ),
        }}
      />

      {/* 3. My Learning */}
      <Tabs.Screen
        name="learning"
        options={{
          title: t('tab_learning'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={22}
              color={color as string}
            />
          ),
        }}
      />

      {/* 4. Student Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tab_profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color as string}
            />
          ),
        }}
      />

      {/* Hide two.tsx from tab bar */}
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
