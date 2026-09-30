/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  School as SchoolIcon, 
  Building2,
  FileText, 
  Video,
  Music,
  Calendar, 
  Trophy,
  Flag, 
  Clock, 
  HardDrive, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminOverview } from './AdminOverview';
import { AdminUsers } from './AdminUsers';
import { AdminStudents } from './AdminStudents';
import { AdminTeachers } from './AdminTeachers';
import { AdminSchools } from './AdminSchools';
import { AdminContent } from './AdminContent';
import { AdminVideos } from './AdminVideos';
import { AdminMusic } from './AdminMusic';
import { AdminCompetitions } from './AdminCompetitions';
import { AdminReports } from './AdminReports';
import { AdminLogs } from './AdminLogs';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminStorage } from './AdminStorage';
import { AdminSettings } from './AdminSettings';
import { EventsPage } from '../events/EventsPage';

interface AdminLayoutProps {
  onReturnToHub: () => void;
}

export type AdminSection = 
  | 'overview'
  | 'users'
  | 'students'
  | 'teachers'
  | 'schools'
  | 'content'
  | 'videos'
  | 'music'
  | 'events'
  | 'competitions'
  | 'reports'
  | 'logs'
  | 'storage'
  | 'settings'
  | 'analytics';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onReturnToHub }) => {
  const { currentUser, role, isSuperAdmin, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exact 14 required sidebar items
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', icon: SchoolIcon },
    { id: 'schools', label: 'Schools', icon: Building2 },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'competitions', label: 'Competitions', icon: Trophy },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'logs', label: 'Activity Logs', icon: Clock },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 font-black text-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  VIBRA ADMIN
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {isSuperAdmin ? 'Super Admin' : 'School Admin'}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono hidden sm:block">
                St. Jude Academy Central Management Console
              </p>
            </div>
          </div>
        </div>

        {/* Right header actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real Database Synced</span>
          </div>

          <button
            onClick={() => setActiveSection('analytics')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
              activeSection === 'analytics'
                ? 'bg-violet-600 text-white border-violet-500 shadow'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Analytics</span>
          </button>

          <button
            onClick={onReturnToHub}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Student Talent Hub</span>
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors cursor-pointer"
            title="Sign out of administration"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex w-full">
        
        {/* Admin Sidebar with 14 exact items */}
        <aside className={`w-60 border-r border-neutral-800/80 bg-neutral-950 flex flex-col justify-between p-3.5 shrink-0 ${
          isSidebarOpen ? 'fixed inset-y-0 left-0 z-50 shadow-2xl flex w-64 pt-18' : 'hidden md:flex'
        }`}>
          <div className="space-y-3 overflow-y-auto no-scrollbar">
            <div className="px-3 pt-1 pb-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                Platform Navigation
              </p>
            </div>

            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id as AdminSection);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm font-bold'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-neutral-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Admin Profile Footer */}
          <div className="pt-3 border-t border-neutral-900">
            <div className="p-2.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-center gap-2.5">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-500/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] font-mono text-amber-400 uppercase truncate">
                  {currentUser?.role}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Stage Panel */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto">
          {activeSection === 'overview' && (
            <AdminOverview onNavigateSection={(sec) => setActiveSection(sec as AdminSection)} />
          )}
          {activeSection === 'users' && <AdminUsers filterRole="all" />}
          {activeSection === 'students' && <AdminStudents />}
          {activeSection === 'teachers' && <AdminTeachers />}
          {activeSection === 'schools' && <AdminSchools />}
          {activeSection === 'content' && <AdminContent />}
          {activeSection === 'videos' && <AdminVideos />}
          {activeSection === 'music' && <AdminMusic />}
          {activeSection === 'events' && <EventsPage />}
          {activeSection === 'competitions' && <AdminCompetitions />}
          {activeSection === 'reports' && <AdminReports />}
          {activeSection === 'logs' && <AdminLogs />}
          {activeSection === 'storage' && <AdminStorage />}
          {activeSection === 'settings' && <AdminSettings />}
          {activeSection === 'analytics' && <AdminAnalytics />}
        </main>
      </div>
    </div>
  );
};
