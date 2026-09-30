/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Music, 
  Play, 
  Pause, 
  Calendar, 
  Trophy, 
  Users, 
  Radio, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Volume2, 
  MessageSquare,
  GraduationCap,
  Vote,
  Compass,
  Star
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Song, TalentItem, SchoolEvent, TalentCategory } from '../../types';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();
  const { showToast } = useNotification();
  const { currentUser, role, isGuest } = useAuth();

  const [selectedTalentCategory, setSelectedTalentCategory] = useState<string>('all');
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});

  const songs = storageService.getSongs();
  const talents = storageService.getTalents();
  const events = storageService.getEvents();
  const choirs = storageService.getChoirs();
  const podcasts = storageService.getPodcasts();
  const posts = storageService.getPosts();

  const filteredTalents = selectedTalentCategory === 'all' 
    ? talents 
    : talents.filter(t => t.category === selectedTalentCategory);

  const handleRegister = (eventId: string, title: string) => {
    if (isGuest) {
      showToast('Please sign in or join as a student to register for school events.', 'info');
      onOpenAuth('login');
      return;
    }
    const success = storageService.registerForEvent(eventId);
    if (success) {
      setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
      showToast(`Registered successfully for "${title}"!`, 'success');
    }
  };

  const handleLikeTalent = (t: TalentItem) => {
    storageService.toggleLikeTalent(t.id);
    showToast(`Applauded ${t.studentName}'s talent!`, 'success');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-950/70 via-neutral-900 to-neutral-950 border border-violet-800/20 p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 mb-6 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>St. Jude Creative Arts Academy · Official Talent Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Discover Talent. <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Create. Connect. Shine.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            The school digital stage for music, contemporary dance, poetry slams, digital arts, drama monologues, and choir harmonies. Perform, audition, vote, and grow together.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('talents')}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/30 flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <Compass className="w-4 h-4" />
              <span>Discover Talent</span>
            </button>
            <button
              onClick={() => onNavigate('music')}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Music className="w-4 h-4 text-violet-400" />
              <span>Explore Music</span>
            </button>
            <button
              onClick={() => onNavigate('events')}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Upcoming Events</span>
            </button>
          </div>

          {/* Key School Metrics */}
          <div className="mt-10 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">480+</p>
              <p className="text-neutral-400 text-[11px] mt-0.5">Active Student Creators</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-violet-400">120+</p>
              <p className="text-neutral-400 text-[11px] mt-0.5">Original Tracks & Choirs</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-amber-400">6</p>
              <p className="text-neutral-400 text-[11px] mt-0.5">Annual Competitions</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-sky-400">100%</p>
              <p className="text-neutral-400 text-[11px] mt-0.5">School Safe & Moderated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Competition Live Banner */}
      <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-violet-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                Voting Now Active
              </span>
              <span className="text-xs text-neutral-400 hidden sm:inline">April 18, 2026</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              Annual Inter-House Music Clash 2026
            </h3>
            <p className="text-xs text-neutral-300">
              Cast your vote for student band originals, vocal solos, and choir sets!
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('events')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Vote className="w-4 h-4" />
          <span>Enter Contest & Vote</span>
        </button>
      </section>

      {/* Trending Songs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Trending Music & Tracks</h2>
              <p className="text-xs text-neutral-400">Top played original compositions and school chorales</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('music')}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {songs.slice(0, 3).map((song) => {
            const isThisPlaying = isPlaying && currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                className="group relative p-3.5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <button
                      onClick={() => (isThisPlaying ? togglePlay() : playSong(song))}
                      className="absolute inset-0 bg-black/40 group-hover:bg-black/60 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Play song"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 text-white fill-current" />
                      ) : (
                        <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                      {song.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {song.artistName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500 font-mono">
                      <span>{song.genre}</span>
                      <span>·</span>
                      <span>{song.playsCount.toLocaleString()} plays</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    storageService.toggleLikeSong(song.id);
                    showToast(`Liked "${song.title}"`, 'success');
                  }}
                  className="p-2 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                  aria-label="Like track"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Talents Discovery Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Featured Student Talents</h2>
              <p className="text-xs text-neutral-400">Dance, poetry, theater drama, fine arts & creative code</p>
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {['all', 'dance', 'poetry', 'art', 'music'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTalentCategory(cat)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors whitespace-nowrap cursor-pointer ${
                  selectedTalentCategory === cat
                    ? 'bg-neutral-800 text-white font-medium border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTalents.slice(0, 4).map((talent) => (
            <div
              key={talent.id}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Student Author Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={talent.studentAvatar}
                      alt={talent.studentName}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-violet-500/30"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{talent.studentName}</p>
                      <p className="text-[10px] text-neutral-400">{talent.studentGrade}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium">
                    {talent.category}
                  </span>
                </div>

                {/* Media Preview & Title */}
                <div className="relative rounded-xl overflow-hidden aspect-video mb-3.5 bg-neutral-950">
                  <img
                    src={talent.mediaUrl}
                    alt={talent.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <p className="text-sm font-bold text-white drop-shadow-md">{talent.title}</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                  {talent.description}
                </p>

                {/* Skills tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {talent.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800/80 text-neutral-300 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Recognition & Applause */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-400/90 text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="truncate max-w-[200px]">{talent.schoolRecognition}</span>
                </div>
                <button
                  onClick={() => handleLikeTalent(talent)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-violet-600/20 text-neutral-300 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono">{talent.likesCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events & Auditions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Upcoming School Events & Auditions</h2>
              <p className="text-xs text-neutral-400">Join competitions, perform in concerts, and sign up for auditions</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <span>All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((evt) => {
            const isRegistered = registeredEvents[evt.id];
            return (
              <div
                key={evt.id}
                className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                      {evt.type}
                    </span>
                    <span className="text-[11px] text-neutral-400">{evt.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{evt.title}</h3>
                  <p className="text-[11px] text-neutral-400 mt-1">{evt.venue} · {evt.time}</p>

                  <p className="text-xs text-neutral-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {evt.registeredCount + (isRegistered ? 1 : 0)} / {evt.capacity || 50} spots
                  </span>
                  <button
                    onClick={() => handleRegister(evt.id, evt.title)}
                    disabled={isRegistered}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isRegistered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white hover:bg-neutral-200 text-neutral-950 shadow'
                    }`}
                  >
                    {isRegistered ? 'Registered ✓' : 'Register Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* School Choirs & Podcasts Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Choirs Box */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">School Choirs & Ensembles</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Auditioned vocal groups, contemporary a cappella, and chamber choirs representing St. Jude.
            </p>

            <div className="space-y-3">
              {choirs.map((ch) => (
                <div key={ch.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                  <img src={ch.coverArt} alt={ch.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{ch.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{ch.leadDirector} · {ch.memberCount} members</p>
                    <p className="text-[10px] text-violet-400 truncate mt-0.5">{ch.rehearsalSchedule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('music')}
            className="mt-4 w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-xs font-medium text-white transition-colors cursor-pointer text-center"
          >
            Explore All Choirs
          </button>
        </div>

        {/* Podcasts Box */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">Student Podcasts</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Behind the curtain conversations, tech + art tutorials, and backstage performer interviews.
            </p>

            <div className="space-y-3">
              {podcasts.map((pod) => (
                <div key={pod.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                  <img src={pod.coverArt} alt={pod.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{pod.title}</p>
                    <p className="text-[11px] text-neutral-400 truncate">Hosted by {pod.hostName}</p>
                    <p className="text-[10px] text-rose-300 truncate mt-0.5">{pod.latestEpisodeTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('music')}
            className="mt-4 w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-xs font-medium text-white transition-colors cursor-pointer text-center"
          >
            Listen to Podcasts
          </button>
        </div>
      </section>

      {/* Community Buzz Preview */}
      <section className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Latest Community Buzz</h2>
              <p className="text-xs text-neutral-400">Collaborations, audition calls, and creative announcements</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('community')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Join Discussion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {posts.slice(0, 3).map((post) => (
            <div key={post.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <img src={post.authorAvatar} alt={post.authorName} className="w-7 h-7 rounded-lg object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-white leading-tight">{post.authorName}</p>
                    <span className="text-[10px] text-neutral-400 font-mono">@{post.authorUsername}</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                  {post.content}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="text-[10px] font-mono text-violet-400">{post.categoryTag}</span>
                <span>{post.likesCount} likes · {post.commentsCount} comments</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
