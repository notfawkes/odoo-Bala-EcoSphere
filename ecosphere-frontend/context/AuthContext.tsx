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

export interface SignupData {
  email: string;
  password: string;
  name: string;
  title: string;
  department: string;
  role: Role;
}

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  isLoggedIn: boolean;
  isInitialized: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<Role>;
  signup: (data: SignupData, rememberMe: boolean) => Promise<Role>;
  logout: () => void;
}

const emptyUser: User = {
  name: '',
  initials: '',
  title: '',
  department: '',
  email: '',
};

// Seed Users for local storage fallback when backend is not running
const DEFAULT_MOCK_USERS: Record<string, any> = {
  'maya@asterco.com': {
    email: 'maya@asterco.com',
    name: 'Maya Chen',
    initials: 'MC',
    title: 'Platform Administrator',
    department: 'Operations',
    role: 'admin',
    password: 'password123'
  },
  'jordan@asterco.com': {
    email: 'jordan@asterco.com',
    name: 'Jordan Lee',
    initials: 'JL',
    title: 'Product Designer',
    department: 'Product',
    role: 'employee',
    password: 'password123'
  }
};

const getLocalUsers = () => {
  if (typeof window === 'undefined') return DEFAULT_MOCK_USERS;
  const stored = localStorage.getItem('ecosphere_local_users');
  if (!stored) {
    localStorage.setItem('ecosphere_local_users', JSON.stringify(DEFAULT_MOCK_USERS));
    return DEFAULT_MOCK_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_MOCK_USERS;
  }
};

const saveLocalUser = (user: any) => {
  const users = getLocalUsers();
  users[user.email] = user;
  localStorage.setItem('ecosphere_local_users', JSON.stringify(users));
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (!parts.length || !parts[0]) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('admin');
  const [userState, setUserState] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const persistToken = (token: string, rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem('ecosphere_jwt', token);
      sessionStorage.removeItem('ecosphere_jwt');
    } else {
      sessionStorage.setItem('ecosphere_jwt', token);
      localStorage.removeItem('ecosphere_jwt');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        let token = localStorage.getItem('ecosphere_jwt');
        if (!token) {
          token = sessionStorage.getItem('ecosphere_jwt');
        }

        if (token) {
          if (token.startsWith('mock-jwt-')) {
            const email = token.replace('mock-jwt-', '');
            const localUsers = getLocalUsers();
            const localUser = localUsers[email];
            if (localUser) {
              setUserState({
                email: localUser.email,
                name: localUser.name,
                initials: localUser.initials,
                title: localUser.title,
                department: localUser.department
              });
              setRoleState(localUser.role as Role);
              setIsLoggedIn(true);
            }
          } else {
            try {
              // 1.5 second timeout abort controller to prevent hanging if server blocks
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 1500);

              const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                signal: controller.signal
              });
              clearTimeout(timeoutId);

              if (res.ok) {
                const userData = await res.json();
                setUserState(userData);
                setRoleState(userData.role as Role);
                setIsLoggedIn(true);
              } else {
                localStorage.removeItem('ecosphere_jwt');
                sessionStorage.removeItem('ecosphere_jwt');
              }
            } catch (e) {
              console.warn("Backend down. Resolving token locally.");
              const match = token.match(/^mock-jwt-(.+)$/);
              const email = match ? match[1] : null;
              if (email) {
                const localUsers = getLocalUsers();
                const localUser = localUsers[email];
                if (localUser) {
                  setUserState({
                    email: localUser.email,
                    name: localUser.name,
                    initials: localUser.initials,
                    title: localUser.title,
                    department: localUser.department
                  });
                  setRoleState(localUser.role as Role);
                  setIsLoggedIn(true);
                }
              } else {
                localStorage.removeItem('ecosphere_jwt');
                sessionStorage.removeItem('ecosphere_jwt');
              }
            }
          }
        }
      } catch (err) {
        console.error("Critical error in auth initialization:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [API_BASE_URL]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<Role> => {
    const emailClean = email.trim().toLowerCase();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailClean, password })
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token;
        const userData = data.user;

        persistToken(token, rememberMe);
        setUserState(userData);
        setRoleState(userData.role as Role);
        setIsLoggedIn(true);
        return userData.role as Role;
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Login failed. Please check your credentials.');
      }
    } catch (e: any) {
      // Fallback if backend is offline or network error
      const isNetworkError = !e.status && (e.message?.includes('Failed to fetch') || e.message?.includes('NetworkError') || e.message?.includes('fetch'));
      if (isNetworkError || e.message === 'Failed to fetch') {
        console.warn("Backend down. Falling back to local authentication.");
        const localUsers = getLocalUsers();
        const localUser = localUsers[emailClean];
        if (localUser && localUser.password === password) {
          const token = `mock-jwt-${emailClean}`;
          persistToken(token, rememberMe);
          const userData = {
            email: localUser.email,
            name: localUser.name,
            initials: localUser.initials,
            title: localUser.title,
            department: localUser.department
          };
          setUserState(userData);
          setRoleState(localUser.role as Role);
          setIsLoggedIn(true);
          return localUser.role as Role;
        } else {
          throw new Error('Invalid email or password (Local Fallback).');
        }
      }
      throw e;
    }
  };

  const signup = async (signupData: SignupData, rememberMe: boolean): Promise<Role> => {
    const emailClean = signupData.email.trim().toLowerCase();
    const titleClean = signupData.role === 'employee' ? signupData.title : 'Platform Administrator';
    const deptClean = signupData.role === 'employee' ? signupData.department : 'Operations';

    const formattedData = {
      ...signupData,
      email: emailClean,
      title: titleClean,
      department: deptClean
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token;
        const userData = data.user;

        persistToken(token, rememberMe);
        setUserState(userData);
        setRoleState(userData.role as Role);
        setIsLoggedIn(true);
        return userData.role as Role;
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Signup failed. Please try again.');
      }
    } catch (e: any) {
      const isNetworkError = !e.status && (e.message?.includes('Failed to fetch') || e.message?.includes('NetworkError') || e.message?.includes('fetch'));
      if (isNetworkError || e.message === 'Failed to fetch') {
        console.warn("Backend down. Falling back to local signup.");
        const localUsers = getLocalUsers();
        if (localUsers[emailClean]) {
          throw new Error('Email address already registered (Local Fallback).');
        }

        const initials = getInitials(signupData.name);
        const newLocalUser = {
          email: emailClean,
          password: signupData.password,
          name: signupData.name,
          initials: initials,
          title: titleClean,
          department: deptClean,
          role: signupData.role
        };
        
        saveLocalUser(newLocalUser);
        
        const token = `mock-jwt-${emailClean}`;
        persistToken(token, rememberMe);
        
        const userData = {
          email: newLocalUser.email,
          name: newLocalUser.name,
          initials: newLocalUser.initials,
          title: newLocalUser.title,
          department: newLocalUser.department
        };
        
        setUserState(userData);
        setRoleState(newLocalUser.role as Role);
        setIsLoggedIn(true);
        return newLocalUser.role as Role;
      }
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('ecosphere_jwt');
    sessionStorage.removeItem('ecosphere_jwt');
    setUserState(null);
    setRoleState('admin');
    setIsLoggedIn(false);
  };

  const user = userState || emptyUser;

  return (
    <AuthContext.Provider value={{ role, setRole, user, isLoggedIn, isInitialized, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const roleLabels: Record<Role, string> = {
  admin: 'Admin',
  employee: 'Employee',
};
