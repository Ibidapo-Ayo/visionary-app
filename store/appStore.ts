import { create } from 'zustand';
import { Event, Member, FollowUp, Conversation } from '@/types/index';

interface AppStore {
  // UI State
  isOnboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;

  // Events & Attendance
  events: Event[];
  setEvents: (events: Event[]) => void;

  // Members
  members: Member[];
  setMembers: (members: Member[]) => void;

  // Follow-ups
  followUps: FollowUp[];
  setFollowUps: (followUps: FollowUp[]) => void;
  addFollowUp: (followUp: FollowUp) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;

  // Conversations & Chat
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // UI State
  isOnboardingComplete: false,
  setOnboardingComplete: (complete) =>
    set({ isOnboardingComplete: complete }),

  // Events & Attendance
  events: [],
  setEvents: (events) => set({ events }),

  // Members
  members: [],
  setMembers: (members) => set({ members }),

  // Follow-ups
  followUps: [],
  setFollowUps: (followUps) => set({ followUps }),
  addFollowUp: (followUp) =>
    set((state) => ({
      followUps: [followUp, ...state.followUps],
    })),
  updateFollowUp: (id, updates) =>
    set((state) => ({
      followUps: state.followUps.map((fu) =>
        fu.id === id ? { ...fu, ...updates } : fu
      ),
    })),

  // Conversations & Chat
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  currentConversation: null,
  setCurrentConversation: (currentConversation) =>
    set({ currentConversation }),

  // Search & Filter
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
