/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Music, 
  Search, 
  Play, 
  Pause, 
  Trash2, 
  Heart, 
  Radio, 
  Users, 
  Disc, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { Song, Choir, Podcast } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useNotification } from '../../context/NotificationContext';

export const AdminMusic: React.FC = () => {
  const { currentUser } = useAuth();
  const { playSong, pauseSong, currentSong, isPlaying } = useAudioPlayer();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'songs' | 'choirs' | 'podcasts'>('songs');
  const [songs, setSongs] = useState<Song[]>(() => storageService.getSongs());
  const [choirs] = useState<Choir[]>(() => storageService.getChoirs());
  const [podcasts] = useState<Podcast[]>(() => storageService.getPodcasts());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSong = (song: Song) => {
    if (!window.confirm(`Permanently remove track "${song.title}" by ${song.artistName}?`)) return;
    const ok = storageService.deleteSong(song.id, currentUser);
    if (ok) {
      setSongs(storageService.getSongs());
      showToast(`Song "${song.title}" removed from school catalog.`, 'info');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Music className="w-6 h-6 text-sky-400" />
            <span>Music, Choirs & Audio Catalog</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Original student studio releases, choir festival recordings, and school podcasts
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'songs' ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Original Tracks ({songs.length})
          </button>
          <button
            onClick={() => setActiveTab('choirs')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'choirs' ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            School Choirs ({choirs.length})
          </button>
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'podcasts' ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Podcasts ({podcasts.length})
          </button>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Total Audio Plays</p>
          <p className="text-2xl font-black text-white mt-0.5">
            {songs.reduce((acc, s) => acc + (s.playsCount || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Total Favorites</p>
          <p className="text-2xl font-black text-rose-400 mt-0.5">
            {songs.reduce((acc, s) => acc + (s.likesCount || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Choir Ensembles</p>
          <p className="text-2xl font-black text-violet-400 mt-0.5">{choirs.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Synthesizer Tones</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">5 Presets</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter audio by title, artist, or genre..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* TAB 1: ORIGINAL SONGS */}
      {activeTab === 'songs' && (
        <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Play</th>
                  <th className="py-3 px-4">Track Title</th>
                  <th className="py-3 px-4">Artist / Ensemble</th>
                  <th className="py-3 px-4">Genre</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Telemetry</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredSongs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                      No tracks matching search query.
                    </td>
                  </tr>
                ) : (
                  filteredSongs.map((song) => {
                    const isCurrent = currentSong?.id === song.id;
                    return (
                      <tr key={song.id} className="hover:bg-neutral-850/40 transition-colors">
                        {/* Play button */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => {
                              if (isCurrent && isPlaying) {
                                pauseSong();
                              } else {
                                playSong(song);
                              }
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isCurrent && isPlaying
                                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white'
                            }`}
                          >
                            {isCurrent && isPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        </td>

                        {/* Title & Cover */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={song.coverArt}
                              alt={song.title}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-xs">{song.title}</p>
                              {song.isSchoolChoir && (
                                <span className="text-[10px] font-mono text-violet-400">
                                  ★ {song.choirName || 'Chamber Choir'}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Artist */}
                        <td className="py-3.5 px-4 text-neutral-300 font-medium">
                          {song.artistName}
                        </td>

                        {/* Genre */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px] font-mono">
                            {song.genre}
                          </span>
                        </td>

                        {/* Duration */}
                        <td className="py-3.5 px-4 font-mono text-neutral-400">
                          {formatDuration(song.duration)}
                        </td>

                        {/* Telemetry */}
                        <td className="py-3.5 px-4 font-mono text-neutral-400 text-[11px]">
                          <span className="text-white font-bold">{song.playsCount}</span> plays · {song.likesCount} likes
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteSong(song)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove Song from Catalog"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CHOIRS */}
      {activeTab === 'choirs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {choirs.map((choir) => (
            <div
              key={choir.id}
              className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={choir.coverArt}
                  alt={choir.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/20"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{choir.name}</h3>
                  <p className="text-xs text-violet-400 font-medium">Director: {choir.leadDirector}</p>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{choir.memberCount} Vocalists</p>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">{choir.description}</p>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block mb-1">
                  Rehearsal Call
                </span>
                <span className="text-neutral-300 font-medium">{choir.rehearsalSchedule}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PODCASTS */}
      {activeTab === 'podcasts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={podcast.coverArt}
                  alt={podcast.title}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/20"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{podcast.title}</h3>
                  <p className="text-xs text-amber-400 font-medium">Host: {podcast.hostName}</p>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{podcast.episodeCount} Episodes Published</p>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">{podcast.description}</p>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block mb-1">
                  Latest Episode
                </span>
                <span className="text-neutral-200 font-medium">"{podcast.latestEpisodeTitle}"</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
