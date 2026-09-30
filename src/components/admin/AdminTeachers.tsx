/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  School as SchoolIcon, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Award, 
  Music, 
  Calendar, 
  Mail, 
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { User } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const AdminTeachers: React.FC = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { showToast } = useNotification();

  const [teachers, setTeachers] = useState<User[]>(() =>
    storageService.getUsers().filter((u) => u.role === 'teacher')
  );
  const [searchQuery, setSearchQuery] = useState('');

  const choirs = storageService.getChoirs();
  const events = storageService.getEvents();

  const filteredTeachers = teachers.filter((t) => {
    return (
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.grade && t.grade.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleToggleStatus = (teacher: User) => {
    const updated = storageService.toggleUserStatus(teacher.id, currentUser);
    if (updated) {
      setTeachers(storageService.getUsers().filter((u) => u.role === 'teacher'));
      showToast(`Faculty member ${teacher.name} status updated to ${updated.status?.toUpperCase()}.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <SchoolIcon className="w-6 h-6 text-sky-400" />
            <span>Teachers & Activity Patrons</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Faculty directors, competition judges, choral patrons, and department mentors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
            {teachers.length} Active Faculty Patrons
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Choral & Music Patrons</span>
            <Music className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-black text-white">2 Patrons</p>
          <p className="text-[11px] text-neutral-400">Overseeing Horizon Choir & Chamber ensembles</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Events & Contests Mentors</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{events.length} Active Tournaments</p>
          <p className="text-[11px] text-neutral-400">Directing audition stages and showcase gala</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Moderation Privileges</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">100% Authorized</p>
          <p className="text-[11px] text-neutral-400">Verified faculty badges with pre-approval rights</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search faculty name, department, or email..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeachers.map((teacher) => {
          const isSuspended = teacher.status === 'suspended';
          return (
            <div
              key={teacher.id}
              className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.avatarUrl}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sky-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">{teacher.name}</h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-bold">
                        Faculty
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{teacher.grade || 'Fine Arts Department'}</p>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{teacher.email}</p>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSuspended 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                  <span>{isSuspended ? 'Suspended' : 'Active Patron'}</span>
                </span>
              </div>

              {/* Bio */}
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300">
                <p className="line-clamp-2">{teacher.bio || 'Faculty patron and student mentor.'}</p>
              </div>

              {/* Badges / Responsibilities */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold">Assigned Programs</p>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.badges.map((b) => (
                    <span key={b} className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[11px] font-medium flex items-center gap-1">
                      <Award className="w-3 h-3 text-sky-400" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer status & Actions */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400 font-mono">
                  Joined: {new Date(teacher.createdAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleToggleStatus(teacher)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    isSuspended
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  }`}
                >
                  {isSuspended ? 'Reactivate Faculty Account' : 'Suspend Account'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
