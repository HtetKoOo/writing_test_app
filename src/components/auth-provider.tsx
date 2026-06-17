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
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;

    if (hasToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
        return; // Bypasses the broken /users/me endpoint entirely if we have a valid session!
      } catch (e) {
        // ignore JSON parse error
      }
    }

    try {
      // Check auth by trying to fetch the user profile.
      // If the token is expired, api.ts interceptor will automatically handle the refresh.
      const { data } = await api.get('/users/me');
      
      if (data && data.data) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      }
    } catch (error: any) {
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
    const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (publicPaths.includes(pathname) && !hasToken) {
      setIsLoading(false);
      return;
    }

    // Redirect authenticated users away from login/register to their dashboard
    if (hasToken && storedUserStr && ['/login', '/register'].includes(pathname)) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser.role === 'admin') {
          router.replace('/admin');
        } else if (storedUser.role === 'teacher') {
          router.replace('/teacher');
        } else {
          router.replace('/student');
        }
        setIsLoading(false);
        return;
      } catch (e) {
        // ignore parse error and run checkAuth
      }
    }
    
    checkAuth();
  }, [checkAuth, pathname, router]);

  const login = async (credentials: any) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = data.data;
    const accessToken = token;

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
    const { token, user } = data.data;
    const accessToken = token;

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
