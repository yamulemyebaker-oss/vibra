/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Music, 
  Trophy, 
  Sparkles, 
  Disc3,
  Calendar,
  Award
} from 'lucide-react';
import { TalentVideo } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { CommentDrawer } from './CommentDrawer';
import { storageService } from '../../services/storageService';

interface VideoCardProps {
  video: TalentVideo;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  isMuted,
  onToggleMute,
  onNavigateTab,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { currentUser, isGuest } = useAuth();
  const { showToast } = useNotification();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showPlayIcon, setShowPlayIcon] = useState<boolean>(false);
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(!!video.isLiked);
  const [likesCount, setLikesCount] = useState<number>(video.likesCount);
  const [isSaved, setIsSaved] = useState<boolean>(!!video.isSaved);
  const [savesCount, setSavesCount] = useState<number>(video.savesCount);
  const [isFollowing, setIsFollowing] = useState<boolean>(!!video.isFollowing);
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const [currentVideoData, setCurrentVideoData] = useState<TalentVideo>(video);
  const [progress, setProgress] = useState<number>(0);
  const [isExpandedCaption, setIsExpandedCaption] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Sync video play/pause with active feed index
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      vid.muted = isMuted;
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay might need user interaction or remain muted
            vid.muted = true;
            vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          });
      }
    } else {
      vid.pause();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isActive]);

  // Handle mute changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Track playback time
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  // Toggle video play / pause on click
  const handleVideoClick = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play();
      setIsPlaying(true);
    }
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 600);
  };

  // Double tap to like
  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      handleLike();
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleLike = () => {
    const updated = storageService.toggleLikeVideo(video.id);
    if (updated) {
      setIsLiked(!!updated.isLiked);
      setLikesCount(updated.likesCount);
      if (updated.isLiked) {
        showToast(`Applauded ${video.studentName}'s talent!`, 'success');
      }
    }
  };

  const handleSave = () => {
    const updated = storageService.toggleSaveVideo(video.id);
    if (updated) {
      setIsSaved(!!updated.isSaved);
      setSavesCount(updated.savesCount);
      showToast(updated.isSaved ? 'Saved to your talent favorites!' : 'Removed from saved', 'info');
    }
  };

  const handleFollow = () => {
    if (isGuest) {
      showToast('Please sign in to follow students.', 'warning');
      return;
    }
    const followed = storageService.toggleFollowVideoCreator(video.studentUsername);
    setIsFollowing(followed);
    showToast(followed ? `Following ${video.studentName}` : `Unfollowed ${video.studentName}`, 'info');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#video-${video.id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('School talent link copied to clipboard!', 'success');
  };

  const handleAddComment = (text: string) => {
    const newComment = storageService.addCommentToVideo(video.id, {
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Classmate',
      userAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      userGrade: currentUser?.grade || 'Student',
      text,
    });
    if (newComment) {
      setCurrentVideoData(prev => ({
        ...prev,
        commentsCount: prev.commentsCount + 1,
        comments: [newComment, ...prev.comments],
      }));
    }
  };

  const handleQuickVote = () => {
    if (isGuest) {
      showToast('Only verified students can vote in official competitions.', 'warning');
      return;
    }
    if (hasVoted) {
      showToast('You have already cast your vote for this competition!', 'error');
      return;
    }
    setHasVoted(true);
    showToast(`Official vote cast for ${video.studentName} in "${video.competitionTag}"! 🏆`, 'success');
  };

  return (
    <div className="snap-start snap-always w-full flex justify-center py-2 h-[calc(100vh-5rem)] md:h-[calc(100vh-2rem)] select-none">
      <div className="relative w-full max-w-[420px] sm:max-w-[460px] h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-2xl flex flex-col justify-between group">
        
        {/* Main Background Video */}
        <div 
          className="absolute inset-0 z-0 bg-neutral-950 flex items-center justify-center cursor-pointer"
          onClick={handleVideoClick}
          onDoubleClick={handleDoubleTap}
        >
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.posterUrl}
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover"
          />

          {/* Fallback ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40 pointer-events-none" />

          {/* Play / Pause Animated Icon Overlay */}
          {showPlayIcon && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/20">
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </div>
            </div>
          )}

          {/* Heart Burst Double Tap Animation */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
              <Heart className="w-24 h-24 text-rose-500 fill-current drop-shadow-2xl" />
            </div>
          )}
        </div>

        {/* TOP OVERLAY BAR: Vibra Event Badge & Mute Toggle */}
        <div className="relative z-20 p-4 pt-3.5 flex items-center justify-between pointer-events-auto">
          {/* Competition or Audition Badge */}
          {video.competitionTag ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-medium shadow-lg">
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[200px]">{video.competitionTag}</span>
            </div>
          ) : video.auditionTag ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-500/40 text-sky-300 text-[11px] font-medium shadow-lg">
              <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate max-w-[200px]">{video.auditionTag}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-neutral-300 font-mono">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>St. Jude Showcase</span>
            </div>
          )}

          {/* Sound Mute/Unmute Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/70 hover:scale-105 transition-all shadow-lg cursor-pointer"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-neutral-300" />
            ) : (
              <Volume2 className="w-4 h-4 text-violet-400" />
            )}
          </button>
        </div>

        {/* BOTTOM METADATA & SIDE ACTION BAR */}
        <div className="relative z-20 p-4 pb-2 flex items-end justify-between gap-3 pointer-events-auto">
          {/* LEFT: Student/Creator Info, Caption, Audio Info */}
          <div className="flex-1 min-w-0 space-y-2 text-white">
            
            {/* Student Identity Header */}
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm tracking-tight hover:underline cursor-pointer">
                {video.studentName}
              </span>
              <span className="text-[11px] font-mono text-neutral-300 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/15">
                {video.studentGrade}
              </span>
            </div>

            {/* School & Talent Category Pill */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-300">
              <span className="text-neutral-400">@{video.studentUsername}</span>
              <span>·</span>
              <span className="capitalize font-mono font-medium text-violet-300 bg-violet-600/30 px-2 py-0.5 rounded-full border border-violet-500/30">
                #{video.category}
              </span>
            </div>

            {/* Caption */}
            <div className="text-xs text-neutral-200 leading-snug">
              <p className={isExpandedCaption ? '' : 'line-clamp-2'}>
                {video.caption}
              </p>
              {video.caption.length > 80 && (
                <button
                  onClick={() => setIsExpandedCaption(!isExpandedCaption)}
                  className="text-[11px] font-semibold text-neutral-400 hover:text-white mt-0.5"
                >
                  {isExpandedCaption ? 'less' : 'more'}
                </button>
              )}
            </div>

            {/* School Tags */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {video.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[11px] font-mono text-neutral-300 hover:text-white cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Marquee Music / Audio Info */}
            <div className="flex items-center gap-2 pt-1.5 text-xs text-neutral-300">
              <Music className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <div className="overflow-hidden whitespace-nowrap w-48 sm:w-60">
                <p className="inline-block animate-marquee font-mono text-[11px]">
                  ♫ {video.audioTitle} — {video.audioArtist}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: ActionBar (Like, Comment, Share, Save, Vote) */}
          <div className="flex flex-col items-center gap-3.5 pb-2">
            
            {/* Creator Profile Avatar + Follow Badge */}
            <div className="relative mb-1">
              <img
                src={video.studentAvatar}
                alt={video.studentName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-500 shadow-lg"
              />
              <button
                onClick={handleFollow}
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white transition-all shadow-md cursor-pointer ${
                  isFollowing ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600 hover:scale-110'
                }`}
                title={isFollowing ? 'Following' : 'Follow Student'}
                aria-label="Follow creator"
              >
                {isFollowing ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 stroke-[3]" />}
              </button>
            </div>

            {/* Like / Heart Action */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleLike}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-rose-500/20 text-rose-500 scale-110 shadow-lg shadow-rose-500/20'
                    : 'bg-black/50 text-white hover:bg-black/70 hover:scale-105'
                } backdrop-blur-md border border-white/10`}
                aria-label="Like video"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-[11px] font-mono text-white font-semibold mt-1">
                {likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
              </span>
            </div>

            {/* Comment Action */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsCommentOpen(true)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70 hover:scale-105 transition-all cursor-pointer shadow-lg"
                aria-label="Open comments"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-mono text-white font-semibold mt-1">
                {currentVideoData.commentsCount}
              </span>
            </div>

            {/* Save / Bookmark Action */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleSave}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-amber-500/20 text-amber-400 scale-110'
                    : 'bg-black/50 text-white hover:bg-black/70 hover:scale-105'
                } backdrop-blur-md border border-white/10 shadow-lg`}
                aria-label="Bookmark video"
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <span className="text-[11px] font-mono text-white font-semibold mt-1">
                {savesCount}
              </span>
            </div>

            {/* Share Action */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70 hover:scale-105 transition-all cursor-pointer shadow-lg"
                aria-label="Share video"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-mono text-white font-semibold mt-1">
                {video.sharesCount}
              </span>
            </div>

            {/* Competition Vote Ballot Button (If registered competition video) */}
            {video.competitionTag && (
              <div className="flex flex-col items-center mt-1">
                <button
                  onClick={handleQuickVote}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                    hasVoted
                      ? 'bg-emerald-500 text-neutral-950 font-bold ring-2 ring-emerald-400'
                      : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 hover:scale-110 animate-bounce'
                  }`}
                  title={hasVoted ? 'Voted' : 'Vote for Contest Entry'}
                  aria-label="Vote for competition entry"
                >
                  <Trophy className="w-5 h-5" />
                </button>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 mt-1">
                  {hasVoted ? 'Voted' : 'Vote'}
                </span>
              </div>
            )}

            {/* Spinning Vinyl Record Disc Graphic */}
            <div className={`w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-lg mt-1 ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <Disc3 className="w-6 h-6 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Video Scrubber Timeline Progress Bar */}
        <div className="relative z-30 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-violet-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Slide-out Comments Drawer */}
      <CommentDrawer
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        video={currentVideoData}
        onAddComment={handleAddComment}
      />
    </div>
  );
};
