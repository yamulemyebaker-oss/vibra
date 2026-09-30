/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Heart, 
  Users, 
  Radio, 
  ListMusic, 
  Disc, 
  Volume2, 
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useNotification } from '../../context/NotificationContext';
import { Song, Choir, Podcast } from '../../types';

export const MusicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'choirs' | 'podcasts'>('tracks');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();
  const { showToast } = useNotification();

  const songs = storageService.getSongs();
  const choirs = storageService.getChoirs();
  const podcasts = storageService.getPodcasts();

  const genres = ['all', 'Indie Acoustic', 'Lo-Fi Chill & Synth', 'Choral / Classical', 'Dream Pop', 'Rhythmic Dance Beats'];

  const filteredSongs = selectedGenre === 'all'
    ? songs
    : songs.filter(s => s.genre === selectedGenre);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleLike = (song: Song) => {
    storageService.toggleLikeSong(song.id);
    showToast(`Added "${song.title}" to your favorites!`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Music, Choirs & Audio</h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Listen to student compositions, choral festival pieces, and campus talk podcasts.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'tracks'
                ? 'bg-violet-600 text-white font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Original Tracks ({songs.length})
          </button>
          <button
            onClick={() => setActiveTab('choirs')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'choirs'
                ? 'bg-violet-600 text-white font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            School Choirs ({choirs.length})
          </button>
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'podcasts'
                ? 'bg-violet-600 text-white font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Podcasts ({podcasts.length})
          </button>
        </div>
      </div>

      {/* TRACKS VIEW */}
      {activeTab === 'tracks' && (
        <div className="space-y-6">
          {/* Genre filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-violet-600 text-white font-medium'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {g === 'all' ? 'All Genres' : g}
              </button>
            ))}
          </div>

          {/* Songs List */}
          <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden divide-y divide-neutral-800/80">
            <div className="p-3.5 px-4 hidden sm:grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-neutral-500 bg-neutral-950/40">
              <span className="col-span-1">#</span>
              <span className="col-span-5">Title & Artist</span>
              <span className="col-span-3">Genre</span>
              <span className="col-span-2">Plays</span>
              <span className="col-span-1 text-right">Time</span>
            </div>

            {filteredSongs.map((song, idx) => {
              const isCurrent = isPlaying && currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`p-3.5 px-4 flex items-center justify-between sm:grid sm:grid-cols-12 gap-3 transition-colors hover:bg-neutral-800/40 cursor-pointer group ${
                    currentSong?.id === song.id ? 'bg-violet-950/20' : ''
                  }`}
                  onClick={() => (isCurrent ? togglePlay() : playSong(song))}
                >
                  {/* Track number / Play button */}
                  <div className="sm:col-span-1 flex items-center">
                    <button
                      className="w-7 h-7 rounded-lg bg-neutral-800 group-hover:bg-violet-600 flex items-center justify-center text-white transition-colors"
                      aria-label="Play track"
                    >
                      {isCurrent ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${currentSong?.id === song.id ? 'text-violet-300' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">{song.artistName}</p>
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="hidden sm:flex sm:col-span-3 items-center text-xs text-neutral-400">
                    <span>{song.genre}</span>
                  </div>

                  {/* Plays */}
                  <div className="hidden sm:flex sm:col-span-2 items-center text-xs text-neutral-400 font-mono">
                    <span>{song.playsCount.toLocaleString()} plays</span>
                  </div>

                  {/* Duration & Like action */}
                  <div className="sm:col-span-1 flex items-center justify-end gap-3 text-xs text-neutral-400 font-mono">
                    <span>{formatDuration(song.duration)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(song);
                      }}
                      className="p-1 hover:text-rose-400 transition-colors"
                      aria-label="Like track"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHOIRS VIEW */}
      {activeTab === 'choirs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {choirs.map((choir) => (
            <div
              key={choir.id}
              className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={choir.coverArt}
                    alt={choir.name}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-sky-500/30"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{choir.name}</h3>
                    <p className="text-xs text-sky-400 mt-0.5">Director: {choir.leadDirector}</p>
                    <p className="text-[11px] text-neutral-400">{choir.memberCount} Vocalists</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  {choir.description}
                </p>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 space-y-2 text-xs">
                  <p className="text-[11px] font-mono text-neutral-400">
                    <span className="text-violet-400 font-bold">Schedule:</span> {choir.rehearsalSchedule}
                  </p>
                  <div className="pt-2 border-t border-neutral-900">
                    <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1">Key Accolades:</p>
                    {choir.achievements.map((ach, aIdx) => (
                      <p key={aIdx} className="text-[11px] text-neutral-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        <span>{ach}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    const chSong = songs.find(s => choir.songIds.includes(s.id)) || songs[2];
                    playSong(chSong);
                  }}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Repertoire</span>
                </button>
                <span className="text-xs text-neutral-400">Auditions open seasonally</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PODCASTS VIEW */}
      {activeTab === 'podcasts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {podcasts.map((pod) => (
            <div
              key={pod.id}
              className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={pod.coverArt}
                    alt={pod.title}
                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-rose-500/30"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{pod.title}</h3>
                    <p className="text-xs text-rose-400 mt-0.5">Hosted by {pod.hostName}</p>
                    <p className="text-[11px] text-neutral-400">{pod.episodeCount} Episodes released</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  {pod.description}
                </p>

                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                  <p className="text-[10px] uppercase font-mono text-neutral-500 mb-1">Featured Episode:</p>
                  <p className="text-xs font-semibold text-white">{pod.latestEpisodeTitle}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    const sampleTrack = songs[1];
                    playSong({
                      ...sampleTrack,
                      title: pod.latestEpisodeTitle,
                      artistName: pod.title,
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Listen to Latest Episode</span>
                </button>
                <span className="text-[11px] text-neutral-400 font-mono">{pod.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
