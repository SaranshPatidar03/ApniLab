import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language, TranslationKey } from '@/src/i18n/translations';

const LANGUAGE_STORAGE_KEY = '@apnilab_language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key) => key,
  isHindi: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load persisted language on mount
  useEffect(() => {
    async function loadStoredLanguage() {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === 'en' || stored === 'hi') {
          setLanguageState(stored);
        }
      } catch {
        // Fallback to default English
      }
    }
    loadStoredLanguage();
  }, []);

  const setLanguage = async (newLang: Language) => {
    // Only accept exactly 'en' or 'hi'
    if (newLang !== 'en' && newLang !== 'hi') return;
    setLanguageState(newLang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // Storage error ignored
    }
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let template = langDict[key] || translations.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }

    return template;
  };

  const isHindi = language === 'hi';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isHindi,
      }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
