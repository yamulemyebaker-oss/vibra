/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Video, 
  Trophy, 
  Compass, 
  ArrowUpRight,
  Calendar,
  Sparkles,
  Music,
  GraduationCap,
  Building2,
  Activity
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const AdminAnalytics: React.FC = () => {
  const [filterRange, setFilterRange] = useState<'7d' | '30d' | 'semester'>('30d');
  const stats = storageService.getPlatformStats();
  const videos = storageService.getVideos();
  const songs = storageService.getSongs();
  const schools = storageService.getSchools();
  const events = storageService.getEvents();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <span>Platform Analytics & Community Growth</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            DAU/WAU/MAU velocity, registration trends, talent category distributions, and tournament turnout
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs">
          {(['7d', '30d', 'semester'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRange(r)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                filterRange === r ? 'bg-violet-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Full Semester'}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Daily / Weekly / Monthly Active Users (DAU / WAU / MAU) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Daily Active Users (DAU)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">384</p>
          <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +21.4% vs previous week
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Weekly Active Users (WAU)</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-black text-sky-400 mt-1">790</p>
          <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +16.2% student cohort
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Monthly Active Users (MAU)</span>
            <GraduationCap className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-3xl font-black text-violet-400 mt-1">1,210</p>
          <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 97.5% campus penetration
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">New Student Signups</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 mt-1">+142</p>
          <p className="text-[11px] font-mono text-neutral-400 mt-1">This academic semester</p>
        </div>
      </div>

      {/* 2. Charts: Upload Trends & Registration Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upload Trends: Videos vs. Music */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Upload Trends & Media Velocity</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Vertical video reels vs. audio tracks over time</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Videos
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Music
              </span>
            </div>
          </div>

          <div className="h-52 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              <line x1="0" y1="30" x2="500" y2="30" stroke="#262626" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#262626" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#262626" strokeDasharray="3 3" />

              {/* Videos path */}
              <path
                d="M 20 140 Q 100 110 180 80 T 320 40 T 480 15"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Songs path */}
              <path
                d="M 20 150 Q 100 135 180 115 T 320 85 T 480 60"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {[20, 110, 200, 290, 380, 480].map((x, i) => (
                <circle key={i} cx={x} cy={140 - i * 25} r="3.5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-neutral-400 px-2 border-t border-neutral-850 pt-2">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span>Current Week</span>
          </div>
        </div>

        {/* Most-Used Talent Categories */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Most-Used Talent Categories</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Where St. Jude students channel their creative craft</p>
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              { cat: 'Vocal Performance & Original Songwriting', pct: 38, count: '142 works', color: 'bg-violet-500' },
              { cat: 'Contemporary & Street Dance Choreography', pct: 26, count: '98 works', color: 'bg-rose-500' },
              { cat: 'Creative Coding, Shaders & Digital Sound', pct: 16, count: '62 works', color: 'bg-sky-500' },
              { cat: 'Spoken Word Poetry & Dramatic Monologue', pct: 12, count: '45 works', color: 'bg-amber-500' },
              { cat: 'Chamber Choir & A Cappella Ensembles', pct: 8, count: '30 works', color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.cat} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-200 font-medium truncate pr-2">{item.cat}</span>
                  <div className="flex items-center gap-2 font-mono text-neutral-400 shrink-0">
                    <span>{item.count}</span>
                    <span className="font-bold text-white">{item.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-neutral-500 font-mono text-right">
            Based on {videos.length + songs.length} verified catalog submissions
          </p>
        </div>
      </div>

      {/* 3. School Participation & Event Turnout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* School Network Participation */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">School Network Participation</h3>
          </div>

          <div className="space-y-3 text-xs">
            {schools.map((s, idx) => (
              <div key={s.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate max-w-[190px]">{s.name}</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.2 rounded">
                    {s.code}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono">
                  <span>{s.studentCount} students</span>
                  <span className="text-emerald-400 font-semibold">{92 - idx * 6}% participation</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Activity & Verified Ballots */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Competition Activity</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1">
              <span className="font-semibold text-white">Annual Inter-House Music Clash 2026</span>
              <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1">
                <span>38 Entries Registered</span>
                <span className="text-violet-400 font-bold">1,842 Votes Cast</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mt-1">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1">
              <span className="font-semibold text-white">Creative Codefest: Sound & Shaders</span>
              <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1">
                <span>24 Teams Registered</span>
                <span className="text-sky-400 font-bold">60% Slots Filled</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mt-1">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 space-y-1">
              <span className="font-semibold text-white">Shakespeare & Contemporary Auditions</span>
              <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1">
                <span>19 Audition Slates</span>
                <span className="text-emerald-400 font-bold">Callbacks Ready</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden mt-1">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Popular Content Leaderboard */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Popular Content Leaderboard</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { title: 'Acoustic Hallway Session: Golden Hour', author: 'Maya Lin', views: '2.4k' },
              { title: 'Sanctuary of Voices 4-Part Choral Rehearsal', author: 'Horizon Choir', views: '3.1k' },
              { title: 'Gravity Defiance Contemporary Solo', author: 'Aaliyah Patel', views: '1.9k' },
              { title: 'Generative Audio Shader Tunnel', author: 'Liam Vance', views: '1.6k' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-neutral-500 font-bold">#{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate max-w-[160px]">{item.title}</p>
                    <p className="text-[10px] text-neutral-400">{item.author}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-violet-400 font-bold shrink-0">
                  {item.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
