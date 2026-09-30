/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Sparkles, 
  Music, 
  Award, 
  Edit3, 
  Check, 
  Heart, 
  Play, 
  MessageSquare,
  Trophy,
  Share2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useNotification } from '../../context/NotificationContext';
import { storageService } from '../../services/storageService';

export const StudentProfile: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { playSong } = useAudioPlayer();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'overview' | 'talents' | 'music' | 'achievements'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser?.bio || '');
  const [gradeInput, setGradeInput] = useState(currentUser?.grade || '');

  if (!currentUser) {
    return (
      <div className="text-center py-16 text-neutral-400">
        Please sign in to view your talent profile.
      </div>
    );
  }

  const songs = storageService.getSongs().filter(s => s.artistId === currentUser.id);
  const talents = storageService.getTalents().filter(t => t.userId === currentUser.id);

  const handleSaveProfile = () => {
    updateProfile({
      bio: bioInput,
      grade: gradeInput,
    });
    setIsEditing(false);
    showToast('Your talent profile has been updated.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Profile Banner & Header */}
      <div className="rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800">
        {/* Decorative Top Gradient */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-violet-900 via-indigo-900 to-amber-900 relative">
          <div className="absolute top-4 right-4">
            <span className="text-xs font-mono uppercase bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/10">
              {currentUser.schoolName}
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
            <div className="flex items-end gap-4">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-neutral-950 shadow-2xl"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 uppercase font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono">@{currentUser.username}</p>
                <p className="text-xs text-violet-400 mt-0.5">{currentUser.grade}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio section */}
          {isEditing ? (
            <div className="space-y-3 mb-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Class / Grade Title</label>
                <input
                  type="text"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Talent Biography</label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed mb-6">
              {currentUser.bio || 'Student creator at St. Jude Academy.'}
            </p>
          )}

          {/* Talents & Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-neutral-800/80">
            {currentUser.talents.map((t, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800/80 text-neutral-200 border border-neutral-700/60 font-medium"
              >
                {t}
              </span>
            ))}
            {currentUser.badges.map((b, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{b}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: Sparkles },
          { id: 'talents', label: `Talent Works (${talents.length})`, icon: Award },
          { id: 'music', label: `Music & Tracks (${songs.length})`, icon: Music },
          { id: 'achievements', label: 'School Honors', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-violet-600 text-white font-medium shadow-md shadow-violet-600/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-violet-400" />
              <span>Featured Audio Works</span>
            </h3>
            {songs.length === 0 ? (
              <p className="text-xs text-neutral-500">No original songs uploaded yet.</p>
            ) : (
              songs.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={s.coverArt} alt={s.title} className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-white">{s.title}</p>
                      <p className="text-[10px] text-neutral-400">{s.genre}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => playSong(s)}
                    className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-violet-600 flex items-center justify-center text-white transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>School Competitions & Recognitions</span>
            </h3>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1">
              <p className="text-xs font-semibold text-white">State Soloist Gold Award 2025</p>
              <p className="text-[11px] text-neutral-400">Awarded by St. Jude Fine Arts Council for exceptional vocal control.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'talents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {talents.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <img src={item.mediaUrl} alt={item.title} className="w-full h-40 rounded-xl object-cover" />
              <h4 className="text-sm font-bold text-white mt-2">{item.title}</h4>
              <p className="text-xs text-neutral-300">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'music' && (
        <div className="space-y-3">
          {songs.map((s) => (
            <div key={s.id} className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={s.coverArt} alt={s.title} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-bold text-white">{s.title}</p>
                  <p className="text-[11px] text-neutral-400">{s.genre} · {s.playsCount} plays</p>
                </div>
              </div>
              <button
                onClick={() => playSong(s)}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Official School Honors & Badges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Vocal Gold Soloist', year: '2025', desc: 'Highest vocal scoring in St. Jude Spring Festival' },
              { title: 'Featured Artist Spotlight', year: '2026', desc: 'Curated by Faculty Performing Arts Patron' },
              { title: 'Chamber Choir Section Lead', year: '2025-2026', desc: 'Soprano section leadership and rehearsals' },
              { title: '1,000+ Campus Plays Milestone', year: '2026', desc: 'Top 5 most listened student original tracks' },
            ].map((ach, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-amber-300">{ach.title}</p>
                  <span className="text-[10px] font-mono text-neutral-500">{ach.year}</span>
                </div>
                <p className="text-[11px] text-neutral-400">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
