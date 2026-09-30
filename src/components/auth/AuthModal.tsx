/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [grade, setGrade] = useState('Grade 11 · Junior');

  const { login, signup } = useAuth();
  const { showToast } = useNotification();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const res = login(email, password || 'Password123!');
      if (res.success) {
        showToast('Successfully signed in!', 'success');
        onClose();
      } else {
        showToast(res.error || 'Account not found. Please try a registered demo student or faculty email.', 'error');
      }
    } else {
      if (!name || !email) {
        showToast('Please fill in required fields.', 'warning');
        return;
      }
      signup(name, email, role, grade, password || 'Password123!');
      showToast(`Welcome to Vibra, ${name}! Your account is active.`, 'success');
      onClose();
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    const DEMO_PASSWORDS: Record<string, string> = {
      'maya.lin@stjude.edu': 'StudentMaya2026!',
      'd.sterling@stjude.edu': 'TeacherSterling!',
      'principal.vance@stjude.edu': 'AdminVance2026!',
    };
    login(demoEmail, DEMO_PASSWORDS[demoEmail] || 'Password123!');
    showToast('Signed in via quick demo account!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-3">
            <GraduationCap className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isLogin ? 'Sign in to Vibra' : 'Create your Vibra Account'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isLogin
              ? 'Connect with your school creative community and talent showcase.'
              : 'Join fellow students and faculty to share and celebrate talents.'}
          </p>
        </div>

        {/* Quick Demo Logins Bar */}
        {isLogin && (
          <div className="mb-5 p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Quick One-Click Demo Logins:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('maya.lin@stjude.edu')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-violet-600/30 text-neutral-200 border border-neutral-700/60 transition-colors"
              >
                Maya (Student)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('d.sterling@stjude.edu')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-sky-600/30 text-neutral-200 border border-neutral-700/60 transition-colors"
              >
                Mr. Sterling (Teacher)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('principal.vance@stjude.edu')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-amber-600/30 text-neutral-200 border border-neutral-700/60 transition-colors"
              >
                Dr. Vance (Admin)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Rivera"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">School Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@stjude.edu"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Patron</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Grade / Level</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Grade 11"
                  className="w-full px-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-violet-600/25 mt-2 cursor-pointer"
          >
            {isLogin ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-neutral-400">
          {isLogin ? "Don't have an account? " : 'Already registered? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-400 hover:underline font-medium"
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
};
