import { create } from 'zustand';
import type { AppStore } from '@/types/index';

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
