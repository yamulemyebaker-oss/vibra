/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Send, 
  Plus, 
  Flag, 
  Sparkles, 
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { CommunityPost } from '../../types';

export const CommunityPage: React.FC = () => {
  const { currentUser, isAuthenticated, isGuest } = useAuth();
  const { showToast } = useNotification();
  
  const [posts, setPosts] = useState<CommunityPost[]>(() => storageService.getPosts());
  const [newContent, setNewContent] = useState('');
  const [categoryTag, setCategoryTag] = useState('Talent Update');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in to publish a community post.', 'warning');
      return;
    }
    if (!newContent.trim()) return;

    const created = storageService.createPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatarUrl,
      authorRole: currentUser.role,
      content: newContent.trim(),
      categoryTag,
      mediaUrl: mediaUrl.trim() || undefined,
      mediaType: mediaUrl.trim() ? 'image' : undefined,
      status: 'approved',
    });

    setPosts(storageService.getPosts());
    setNewContent('');
    setMediaUrl('');
    setShowNewPostForm(false);
    showToast('Your post has been published to the community!', 'success');
  };

  const handleLike = (post: CommunityPost) => {
    storageService.toggleLikePost(post.id);
    setPosts(storageService.getPosts());
  };

  const handleReport = (post: CommunityPost) => {
    storageService.createReport({
      reporterId: currentUser?.id || 'guest',
      targetType: 'post',
      targetId: post.id,
      reason: 'Flagged for teacher/moderator review regarding school content guidelines.',
    });
    showToast('Post reported to school patrons for moderation review.', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Community Buzz</h1>
          </div>
          <p className="text-xs text-neutral-400">
            Share creative updates, seek collaborators, and cheer on student performers.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        )}
      </div>

      {/* New Post Form Drawer */}
      {showNewPostForm && (
        <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3.5">
          <h3 className="text-sm font-bold text-white">Create a Community Post</h3>

          <textarea
            rows={3}
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What creative project, rehearsal, or audition are you working on?"
            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-neutral-400 mb-1 text-[11px]">Topic Category</label>
              <select
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
                className="w-full p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Talent Update">Talent Update</option>
                <option value="Collaboration Call">Collaboration Call</option>
                <option value="Music Release">Music Release</option>
                <option value="Audition Prep">Audition Prep</option>
                <option value="School Announcement">School Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 text-[11px]">Optional Image URL</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewPostForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow"
            >
              Publish Post
            </button>
          </div>
        </form>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-3.5"
          >
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-violet-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white">{post.authorName}</p>
                    <span className="text-[10px] font-mono text-neutral-500">@{post.authorUsername}</span>
                  </div>
                  <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded border border-violet-500/20">
                    {post.categoryTag}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleReport(post)}
                className="text-neutral-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                title="Report content to school moderator"
                aria-label="Report post"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {post.content}
            </p>

            {/* Media Attachment if present */}
            {post.mediaUrl && (
              <div className="rounded-xl overflow-hidden max-h-80 bg-neutral-950">
                <img src={post.mediaUrl} alt="Post attachment" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-1.5 p-1 transition-colors cursor-pointer ${
                    post.isLikedByCurrentUser ? 'text-rose-400 font-semibold' : 'hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} />
                  <span className="font-mono text-xs">{post.likesCount}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-neutral-500" />
                  <span className="font-mono text-xs">{post.commentsCount} comments</span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-neutral-500">
                School Community Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
