/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Music, 
  Sparkles, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Trophy, 
  TrendingUp, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';

interface RoleDashboardProps {
  onNavigate: (tab: string) => void;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({ onNavigate }) => {
  const { currentUser, role } = useAuth();
  const { showToast } = useNotification();

  const users = storageService.getUsers();
  const songs = storageService.getSongs();
  const talents = storageService.getTalents();
  const events = storageService.getEvents();
  const posts = storageService.getPosts();

  /* ================= STUDENT DASHBOARD ================= */
  if (role === 'student') {
    return (
      <div className="space-y-8 pb-16">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-neutral-900 to-neutral-950 border border-violet-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">
                Student Workspace
              </span>
              <span className="text-xs text-neutral-400">· St. Jude Academy</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Welcome back, {currentUser?.name || 'Student'}!
            </h1>
            <p className="text-xs text-neutral-300 mt-1">
              Here is your talent activity overview, audition status, and competition schedules.
            </p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Edit Talent Profile
          </button>
        </div>

        {/* Student Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Followers</p>
            <p className="text-2xl font-black text-white mt-1">{currentUser?.followersCount || 342}</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Original Songs</p>
            <p className="text-2xl font-black text-violet-400 mt-1">2 Tracks</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Applause Received</p>
            <p className="text-2xl font-black text-rose-400 mt-1">468</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Registered Events</p>
            <p className="text-2xl font-black text-amber-400 mt-1">1 Contest</p>
          </div>
        </div>

        {/* Actionable Student Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Active Competitions for You</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1">
              <p className="text-xs font-bold text-white">Annual Inter-House Music Clash 2026</p>
              <p className="text-[11px] text-neutral-400">Public audience voting is active until April 18th.</p>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs text-amber-400 hover:underline pt-1 inline-block"
              >
                Go to Voting Ballot →
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Audition Deadlines</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1">
              <p className="text-xs font-bold text-white">Spring Monologue & Contemporary Play</p>
              <p className="text-[11px] text-neutral-400">Audition slots closing this Friday. Monologues in room 204.</p>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs text-sky-400 hover:underline pt-1 inline-block"
              >
                Sign up for audition →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= TEACHER / PATRON DASHBOARD ================= */
  if (role === 'teacher') {
    return (
      <div className="space-y-8 pb-16">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/40 via-neutral-900 to-neutral-950 border border-sky-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                Faculty Patron Console
              </span>
              <span className="text-xs text-neutral-400">· St. Jude Performing Arts</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Faculty Patron Hub — Mr. David Sterling
            </h1>
            <p className="text-xs text-neutral-300 mt-1">
              Manage student talent submissions, review audition applications, and supervise competitions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Review Auditions
          </button>
        </div>

        {/* Teacher Patron KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Pending Submissions</p>
            <p className="text-2xl font-black text-sky-400 mt-1">4</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Audition Applicants</p>
            <p className="text-2xl font-black text-white mt-1">19</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Active Choirs</p>
            <p className="text-2xl font-black text-violet-400 mt-1">2 Groups</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Moderation Reports</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">0 Critical</p>
          </div>
        </div>

        {/* Pending Patron Reviews */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Student Submissions Awaiting Approval</h3>
          <div className="divide-y divide-neutral-800">
            {[
              { student: 'Maya Lin', item: 'Track: "Golden Hour Echoes" (Acoustic)', category: 'Music', date: 'Today' },
              { student: 'Aaliyah Patel', item: 'Dance Choreography Video Submission', category: 'Dance', date: 'Yesterday' },
              { student: 'Liam Vance', item: 'WebGL Generative Audio Visualizer', category: 'Coding', date: '2 days ago' },
            ].map((sub, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{sub.item}</p>
                  <p className="text-[11px] text-neutral-400">By {sub.student} · {sub.category} · {sub.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Approved submission by ${sub.student}!`, 'success')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => showToast(`Requested revision from ${sub.student}.`, 'info')}
                    className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs cursor-pointer"
                  >
                    Request Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= ADMINISTRATOR DASHBOARD ================= */
  if (role === 'admin') {
    return (
      <div className="space-y-8 pb-16">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-950 border border-amber-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Platform Administration
              </span>
              <span className="text-xs text-neutral-400">· St. Jude Academy</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Administrator Console — Dr. Sarah Vance
            </h1>
            <p className="text-xs text-neutral-300 mt-1">
              Complete school talent hub governance: accounts, voting controls, content oversight, and telemetry.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => showToast('Platform safety scan completed: All systems healthy.', 'success')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shrink-0"
            >
              Run Safety Audit
            </button>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Registered Accounts</p>
            <p className="text-2xl font-black text-white mt-1">{users.length + 420}</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Approved Songs</p>
            <p className="text-2xl font-black text-violet-400 mt-1">{songs.length + 115}</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Talent Portfolios</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{talents.length + 72}</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-[11px] text-neutral-400 font-medium">Safety Reports</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">0 Pending</p>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Competition & Voting Governance</h3>
            <p className="text-xs text-neutral-400">
              Enable or close student voting for the Annual Inter-House Music Clash 2026.
            </p>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850">
              <span className="text-xs text-white font-medium">Music Clash Audience Ballot</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ENABLED
              </span>
            </div>
            <button
              onClick={() => showToast('Ballot settings updated.', 'info')}
              className="text-xs text-amber-400 hover:underline pt-1 inline-block"
            >
              Configure voting window & judges →
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <h3 className="text-sm font-bold text-white">School Announcement Broadcast</h3>
            <p className="text-xs text-neutral-400">
              Publish school-wide alerts to student and faculty notification centers.
            </p>
            <button
              onClick={() => showToast('School announcement broadcast dispatched.', 'success')}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Broadcast Cultural Week Alert
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= GUEST DASHBOARD ================= */
  return (
    <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800 p-8 max-w-xl mx-auto space-y-4">
      <ShieldCheck className="w-12 h-12 text-neutral-500 mx-auto" />
      <h2 className="text-xl font-bold text-white">Guest Viewing Mode</h2>
      <p className="text-xs text-neutral-400 leading-relaxed">
        You are browsing Vibra as a public visitor. You can listen to public songs, view approved student showcases, and see event dates. To participate in voting, auditions, or chat, please sign in.
      </p>
      <button
        onClick={() => onNavigate('home')}
        className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors"
      >
        Return to Home Hub
      </button>
    </div>
  );
};
