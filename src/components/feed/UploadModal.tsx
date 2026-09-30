/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Sparkles, 
  Music, 
  Trophy, 
  Check, 
  GraduationCap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { storageService } from '../../services/storageService';
import { TalentCategory } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

const SAMPLE_CLIPS = [
  {
    name: 'Acoustic Guitar / Vocals',
    category: 'music' as TalentCategory,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-playing-an-acoustic-guitar-at-home-43224-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    audioTitle: 'Original Acoustic Melody',
  },
  {
    name: 'Contemporary Dance Solo',
    category: 'dance' as TalentCategory,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-in-a-dance-studio-41132-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    audioTitle: 'Rhythmic Studio Dance Beat',
  },
  {
    name: 'Creative Coding & Tech',
    category: 'coding' as TalentCategory,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41147-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    audioTitle: 'Cyber Synth Beats',
  },
  {
    name: 'Stage Poetry / Monologue',
    category: 'poetry' as TalentCategory,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-performing-a-monologue-on-stage-43572-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    audioTitle: 'Echoes in the Theatre',
  },
  {
    name: 'Choir Repertoire Harmony',
    category: 'choir' as TalentCategory,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-choir-singing-together-42845-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    audioTitle: 'Chamber Choral Harmony',
  },
  {
    name: 'Digital Art & Speedpaint',
    category: 'art' as TalentCategory,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-artist-painting-on-a-digital-tablet-41223-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&auto=format&fit=crop&q=80',
    audioTitle: 'Canvas Lo-Fi Loops',
  }
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploaded,
}) => {
  const { currentUser, isGuest } = useAuth();
  const { showToast } = useNotification();

  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TalentCategory>('music');
  const [caption, setCaption] = useState('');
  const [competitionTag, setCompetitionTag] = useState('');
  const [audioTitle, setAudioTitle] = useState('');

  if (!isOpen) return null;

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    setCategory(SAMPLE_CLIPS[idx].category);
    setAudioTitle(SAMPLE_CLIPS[idx].audioTitle);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) {
      showToast('Please provide a title and caption for your talent video.', 'warning');
      return;
    }

    const sample = SAMPLE_CLIPS[selectedSampleIndex];

    storageService.addVideo({
      studentId: currentUser?.id || 'user-guest',
      studentName: currentUser?.name || 'Guest Creator',
      studentUsername: currentUser?.username || 'vibra_student',
      studentAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      studentGrade: currentUser?.grade || 'Grade 11 · Junior',
      schoolName: currentUser?.schoolName || 'St. Jude Creative Arts Academy',
      title: title.trim(),
      caption: caption.trim(),
      tags: [`#${category}`, '#StJudeTalent', '#VibraHub'],
      category,
      videoUrl: sample.videoUrl,
      posterUrl: sample.posterUrl,
      audioTitle: audioTitle.trim() || sample.audioTitle,
      audioArtist: `${currentUser?.name || 'Student'} · St. Jude`,
      audioToneType: 'synth-acoustic',
      competitionTag: competitionTag.trim() || undefined,
    });

    showToast('Your talent video has been uploaded to the school feed!', 'success');
    if (onUploaded) onUploaded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Upload Talent Clip
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Showcase your skills to the school community and enter approved school competitions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Sample Video / Preset Selector */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-2">
              Select Talent Media Clip Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SAMPLE_CLIPS.map((clip, idx) => {
                const isSelected = selectedSampleIndex === idx;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectSample(idx)}
                    className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-violet-500 bg-violet-600/15 shadow-md shadow-violet-500/10'
                        : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                    }`}
                  >
                    <img
                      src={clip.posterUrl}
                      alt={clip.name}
                      className="w-full h-16 rounded-lg object-cover"
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px] text-white truncate">
                        {clip.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">
              Talent Performance Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Original Fingerstyle Guitar Arrangement"
              className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Category & Audio Track */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TalentCategory)}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
              >
                <option value="music">Music & Vocals</option>
                <option value="dance">Contemporary / Fusion Dance</option>
                <option value="coding">Creative Coding & Shaders</option>
                <option value="poetry">Poetry & Spoken Word</option>
                <option value="drama">Theater & Monologues</option>
                <option value="choir">School Choir Repertoire</option>
                <option value="art">Fine & Digital Art</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">
                Audio Track / Sound Title
              </label>
              <input
                type="text"
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                placeholder="e.g. Hallway Harmonics Ep. 1"
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Competition Tag */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Submit to School Event / Competition (Optional)</span>
            </label>
            <select
              value={competitionTag}
              onChange={(e) => setCompetitionTag(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
            >
              <option value="">None (General Showcase)</option>
              <option value="Annual Inter-House Music Clash 2026">
                Annual Inter-House Music Clash 2026 (Audience Voting Open)
              </option>
              <option value="Creative Codefest: Sound & Shaders">
                Creative Codefest: Interactive Sound & Shaders 2026
              </option>
              <option value="Spring Monologue Showcase">
                Spring Shakespeare & Contemporary Auditions
              </option>
              <option value="Spirit Week Digital Mascot Banner Contest">
                Spirit Week Digital Mascot Banner Contest
              </option>
            </select>
          </div>

          {/* Caption */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">
              Caption & Description
            </label>
            <textarea
              rows={3}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tell your classmates about your creative process, inspiration, or practice routine..."
              className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              Publish to Vibra Feed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
