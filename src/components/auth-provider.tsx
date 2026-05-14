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
      // Check auth by trying to fetch the user profile.
      // If the token is expired, api.ts interceptor will automatically handle the refresh.
      const { data } = await api.get('/users/me');
      
      if (data && data.data) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      } else {
        // Fallback to local storage if API doesn't return full user object
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      // We don't need to console.error here because Axios interceptor already handles it
      // and it pollutes the console when user is simply unauthenticated
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // If we are on a protected route and auth fails, redirect to login
      const publicPaths = ['/', '/login', '/register'];
      if (typeof window !== 'undefined' && !publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Skip API calls on the public pages if no access token is present
    // This prevents the 401 Unauthorized error in the console when unauthenticated
    const publicPaths = ['/', '/login', '/register'];
    const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;

    if (publicPaths.includes(pathname) && !hasToken) {
      setIsLoading(false);
      return;
    }
    
    checkAuth();
  }, [checkAuth, pathname]);

  const login = async (credentials: any) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    const { accessToken, user } = data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    // Redirect based on role
    if (user.role === 'admin') router.push('/admin');
    else if (user.role === 'teacher') router.push('/teacher');
    else router.push('/student');
  };

  const register = async (regData: any) => {
    const { data } = await api.post<AuthResponse>('/auth/register', regData);
    const { accessToken, user } = data.data;

    localStorage.setItem('accessToken', accessToken);
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
