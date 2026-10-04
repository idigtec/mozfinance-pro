import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppUser, UserRole } from '../types';

interface AuthContextType {
  currentUser: AppUser | null;
  users: AppUser[];
  isAuthenticated: boolean;
  login: (email: string, pin?: string) => { success: boolean; message: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  addUser: (user: Omit<AppUser, 'id' | 'createdAt'>) => void;
  updateUser: (user: AppUser) => void;
  deleteUser: (id: string) => void;
  updateProfile: (data: Partial<AppUser>) => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const DEFAULT_USERS: AppUser[] = [
  {
    id: 'user_admin',
    name: 'Carlos Silva',
    email: 'carlos.silva@idigtec.co.mz',
    role: 'ADMIN',
    phone: '+258 84 102 9384',
    department: 'Direcção Executiva',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    companyIds: ['all'],
    createdAt: '2026-01-10T08:00:00Z',
    lastLogin: '2026-10-04T06:00:00Z',
    pinCode: '1234'
  },
  {
    id: 'user_finance',
    name: 'Sofia Macamo',
    email: 'sofia.macamo@idigtec.co.mz',
    role: 'FINANCIAL_MANAGER',
    phone: '+258 82 491 0293',
    department: 'Contabilidade & Tesouraria',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    companyIds: ['all'],
    createdAt: '2026-02-01T09:30:00Z',
    lastLogin: '2026-10-03T16:20:00Z',
    pinCode: '2024'
  },
  {
    id: 'user_operator',
    name: 'João Santos',
    email: 'joao.santos@idigtec.co.mz',
    role: 'OPERATOR',
    phone: '+258 86 312 9048',
    department: 'Operações de Caixa & POS',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    companyIds: ['default', 'comp_costasol', 'comp_marracuene'],
    createdAt: '2026-03-15T11:00:00Z',
    lastLogin: '2026-10-04T05:30:00Z',
    pinCode: '0000'
  },
  {
    id: 'user_auditor',
    name: 'Ana Mondlane',
    email: 'ana.mondlane@audit-fiscal.mz',
    role: 'AUDITOR',
    phone: '+258 84 777 9922',
    department: 'Auditoria Externa & Compliance',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    companyIds: ['all'],
    createdAt: '2026-04-20T14:15:00Z',
    lastLogin: '2026-10-02T10:00:00Z',
    pinCode: '9999'
  }
];

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = safeParse('idigtec_users_db', null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const savedSession = safeParse('idigtec_auth_session', null);
    if (savedSession && savedSession.id) {
      const match = users.find(u => u.id === savedSession.id);
      return match || savedSession;
    }
    return DEFAULT_USERS[0]; // Default logged-in user for smooth UX
  });

  useEffect(() => {
    localStorage.setItem('idigtec_users_db', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('idigtec_auth_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('idigtec_auth_session');
    }
  }, [currentUser]);

  const login = (email: string, pin?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.isActive);
    if (!user) {
      return { success: false, message: 'Utilizador não encontrado ou conta inativa.' };
    }
    if (pin && user.pinCode && user.pinCode !== pin) {
      return { success: false, message: 'Código PIN ou palavra-passe incorreta.' };
    }
    const updatedUser = { ...user, lastLogin: new Date().toISOString() };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    return { success: true, message: 'Sessão iniciada com sucesso!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      const updated = { ...target, lastLogin: new Date().toISOString() };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === target.id ? updated : u));
    }
  };

  const addUser = (userData: Omit<AppUser, 'id' | 'createdAt'>) => {
    const newUser: AppUser = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (updated: AppUser) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const deleteUser = (id: string) => {
    if (currentUser && currentUser.id === id) {
      return; // Cannot delete self while logged in
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateProfile = (data: Partial<AppUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const hasRole = (roles: UserRole[]) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      isAuthenticated: !!currentUser,
      login,
      logout,
      switchUser,
      addUser,
      updateUser,
      deleteUser,
      updateProfile,
      hasRole
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
