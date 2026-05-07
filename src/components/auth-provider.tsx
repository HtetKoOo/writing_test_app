'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { User, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      // Small delay to ensure cookies are ready or just go straight to refresh
      const { data } = await api.post('/auth/refresh');
      const { accessToken } = data.data;

      localStorage.setItem('accessToken', accessToken);

      // Get user profile - need an endpoint for this, or extract from refresh?
      // Express refresh doesn't return user, but we can call /profile or similar
      // For now, let's assume we need a /auth/me or similar, OR we store user in localStorage too
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback: fetch profile if we have it
        try {
          const profileRes = await api.get('/users/me');
          setUser(profileRes.data.data);
          localStorage.setItem('user', JSON.stringify(profileRes.data.data));
        } catch (e) {
          console.error("Failed to fetch profile", e);
        }
      }
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: any) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = data.data;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    // Redirect based on role
    if (user.role === 'admin') router.push('/admin');
    else if (user.role === 'teacher') router.push('/teacher');
    else router.push('/student');
  };

  const register = async (regData: any) => {
    const { data } = await api.post<AuthResponse>('/auth/register', regData);
    const { token, user } = data.data;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    router.push('/student'); // Default for new users
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
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
