'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { User, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<any>;
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
      const publicPaths = ['/', '/login', '/register', '/auth/callback'];
      if (typeof window !== 'undefined' && !publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Intercept OAuth tokens in query parameters if present
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token') || searchParams.get('accessToken');
      const userParam = searchParams.get('user');

      if (token) {
        localStorage.setItem('accessToken', token);
        
        if (userParam) {
          try {
            const decodedUser = decodeURIComponent(userParam);
            const parsedUser = JSON.parse(decodedUser);
            localStorage.setItem('user', JSON.stringify(parsedUser));
            setUser(parsedUser);
            
            // Clean URL query params
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);

            // Redirect based on role
            if (parsedUser.role === 'admin') router.replace('/admin');
            else if (parsedUser.role === 'teacher') router.replace('/teacher');
            else router.replace('/student');
            setIsLoading(false);
            return;
          } catch (e) {
            console.error("Failed to parse user from query parameters:", e);
          }
        }

        // If we have token but no user info, fetch it from backend
        // Clean URL query params first
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        checkAuth().then(() => {
          // After checkAuth successfully retrieves user, redirect based on user role
          const storedUserStr = localStorage.getItem('user');
          if (storedUserStr) {
            const parsedUser = JSON.parse(storedUserStr);
            if (parsedUser.role === 'admin') router.replace('/admin');
            else if (parsedUser.role === 'teacher') router.replace('/teacher');
            else router.replace('/student');
          }
        });
        return;
      }
    }

    // Skip API calls on the public pages if no access token is present
    // This prevents the 401 Unauthorized error in the console when unauthenticated
    const publicPaths = ['/', '/login', '/register', '/auth/callback'];
    const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;
    const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (publicPaths.includes(pathname) && !hasToken) {
      setIsLoading(false);
      return;
    }

    // Redirect authenticated users away from login/register/callback to their dashboard
    if (hasToken && storedUserStr && ['/login', '/register', '/auth/callback'].includes(pathname)) {
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
    const { data } = await api.post<any>('/auth/register', regData);
    
    // If the response contains a user object, log them in automatically
    if (data?.data?.user) {
      const { token, user } = data.data;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      router.push('/student');
      return { success: true, loggedIn: true };
    }
    
    // Otherwise (email verification flow), return success metadata
    return {
      success: true,
      loggedIn: false,
      message: data?.data?.message || data?.message || "Account created successfully. Please check your email to verify your account."
    };
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn("Backend logout failed:", error);
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
