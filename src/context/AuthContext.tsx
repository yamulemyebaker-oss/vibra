/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { DEMO_USERS } from '../db/initialData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  login: (identifier: string, passwordAttempt: string, rememberMe?: boolean) => { success: boolean; user?: User; error?: string; lockoutSeconds?: number };
  loginWithGoogle: () => boolean;
  logout: () => void;
  signup: (name: string, email: string, role: UserRole, grade?: string, password?: string) => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<User>) => void;
  canModerate: boolean;
  canCreateEvents: boolean;
  canVote: boolean;
  canAdminister: boolean;
  canPost: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Check active session token first
    const session = authService.getActiveSession();
    const users = storageService.getUsers();
    if (session) {
      const match = users.find(u => u.id === session.userId);
      if (match && match.status !== 'suspended') return match;
    }

    const savedUserId = localStorage.getItem('vibra_active_user_id');
    if (savedUserId) {
      const match = users.find(u => u.id === savedUserId);
      if (match && match.status !== 'suspended') return match;
    }
    // Default demo student
    return users.find(u => u.role === 'student') || DEMO_USERS[0];
  });

  const role: UserRole = currentUser?.role || 'guest';
  const isAuthenticated = currentUser !== null && role !== 'guest';
  const isGuest = role === 'guest';
  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperAdmin = role === 'superadmin';
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vibra_active_user_id', currentUser.id);
    } else {
      localStorage.removeItem('vibra_active_user_id');
    }
  }, [currentUser]);

  const login = (identifier: string, passwordAttempt: string, rememberMe: boolean = false) => {
    const result = authService.login(identifier, passwordAttempt, rememberMe);
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const loginWithGoogle = () => {
    const result = authService.loginWithGoogle();
    if (result.success && result.user) {
      setCurrentUser(result.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    authService.logout(currentUser);
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const users = storageService.getUsers();
    if (newRole === 'guest') {
      authService.logout(currentUser);
      setCurrentUser(null);
      return;
    }
    const found = users.find(u => u.role === newRole);
    if (found) {
      setCurrentUser(found);
      authService.login(found.email, found.password || 'SuperAdmin2026!');
    }
  };

  const signup = (name: string, email: string, newRole: UserRole, grade?: string, password?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      role: newRole,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      schoolId: 'school-st-jude',
      schoolName: 'St. Jude Creative Arts Academy',
      grade: grade || (newRole === 'student' ? 'Grade 10 · Sophomore' : 'Faculty'),
      bio: 'Excited to discover and share creative talents on Vibra!',
      talents: [],
      followersCount: 0,
      followingCount: 0,
      badges: ['New Member'],
      status: 'active',
      password: password || 'Password123!',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const users = storageService.getUsers();
    users.push(newUser);
    localStorage.setItem('vibra_users', JSON.stringify(users));
    setCurrentUser(newUser);

    storageService.addAuditLog(
      'USER_SIGNUP',
      `User: ${newUser.name} (${newRole})`,
      'success',
      `Self-registered with email ${email}`,
      newUser
    );
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = storageService.updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
    }
  };

  // Role permissions matrix
  const canModerate = role === 'admin' || role === 'superadmin' || role === 'teacher';
  const canCreateEvents = role === 'admin' || role === 'superadmin' || role === 'teacher';
  const canAdminister = role === 'admin' || role === 'superadmin';
  const canVote = isAuthenticated && (role === 'student' || role === 'teacher');
  const canPost = isAuthenticated;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        isGuest,
        isAdmin,
        isSuperAdmin,
        isTeacher,
        isStudent,
        login,
        loginWithGoogle,
        logout,
        signup,
        switchRole,
        updateProfile,
        canModerate,
        canCreateEvents,
        canVote,
        canAdminister,
        canPost,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
