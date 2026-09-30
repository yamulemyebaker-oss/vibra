/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { TalentVideo, VideoComment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  video: TalentVideo;
  onAddComment: (text: string) => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  isOpen,
  onClose,
  video,
  onAddComment,
}) => {
  const { currentUser, isGuest } = useAuth();
  const { showToast } = useNotification();
  const [commentText, setCommentText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (isGuest) {
      showToast('Please sign in as a student to join the conversation.', 'warning');
      return;
    }

    onAddComment(commentText.trim());
    setCommentText('');
    showToast('Comment posted! School community moderated.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col max-h-[80vh] h-[550px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">
              {video.commentsCount} Comments
            </span>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
              School Safe
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close comments"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* School Moderation Notice */}
        <div className="px-4 py-2 bg-neutral-950/60 border-b border-neutral-800/60 flex items-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Vibra is moderated to ensure positive peer encouragement and safety.</span>
        </div>

        {/* Comments List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {video.comments.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              <Sparkles className="w-6 h-6 text-neutral-600 mx-auto mb-2" />
              Be the first classmate to cheer on {video.studentName}!
            </div>
          ) : (
            video.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 group">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {comment.userName}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {comment.userGrade}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 mt-0.5 leading-relaxed break-words">
                    {comment.text}
                  </p>
                </div>
                <button 
                  className="p-1 text-neutral-500 hover:text-rose-400 transition-colors shrink-0"
                  aria-label="Like comment"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="My Avatar"
            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-violet-500/30"
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`Cheer on ${video.studentName}...`}
            className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white transition-all cursor-pointer shrink-0"
            aria-label="Send comment"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
