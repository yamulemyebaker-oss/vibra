/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Video, 
  Search, 
  Trash2, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Filter, 
  ShieldCheck, 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2,
  X
} from 'lucide-react';
import { TalentVideo } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const AdminVideos: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [videos, setVideos] = useState<TalentVideo[]>(() => storageService.getVideos());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewVideo, setPreviewVideo] = useState<TalentVideo | null>(null);
  const [deleteModalVideo, setDeleteModalVideo] = useState<TalentVideo | null>(null);
  const [deleteReason, setDeleteReason] = useState('Violates St. Jude school performance guidelines');

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteModalVideo) return;

    const ok = storageService.deleteVideo(deleteModalVideo.id, currentUser);
    if (ok) {
      setVideos(storageService.getVideos());
      showToast(`Video "${deleteModalVideo.title}" removed. Reason logged.`, 'info');
      setDeleteModalVideo(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Video className="w-6 h-6 text-rose-400" />
            <span>Talent Videos & Reels Moderation</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Supervise vertical student video reels, audio sync, and peer comment threads
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
            {videos.length} Published Videos
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Total Reel Views</p>
          <p className="text-2xl font-black text-white mt-0.5">24.8k</p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Total Peer Likes</p>
          <p className="text-2xl font-black text-rose-400 mt-0.5">
            {videos.reduce((acc, v) => acc + (v.likesCount || 0), 0)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Total Comments</p>
          <p className="text-2xl font-black text-sky-400 mt-0.5">
            {videos.reduce((acc, v) => acc + (v.commentsCount || 0), 0)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <p className="text-[11px] font-mono text-neutral-400">Content Safety Rate</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">99.4%</p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search video title, creator, or #tags..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Talent Categories</option>
            <option value="music">Music & Vocals</option>
            <option value="dance">Contemporary Dance</option>
            <option value="poetry">Poetry & Monologue</option>
            <option value="coding">Creative Tech</option>
            <option value="art">Visual Arts</option>
            <option value="choir">Choirs & Chorales</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="rounded-3xl bg-neutral-900/60 border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between shadow-lg"
          >
            <div className="relative aspect-[9/10] bg-neutral-950 overflow-hidden group">
              <img
                src={video.posterUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Category pill */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-violet-300 border border-white/10 uppercase font-bold">
                #{video.category}
              </div>

              {/* Audio badge */}
              <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-[11px] text-white flex items-center justify-between border border-white/10">
                <span className="truncate max-w-[180px]">♫ {video.audioTitle}</span>
                <span className="text-[10px] text-neutral-400 font-mono">{video.audioArtist}</span>
              </div>

              {/* Play preview overlay */}
              <button
                onClick={() => setPreviewVideo(video)}
                className="absolute inset-0 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Preview Video Reel"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </button>
            </div>

            <div className="p-4 space-y-2.5">
              <div>
                <h3 className="font-bold text-white text-sm truncate">{video.title}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  By {video.studentName} · {video.studentGrade}
                </p>
                <p className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                  {video.caption}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {video.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Engagement metrics */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-neutral-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1 text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" /> {video.likesCount}
                  </span>
                  <span className="flex items-center gap-1 text-sky-400">
                    <MessageSquare className="w-3.5 h-3.5" /> {video.commentsCount}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Bookmark className="w-3.5 h-3.5" /> {video.savesCount}
                  </span>
                </div>

                <button
                  onClick={() => setDeleteModalVideo(video)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                  title="Remove Video Reel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 relative shadow-2xl">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <video
              src={previewVideo.videoUrl}
              poster={previewVideo.posterUrl}
              controls
              autoPlay
              className="w-full aspect-[9/16] object-cover"
            />

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{previewVideo.title}</h4>
                  <p className="text-xs text-neutral-400">{previewVideo.studentName} · @{previewVideo.studentUsername}</p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  {previewVideo.category}
                </span>
              </div>
              <p className="text-xs text-neutral-300">{previewVideo.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setDeleteModalVideo(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Remove Video Reel</h3>
                <p className="text-xs text-neutral-400">This action will be recorded in the audit trail.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 mb-4">
              Are you sure you want to remove <strong className="text-white">"{deleteModalVideo.title}"</strong> by {deleteModalVideo.studentName}?
            </p>

            <form onSubmit={handleDeleteVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Administrative Removal Reason</label>
                <input
                  type="text"
                  required
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalVideo(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow"
                >
                  Confirm Removal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
