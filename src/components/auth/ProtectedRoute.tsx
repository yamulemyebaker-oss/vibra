/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'superadmin';
  onNavigateHome: () => void;
  onOpenRoleSwitcher: () => void;
  onOpenLogin: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'admin',
  onNavigateHome,
  onOpenRoleSwitcher,
  onOpenLogin,
}) => {
  const { currentUser, role, isAdmin, isSuperAdmin, isAuthenticated } = useAuth();

  const isAuthorized = 
    requiredRole === 'superadmin' ? isSuperAdmin : isAdmin;

  // Log unauthorized access attempts in the audit trail
  useEffect(() => {
    if (!isAuthorized) {
      storageService.addAuditLog(
        'SECURITY_ACCESS_DENIED',
        'Route: /admin',
        'failure',
        `Unauthorized access attempt by ${currentUser?.name || 'Guest'} (${role}). Admin role required.`,
        currentUser || {
          id: 'unauthenticated-visitor',
          name: 'Guest / Public User',
          username: 'guest',
          email: 'anonymous@guest.local',
          role: 'guest',
          avatarUrl: '',
          schoolId: 'school-st-jude',
          schoolName: 'St. Jude Academy',
          talents: [],
          followersCount: 0,
          followingCount: 0,
          badges: [],
          createdAt: new Date().toISOString()
        }
      );
    }
  }, [isAuthorized, role, currentUser]);

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-neutral-950 text-white">
      <div className="max-w-md w-full rounded-3xl bg-neutral-900 border border-neutral-800 p-8 shadow-2xl text-center space-y-6">
        
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold">
            403 Forbidden · Access Denied
          </span>
          <h2 className="text-xl font-black text-white mt-2">
            Administrator Clearance Required
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            The Vibra Central Administration Console is strictly restricted to School Administrators and Super Admins.
          </p>
        </div>

        {/* Current Identity Box */}
        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Your Identity:</span>
            <span className="font-semibold text-white">{currentUser?.name || 'Guest Explorer'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Active Role:</span>
            <span className="font-mono text-violet-400 uppercase text-[11px] font-bold">
              {role}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Required Role:</span>
            <span className="font-mono text-amber-400 uppercase text-[11px] font-bold">
              {requiredRole === 'superadmin' ? 'Super Admin' : 'School Administrator'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          {!isAuthenticated ? (
            <button
              onClick={onOpenLogin}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors shadow"
            >
              Sign In as Administrator
            </button>
          ) : (
            <button
              onClick={onOpenRoleSwitcher}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Switch to Administrator Persona (Test Mode)</span>
            </button>
          )}

          <button
            onClick={onNavigateHome}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to School Talent Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
