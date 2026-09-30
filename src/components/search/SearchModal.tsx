/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Music, 
  Sparkles, 
  Calendar, 
  User, 
  Users, 
  Play, 
  ArrowRight,
  Radio
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Song, TalentItem, SchoolEvent } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

type SearchCategory = 'all' | 'songs' | 'talents' | 'events' | 'students';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const { playSong } = useAudioPlayer();

  const songs = storageService.getSongs();
  const talents = storageService.getTalents();
  const events = storageService.getEvents();
  const users = storageService.getUsers().filter(u => u.role === 'student');

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { songs: [], talents: [], events: [], users: [] };
    }

    const matchedSongs = songs.filter(
      s => s.title.toLowerCase().includes(q) || s.artistName.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q)
    );

    const matchedTalents = talents.filter(
      t => t.title.toLowerCase().includes(q) || t.studentName.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.skills.some(sk => sk.toLowerCase().includes(q))
    );

    const matchedEvents = events.filter(
      e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
    );

    const matchedUsers = users.filter(
      u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.talents.some(t => t.toLowerCase().includes(q))
    );

    return {
      songs: matchedSongs,
      talents: matchedTalents,
      events: matchedEvents,
      users: matchedUsers,
    };
  }, [query, songs, talents, events, users]);

  if (!isOpen) return null;

  const totalResults = 
    filteredResults.songs.length + 
    filteredResults.talents.length + 
    filteredResults.events.length + 
    filteredResults.users.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-20 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, talents, auditions, events, creators..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-500 hover:text-neutral-300"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="px-4 py-2 border-b border-neutral-800/80 bg-neutral-950/40 flex items-center gap-2 overflow-x-auto text-xs">
          {(['all', 'songs', 'talents', 'events', 'students'] as SearchCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-violet-600 text-white font-medium shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results / Suggestions */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {query.trim() === '' ? (
            <div className="space-y-4 py-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Music Clash 2026', 'Contemporary Dance', 'Horizon Chamber Choir', 'Maya Lin', 'Creative Codefest', 'Spoken Word'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No matching school content found for "{query}". Try checking your spelling or searching by category.
            </div>
          ) : (
            <>
              {/* Songs Section */}
              {(activeCategory === 'all' || activeCategory === 'songs') && filteredResults.songs.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-violet-400" />
                    <span>Songs & Audio ({filteredResults.songs.length})</span>
                  </p>
                  <div className="space-y-1.5">
                    {filteredResults.songs.map((song) => (
                      <div
                        key={song.id}
                        onClick={() => {
                          playSong(song);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800/80 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={song.coverArt} alt={song.title} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate group-hover:text-violet-300">{song.title}</p>
                            <p className="text-[11px] text-neutral-400 truncate">{song.artistName} · {song.genre}</p>
                          </div>
                        </div>
                        <span className="w-7 h-7 rounded-full bg-neutral-800 group-hover:bg-violet-600 flex items-center justify-center text-white transition-colors">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Talents Section */}
              {(activeCategory === 'all' || activeCategory === 'talents') && filteredResults.talents.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Talents & Creative Works ({filteredResults.talents.length})</span>
                  </p>
                  <div className="space-y-1.5">
                    {filteredResults.talents.map((talent) => (
                      <div
                        key={talent.id}
                        onClick={() => {
                          onSelectTab('talents');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800/80 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{talent.title}</p>
                          <p className="text-[11px] text-neutral-400 truncate">{talent.studentName} · {talent.category.toUpperCase()}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events & Competitions Section */}
              {(activeCategory === 'all' || activeCategory === 'events') && filteredResults.events.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Events & Auditions ({filteredResults.events.length})</span>
                  </p>
                  <div className="space-y-1.5">
                    {filteredResults.events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => {
                          onSelectTab('events');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800/80 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{event.title}</p>
                          <p className="text-[11px] text-neutral-400 truncate">{event.date} · {event.venue}</p>
                        </div>
                        <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 uppercase">
                          {event.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Students Section */}
              {(activeCategory === 'all' || activeCategory === 'students') && filteredResults.users.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Students ({filteredResults.users.length})</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredResults.users.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          onSelectTab('profile');
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800/80 transition-colors cursor-pointer flex items-center gap-2.5"
                      >
                        <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{u.grade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
