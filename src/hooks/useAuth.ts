import { useState, useEffect } from 'react';
import { User } from '../types';
import { getCurrentUser, loginUser, registerUser, loginAsDemoUser, logoutUser } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Sync state
    const current = getCurrentUser();
    setUser(current);
  }, []);

  const login = (email: string, pass: string) => {
    const res = loginUser(email, pass);
    if (res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const register = (name: string, email: string, pass: string) => {
    const res = registerUser(name, email, pass);
    if (res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const loginDemo = () => {
    const demo = loginAsDemoUser();
    setUser(demo);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isAuthModalOpen,
    authMode,
    openLoginModal: () => {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    },
    openRegisterModal: () => {
      setAuthMode('register');
      setIsAuthModalOpen(true);
    },
    closeAuthModal: () => setIsAuthModalOpen(false),
    setAuthMode,
    login,
    register,
    loginDemo,
    logout
  };
}
