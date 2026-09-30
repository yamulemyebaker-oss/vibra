/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Flame, 
  Users, 
  Trophy, 
  Filter,
  GraduationCap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { TalentVideo, TalentCategory } from '../../types';
import { storageService } from '../../services/storageService';
import { VideoCard } from './VideoCard';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface VideoFeedProps {
  feedType?: 'for-you' | 'following';
  selectedCategory?: string;
  onNavigateTab: (tab: string) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  feedType = 'for-you',
  selectedCategory = 'all',
  onNavigateTab,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videos, setVideos] = useState<TalentVideo[]>(() => storageService.getVideos());
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true); // browser friendly default
  const [activeTabFilter, setActiveTabFilter] = useState<'for-you' | 'following'>('for-you');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const { isGuest } = useAuth();
  const { showToast } = useNotification();

  // Listen for storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setVideos(storageService.getVideos());
    };
    window.addEventListener('vibra_storage_updated', handleUpdate);
    return () => window.removeEventListener('vibra_storage_updated', handleUpdate);
  }, []);

  // Filter videos
  const displayedVideos = videos.filter((v) => {
    if (activeTabFilter === 'following' && !v.isFollowing) {
      return false;
    }
    if (categoryFilter !== 'all' && v.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  // Handle scroll detection to activate whichever video is in view
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    if (itemHeight === 0) return;

    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0 && index < displayedVideos.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Keyboard navigation: ArrowUp, ArrowDown, Space, M
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, displayedVideos.length]);

  const scrollToIndex = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(displayedVideos.length - 1, idx));
    const targetY = clamped * container.clientHeight;
    container.scrollTo({ top: targetY, behavior: 'smooth' });
    setActiveIndex(clamped);
  };

  const categories = [
    { id: 'all', label: 'All Talents' },
    { id: 'music', label: 'Music' },
    { id: 'dance', label: 'Dance' },
    { id: 'coding', label: 'Coding' },
    { id: 'poetry', label: 'Poetry' },
    { id: 'choir', label: 'Choirs' },
    { id: 'art', label: 'Art' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-screen flex flex-col items-center overflow-hidden bg-neutral-950">
      
      {/* Top Header Filter Bar: "Following" | "For You" + Category Pills */}
      <div className="absolute top-2 z-30 flex flex-col items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-4 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-xl">
          <button
            onClick={() => {
              if (isGuest) {
                showToast('Sign in as a student to see student creators you follow.', 'info');
              }
              setActiveTabFilter('following');
              setActiveIndex(0);
            }}
            className={`text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'following'
                ? 'text-white border-b-2 border-violet-500 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Following
          </button>

          <span className="text-neutral-700">|</span>

          <button
            onClick={() => {
              setActiveTabFilter('for-you');
              setActiveIndex(0);
            }}
            className={`text-xs font-bold transition-all cursor-pointer ${
              activeTabFilter === 'for-you'
                ? 'text-white border-b-2 border-violet-500 pb-0.5'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            School Feed
          </button>
        </div>

        {/* Horizontal Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[90vw] sm:max-w-md no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategoryFilter(c.id);
                setActiveIndex(0);
                if (containerRef.current) {
                  containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === c.id
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 border border-violet-400/30'
                  : 'bg-black/50 backdrop-blur-sm text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Snap Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar pt-12 pb-16 md:pb-4"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {displayedVideos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
            <Sparkles className="w-10 h-10 text-neutral-600 mb-3" />
            <h3 className="text-base font-bold text-white">No talent videos in this view</h3>
            <p className="text-xs text-neutral-500 max-w-sm mt-1">
              {activeTabFilter === 'following'
                ? 'You are not following any student creators yet. Switch to "School Feed" to discover peers!'
                : 'No videos found in this category. Be the first student to upload!'}
            </p>
            <button
              onClick={() => {
                setActiveTabFilter('for-you');
                setCategoryFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedVideos.map((video, idx) => (
            <VideoCard
              key={video.id}
              video={video}
              isActive={idx === activeIndex}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              onNavigateTab={onNavigateTab}
            />
          ))
        )}
      </div>

      {/* Floating Desktop Navigation Controls (Up / Down Buttons) */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
        <button
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex <= 0}
          className="w-11 h-11 rounded-full bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-30 border border-neutral-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105"
          title="Previous video (ArrowUp)"
          aria-label="Previous video"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <div className="text-center font-mono text-[10px] text-neutral-500 py-1">
          {displayedVideos.length > 0 ? `${activeIndex + 1}/${displayedVideos.length}` : '0/0'}
        </div>

        <button
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex >= displayedVideos.length - 1}
          className="w-11 h-11 rounded-full bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-30 border border-neutral-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105"
          title="Next video (ArrowDown)"
          aria-label="Next video"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
