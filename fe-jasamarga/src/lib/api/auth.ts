import axios from 'axios';
import { LoginRequest, LoginResponse } from '@/lib/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

const syncStorage = () => {
  if (typeof window === 'undefined') return;
  
  const token = localStorage.getItem('jasamarga_token');
  const cookieToken = cookieManager.getToken();
  
  if (token && !cookieToken) {
    cookieManager.setToken(token);
  }
  
  if (cookieToken && !token) {
    localStorage.setItem('jasamarga_token', cookieToken);
  }
  
  if (!token && !cookieToken && window.location.pathname !== '/login') {
    redirectToLogin();
  }
};

const redirectToLogin = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('jasamarga_token');
  localStorage.removeItem('jasamarga_user');
  cookieManager.clearAll();
  
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

if (typeof window !== 'undefined') {
  syncStorage();
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/auth/login')) {
      return config;
    }
    
    syncStorage();
    
    const token = localStorage.getItem('jasamarga_token') || cookieManager.getToken();
    
    if (!token) {
      redirectToLogin();
      return Promise.reject(new Error('No authentication token'));
    }
    
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
        localStorage.setItem('jasamarga_token', response.data.token);
        
        if (response.data.user) {
          const userData = JSON.stringify(response.data.user);
          localStorage.setItem('jasamarga_user', userData);
          cookieManager.setUser(response.data.user);
        }
        
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
  
  syncStorage: () => {
    if (typeof window !== 'undefined') {
      syncStorage();
    }
  }
};

export default api;