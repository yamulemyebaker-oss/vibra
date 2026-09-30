/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  UserCheck, 
  UserX, 
  Eye, 
  Award, 
  Filter, 
  ExternalLink, 
  X, 
  ShieldCheck,
  Video,
  Music,
  Heart
} from 'lucide-react';
import { User } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const AdminStudents: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [students, setStudents] = useState<User[]>(() => 
    storageService.getUsers().filter((u) => u.role === 'student')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const videos = storageService.getVideos();
  const songs = storageService.getSongs();

  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.talents.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGrade = 
      selectedGrade === 'all' || (s.grade && s.grade.toLowerCase().includes(selectedGrade.toLowerCase()));

    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'active' ? s.status !== 'suspended' : s.status === 'suspended');

    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleToggleStatus = (student: User) => {
    const updated = storageService.toggleUserStatus(student.id, currentUser);
    if (updated) {
      setStudents(storageService.getUsers().filter((u) => u.role === 'student'));
      if (selectedStudent?.id === student.id) {
        setSelectedStudent(updated);
      }
      showToast(`Student ${student.name} account is now ${updated.status?.toUpperCase()}.`, 'info');
    }
  };

  const getStudentStats = (studentId: string, studentUsername: string) => {
    const studentVideos = videos.filter(
      (v) => v.studentId === studentId || v.studentUsername === studentUsername
    );
    const studentSongs = songs.filter((s) => s.artistName.toLowerCase() === studentUsername.toLowerCase());
    const totalLikes = studentVideos.reduce((acc, v) => acc + (v.likesCount || 0), 0);
    return {
      videosCount: studentVideos.length,
      songsCount: studentSongs.length,
      totalLikes
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-violet-400" />
            <span>Enrolled Students Directory</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Monitor student creative portfolios, grade rosters, and talent showcases
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
            {students.length} Total Registered Students
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Total Enrolled</p>
          <p className="text-2xl font-black text-white mt-0.5">{students.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Active Good Standing</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">
            {students.filter(s => s.status !== 'suspended').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Published Talent Reels</p>
          <p className="text-2xl font-black text-violet-400 mt-0.5">{videos.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Suspended Accounts</p>
          <p className="text-2xl font-black text-rose-400 mt-0.5">
            {students.filter(s => s.status === 'suspended').length}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, talent, or email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Grades</option>
            <option value="Grade 9">Grade 9 · Freshman</option>
            <option value="Grade 10">Grade 10 · Sophomore</option>
            <option value="Grade 11">Grade 11 · Junior</option>
            <option value="Grade 12">Grade 12 · Senior</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Grade & Class</th>
                <th className="py-3 px-4">Talent Specialties</th>
                <th className="py-3 px-4">Showcases</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No students matching search filters found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isSuspended = student.status === 'suspended';
                  const stats = getStudentStats(student.id, student.username);

                  return (
                    <tr key={student.id} className="hover:bg-neutral-850/40 transition-colors">
                      {/* Name / Avatar / Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{student.name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">@{student.username} · {student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-4 text-neutral-300 font-medium">
                        {student.grade || 'General Secondary'}
                      </td>

                      {/* Talent Tags */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {student.talents.slice(0, 3).map((talent) => (
                            <span
                              key={talent}
                              className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] font-medium"
                            >
                              {talent}
                            </span>
                          ))}
                          {student.talents.length > 3 && (
                            <span className="text-[10px] font-mono text-neutral-500">
                              +{student.talents.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Showcases count */}
                      <td className="py-3.5 px-4 font-mono text-neutral-300">
                        <span className="text-violet-400 font-bold">{stats.videosCount}</span> reels · {stats.totalLikes} likes
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isSuspended 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          <span>{isSuspended ? 'Suspended' : 'Active'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="Inspect Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(student)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isSuspended
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                            }`}
                            title={isSuspended ? 'Reactivate Student' : 'Suspend Account'}
                          >
                            {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-5">
              <img
                src={selectedStudent.avatarUrl}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/30"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{selectedStudent.name}</h3>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    selectedStudent.status === 'suspended'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {selectedStudent.status || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono">@{selectedStudent.username}</p>
                <p className="text-xs text-violet-400 mt-0.5">{selectedStudent.grade}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold mb-1">Biography</p>
                <p className="text-neutral-300 leading-relaxed">{selectedStudent.bio || 'No biography written yet.'}</p>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold mb-1.5">Registered Talents</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.talents.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-medium">
                      ★ {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold mb-1.5">Earned Badges & Honors</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.badges.map((b) => (
                    <span key={b} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                  <p className="text-[10px] text-neutral-500 font-mono">Account Created</p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {new Date(selectedStudent.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                  <p className="text-[10px] text-neutral-500 font-mono">Last Active Timestamp</p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {selectedStudent.lastLoginAt ? new Date(selectedStudent.lastLoginAt).toLocaleString() : 'Recent'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(selectedStudent)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  selectedStudent.status === 'suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {selectedStudent.status === 'suspended' ? 'Reactivate Student Account' : 'Suspend Student Account'}
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
