import { create } from 'zustand';
import { User, AuthState } from '@/types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (email, password) => {
    try {
      set({ isLoading: true });
      // Mock API call - replace with actual API
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email,
        phone: '+1234567890',
        role: 'MEMBER',
        churchId: 'church_1',
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock_token_' + Date.now();

      // Store securely
      await SecureStore.setItemAsync('auth_token', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true });
      // Mock API call - replace with actual API
      const mockUser: User = {
        id: Math.random().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: 'MEMBER',
        churchId: data.churchId || 'church_1',
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock_token_' + Date.now();

      await SecureStore.setItemAsync('auth_token', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await AsyncStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const token = await SecureStore.getItemAsync('auth_token');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('[v0] Load user error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
