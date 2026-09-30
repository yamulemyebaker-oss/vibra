/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  User, 
  UserRole,
  School,
  Song, 
  TalentItem, 
  SchoolEvent, 
  CommunityPost, 
  Choir, 
  Podcast, 
  NotificationItem, 
  ReportItem,
  TalentVideo,
  VideoComment,
  AuditLog,
  PlatformSettings,
  StorageMetrics
} from '../types';
import { 
  DEMO_USERS, 
  INITIAL_SCHOOLS,
  INITIAL_SONGS, 
  INITIAL_TALENTS, 
  INITIAL_EVENTS, 
  INITIAL_CHOIRS, 
  INITIAL_PODCASTS, 
  INITIAL_POSTS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_VIDEOS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
  INITIAL_REPORTS
} from '../db/initialData';

const STORAGE_KEYS = {
  USERS: 'vibra_users',
  SCHOOLS: 'vibra_schools',
  SONGS: 'vibra_songs',
  TALENTS: 'vibra_talents',
  EVENTS: 'vibra_events',
  CHOIRS: 'vibra_choirs',
  PODCASTS: 'vibra_podcasts',
  POSTS: 'vibra_posts',
  NOTIFICATIONS: 'vibra_notifications',
  REPORTS: 'vibra_reports',
  VOTES: 'vibra_votes',
  CURRENT_USER_ID: 'vibra_current_user_id',
  VIDEOS: 'vibra_videos',
  AUDIT_LOGS: 'vibra_audit_logs',
  SETTINGS: 'vibra_settings',
  AUTH_TOKEN: 'vibra_session_token',
};

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch storage update event for reactive components
      window.dispatchEvent(new Event('vibra_storage_updated'));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // Users
  getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  }

  // Schools
  getSchools(): School[] {
    return this.get<School[]>(STORAGE_KEYS.SCHOOLS, INITIAL_SCHOOLS);
  }

  getSchoolById(id: string): School | undefined {
    return this.getSchools().find(s => s.id === id);
  }

  updateSchool(id: string, updates: Partial<School>, adminUser?: User | null): School | null {
    const schools = this.getSchools();
    const idx = schools.findIndex(s => s.id === id);
    if (idx === -1) return null;
    schools[idx] = { ...schools[idx], ...updates };
    this.set(STORAGE_KEYS.SCHOOLS, schools);

    if (adminUser) {
      this.addAuditLog(
        'SCHOOL_UPDATE',
        `School: ${schools[idx].name}`,
        'success',
        `School settings updated: ${Object.keys(updates).join(', ')}`,
        adminUser
      );
    }
    return schools[idx];
  }

  addSchool(school: Omit<School, 'id'>, adminUser?: User | null): School {
    const schools = this.getSchools();
    const newSchool: School = {
      ...school,
      id: `school-${Date.now()}`
    };
    schools.push(newSchool);
    this.set(STORAGE_KEYS.SCHOOLS, schools);

    if (adminUser) {
      this.addAuditLog(
        'SCHOOL_CREATE',
        `School: ${newSchool.name}`,
        'success',
        `New affiliated campus registered: ${newSchool.code}`,
        adminUser
      );
    }
    return newSchool;
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.set(STORAGE_KEYS.USERS, users);
    return users[idx];
  }

  // Songs
  getSongs(): Song[] {
    return this.get<Song[]>(STORAGE_KEYS.SONGS, INITIAL_SONGS);
  }

  toggleLikeSong(songId: string): Song | null {
    const songs = this.getSongs();
    const song = songs.find(s => s.id === songId);
    if (!song) return null;
    song.likesCount += 1;
    this.set(STORAGE_KEYS.SONGS, songs);
    return song;
  }

  incrementPlays(songId: string): void {
    const songs = this.getSongs();
    const song = songs.find(s => s.id === songId);
    if (song) {
      song.playsCount += 1;
      this.set(STORAGE_KEYS.SONGS, songs);
    }
  }

  // Talents
  getTalents(): TalentItem[] {
    return this.get<TalentItem[]>(STORAGE_KEYS.TALENTS, INITIAL_TALENTS);
  }

  toggleLikeTalent(talentId: string): TalentItem | null {
    const talents = this.getTalents();
    const item = talents.find(t => t.id === talentId);
    if (!item) return null;
    item.likesCount += 1;
    this.set(STORAGE_KEYS.TALENTS, talents);
    return item;
  }

  // Events & Registration
  getEvents(): SchoolEvent[] {
    return this.get<SchoolEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }

  registerForEvent(eventId: string): boolean {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event || !event.registrationOpen) return false;
    event.registeredCount += 1;
    this.set(STORAGE_KEYS.EVENTS, events);
    return true;
  }

  // Choirs & Podcasts
  getChoirs(): Choir[] {
    return this.get<Choir[]>(STORAGE_KEYS.CHOIRS, INITIAL_CHOIRS);
  }

  getPodcasts(): Podcast[] {
    return this.get<Podcast[]>(STORAGE_KEYS.PODCASTS, INITIAL_PODCASTS);
  }

  // Posts
  getPosts(): CommunityPost[] {
    return this.get<CommunityPost[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  }

  createPost(newPost: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>): CommunityPost {
    const posts = this.getPosts();
    const post: CommunityPost = {
      ...newPost,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLikedByCurrentUser: false,
    };
    posts.unshift(post);
    this.set(STORAGE_KEYS.POSTS, posts);
    return post;
  }

  toggleLikePost(postId: string): CommunityPost | null {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;
    if (post.isLikedByCurrentUser) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      post.isLikedByCurrentUser = false;
    } else {
      post.likesCount += 1;
      post.isLikedByCurrentUser = true;
    }
    this.set(STORAGE_KEYS.POSTS, posts);
    return post;
  }

  // Notifications
  getNotifications(): NotificationItem[] {
    return this.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.isRead = true;
      this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  markAllNotificationsAsRead(): void {
    const notifs = this.getNotifications().map(n => ({ ...n, isRead: true }));
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  // Videos & Vertical Feed
  getVideos(): TalentVideo[] {
    return this.get<TalentVideo[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
  }

  toggleLikeVideo(videoId: string): TalentVideo | null {
    const videos = this.getVideos();
    const vid = videos.find(v => v.id === videoId);
    if (!vid) return null;
    if (vid.isLiked) {
      vid.isLiked = false;
      vid.likesCount = Math.max(0, vid.likesCount - 1);
    } else {
      vid.isLiked = true;
      vid.likesCount += 1;
    }
    this.set(STORAGE_KEYS.VIDEOS, videos);
    return vid;
  }

  toggleSaveVideo(videoId: string): TalentVideo | null {
    const videos = this.getVideos();
    const vid = videos.find(v => v.id === videoId);
    if (!vid) return null;
    vid.isSaved = !vid.isSaved;
    vid.savesCount += vid.isSaved ? 1 : -1;
    this.set(STORAGE_KEYS.VIDEOS, videos);
    return vid;
  }

  toggleFollowVideoCreator(studentUsername: string): boolean {
    const videos = this.getVideos();
    let isNowFollowing = false;
    videos.forEach(v => {
      if (v.studentUsername === studentUsername) {
        v.isFollowing = !v.isFollowing;
        isNowFollowing = !!v.isFollowing;
      }
    });
    this.set(STORAGE_KEYS.VIDEOS, videos);
    return isNowFollowing;
  }

  addCommentToVideo(videoId: string, comment: Omit<VideoComment, 'id' | 'timestamp' | 'likesCount'>): VideoComment | null {
    const videos = this.getVideos();
    const vid = videos.find(v => v.id === videoId);
    if (!vid) return null;
    const newComment: VideoComment = {
      ...comment,
      id: `vc-${Date.now()}`,
      timestamp: 'Just now',
      likesCount: 0,
    };
    vid.comments.unshift(newComment);
    vid.commentsCount += 1;
    this.set(STORAGE_KEYS.VIDEOS, videos);
    return newComment;
  }

  addVideo(newVideo: Omit<TalentVideo, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'savesCount' | 'comments'>): TalentVideo {
    const videos = this.getVideos();
    const video: TalentVideo = {
      ...newVideo,
      id: `vid-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false,
      isFollowing: false,
      comments: [],
    };
    videos.unshift(video);
    this.set(STORAGE_KEYS.VIDEOS, videos);
    return video;
  }

  // Reports
  getReports(): ReportItem[] {
    return this.get<ReportItem[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  }

  createReport(report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): ReportItem {
    const reports = this.getReports();
    const item: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    reports.unshift(item);
    this.set(STORAGE_KEYS.REPORTS, reports);
    return item;
  }

  resolveReport(reportId: string, actionTaken: string, adminUser?: User | null): boolean {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return false;
    rep.status = 'resolved';
    rep.actionTaken = actionTaken;
    this.set(STORAGE_KEYS.REPORTS, reports);

    if (adminUser) {
      this.addAuditLog(
        'MODERATION_RESOLVE',
        `Report: #${reportId} (${rep.targetType})`,
        'success',
        `Action taken: ${actionTaken}`,
        adminUser
      );
    }
    return true;
  }

  dismissReport(reportId: string, adminUser?: User | null): boolean {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return false;
    rep.status = 'dismissed';
    this.set(STORAGE_KEYS.REPORTS, reports);

    if (adminUser) {
      this.addAuditLog(
        'MODERATION_DISMISS',
        `Report: #${reportId}`,
        'success',
        'Dismissed as non-violating',
        adminUser
      );
    }
    return true;
  }

  // Admin User Management
  toggleUserStatus(userId: string, adminUser?: User | null): User | null {
    const users = this.getUsers();
    const u = users.find(x => x.id === userId);
    if (!u) return null;
    const newStatus = u.status === 'suspended' ? 'active' : 'suspended';
    u.status = newStatus;
    this.set(STORAGE_KEYS.USERS, users);

    if (adminUser) {
      this.addAuditLog(
        newStatus === 'suspended' ? 'USER_SUSPEND' : 'USER_ACTIVATE',
        `User: ${u.name} (@${u.username})`,
        'warning',
        `Account status changed to ${newStatus}`,
        adminUser
      );
    }
    return u;
  }

  updateUserRole(userId: string, newRole: UserRole, adminUser?: User | null): User | null {
    const users = this.getUsers();
    const u = users.find(x => x.id === userId);
    if (!u) return null;
    const oldRole = u.role;
    u.role = newRole;
    this.set(STORAGE_KEYS.USERS, users);

    if (adminUser) {
      this.addAuditLog(
        'ROLE_CHANGE',
        `User: ${u.name} (@${u.username})`,
        'success',
        `Role updated from ${oldRole} to ${newRole}`,
        adminUser
      );
    }
    return u;
  }

  deleteUser(userId: string, adminUser?: User | null): boolean {
    const users = this.getUsers();
    const idx = users.findIndex(x => x.id === userId);
    if (idx === -1) return false;
    const deletedUser = users[idx];
    users.splice(idx, 1);
    this.set(STORAGE_KEYS.USERS, users);

    if (adminUser) {
      this.addAuditLog(
        'USER_DELETE',
        `User: ${deletedUser.name} (@${deletedUser.username})`,
        'warning',
        'User account permanently deleted',
        adminUser
      );
    }
    return true;
  }

  // Admin Content Removal
  deleteVideo(videoId: string, adminUser?: User | null): boolean {
    const videos = this.getVideos();
    const idx = videos.findIndex(v => v.id === videoId);
    if (idx === -1) return false;
    const title = videos[idx].title;
    videos.splice(idx, 1);
    this.set(STORAGE_KEYS.VIDEOS, videos);

    if (adminUser) {
      this.addAuditLog(
        'CONTENT_DELETE',
        `Video: ${title}`,
        'warning',
        'Video removed by administrator',
        adminUser
      );
    }
    return true;
  }

  deleteSong(songId: string, adminUser?: User | null): boolean {
    const songs = this.getSongs();
    const idx = songs.findIndex(s => s.id === songId);
    if (idx === -1) return false;
    const title = songs[idx].title;
    songs.splice(idx, 1);
    this.set(STORAGE_KEYS.SONGS, songs);

    if (adminUser) {
      this.addAuditLog(
        'CONTENT_DELETE',
        `Song: ${title}`,
        'warning',
        'Song removed from school catalog',
        adminUser
      );
    }
    return true;
  }

  deletePost(postId: string, adminUser?: User | null): boolean {
    const posts = this.getPosts();
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) return false;
    posts.splice(idx, 1);
    this.set(STORAGE_KEYS.POSTS, posts);

    if (adminUser) {
      this.addAuditLog(
        'CONTENT_DELETE',
        `Post: #${postId}`,
        'warning',
        'Post removed from community feed',
        adminUser
      );
    }
    return true;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  addAuditLog(
    action: string,
    resource: string,
    status: 'success' | 'failure' | 'warning',
    details: string,
    adminUser: User
  ): AuditLog {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      adminId: adminUser.id,
      adminName: adminUser.name,
      adminRole: adminUser.role,
      action,
      resource,
      status,
      ipAddress: '10.0.4.22',
      details,
    };
    logs.unshift(newLog);
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs);
    return newLog;
  }

  // Platform Settings
  getSettings(): PlatformSettings {
    return this.get<PlatformSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  updateSettings(updates: Partial<PlatformSettings>, adminUser?: User | null): PlatformSettings {
    const settings = this.getSettings();
    const updated = { ...settings, ...updates };
    this.set(STORAGE_KEYS.SETTINGS, updated);

    if (adminUser) {
      this.addAuditLog(
        'SETTINGS_UPDATE',
        'Platform Configuration',
        'success',
        `Settings updated: ${Object.keys(updates).join(', ')}`,
        adminUser
      );
    }
    return updated;
  }

  // Dynamic Platform Analytics
  getPlatformStats() {
    const users = this.getUsers();
    const videos = this.getVideos();
    const songs = this.getSongs();
    const events = this.getEvents();
    const posts = this.getPosts();
    const reports = this.getReports();
    const schools = this.getSchools();

    const studentsCount = users.filter(u => u.role === 'student').length;
    const teachersCount = users.filter(u => u.role === 'teacher').length;
    const adminsCount = users.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
    const activeUsersCount = users.filter(u => u.status !== 'suspended').length;
    const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

    const totalLikes = 
      videos.reduce((acc, v) => acc + (v.likesCount || 0), 0) +
      songs.reduce((acc, s) => acc + (s.likesCount || 0), 0) +
      posts.reduce((acc, p) => acc + (p.likesCount || 0), 0);

    const totalComments = 
      videos.reduce((acc, v) => acc + (v.commentsCount || 0), 0) +
      posts.reduce((acc, p) => acc + (p.commentsCount || 0), 0);

    return {
      totalUsers: users.length,
      activeUsers: activeUsersCount,
      studentsCount,
      teachersCount,
      adminsCount,
      schoolsCount: schools.length,
      videosCount: videos.length,
      songsCount: songs.length,
      eventsCount: events.length,
      competitionsCount: events.filter(e => e.type === 'competition').length,
      postsCount: posts.length,
      totalLikes,
      totalComments,
      reportsCount: reports.length,
      pendingReportsCount,
    };
  }

  // Storage Metrics
  getStorageMetrics(): StorageMetrics {
    const videos = this.getVideos();
    const songs = this.getSongs();
    const users = this.getUsers();
    const posts = this.getPosts();

    const videosUsedMb = Math.round(videos.length * 48.5);
    const songsUsedMb = Math.round(songs.length * 12.2);
    const profilesUsedMb = Math.round(users.length * 2.8);
    const postsUsedMb = Math.round(posts.length * 1.5);
    const totalUsedMb = videosUsedMb + songsUsedMb + profilesUsedMb + postsUsedMb;
    const maxCapacityMb = 10240; // 10 GB school storage quota

    return {
      totalUsedMb,
      maxCapacityMb,
      videosUsedMb,
      songsUsedMb,
      profilesUsedMb,
      postsUsedMb,
      filesCount: videos.length + songs.length + users.length + posts.length,
    };
  }

  resetAllData(): void {
    localStorage.clear();
    window.location.reload();
  }
}

export const storageService = new StorageService();
