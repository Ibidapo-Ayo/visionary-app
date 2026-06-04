import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiResponse } from '@types/index';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token interceptor
    this.api.interceptors.request.use(async (config) => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('[v0] Failed to get token:', error);
      }
      return config;
    });

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          SecureStore.deleteItemAsync('auth_token').catch(console.error);
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post<ApiResponse<{ user: any; token: string }>>(
      '/auth/login',
      { email, password }
    );
    return response.data;
  }

  async register(data: any) {
    const response = await this.api.post<ApiResponse<{ user: any; token: string }>>(
      '/auth/register',
      data
    );
    return response.data;
  }

  // Events
  async getEvents(churchId: string) {
    const response = await this.api.get<ApiResponse<any[]>>(`/events`, {
      params: { churchId },
    });
    return response.data;
  }

  async getEventById(id: string) {
    const response = await this.api.get<ApiResponse<any>>(`/events/${id}`);
    return response.data;
  }

  // Attendance
  async checkInQR(eventId: string, qrCode: string) {
    const response = await this.api.post<ApiResponse<any>>(
      `/attendance/checkin`,
      { eventId, qrCode }
    );
    return response.data;
  }

  async getAttendanceHistory(userId: string) {
    const response = await this.api.get<ApiResponse<any[]>>(
      `/attendance/history/${userId}`
    );
    return response.data;
  }

  // Members
  async getMembers(churchId: string) {
    const response = await this.api.get<ApiResponse<any[]>>(`/members`, {
      params: { churchId },
    });
    return response.data;
  }

  async getMemberById(id: string) {
    const response = await this.api.get<ApiResponse<any>>(`/members/${id}`);
    return response.data;
  }

  async updateMember(id: string, data: any) {
    const response = await this.api.put<ApiResponse<any>>(`/members/${id}`, data);
    return response.data;
  }

  // Follow-ups
  async getFollowUps(churchId: string) {
    const response = await this.api.get<ApiResponse<any[]>>(`/follow-ups`, {
      params: { churchId },
    });
    return response.data;
  }

  async createFollowUp(data: any) {
    const response = await this.api.post<ApiResponse<any>>(`/follow-ups`, data);
    return response.data;
  }

  async updateFollowUp(id: string, data: any) {
    const response = await this.api.put<ApiResponse<any>>(`/follow-ups/${id}`, data);
    return response.data;
  }

  // AI Chat
  async sendMessage(conversationId: string, content: string) {
    const response = await this.api.post<ApiResponse<any>>(
      `/chat/messages`,
      { conversationId, content }
    );
    return response.data;
  }

  async getConversation(id: string) {
    const response = await this.api.get<ApiResponse<any>>(`/chat/conversations/${id}`);
    return response.data;
  }

  async createConversation(title: string) {
    const response = await this.api.post<ApiResponse<any>>(`/chat/conversations`, {
      title,
    });
    return response.data;
  }

  // Prayer Requests
  async getPrayerRequests(churchId: string) {
    const response = await this.api.get<ApiResponse<any[]>>(`/prayer-requests`, {
      params: { churchId },
    });
    return response.data;
  }

  async createPrayerRequest(data: any) {
    const response = await this.api.post<ApiResponse<any>>(`/prayer-requests`, data);
    return response.data;
  }
}

export const apiService = new ApiService();
