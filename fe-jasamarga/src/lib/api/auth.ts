// src/lib/api/auth.ts
import axios from 'axios';
import { LoginRequest, LoginResponse } from '@/lib/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Helper untuk mengelola cookies di client-side
const cookieManager = {
  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    const maxAge = 60 * 60 * 24 * 7; // 7 hari
    document.cookie = `jasamarga_token=${token}; path=/; max-age=${maxAge}; sameSite=lax`;
  },
  
  setUser: (user: any) => {
    if (typeof window === 'undefined') return;
    const maxAge = 60 * 60 * 24 * 7; // 7 hari
    document.cookie = `jasamarga_user=${JSON.stringify(user)}; path=/; max-age=${maxAge}; sameSite=lax`;
  },
  
  clearAll: () => {
    if (typeof window === 'undefined') return;
    // Hapus semua cookies auth
    document.cookie = 'jasamarga_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'jasamarga_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },
  
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'jasamarga_token' || name === 'token') {
        return value;
      }
    }
    return null;
  }
};

// Fungsi untuk sinkronkan storage
const syncStorage = () => {
  if (typeof window === 'undefined') return;
  
  const token = localStorage.getItem('jasamarga_token');
  const cookieToken = cookieManager.getToken();
  
  // Jika ada token di localStorage tapi tidak di cookies, sync
  if (token && !cookieToken) {
    cookieManager.setToken(token);
  }
  
  // Jika ada token di cookies tapi tidak di localStorage, sync
  if (cookieToken && !token) {
    localStorage.setItem('jasamarga_token', cookieToken);
  }
  
  // Jika tidak ada token di kedua tempat, redirect ke login
  if (!token && !cookieToken && window.location.pathname !== '/login') {
    redirectToLogin();
  }
};

// Helper untuk redirect ke login
const redirectToLogin = () => {
  if (typeof window === 'undefined') return;
  
  // Hapus semua storage
  localStorage.removeItem('jasamarga_token');
  localStorage.removeItem('jasamarga_user');
  cookieManager.clearAll();
  
  // Redirect ke login jika belum di halaman login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Panggil sync saat modul dimuat (untuk handle refresh)
if (typeof window !== 'undefined') {
  syncStorage();
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request
api.interceptors.request.use(
  (config) => {
    // Skip untuk endpoint login
    if (config.url?.includes('/auth/login')) {
      return config;
    }
    
    // Sinkronkan storage sebelum request
    syncStorage();
    
    // Ambil token dari localStorage (atau cookies sebagai fallback)
    const token = localStorage.getItem('jasamarga_token') || cookieManager.getToken();
    
    if (!token) {
      redirectToLogin();
      return Promise.reject(new Error('No authentication token'));
    }
    
    // Set header
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token && typeof window !== 'undefined') {
        // Simpan ke localStorage
        localStorage.setItem('jasamarga_token', response.data.token);
        
        if (response.data.user) {
          const userData = JSON.stringify(response.data.user);
          localStorage.setItem('jasamarga_user', userData);
          cookieManager.setUser(response.data.user);
        }
        
        // Simpan token ke cookies untuk middleware
        cookieManager.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jasamarga_token');
      localStorage.removeItem('jasamarga_user');
      cookieManager.clearAll();
      window.location.href = '/login';
    }
  },
  
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Cek dari localStorage dan cookies
    const localStorageToken = localStorage.getItem('jasamarga_token');
    const cookieToken = cookieManager.getToken();
    
    return !!(localStorageToken || cookieToken);
  },
  
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jasamarga_token') || cookieManager.getToken();
  },
  
  getUser() {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('jasamarga_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  // Fungsi untuk sync manual
  syncStorage: () => {
    if (typeof window !== 'undefined') {
      syncStorage();
    }
  }
};

export default api;