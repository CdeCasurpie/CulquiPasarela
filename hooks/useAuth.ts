'use client';

import { useState, useEffect } from 'react';
import { User, Session } from '@/types';
import authService from '@/services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar sesión al cargar
    const session = authService.getSession();
    if (session) {
      setUser(session.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const session = await authService.login(email, password);
    setUser(session.user);
    setIsAuthenticated(true);
    return session;
  };

  const register = async (email: string, password: string) => {
    const session = await authService.register(email, password);
    setUser(session.user);
    setIsAuthenticated(true);
    return session;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  };
}
