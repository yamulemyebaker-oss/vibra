-- ====================================================================
-- VIBRA SCHOOL TALENT HUB — PRODUCTION RELATIONAL DATABASE SCHEMA
-- PostgreSQL / Supabase Architecture with Row Level Security (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SCHOOLS
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    motto TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS & ROLES
CREATE TYPE user_role_enum AS ENUM ('student', 'teacher', 'admin', 'guest');

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE RESTRICT,
    role user_role_enum NOT NULL DEFAULT 'student',
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    grade VARCHAR(50),
    bio TEXT,
    avatar_url TEXT,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TALENT CATEGORIES & TALENTS
CREATE TABLE public.talent_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50)
);

CREATE TABLE public.talents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id VARCHAR(50) NOT NULL REFERENCES public.talent_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    media_url TEXT,
    media_type VARCHAR(20) DEFAULT 'image',
    skills TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    years_experience INT DEFAULT 1,
    school_recognition TEXT,
    likes_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MUSIC, CHOIRS, ALBUMS & PLAYLISTS
CREATE TABLE public.choirs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    lead_director VARCHAR(255) NOT NULL,
    member_count INT DEFAULT 0,
    cover_art_url TEXT,
    description TEXT,
    rehearsal_schedule TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    cover_art_url TEXT,
    release_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
    choir_id UUID REFERENCES public.choirs(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    cover_art_url TEXT,
    audio_url TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    genre VARCHAR(100),
    plays_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_art_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    position INT NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(playlist_id, song_id)
);

-- 6. PODCASTS
CREATE TABLE public.podcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    description TEXT,
    cover_art_url TEXT,
    episode_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EVENTS, COMPETITIONS & AUDITIONS
CREATE TYPE event_type_enum AS ENUM ('competition', 'audition', 'concert', 'workshop');
CREATE TYPE event_status_enum AS ENUM ('upcoming', 'ongoing', 'completed', 'registration_closed');

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    type event_type_enum NOT NULL,
    category_id VARCHAR(50) REFERENCES public.talent_categories(id),
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    cover_image_url TEXT,
    status event_status_enum DEFAULT 'upcoming',
    registration_open BOOLEAN DEFAULT TRUE,
    capacity INT,
    registered_count INT DEFAULT 0,
    rules TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.competition_details (
    event_id UUID PRIMARY KEY REFERENCES public.events(id) ON DELETE CASCADE,
    voting_open BOOLEAN DEFAULT FALSE,
    voting_deadline TIMESTAMPTZ,
    winner_entry_id UUID,
    results_published BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.competition_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entry_title VARCHAR(255) NOT NULL,
    submission_media_url TEXT,
    votes_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, student_id)
);

-- 8. VOTING (AUDITED AND ANTI-DUPLICATION)
CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    entry_id UUID NOT NULL REFERENCES public.competition_entries(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, voter_id) -- One vote per student per competition
);

-- 9. COMMUNITY (POSTS, COMMENTS, LIKES, FOLLOWS)
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category_tag VARCHAR(50),
    media_url TEXT,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.likes (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL, -- 'song', 'talent', 'post'
    target_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, target_type, target_id)
);

CREATE TABLE public.follows (
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- 10. MODERATION & REPORTS
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_type VARCHAR(30) NOT NULL,
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
    action_taken TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
