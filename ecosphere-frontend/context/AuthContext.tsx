"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
export type Role = 'admin' | 'employee';

export interface User {
  name: string;
  initials: string;
  title: string;
  department: string;
  email: string;
}

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  isLoggedIn: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const mockUsers: Record<Role, User> = {
  admin: {
    name: 'Maya Chen',
    initials: 'MC',
    title: 'Platform Administrator',
    department: 'Operations',
    email: 'maya@asterco.com',
  },

  employee: {
    name: 'Jordan Lee',
    initials: 'JL',
    title: 'Product Designer',
    department: 'Product',
    email: 'jordan@asterco.com',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window === 'undefined') return 'admin';
    const saved = sessionStorage.getItem('ecosphere_role');
    return (saved as Role) || 'admin';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('ecosphere_logged_in') === 'true';
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    sessionStorage.setItem('ecosphere_role', newRole);
  };

  const login = (loginRole: Role) => {
    setRole(loginRole);
    setIsLoggedIn(true);
    sessionStorage.setItem('ecosphere_logged_in', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('ecosphere_logged_in');
    sessionStorage.removeItem('ecosphere_role');
    setRoleState('admin');
  };

  const user = mockUsers[role];

  return (
    <AuthContext.Provider value={{ role, setRole, user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Bypassing authentication for now to prevent rendering issues
    return {
      role: 'admin',
      setRole: () => {},
      user: mockUsers.admin,
      isLoggedIn: true,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
}

export const roleLabels: Record<Role, string> = {
  admin: 'Admin',
  employee: 'Employee',
};