/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Video, 
  Music, 
  Calendar, 
  Trophy, 
  Flag, 
  HardDrive, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  GraduationCap,
  Building2,
  Heart,
  MessageSquare,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface AdminOverviewProps {
  onNavigateSection: (section: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateSection }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'semester'>('7d');
  
  const stats = storageService.getPlatformStats();
  const storageMetrics = storageService.getStorageMetrics();
  const logs = storageService.getAuditLogs().slice(0, 5);
  const pendingReports = storageService.getReports().filter(r => r.status === 'pending');

  // The 13 required platform telemetry stats
  const TELEMETRY_STATS = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-violet-400', nav: 'users' },
    { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-emerald-400', nav: 'users' },
    { label: 'Students', value: stats.studentsCount, icon: GraduationCap, color: 'text-sky-400', nav: 'students' },
    { label: 'Teachers', value: stats.teachersCount, icon: Users, color: 'text-indigo-400', nav: 'teachers' },
    { label: 'Schools', value: stats.schoolsCount, icon: Building2, color: 'text-amber-400', nav: 'schools' },
    { label: 'Videos Uploaded', value: stats.videosCount, icon: Video, color: 'text-rose-400', nav: 'videos' },
    { label: 'Music Uploaded', value: stats.songsCount, icon: Music, color: 'text-cyan-400', nav: 'music' },
    { label: 'Events', value: stats.eventsCount, icon: Calendar, color: 'text-amber-400', nav: 'events' },
    { label: 'Competitions', value: stats.competitionsCount, icon: Trophy, color: 'text-yellow-400', nav: 'competitions' },
    { label: 'Comments', value: stats.totalComments, icon: MessageSquare, color: 'text-blue-400', nav: 'content' },
    { label: 'Likes', value: stats.totalLikes, icon: Heart, color: 'text-rose-400', nav: 'content' },
    { label: 'Reports / Flags', value: stats.reportsCount, icon: Flag, color: stats.pendingReportsCount > 0 ? 'text-rose-400' : 'text-emerald-400', nav: 'reports' },
    { label: 'Storage Usage', value: `${(storageMetrics.totalUsedMb / 1024).toFixed(2)} GB`, icon: HardDrive, color: 'text-purple-400', nav: 'storage' },
  ];

  const PRIMARY_KPIS = [
    {
      label: 'Total Platform Community',
      value: stats.totalUsers,
      sublabel: `${stats.activeUsers} Active · ${stats.studentsCount} Students · ${stats.teachersCount} Faculty`,
      change: '+18.4%',
      positive: true,
      icon: Users,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      nav: 'users'
    },
    {
      label: 'Videos & Music Uploaded',
      value: stats.videosCount + stats.songsCount,
      sublabel: `${stats.videosCount} Video Reels · ${stats.songsCount} Audio Tracks`,
      change: '+24.1%',
      positive: true,
      icon: Video,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      nav: 'content'
    },
    {
      label: 'Events & Tournaments',
      value: stats.eventsCount,
      sublabel: `${stats.competitionsCount} Active Live Voting Contests`,
      change: '+5.0%',
      positive: true,
      icon: Trophy,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      nav: 'competitions'
    },
    {
      label: 'Peer Social Engagement',
      value: (stats.totalLikes + stats.totalComments).toLocaleString(),
      sublabel: `${stats.totalLikes} Likes · ${stats.totalComments} Comments`,
      change: '+32.8%',
      positive: true,
      icon: Heart,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      nav: 'content'
    },
    {
      label: 'Pending Moderation',
      value: stats.pendingReportsCount,
      sublabel: stats.pendingReportsCount === 0 ? 'All flags resolved' : 'Awaiting admin review',
      change: stats.pendingReportsCount === 0 ? 'Clean' : 'Needs Action',
      positive: stats.pendingReportsCount === 0,
      icon: Flag,
      color: stats.pendingReportsCount === 0 
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
        : 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse',
      nav: 'reports'
    },
    {
      label: 'Storage Consumed',
      value: `${(storageMetrics.totalUsedMb / 1024).toFixed(2)} GB`,
      sublabel: `of ${(storageMetrics.maxCapacityMb / 1024).toFixed(0)} GB quota allocated`,
      change: `${Math.round((storageMetrics.totalUsedMb / storageMetrics.maxCapacityMb) * 100)}% Used`,
      positive: true,
      icon: HardDrive,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      nav: 'storage'
    }
  ];

  // SVG Area Chart points (normalized 0-100)
  const chartData = [
    { day: 'Mon', students: 140, uploads: 12 },
    { day: 'Tue', students: 185, uploads: 18 },
    { day: 'Wed', students: 230, uploads: 25 },
    { day: 'Thu', students: 310, uploads: 38 },
    { day: 'Fri', students: 420, uploads: 54 },
    { day: 'Sat', students: 390, uploads: 42 },
    { day: 'Sun', students: 460, uploads: 68 },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Vibra Platform Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Real-Time Sync
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time synchronized telemetry across St. Jude Academy talent network
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['7d', '30d', 'semester'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                timeRange === r
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'This Semester'}
            </button>
          ))}
        </div>
      </div>

      {/* 13 Synchronized Real-Time Platform Indicators Grid */}
      <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
              Synchronized Platform Telemetry Indicators (All 13 Metrics)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">Database Synced</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
          {TELEMETRY_STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigateSection(stat.nav)}
                className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-850 hover:border-neutral-700 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-neutral-400 truncate pr-1">
                    {stat.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${stat.color} shrink-0 group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-lg font-black text-white tracking-tight">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRIMARY_KPIS.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateSection(kpi.nav)}
              className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between shadow-sm cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">{kpi.label}</span>
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-3">
                <span className="text-3xl font-black text-white tracking-tight">
                  {kpi.value}
                </span>
                <p className="text-xs text-neutral-500 mt-0.5">{kpi.sublabel}</p>
              </div>

              <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs">
                <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold ${
                  kpi.positive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {kpi.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{kpi.change}</span>
                </span>
                <span className="text-neutral-500 text-[11px]">vs prior period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Activity Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Student Activity & Video Engagement</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Daily active students and talent uploads</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span>Active Students</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Uploads</span>
              </span>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
              <defs>
                <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#262626" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#262626" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#262626" strokeDasharray="3 3" />

              {/* Shaded Area for Students */}
              <path
                d="M 20 140 Q 90 120 160 90 T 300 50 T 420 30 T 480 20 L 480 160 L 20 160 Z"
                fill="url(#violetGradient)"
              />

              {/* Curve Stroke for Students */}
              <path
                d="M 20 140 Q 90 120 160 90 T 300 50 T 420 30 T 480 20"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Curve Stroke for Uploads */}
              <path
                d="M 20 150 Q 90 140 160 125 T 300 100 T 420 70 T 480 50"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { x: 20, y: 140 },
                { x: 95, y: 120 },
                { x: 175, y: 88 },
                { x: 250, y: 65 },
                { x: 330, y: 48 },
                { x: 410, y: 32 },
                { x: 480, y: 20 },
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-neutral-400 px-2 pt-1 border-t border-neutral-850">
            {chartData.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </div>

        {/* Talent Category Distribution Breakdown */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Talent Category Velocity</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Distribution of student creative works</p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { cat: 'Music & Vocals', pct: 36, color: 'bg-violet-500' },
              { cat: 'Contemporary Dance', pct: 24, color: 'bg-rose-500' },
              { cat: 'Creative Coding & Tech', pct: 18, color: 'bg-sky-500' },
              { cat: 'Poetry & Spoken Word', pct: 12, color: 'bg-amber-500' },
              { cat: 'School Choirs & Ensembles', pct: 10, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.cat} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-300 font-medium">{item.cat}</span>
                  <span className="font-mono text-neutral-400">{item.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateSection('analytics')}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-semibold text-xs transition-colors text-center cursor-pointer"
          >
            Open Advanced Analytics →
          </button>
        </div>
      </div>

      {/* Lower Section: Pending Moderation & Recent Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Moderation Queue */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Pending Moderation Queue</h3>
            </div>
            <button
              onClick={() => onNavigateSection('reports')}
              className="text-xs text-violet-400 hover:underline cursor-pointer"
            >
              View All ({pendingReports.length})
            </button>
          </div>

          {pendingReports.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/80 mb-2" />
              <span>All student reports have been resolved. The platform is compliant.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingReports.slice(0, 3).map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">{rep.targetTitle || 'Reported Item'}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {rep.targetType}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{rep.reason}</p>
                  </div>
                  <button
                    onClick={() => onNavigateSection('reports')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit Trail Preview */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Recent Administrative Events</h3>
            </div>
            <button
              onClick={() => onNavigateSection('logs')}
              className="text-xs text-sky-400 hover:underline cursor-pointer"
            >
              Full Audit Trail →
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-white">{log.action}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{log.details || log.resource}</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-bold">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
