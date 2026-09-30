/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  Compass, 
  Users, 
  PlusCircle, 
  User as UserIcon, 
  Calendar, 
  Music, 
  LayoutDashboard, 
  Database,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenDbSchema: () => void;
  onOpenRoleSwitcher: () => void;
  className?: string;
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenDbSchema,
  onOpenRoleSwitcher,
  className = '',
  onItemClick,
}) => {
  const { currentUser, role, isGuest } = useAuth();

  const handleSelect = (tab: string) => {
    setActiveTab(tab);
    if (onItemClick) onItemClick();
  };

  const primaryNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'following', label: 'Following', icon: Users },
    { 
      id: 'upload', 
      label: 'Upload', 
      icon: PlusCircle, 
      action: onOpenUpload,
      highlight: true 
    },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <aside className={`w-64 md:w-60 lg:w-64 border-r border-neutral-800/80 bg-neutral-950 flex flex-col justify-between p-4 shrink-0 select-none ${className}`}>
      <div className="space-y-6">
        
        {/* VIBRA LOGO */}
        <div className="px-2 pt-1 pb-2">
          <button 
            onClick={() => handleSelect('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-black text-white text-lg tracking-tighter">V</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                  VIBRA
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                  Hub
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium">
                St. Jude Academy
              </p>
            </div>
          </button>
        </div>

        {/* PRIMARY SIDEBAR NAVIGATION (Home, Explore, Following, Upload, Profile) */}
        <div>
          <nav className="space-y-1.5">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.action) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action();
                      if (onItemClick) onItemClick();
                    }}
                    className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow-sm transition-all duration-150 cursor-pointer"
                  >
                    <Icon className="w-5 h-5 text-violet-400" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-neutral-700/80 shadow-md'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SCHOOL ACTIVITIES & SECONDARY TABS */}
        <div className="pt-2 border-t border-neutral-850">
          <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-3 mb-2 font-semibold">
            Campus Stages
          </p>
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => handleSelect('events')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Events & Contests</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">Voting</span>
            </button>

            <button
              onClick={() => handleSelect('music')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'music'
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-sky-400" />
                <span>Music & Choirs</span>
              </span>
            </button>

            <button
              onClick={() => handleSelect('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Role Dashboard</span>
            </button>

            {(role === 'admin' || role === 'superadmin') && (
              <button
                onClick={() => handleSelect('admin')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Panel</span>
                </span>
                <span className="text-[9px] font-mono uppercase bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                  Console
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* UTILITY SHORTCUTS */}
        <div className="pt-2 border-t border-neutral-850 space-y-1">
          <button
            onClick={onOpenRoleSwitcher}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 text-xs transition-colors cursor-pointer text-left"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
            <span>Test Role Persona</span>
          </button>

          <button
            onClick={onOpenDbSchema}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 text-xs transition-colors cursor-pointer text-left"
          >
            <Database className="w-3.5 h-3.5 text-neutral-500" />
            <span>DB & Supabase Schema</span>
          </button>
        </div>
      </div>

      {/* USER FOOTER / ACTIVE ROLE */}
      <div className="pt-4 border-t border-neutral-900">
        <div className="p-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-violet-500/40"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {currentUser?.name || 'Guest Explorer'}
            </p>
            <p className="text-[10px] text-neutral-400 font-mono capitalize truncate">
              {role} · St. Jude
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
