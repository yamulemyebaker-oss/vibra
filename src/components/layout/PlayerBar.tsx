/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart, 
  ListMusic, 
  Radio, 
  Users,
  Maximize2
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useNotification } from '../../context/NotificationContext';

export const PlayerBar: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    duration, 
    volume, 
    togglePlay, 
    nextSong, 
    prevSong, 
    seekTo, 
    setVolume, 
    queue,
    playSong,
    likeCurrentSong
  } = useAudioPlayer();

  const { showToast } = useNotification();
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  if (!currentSong) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekTo(Number(e.target.value));
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume || 0.7);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleLike = () => {
    likeCurrentSong();
    showToast(`Liked "${currentSong.title}"`, 'success');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Current Track Info */}
          <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3">
            <div className="relative group shrink-0">
              <img
                src={currentSong.coverArt}
                alt={currentSong.title}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover ring-1 ring-white/10 shadow-md"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center gap-0.5">
                  <span className="w-1 h-3 bg-violet-400 animate-bounce rounded-full" />
                  <span className="w-1 h-5 bg-violet-400 animate-bounce delay-75 rounded-full" />
                  <span className="w-1 h-2 bg-violet-400 animate-bounce delay-150 rounded-full" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs sm:text-sm font-semibold text-white truncate leading-tight">
                  {currentSong.title}
                </p>
                {currentSong.isSchoolChoir && (
                  <span className="hidden md:inline-flex text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    Choir
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                {currentSong.artistName}
              </p>
            </div>
            <button
              onClick={handleLike}
              className="text-neutral-500 hover:text-rose-500 transition-colors hidden sm:block p-1 cursor-pointer"
              title="Like this song"
              aria-label="Like song"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Player Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={prevSong}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Previous track"
                aria-label="Previous song"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10 cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current text-neutral-950" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-neutral-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={nextSong}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Next track"
                aria-label="Next song"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrubber slider */}
            <div className="w-full flex items-center gap-2 text-[10px] font-mono text-neutral-400">
              <span className="w-8 text-right">{formatTime(progress)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400"
                aria-label="Audio scrubber"
              />
              <span className="w-8">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Queue controls */}
          <div className="flex items-center justify-end gap-3 w-1/4 sm:w-1/3">
            <div className="hidden lg:flex items-center gap-2">
              <button 
                onClick={toggleMute}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setIsMuted(false);
                  setVolume(Number(e.target.value));
                }}
                className="w-16 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                aria-label="Volume slider"
              />
            </div>

            <button
              onClick={() => setShowQueueDrawer(!showQueueDrawer)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showQueueDrawer 
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Playing Queue"
              aria-label="Toggle queue"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Queue Drawer overlay */}
      {showQueueDrawer && (
        <div className="fixed bottom-20 right-4 sm:right-8 z-50 w-80 sm:w-96 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 shadow-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-xs text-white">Playback Queue</span>
              <span className="text-[10px] text-neutral-500 font-mono">({queue.length} songs)</span>
            </div>
            <button
              onClick={() => setShowQueueDrawer(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {queue.map((song, i) => {
              const isCurrent = song.id === currentSong.id;
              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song)}
                  className={`p-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer text-xs ${
                    isCurrent
                      ? 'bg-violet-600/20 text-violet-200 border border-violet-500/30'
                      : 'hover:bg-neutral-800/60 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono text-neutral-500 w-4 text-center">
                      {i + 1}
                    </span>
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-7 h-7 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${isCurrent ? 'text-violet-300' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">{song.artistName}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 shrink-0">
                    {formatTime(song.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
