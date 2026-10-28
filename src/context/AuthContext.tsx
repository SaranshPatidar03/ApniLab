import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCALIZED_STUDENT } from '@/src/data/mockLabs';

export const AUTH_STORAGE_KEY = '@apnilab_auth_session';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  college?: string;
  rollNo?: string;
  department?: string;
  isDemo: boolean;
  isGuest?: boolean;
  isCustomProfile?: boolean;
  nameLocalized?: { en: string; hi: string };
  collegeLocalized?: { en: string; hi: string };
  departmentLocalized?: { en: string; hi: string };
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoSession: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    college?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: {
    name: string;
    college?: string;
    rollNo?: string;
    department?: string;
  }) => Promise<void>;
  resetToDefaultProfile: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isDemoSession: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  updateProfile: async () => {},
  resetToDefaultProfile: async () => {},
  logout: async () => {},
  continueAsGuest: async () => {},
});

// Initial student profile with explicit English and Hindi localized fields
const DEFAULT_DEMO_USER: AuthUser = {
  id: 'student-session-01',
  name: 'ApniLab Student',
  email: 'student@apnilab.app',
  college: 'Delhi Public Model School',
  rollNo: 'AP-2026-001',
  department: 'Secondary School Science',
  isDemo: false,
  isGuest: true,
  isCustomProfile: false,
  nameLocalized: {
    en: 'ApniLab Student',
    hi: 'अपनीलैब छात्र',
  },
  collegeLocalized: {
    en: 'Delhi Public Model School',
    hi: 'दिल्ली पब्लिक मॉडल स्कूल',
  },
  departmentLocalized: {
    en: 'Secondary School Science',
    hi: 'माध्यमिक विद्यालय विज्ञान',
  },
};

/**
 * Resolves the displayed name, college, department, and roll number based on:
 * 1. If it's a real user-entered profile (signup or manual edit): preserves original data untouched.
 * 2. If it's the sample/default educational student: uses explicit localized values for selected language.
 */
export function getDisplayProfile(
  user: AuthUser | null,
  language: 'en' | 'hi'
): {
  name: string;
  college: string;
  department: string;
  rollNo: string;
  isCustom: boolean;
} {
  const localized = LOCALIZED_STUDENT[language] || LOCALIZED_STUDENT.en;

  if (!user) {
    return {
      name: localized.name,
      college: localized.college,
      department: localized.department,
      rollNo: localized.rollNo,
      isCustom: false,
    };
  }

  // If student entered their own custom name or college, PRESERVE original data!
  if (user.isCustomProfile) {
    return {
      name: user.name,
      college: user.college || '',
      department: user.department || '',
      rollNo: user.rollNo || localized.rollNo,
      isCustom: true,
    };
  }

  // If explicit localized alternatives exist for this account:
  if (user.nameLocalized && user.nameLocalized[language]) {
    return {
      name: user.nameLocalized[language],
      college: user.collegeLocalized ? user.collegeLocalized[language] : (user.college || ''),
      department: user.departmentLocalized ? user.departmentLocalized[language] : (user.department || ''),
      rollNo: user.rollNo || localized.rollNo,
      isCustom: false,
    };
  }

  // If the user's name matches known sample student names:
  if (user.name === 'ApniLab Student' || user.name === 'अपनीलैब छात्र') {
    return {
      name: localized.name,
      college: localized.college,
      department: localized.department,
      rollNo: user.rollNo || localized.rollNo,
      isCustom: false,
    };
  }

  // Default: preserve student's actual entered data
  return {
    name: user.name,
    college: user.college || '',
    department: user.department || '',
    rollNo: user.rollNo || localized.rollNo,
    isCustom: true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_DEMO_USER);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore non-sensitive session metadata on launch
  useEffect(() => {
    async function loadSavedSession() {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.user) {
            setUser(parsed.user);
          }
        }
      } catch {
        // Fallback to default student session
        setUser(DEFAULT_DEMO_USER);
      } finally {
        setIsLoading(false);
      }
    }
    loadSavedSession();
  }, []);

  /**
   * Local student login with client-side validation.
   * Note: This is an offline educational app. Passwords are never stored.
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Client-side verification
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'invalid_email' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'password_too_short' };
    }

    // Generate authenticated student user (without storing password)
    const isSampleStudent = trimmedEmail === 'student@apnilab.app' || trimmedEmail.startsWith('student');
    const authenticatedUser: AuthUser = {
      id: `user-${Date.now().toString(36)}`,
      name: isSampleStudent
        ? 'ApniLab Student'
        : trimmedEmail.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase()),
      email: trimmedEmail,
      college: isSampleStudent ? 'National Institute of Technology' : 'College of Engineering',
      rollNo: isSampleStudent ? 'AP-2026-001' : `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'Computer Science & Engineering',
      isDemo: false,
      isGuest: false,
      isCustomProfile: !isSampleStudent,
      nameLocalized: isSampleStudent
        ? { en: 'ApniLab Student', hi: 'अपनीलैब छात्र' }
        : undefined,
      collegeLocalized: isSampleStudent
        ? { en: 'National Institute of Technology', hi: 'राष्ट्रीय प्रौद्योगिकी संस्थान' }
        : undefined,
      departmentLocalized: isSampleStudent
        ? { en: 'Computer Science & Engineering', hi: 'कंप्यूटर साइंस एवं इंजीनियरिंग' }
        : undefined,
    };

    setUser(authenticatedUser);

    try {
      // Persist only non-sensitive user identity (NEVER passwords)
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: authenticatedUser,
          loginTimestamp: Date.now(),
        })
      );
    } catch {
      // Storage error non-fatal
    }

    return { success: true };
  };

  /**
   * Local student registration with client-side validation.
   */
  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    college?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = data.name.trim();
    const trimmedEmail = data.email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: 'name_required' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'invalid_email' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'password_too_short' };
    }

    const newUser: AuthUser = {
      id: `student-${Date.now().toString(36)}`,
      name: trimmedName,
      email: trimmedEmail,
      college: data.college?.trim() || 'College of Engineering',
      rollNo: `STU-${Math.floor(2000 + Math.random() * 8000)}`,
      department: 'Engineering & Applied Sciences',
      isDemo: false,
      isGuest: false,
      isCustomProfile: true, // Preserve real user-provided values across all languages!
    };

    setUser(newUser);

    try {
      // Store session metadata only (NEVER plaintext passwords)
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: newUser,
          signupTimestamp: Date.now(),
        })
      );
    } catch {
      // Storage error non-fatal
    }

    return { success: true };
  };

  /**
   * Update student profile with custom details and persist locally.
   */
  const updateProfile = async (data: {
    name: string;
    college?: string;
    rollNo?: string;
    department?: string;
  }) => {
    if (!user) return;
    const updatedUser: AuthUser = {
      ...user,
      name: data.name.trim() || user.name,
      college: data.college !== undefined ? data.college.trim() : user.college,
      rollNo: data.rollNo !== undefined ? data.rollNo.trim() : user.rollNo,
      department: data.department !== undefined ? data.department.trim() : user.department,
      isCustomProfile: true,
    };
    setUser(updatedUser);
    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: updatedUser,
          updatedTimestamp: Date.now(),
        })
      );
    } catch {
      // Storage error non-fatal
    }
  };

  /**
   * Reset profile back to sample student account.
   */
  const resetToDefaultProfile = async () => {
    setUser(DEFAULT_DEMO_USER);
    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: DEFAULT_DEMO_USER,
          loginTimestamp: Date.now(),
        })
      );
    } catch {
      // Storage error non-fatal
    }
  };

  /**
   * Log out and clear demo session
   */
  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Storage error non-fatal
    }
  };

  /**
   * Guest access — allows exploring labs without logging in
   */
  const continueAsGuest = async () => {
    setUser(DEFAULT_DEMO_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isDemoSession: true,
        login,
        signup,
        updateProfile,
        resetToDefaultProfile,
        logout,
        continueAsGuest,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
