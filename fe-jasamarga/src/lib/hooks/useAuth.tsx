'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { authAPI } from '@/lib/api/auth';
import { LoginRequest, LoginResponse, User } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('jasamarga_token');
      const storedUser = localStorage.getItem('jasamarga_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ username, password });
      
      if (response.status && response.token) {
        const userData: User = {
          id: 1,
          username: response.username || username,
          role: 'Super Admin',
        };
        
        setToken(response.token);
        setUser(userData);
        
        localStorage.setItem('jasamarga_token', response.token);
        localStorage.setItem('jasamarga_user', JSON.stringify(userData));
        
        notifications.show({
          title: 'Login Berhasil',
          message: 'Selamat datang di sistem Jasa Marga',
          color: 'green',
        });
        
        router.push('/dashboard');
      } else {
        throw new Error(response.message || 'Login gagal');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Login Gagal',
        message: error.message || 'Username atau password salah',
        color: 'red',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jasamarga_token');
    localStorage.removeItem('jasamarga_user');
    router.push('/login');
    
    notifications.show({
      title: 'Logout Berhasil',
      message: 'Anda telah keluar dari sistem',
      color: 'blue',
    });
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isLoading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}