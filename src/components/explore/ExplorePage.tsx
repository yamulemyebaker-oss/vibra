/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Music, 
  Calendar, 
  Trophy, 
  Users, 
  Radio, 
  ArrowRight,
  Play
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { TalentCategory } from '../../types';

interface ExplorePageProps {
  onSelectVideoFeed: (category?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onSelectVideoFeed,
  onNavigateTab,
}) => {
  const songs = storageService.getSongs();
  const talents = storageService.getTalents();
  const events = storageService.getEvents();
  const choirs = storageService.getChoirs();
  const { playSong } = useAudioPlayer();

  const talentCategories: { id: TalentCategory; label: string; count: number; image: string }[] = [
    { 
      id: 'music', 
      label: 'Music & Vocals', 
      count: 24, 
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80' 
    },
    { 
      id: 'dance', 
      label: 'Dance & Choreography', 
      count: 18, 
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80' 
    },
    { 
      id: 'coding', 
      label: 'Creative Coding & Shaders', 
      count: 12, 
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80' 
    },
    { 
      id: 'poetry', 
      label: 'Poetry & Spoken Word', 
      count: 15, 
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80' 
    },
    { 
      id: 'choir', 
      label: 'School Choirs & Ensembles', 
      count: 6, 
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80' 
    },
    { 
      id: 'art', 
      label: 'Fine & Digital Art', 
      count: 20, 
      image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&auto=format&fit=crop&q=80' 
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 px-4 pb-20">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-violet-400" />
          <h1 className="text-2xl font-black text-white tracking-tight">Explore Vibra Hub</h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400">
          Discover student talents across categories, active school competitions, and choir harmonies.
        </p>
      </div>

      {/* Talent Categories Grid */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-400 font-semibold">
          Browse by Talent Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {talentCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectVideoFeed(cat.id)}
              className="group relative h-36 rounded-2xl overflow-hidden border border-neutral-800 text-left transition-all hover:border-violet-500 hover:scale-102 cursor-pointer shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-bold text-sm text-white drop-shadow leading-snug">
                  {cat.label}
                </p>
                <p className="text-[10px] text-violet-300 font-mono mt-0.5">
                  {cat.count} student clips
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Active Competitions Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              School Tournaments & Competitions
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('events')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                    {evt.type}
                  </span>
                  <span className="text-xs text-neutral-400">{evt.date}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{evt.title}</h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{evt.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">{evt.venue}</span>
                <button
                  onClick={() => onNavigateTab('events')}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  View Details & Vote →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* School Choirs Showcase */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            Featured School Choirs
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {choirs.map((choir) => (
            <div
              key={choir.id}
              className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-4"
            >
              <img
                src={choir.coverArt}
                alt={choir.name}
                className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">{choir.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5 truncate">Director: {choir.leadDirector}</p>
                <p className="text-[11px] text-violet-400 font-mono mt-1">{choir.memberCount} Vocalists · {choir.rehearsalSchedule}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
