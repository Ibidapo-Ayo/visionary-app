import type React from 'react';
import type { Feather } from '@expo/vector-icons';

// User & Auth Types
export type UserRole = 'MEMBER' | 'STEWARD' | 'LEADER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  churchId: string;
  joinDate: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export interface AuthErrorShape {
  code: string;
  message: string;
  field?: string;
}

export interface ClerkApiError {
  code?: string;
  message?: string;
  longMessage?: string;
  meta?: {
    paramName?: string;
  };
}

export type ClerkAuthUserResource = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl?: string | null;
  createdAt?: string | number | Date | null;
  updatedAt?: string | number | Date | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
  emailAddresses?: Array<{ emailAddress?: string | null }>;
  primaryPhoneNumber?: { phoneNumber?: string | null } | null;
  phoneNumbers?: Array<{ phoneNumber?: string | null }>;
};

export interface SignUpInput {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone?: string;
  password: string;
}

export interface SignUpResult {
  needsEmailVerification: boolean;
  complete: boolean;
  error?: AuthErrorShape;
}

export interface SignInInput {
  identifier: string;
  password: string;
}

export interface SignInResult {
  complete: boolean;
  needsSecondFactor?: boolean;
  error?: AuthErrorShape;
}

export interface RequestResetResult {
  sent: boolean;
  error?: AuthErrorShape;
}

export interface CompleteResetResult {
  complete: boolean;
  error?: AuthErrorShape;
}

export interface OAuthResult {
  complete: boolean;
  error?: AuthErrorShape;
}

export interface SignOutResult {
  success: boolean;
  error?: AuthErrorShape;
}

// Event & Attendance Types
export interface Event {
  id: string;
  title: string;
  description: string;
  churchId: string;
  startTime: string;
  endTime: string;
  location: string;
  category: 'service' | 'meeting' | 'event' | 'study';
  imageUrl?: string;
  maxAttendees?: number;
  registeredCount: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  eventId: string;
  checkedInAt: string;
  checkedOutAt?: string;
  method: 'qr_scan' | 'manual';
}

// Member Types
export interface Member {
  id: string;
  userId: string;
  churchId: string;
  role: UserRole;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  phone: string;
  address?: string;
  birthday?: string;
  spouse?: string;
  children?: number;
  profession?: string;
  interests?: string[];
  giveStatus?: 'regular' | 'occasional' | 'none';
  serveAreas?: string[];
}

// AI & Chat Types
export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  scriptureRef?: string;
  attachments?: Attachment[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  topic?: 'faith' | 'community' | 'giving' | 'service' | 'prayer' | 'general';
  messages: ChatMessage[];
  lastMessageAt: string;
  createdAt: string;
}

// Follow-up Types
export interface FollowUp {
  id: string;
  assignedToId: string;
  memberId: string;
  churchId: string;
  type: 'first_time_visitor' | 'new_member' | 'inactive' | 'giving_decline' | 'prayer_request';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerRequest {
  id: string;
  userId: string;
  churchId: string;
  title: string;
  description: string;
  category: 'health' | 'family' | 'work' | 'finances' | 'spiritual' | 'other';
  isPublic: boolean;
  isPrayed: boolean;
  prayerCount: number;
  createdAt: string;
  updatedAt: string;
}

// General Types
export interface Attachment {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  name: string;
}

export interface Church {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AppStore {
  isOnboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  members: Member[];
  setMembers: (members: Member[]) => void;
  followUps: FollowUp[];
  setFollowUps: (followUps: FollowUp[]) => void;
  addFollowUp: (followUp: FollowUp) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export type ReadingReaction =
  | 'Encouraging'
  | 'Challenging'
  | 'Peaceful'
  | 'Eye-opening'
  | 'I need more understanding';

export type ReadingPeriod = 'morning' | 'evening';

export interface DailyReadingProgress {
  dateKey: string;
  morningCompleted: boolean;
  eveningCompleted: boolean;
  dailyCompleted: boolean;
  reflectionCompletedByPeriod: Partial<Record<ReadingPeriod, boolean>>;
  completedChaptersByPeriod: Partial<Record<ReadingPeriod, string[]>>;
  reactions: Partial<Record<ReadingPeriod, ReadingReaction>>;
  reflections: Partial<Record<ReadingPeriod, string>>;
  completedAtByPeriod: Partial<Record<ReadingPeriod, string>>;
  readingReferenceByPeriod: Partial<Record<ReadingPeriod, string>>;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
}

export interface BibleJourneyStore {
  dailyProgressByDate: Record<string, DailyReadingProgress>;
  markSessionReadingCompleteForToday: (payload: {
    period: ReadingPeriod;
    readingReference: string;
  }) => void;
  markReflectionCompleteForToday: (payload: {
    period: ReadingPeriod;
  }) => void;
  isReflectionCompleteForToday: (period: ReadingPeriod) => boolean;
  markPeriodCompleteForToday: (payload: {
    period: ReadingPeriod;
    readingReference: string;
  }) => void;
  completeReadingForToday: (payload: {
    period: ReadingPeriod;
    reaction: ReadingReaction;
    reflection?: string;
    readingReference: string;
  }) => void;
  markChapterCompleteForToday: (payload: {
    period: ReadingPeriod;
    chapterReference: string;
  }) => void;
  getCompletedChaptersForToday: (period: ReadingPeriod) => string[];
  getTodayProgress: () => DailyReadingProgress;
  getStreakStats: () => StreakStats;
}

export interface UserReadingProgressRow {
  id: string;
  user_id: string;
  schedule_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface UserReadingProgressStore {
  completedScheduleIdsByUser: Record<string, string[]>;
  supabaseUserIdsByClerkId: Record<string, string>;
  loadedUserId: string | null;
  isLoadingProgress: boolean;
  progressError: string | null;
  loadUserReadingProgress: (clerkUserId: string) => Promise<void>;
  markScheduleComplete: (payload: { clerkUserId: string; scheduleId: string }) => Promise<void>;
  getCompletedScheduleCount: (scheduleIds: string[]) => number;
  isScheduleComplete: (scheduleId: string) => boolean;
}

export type ClerkGetToken = (options?: { template?: string }) => Promise<string | null>;

export type ClerkUserResource = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  createdAt: number | null;
  updatedAt: number | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
  emailAddresses: Array<{ emailAddress?: string | null }>;
  primaryPhoneNumber?: { phoneNumber?: string | null } | null;
  phoneNumbers: Array<{ phoneNumber?: string | null }>;
  unsafeMetadata?: Record<string, unknown>;
};

export interface SupabaseUserRow {
  id?: string;
  clerk_user_id: string;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  profile_image: string | null;
  gender: string | null;
  date_of_birth: string | null;
  role: string;
  department: string | null;
  joined_at: string | null;
  is_active: boolean;
}

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export interface MockMember {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'at-risk' | 'active' | 'inactive';
}

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  location: string;
}

export interface MockBibleJourneyReading {
  id: string;
  period: ReadingPeriod;
  title: string;
  reference: string;
  estimatedMinutes: number;
  focus: string;
}

export interface MockBibleJourneyProgress {
  year: number;
  cyclesCompleted: number;
  cyclesTarget: number;
  completedReadings: number;
  totalReadings: number;
}

export interface MockBibleJourneySessionPlan {
  morning: string[];
  evening: string[];
}

export interface BibleReadingPlanData {
  id: string;
  name: string;
  description: string;
  year: number;
  total_days: number;
  chapters_per_day: number;
  group_plan_start_date: string;
  is_active: boolean;
  created_at: string;
}

export interface DayReading {
  id: string;
  orderNumber: number;
  bookName: string;
  chapter: number;
}

export interface ReadingScheduleData {
  morning: DayReading[];
  evening: DayReading[];
}

export interface MockBibleVerse {
  number: number;
  text: string;
}

export interface MockBibleReadingChapter {
  id: string;
  title: string;
  reference: string;
  estimatedMinutes: number;
  verses: MockBibleVerse[];
}

export type MockSpiritualMetricIconKey =
  | 'bibleJourney'
  | 'bibleReadingStreak'
  | 'prayerStreak'
  | 'attendanceStreak'
  | 'digestStreak'
  | 'overallJourney';

export interface MockSpiritualMetric {
  id: string;
  title: string;
  iconKey: MockSpiritualMetricIconKey;
  progress: number;
  currentValue: string;
  currentStreak: string;
  encouragement: string;
  color: string;
}

export interface MockAchievement {
  id: string;
  badge: string;
  title: string;
  unlockedOn: string;
  spiritualXp: number;
}

export type MockSpiritualActivityType = 'bibleReading' | 'reflection' | 'attendance' | 'digest' | 'prayer';

export interface MockSpiritualActivity {
  id: string;
  type: MockSpiritualActivityType;
  title: string;
  date: string;
  time: string;
}

export interface ProfileSettingsItem {
  id: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
  rightControl?: React.ReactNode;
  destructive?: boolean;
}

export type ComingSoonCapability = {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

export type ComingSoonScreenProps = {
  title: string;
  description: string;
  capabilityTitle: string;
  capabilities: ComingSoonCapability[];
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  successMessage?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction: () => void;
};
