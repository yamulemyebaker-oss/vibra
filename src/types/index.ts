/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  avatarUrl: string;
  schoolId: string;
  schoolName: string;
  grade?: string; // e.g. "Grade 11 - Junior"
  bio?: string;
  talents: string[];
  followersCount: number;
  followingCount: number;
  badges: string[];
  status?: 'active' | 'suspended' | 'pending_verification';
  lastLoginAt?: string;
  password?: string;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  district: string;
  address: string;
  city: string;
  state: string;
  studentCount: number;
  facultyCount: number;
  capacity: number;
  status: 'active' | 'pending';
  principal: string;
  logoUrl: string;
  academicYear: string;
  foundedYear: number;
}

export type TalentCategory = 
  | 'music'
  | 'dance'
  | 'poetry'
  | 'drama'
  | 'art'
  | 'coding'
  | 'choir'
  | 'other';

export interface TalentItem {
  id: string;
  userId: string;
  studentName: string;
  studentUsername: string;
  studentAvatar: string;
  studentGrade: string;
  title: string;
  category: TalentCategory;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'audio' | 'video' | 'code';
  skills: string[];
  achievements: string[];
  yearsExperience: number;
  schoolRecognition: string;
  likesCount: number;
  viewsCount: number;
  featured: boolean;
  createdAt: string;
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  albumId?: string;
  albumTitle?: string;
  coverArt: string;
  duration: number; // in seconds
  genre: string;
  audioToneType: 'synth-acoustic' | 'synth-ambient' | 'synth-beat' | 'synth-choir' | 'synth-lofi';
  audioUrl?: string;
  playsCount: number;
  likesCount: number;
  isSchoolChoir?: boolean;
  choirName?: string;
  isPodcast?: boolean;
  podcastEpisode?: number;
  lyrics?: string;
  releaseDate: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  coverArt: string;
  songIds: string[];
  isPublic: boolean;
  followersCount: number;
  createdAt: string;
}

export interface Choir {
  id: string;
  name: string;
  leadDirector: string;
  memberCount: number;
  coverArt: string;
  description: string;
  rehearsalSchedule: string;
  achievements: string[];
  songIds: string[];
}

export interface Podcast {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  coverArt: string;
  description: string;
  episodeCount: number;
  latestEpisodeTitle: string;
  category: string;
}

export type EventType = 'competition' | 'audition' | 'concert' | 'workshop';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'registration_closed';

export interface SchoolEvent {
  id: string;
  title: string;
  type: EventType;
  category: TalentCategory;
  description: string;
  date: string;
  time: string;
  venue: string;
  coverImage: string;
  organizerName: string;
  organizerRole: 'teacher' | 'admin';
  status: EventStatus;
  registrationOpen: boolean;
  registeredCount: number;
  capacity?: number;
  rules: string[];
  announcements: string[];
  
  // Specific to competitions
  votingOpen?: boolean;
  votingDeadline?: string;
  judges?: string[];
  winnerName?: string;
  winnerTalent?: string;
  
  // Specific to auditions
  eligibility?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  categoryTag: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'link';
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser?: boolean;
  createdAt: string;
  status: 'approved' | 'pending_moderation' | 'flagged';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'like' | 'comment' | 'follow' | 'event' | 'competition' | 'audition' | 'admin';
  isRead: boolean;
  timestamp: string;
  linkUrl?: string;
}

export interface VideoComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userGrade: string;
  text: string;
  timestamp: string;
  likesCount: number;
}

export interface TalentVideo {
  id: string;
  studentId: string;
  studentName: string;
  studentUsername: string;
  studentAvatar: string;
  studentGrade: string;
  schoolName: string;
  title: string;
  caption: string;
  tags: string[];
  category: TalentCategory;
  videoUrl: string;
  posterUrl: string;
  audioTitle: string;
  audioArtist: string;
  audioToneType: 'synth-acoustic' | 'synth-ambient' | 'synth-beat' | 'synth-choir' | 'synth-lofi';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  competitionTag?: string;
  auditionTag?: string;
  comments: VideoComment[];
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: 'post' | 'comment' | 'music' | 'video' | 'profile';
  targetId: string;
  targetTitle?: string;
  targetAuthorName?: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  actionTaken?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminRole: UserRole;
  action: string;
  resource: string;
  status: 'success' | 'failure' | 'warning';
  ipAddress: string;
  details?: string;
}

export interface PlatformSettings {
  schoolName: string;
  academicYear: string;
  allowStudentUploads: boolean;
  requireContentApproval: boolean;
  votingEnabledGlobally: boolean;
  maxVideoUploadSizeMb: number;
  notifyAdminsOnReport: boolean;
  allowGuestPreview: boolean;
}

export interface StorageMetrics {
  totalUsedMb: number;
  maxCapacityMb: number;
  videosUsedMb: number;
  songsUsedMb: number;
  profilesUsedMb: number;
  postsUsedMb: number;
  filesCount: number;
}

