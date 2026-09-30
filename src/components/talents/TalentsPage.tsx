/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Eye, 
  Star, 
  Search, 
  Award, 
  Plus, 
  GraduationCap,
  Filter
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { TalentCategory, TalentItem } from '../../types';

export const TalentsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useNotification();
  const { isAuthenticated, isGuest } = useAuth();

  const talents = storageService.getTalents();

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'dance', label: 'Dance & Choreography' },
    { id: 'poetry', label: 'Poetry & Spoken Word' },
    { id: 'art', label: 'Fine & Digital Art' },
    { id: 'coding', label: 'Creative Coding' },
    { id: 'music', label: 'Music & Vocals' },
    { id: 'drama', label: 'Theater & Drama' },
  ];

  const filteredTalents = talents.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesQuery = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleLike = (t: TalentItem) => {
    storageService.toggleLikeTalent(t.id);
    showToast(`Applauded ${t.title}!`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Discover School Talents</h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Explore peer achievements in performing arts, digital crafts, literature, and technology.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search talents, skills, students..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-violet-600 text-white font-medium shadow-md shadow-violet-600/20'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-850 border border-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Talents Grid */}
      {filteredTalents.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-8">
          <Sparkles className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-white">No talents found</p>
          <p className="text-xs text-neutral-400 mt-1">Try switching categories or clearing search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTalents.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
            >
              <div>
                {/* Creator Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.studentAvatar}
                      alt={item.studentName}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-violet-500/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{item.studentName}</p>
                      <p className="text-[11px] text-neutral-400">{item.studentGrade}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold">
                    {item.category}
                  </span>
                </div>

                {/* Media Artwork */}
                <div className="relative rounded-xl overflow-hidden aspect-video mb-3.5 bg-neutral-950">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-bold text-white drop-shadow-md">{item.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Skills & Experience */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-neutral-400 font-mono mr-1">
                    {item.yearsExperience} yrs exp ·
                  </span>
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements & Recognition Bar */}
              <div className="mt-4 pt-3.5 border-t border-neutral-800 flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.schoolRecognition}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.viewsCount} views</span>
                  </span>
                  <button
                    onClick={() => handleLike(item)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">{item.likesCount} Applause</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
