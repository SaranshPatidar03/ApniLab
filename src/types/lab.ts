export type LabCategory = 'All' | 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics';

export const CATEGORIES: LabCategory[] = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics'];
export const DISCIPLINES: ('Physics' | 'Chemistry' | 'Biology' | 'Mathematics')[] = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
];

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LabItem {
  id: string;
  title: string;
  category: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics';
  difficulty: DifficultyLevel;
  duration: string;
  description: string;
  route: string;
  isInteractive: boolean;
  rating: number;
  enrolledCount: number;
  apparatus: string[];
  objectives: string[];
  theory: string;
  safety?: string[];
  iconName: string;
  badgeColor?: string;
}

export interface ProgressItem {
  labId: string;
  title: string;
  category: string;
  progress: number; // 0 - 100
  lastAccessed: string;
  status: 'in-progress' | 'completed';
  score?: number;
  route: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  rollNo: string;
  department: string;
  semester: string;
  labsCompleted: number;
  hoursPracticed: number;
  averageScore: number;
  streakDays: number;
  isDemo?: boolean;
}
