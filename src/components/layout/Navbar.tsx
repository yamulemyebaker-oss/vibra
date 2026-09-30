/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Check, 
  ChevronDown,
  Database,
  Menu,
  X,
  Volume2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenRoleSwitcher: () => void;
  onOpenDbSchema: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAuth,
  onOpenRoleSwitcher,
  onOpenDbSchema,
  onToggleMobileMenu,
  isMobileMenuOpen,
  activeTab,
  setActiveTab,
}) => {
  const { currentUser, role, isAuthenticated, isGuest, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'superadmin':
        return <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">Super Admin</span>;
      case 'admin':
        return <span className="text-[11px] font-mono font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Admin</span>;
      case 'teacher':
        return <span className="text-[11px] font-mono font-medium text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">Teacher / Patron</span>;
      case 'student':
        return <span className="text-[11px] font-mono font-medium text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded border border-violet-400/20">Student</span>;
      default:
        return <span className="text-[11px] font-mono font-medium text-neutral-400 bg-neutral-400/10 px-2 py-0.5 rounded border border-neutral-400/20">Guest</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Mobile menu button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-black text-white text-base tracking-tighter">V</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                  VIBRA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                  School Hub
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 hidden sm:block leading-none -mt-0.5">
                St. Jude Academy
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Trigger Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs transition-colors cursor-pointer group shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-neutral-500 group-hover:text-violet-400 transition-colors" />
              <span>Search songs, talents, events, choirs, students...</span>
            </span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 border border-neutral-700/50">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons: DB Spec, Role Switcher, Notifications, Auth/Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Database Architecture Modal Trigger */}
          <button
            onClick={onOpenDbSchema}
            title="View Relational DB Schema & Supabase Architecture"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-medium hidden lg:inline">DB Schema</span>
          </button>

          {/* Admin Console Launcher (Admins only) */}
          {(role === 'admin' || role === 'superadmin') && (
            <button
              onClick={() => setActiveTab('admin')}
              title="Launch Vibra Central Admin Console"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>
          )}

          {/* Live Role Switcher Button */}
          <button
            onClick={onOpenRoleSwitcher}
            title="Switch demo persona (Student, Teacher, Admin, Guest)"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <div className="flex items-center gap-1">
              <span className="text-neutral-400 hidden xl:inline text-[11px]">Role:</span>
              {getRoleBadge(role)}
            </div>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-neutral-950 animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl z-50 p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-mono">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-6">No notifications yet</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-2.5 rounded-xl transition-colors cursor-pointer text-xs ${
                          notif.isRead
                            ? 'bg-neutral-950/40 text-neutral-400'
                            : 'bg-neutral-800/60 border border-neutral-700/50 text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white text-[11px]">{notif.title}</span>
                          <span className="text-[10px] text-neutral-500">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-snug">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile or Guest Login */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-violet-500/40"
                />
                <span className="text-xs font-medium text-neutral-200 hidden md:inline max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400 hidden md:inline" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl z-50 p-2 text-xs">
                  <div className="p-2 border-b border-neutral-800">
                    <p className="font-medium text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">@{currentUser.username}</p>
                    <div className="mt-1.5">{getRoleBadge(currentUser.role)}</div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors text-left"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>My Talent Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Role Dashboard</span>
                    </button>
                  </div>
                  <div className="pt-1 border-t border-neutral-800">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (Guest Mode)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-md shadow-violet-600/20 transition-all cursor-pointer"
              >
                Join Vibra
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
