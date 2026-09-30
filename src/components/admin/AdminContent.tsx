/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Video, 
  Music, 
  FileText, 
  MessageSquare, 
  User as UserIcon, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  ExternalLink,
  ShieldCheck,
  Search,
  Check,
  X,
  Eye,
  Flag
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { TalentVideo, Song, CommunityPost, User, SchoolEvent } from '../../types';

export const AdminContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'videos' | 'music' | 'posts' | 'comments' | 'profiles' | 'events'>('videos');
  const [searchQuery, setSearchQuery] = useState('');

  const [videos, setVideos] = useState<TalentVideo[]>(() => storageService.getVideos());
  const [songs, setSongs] = useState<Song[]>(() => storageService.getSongs());
  const [posts, setPosts] = useState<CommunityPost[]>(() => storageService.getPosts());
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [events, setEvents] = useState<SchoolEvent[]>(() => storageService.getEvents());

  // Quick video preview modal
  const [previewVideo, setPreviewVideo] = useState<TalentVideo | null>(null);

  // Extract all comments across videos
  const allComments = videos.flatMap((v) =>
    (v.comments || []).map((c) => ({
      ...c,
      videoTitle: v.title,
      videoId: v.id,
    }))
  );

  const handleDeleteVideo = (video: TalentVideo) => {
    if (!window.confirm(`Are you sure you want to delete "${video.title}" by ${video.studentName}?`)) return;
    const ok = storageService.deleteVideo(video.id, currentUser);
    if (ok) {
      setVideos(storageService.getVideos());
      showToast(`Video "${video.title}" removed. Action logged.`, 'info');
    }
  };

  const handleDeleteSong = (song: Song) => {
    if (!window.confirm(`Delete song "${song.title}" from catalog?`)) return;
    const ok = storageService.deleteSong(song.id, currentUser);
    if (ok) {
      setSongs(storageService.getSongs());
      showToast(`Song "${song.title}" deleted. Action logged.`, 'info');
    }
  };

  const handleDeletePost = (post: CommunityPost) => {
    if (!window.confirm(`Remove community post by ${post.authorName}?`)) return;
    const ok = storageService.deletePost(post.id, currentUser);
    if (ok) {
      setPosts(storageService.getPosts());
      showToast('Community post removed. Action logged.', 'info');
    }
  };

  const handleDeleteComment = (videoId: string, commentId: string) => {
    if (!window.confirm('Delete this peer comment?')) return;
    const updatedVideos = storageService.getVideos().map((v) => {
      if (v.id === videoId) {
        return {
          ...v,
          comments: v.comments.filter((c) => c.id !== commentId),
          commentsCount: Math.max(0, v.commentsCount - 1),
        };
      }
      return v;
    });

    localStorage.setItem('vibra_videos', JSON.stringify(updatedVideos));
    setVideos(updatedVideos);

    if (currentUser) {
      storageService.addAuditLog(
        'COMMENT_DELETE',
        `Comment: #${commentId} on ${videoId}`,
        'warning',
        'Inappropriate peer comment removed by administrator',
        currentUser
      );
    }
    showToast('Comment removed from video reel.', 'info');
  };

  const handleToggleUserSuspension = (user: User) => {
    const updated = storageService.toggleUserStatus(user.id, currentUser);
    if (updated) {
      setUsers(storageService.getUsers());
      showToast(`User ${user.name} status updated to ${updated.status?.toUpperCase()}.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-violet-400" />
            <span>Content Moderation Suite</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review, approve, and moderate Videos, Music, Posts, Comments, Profiles, and Events
          </p>
        </div>

        {/* 6 Tabs for Videos, Music, Posts, Comments, Profiles, Events */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs">
          {[
            { id: 'videos', label: 'Videos', count: videos.length },
            { id: 'music', label: 'Music', count: songs.length },
            { id: 'posts', label: 'Posts', count: posts.length },
            { id: 'comments', label: 'Comments', count: allComments.length },
            { id: 'profiles', label: 'Profiles', count: users.length },
            { id: 'events', label: 'Events', count: events.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === tab.id ? 'bg-violet-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* 1. VIDEOS */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos
            .filter((v) => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((video) => (
              <div
                key={video.id}
                className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-3"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-950">
                  <img src={video.posterUrl} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-violet-300 border border-white/10 uppercase font-bold">
                    #{video.category}
                  </div>
                  <button
                    onClick={() => setPreviewVideo(video)}
                    className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <Play className="w-8 h-8 fill-current ml-0.5" />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white truncate">{video.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">By {video.studentName} · {video.studentGrade}</p>
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-2">{video.caption}</p>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {video.likesCount} Likes · {video.commentsCount} Comments
                  </span>
                  <button
                    onClick={() => handleDeleteVideo(video)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                    title="Remove Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 2. MUSIC */}
      {activeTab === 'music' && (
        <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 overflow-hidden divide-y divide-neutral-800/80 text-xs">
          {songs
            .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artistName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((song) => (
              <div key={song.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-850/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={song.coverArt} alt={song.title} className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{song.title}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{song.artistName} · {song.genre}</p>
                    <span className="text-[10px] font-mono text-neutral-500">{song.playsCount} plays · {song.likesCount} likes</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSong(song)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove Song"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* 3. POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          {posts
            .filter((p) => p.content.toLowerCase().includes(searchQuery.toLowerCase()) || p.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((post) => (
              <div key={post.id} className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <img src={post.authorAvatar} alt={post.authorName} className="w-7 h-7 rounded-full object-cover" />
                    <span className="font-bold text-white text-xs">{post.authorName}</span>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.2 rounded">
                      {post.categoryTag}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">{post.content}</p>
                </div>

                <button
                  onClick={() => handleDeletePost(post)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                  title="Remove Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* 4. COMMENTS */}
      {activeTab === 'comments' && (
        <div className="space-y-3">
          {allComments
            .filter((c) => c.text.toLowerCase().includes(searchQuery.toLowerCase()) || c.userName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((comment) => (
              <div key={comment.id} className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <img src={comment.userAvatar} alt={comment.userName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-bold text-white text-xs">{comment.userName}</span>
                    <span className="text-[10px] font-mono text-neutral-500">on "{comment.videoTitle}"</span>
                  </div>
                  <p className="text-xs text-neutral-200">{comment.text}</p>
                </div>

                <button
                  onClick={() => handleDeleteComment(comment.videoId, comment.id)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                  title="Remove Inappropriate Comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* 5. PROFILES */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users
            .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((user) => {
              const isSuspended = user.status === 'suspended';
              return (
                <div key={user.id} className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-xs truncate">{user.name}</p>
                      <p className="text-[10px] font-mono text-neutral-400">@{user.username} · {user.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-2">{user.bio || 'Student creator'}</p>
                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className={`text-[10px] font-mono uppercase font-bold ${isSuspended ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isSuspended ? 'Suspended' : 'Good Standing'}
                    </span>
                    <button
                      onClick={() => handleToggleUserSuspension(user)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200"
                    >
                      {isSuspended ? 'Unsuspend' : 'Flag / Suspend'}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 6. EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          {events
            .filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((event) => (
              <div key={event.id} className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={event.coverImage} alt={event.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">{event.type}</span>
                    <p className="font-bold text-white text-xs truncate">{event.title}</p>
                    <p className="text-[11px] text-neutral-400">{event.date} · {event.venue}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                  {event.status}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 relative">
            <video
              src={previewVideo.videoUrl}
              poster={previewVideo.posterUrl}
              controls
              autoPlay
              className="w-full aspect-[9/16] object-cover"
            />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-xs">{previewVideo.title}</p>
                <p className="text-[11px] text-neutral-400">{previewVideo.studentName}</p>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
