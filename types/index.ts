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
