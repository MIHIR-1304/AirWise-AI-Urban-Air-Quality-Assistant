import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; persona?: string; defaultCity?: string }) => Promise<void>;
  logout: () => void;
  updateUserPreferences: (prefs: any) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('airwise_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('airwise_cached_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const profile = await api.getCurrentUser();
          setUser(profile);
          localStorage.setItem('airwise_cached_user', JSON.stringify(profile));
        } catch (e) {
          console.warn('Could not refresh session token', e);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('airwise_cached_user', JSON.stringify(res.user));
    setIsAuthModalOpen(false);
  };

  const register = async (data: { email: string; password: string; fullName: string; persona?: string; defaultCity?: string }) => {
    const res = await api.register(data);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('airwise_cached_user', JSON.stringify(res.user));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('airwise_token');
    localStorage.removeItem('airwise_cached_user');
    setToken(null);
    setUser(null);
  };

  const updateUserPreferences = async (prefs: any) => {
    if (!user) return;
    try {
      const updated = await api.updateProfile({ preferences: prefs });
      setUser(updated);
      localStorage.setItem('airwise_cached_user', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update preferences', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      updateUserPreferences,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
