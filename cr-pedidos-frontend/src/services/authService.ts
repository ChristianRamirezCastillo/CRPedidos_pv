import { api } from './api';
import type { LoginRequest, LoginResponse, UserProfile } from '../types/auth';

export const parseJwt = (token: string): UserProfile | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    
    return {
      id: decoded.sub || decoded.nameid || '',
      email: decoded.email || '',
      role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User',
    };
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Intentar /auth/login primero, y si falla con 404 intentar /api/auth/login
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        const fallback = await api.post<LoginResponse>('/api/auth/login', credentials);
        return fallback.data;
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getStoredUser: (): UserProfile | null => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveSession: (token: string, user: UserProfile) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};
