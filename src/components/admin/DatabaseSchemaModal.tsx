/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  FolderTree, 
  Server, 
  KeyRound, 
  Layers, 
  CheckCircle2, 
  Code,
  Table,
  Lock,
  X
} from 'lucide-react';

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'tables' | 'rls' | 'storage' | 'architecture'>('tables');

  if (!isOpen) return null;

  const SCHEMA_TABLES = [
    {
      name: 'profiles',
      pk: 'id (UUID)',
      fks: ['school_id -> schools.id'],
      columns: ['full_name', 'username', 'role', 'grade', 'bio', 'avatar_url', 'followers_count'],
      rls: 'Public read. Update own profile only.'
    },
    {
      name: 'talents',
      pk: 'id (UUID)',
      fks: ['student_id -> profiles.id', 'category_id -> talent_categories.id'],
      columns: ['title', 'category_id', 'description', 'media_url', 'skills', 'achievements', 'is_featured'],
      rls: 'Public read. Students can create/edit own talents.'
    },
    {
      name: 'songs',
      pk: 'id (UUID)',
      fks: ['artist_id -> profiles.id', 'album_id -> albums.id', 'choir_id -> choirs.id'],
      columns: ['title', 'audio_url', 'cover_art_url', 'duration_seconds', 'genre', 'plays_count', 'likes_count'],
      rls: 'Public listen. Upload restricted to registered students & choirs.'
    },
    {
      name: 'choirs',
      pk: 'id (UUID)',
      fks: ['school_id -> schools.id'],
      columns: ['name', 'lead_director', 'member_count', 'cover_art_url', 'rehearsal_schedule'],
      rls: 'Managed by faculty patron & administrator.'
    },
    {
      name: 'events',
      pk: 'id (UUID)',
      fks: ['school_id -> schools.id', 'organizer_id -> profiles.id'],
      columns: ['title', 'type (competition/audition/concert)', 'event_date', 'venue', 'status', 'capacity'],
      rls: 'Created by teacher & admin. Students can register.'
    },
    {
      name: 'votes',
      pk: 'id (UUID)',
      fks: ['event_id -> events.id', 'entry_id -> competition_entries.id', 'voter_id -> profiles.id'],
      columns: ['created_at', 'UNIQUE(event_id, voter_id)'],
      rls: 'Strict 1-vote-per-student constraint enforced by unique composite key.'
    },
    {
      name: 'reports',
      pk: 'id (UUID)',
      fks: ['reporter_id -> profiles.id', 'reviewed_by -> profiles.id'],
      columns: ['target_type', 'target_id', 'reason', 'status', 'action_taken'],
      rls: 'Only accessible by teachers and administrators.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Vibra Database Architecture & Relational Schema
              </h2>
              <p className="text-xs text-neutral-400">
                PostgreSQL & Supabase specification mapped for production scalability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav tabs */}
        <div className="px-5 py-2.5 border-b border-neutral-800/80 bg-neutral-950/60 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveSection('tables')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'tables'
                ? 'bg-violet-600 text-white font-medium'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Core Relational Entities</span>
          </button>
          <button
            onClick={() => setActiveSection('rls')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'rls'
                ? 'bg-violet-600 text-white font-medium'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Row-Level Security (RLS)</span>
          </button>
          <button
            onClick={() => setActiveSection('storage')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'storage'
                ? 'bg-violet-600 text-white font-medium'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Storage Buckets</span>
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'architecture'
                ? 'bg-violet-600 text-white font-medium'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Full-Stack Overview</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeSection === 'tables' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-300">
                All 28 entities specified in Section 12 are defined in <code className="bg-neutral-900 px-1 py-0.5 rounded text-white font-mono text-[11px]">/src/db/schema.sql</code> with constraints, foreign keys, timestamps, and indexes.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {SCHEMA_TABLES.map((tbl) => (
                  <div key={tbl.name} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-violet-400">{tbl.name}</span>
                      <span className="text-[10px] font-mono text-neutral-500">PK: {tbl.pk}</span>
                    </div>
                    {tbl.fks.length > 0 && (
                      <p className="text-[11px] text-neutral-400 font-mono">
                        FK: {tbl.fks.join(', ')}
                      </p>
                    )}
                    <div className="pt-2 border-t border-neutral-900">
                      <p className="text-[10px] uppercase font-mono text-neutral-500 mb-1">Key Fields:</p>
                      <div className="flex flex-wrap gap-1">
                        {tbl.columns.map((col, idx) => (
                          <span key={idx} className="bg-neutral-900 text-neutral-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-400/90 pt-1">
                      <span className="font-semibold">Security:</span> {tbl.rls}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'rls' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Row Level Security (RLS) Policy Specifications</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <p className="font-semibold text-violet-300 mb-1">1. Student Profile Isolation</p>
                  <p className="text-neutral-400 leading-relaxed">
                    Users can read approved public student portfolios, but write access (<code className="font-mono text-neutral-200">UPDATE, DELETE</code>) is strictly restricted to <code className="font-mono text-neutral-200">auth.uid() = profiles.id</code>. A student cannot tamper with another student's account.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <p className="font-semibold text-amber-300 mb-1">2. Anti-Tamper Competition Voting</p>
                  <p className="text-neutral-400 leading-relaxed">
                    Votes table enforces <code className="font-mono text-neutral-200">UNIQUE(event_id, voter_id)</code>. Students can only cast 1 vote per approved competition when <code className="font-mono text-neutral-200">voting_open = TRUE</code>. Winner results cannot be manually altered by students.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <p className="font-semibold text-sky-300 mb-1">3. Teacher & Patron Governance</p>
                  <p className="text-neutral-400 leading-relaxed">
                    Only profiles with <code className="font-mono text-neutral-200">role IN ('teacher', 'admin')</code> can create auditions, publish competition outcomes, or resolve content reports.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <p className="font-semibold text-rose-300 mb-1">4. Safety Reports & Moderation</p>
                  <p className="text-neutral-400 leading-relaxed">
                    All report entries are completely hidden from student queries and can only be queried by authorized faculty and administrators.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'storage' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Supabase Media Storage Bucket Structure (Section 16)</h3>
              <p className="text-neutral-400">
                Large media assets are never stored in relational rows; they are stored in dedicated cloud buckets with organized URI paths:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { path: '/profiles/', desc: 'Student and faculty avatars, max 2MB, optimized WebP' },
                  { path: '/songs/', desc: 'Audio tracks (MP3/WAV/AAC) with streaming MIME types' },
                  { path: '/albums/', desc: 'High-res square album art and cover graphics' },
                  { path: '/choirs/', desc: 'Choir ensemble banners and rehearsal recordings' },
                  { path: '/events/', desc: 'Official posters, competition badges, and concert flyers' },
                  { path: '/talents/', desc: 'Visual portfolios, dance videos, art snapshots' },
                  { path: '/posts/', desc: 'Student community post attachments and event recaps' },
                ].map((b) => (
                  <div key={b.path} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    <p className="font-mono font-bold text-violet-400">{b.path}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">Architecture & Phase Roadmap</h3>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                  <span className="font-bold">Phase 1 (Completed):</span> Project foundation, brand identity, responsive multi-role navigation, homepage hero, real Web Audio player engine, search modal, role switcher, and database schema specification.
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400">
                  <span className="font-semibold text-white">Phase 2:</span> Comprehensive portfolio pages, music & playlist creators, dedicated choir showcases, podcast player.
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400">
                  <span className="font-semibold text-white">Phase 3:</span> Full competition submission portal, real-time live voting, audition application manager.
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400">
                  <span className="font-semibold text-white">Phase 4:</span> Safe 1-on-1 school chat, comment threads, follow feeds.
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400">
                  <span className="font-semibold text-white">Phase 5:</span> Complete moderation center, student safety reporting triage, full platform telemetry.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
          >
            Close Schema Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
