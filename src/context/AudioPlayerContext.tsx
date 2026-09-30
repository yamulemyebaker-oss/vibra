/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Song } from '../types';
import { INITIAL_SONGS } from '../db/initialData';
import { audioSynth } from '../services/audioEngine';
import { storageService } from '../services/storageService';

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0 to 1
  queue: Song[];
  isExpanded: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleExpand: () => void;
  addToQueue: (song: Song) => void;
  likeCurrentSong: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<Song[]>(INITIAL_SONGS);
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.75);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Play progress interval
  useEffect(() => {
    if (isPlaying && currentSong) {
      audioSynth.startSynthTrack(currentSong.audioToneType || 'synth-acoustic');
      timerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentSong.duration) {
            nextSong();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      audioSynth.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      audioSynth.stop();
    };
  }, [isPlaying, currentSong]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setProgress(0);
    setIsPlaying(true);
    storageService.incrementPlays(song.id);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const resumeSong = () => {
    if (currentSong) {
      setIsPlaying(true);
    } else if (queue.length > 0) {
      playSong(queue[0]);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const nextSong = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playSong(queue[nextIndex]);
  };

  const prevSong = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playSong(queue[prevIndex]);
  };

  const seekTo = (seconds: number) => {
    if (!currentSong) return;
    const clamped = Math.max(0, Math.min(seconds, currentSong.duration));
    setProgress(clamped);
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    audioSynth.setVolume(val);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const addToQueue = (song: Song) => {
    setQueue((prev) => [...prev, song]);
  };

  const likeCurrentSong = () => {
    if (!currentSong) return;
    const updated = storageService.toggleLikeSong(currentSong.id);
    if (updated) {
      setCurrentSong({ ...currentSong, likesCount: updated.likesCount });
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration: currentSong?.duration || 0,
        volume,
        queue,
        isExpanded,
        playSong,
        pauseSong,
        resumeSong,
        togglePlay,
        nextSong,
        prevSong,
        seekTo,
        setVolume,
        toggleExpand,
        addToQueue,
        likeCurrentSong,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
