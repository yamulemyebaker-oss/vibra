/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Vertical Feed & Upload
import { VideoFeed } from './components/feed/VideoFeed';
import { UploadModal } from './components/feed/UploadModal';

// Auth & Admin Architecture
import { LoginPage } from './components/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { RoleSwitcherModal } from './components/auth/RoleSwitcherModal';
import { SearchModal } from './components/search/SearchModal';
import { DatabaseSchemaModal } from './components/admin/DatabaseSchemaModal';

// Pages
import { ExplorePage } from './components/explore/ExplorePage';
import { StudentProfile } from './components/profile/StudentProfile';
import { EventsPage } from './components/events/EventsPage';
import { MusicPage } from './components/music/MusicPage';
import { RoleDashboard } from './components/dashboard/RoleDashboard';

function AppContent() {
  const { role, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedFeedCategory, setSelectedFeedCategory] = useState<string>('all');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDbSchemaOpen, setIsDbSchemaOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    if (mode === 'login') {
      setActiveTab('login');
    } else {
      setAuthMode(mode);
      setIsAuthOpen(true);
    }
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'schema') {
      setIsDbSchemaOpen(true);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromExplore = (category?: string) => {
    if (category) {
      setSelectedFeedCategory(category);
    }
    setActiveTab('home');
  };

  // If in dedicated /admin route, render full Admin Portal protected by RBAC
  if (activeTab === 'admin') {
    return (
      <ProtectedRoute
        requiredRole="admin"
        onNavigateHome={() => setActiveTab('home')}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenLogin={() => setActiveTab('login')}
      >
        <ToastContainer />
        <AdminLayout onReturnToHub={() => setActiveTab('home')} />
        <RoleSwitcherModal
          isOpen={isRoleSwitcherOpen}
          onClose={() => setIsRoleSwitcherOpen(false)}
        />
      </ProtectedRoute>
    );
  }

  // If on dedicated login page, render full LoginPage
  if (activeTab === 'login') {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
        <ToastContainer />
        <header className="px-6 py-4 border-b border-neutral-850 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-white font-bold text-sm hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
              V
            </div>
            <span>Vibra Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Back to Public Feed →
          </button>
        </header>

        <LoginPage
          onSuccess={() => setActiveTab('home')}
          onNavigateTab={handleNavigate}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-violet-200 overflow-hidden">
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenDbSchema={() => setIsDbSchemaOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex w-full h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Desktop Sidebar: Vibra Logo, Home, Explore, Following, Upload, Profile */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenDbSchema={() => setIsDbSchemaOpen(true)}
          onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          className="hidden md:flex h-full"
        />

        {/* Mobile Slideout Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm flex animate-fade-in">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                handleNavigate(tab);
                setIsMobileMenuOpen(false);
              }}
              onOpenUpload={() => {
                setIsUploadOpen(true);
                setIsMobileMenuOpen(false);
              }}
              onOpenDbSchema={() => {
                setIsDbSchemaOpen(true);
                setIsMobileMenuOpen(false);
              }}
              onOpenRoleSwitcher={() => {
                setIsRoleSwitcherOpen(true);
                setIsMobileMenuOpen(false);
              }}
              onItemClick={() => setIsMobileMenuOpen(false)}
              className="w-72 bg-neutral-950 h-full border-r border-neutral-800"
            />
            <div 
              className="flex-1" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
          </div>
        )}

        {/* Center Main Stage Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto no-scrollbar relative bg-neutral-950">
          
          {/* HOME: Modern TikTok-inspired vertical video feed */}
          {activeTab === 'home' && (
            <VideoFeed
              feedType="for-you"
              selectedCategory={selectedFeedCategory}
              onNavigateTab={handleNavigate}
            />
          )}

          {/* FOLLOWING: Curated feed of followed student creators */}
          {activeTab === 'following' && (
            <VideoFeed
              feedType="following"
              onNavigateTab={handleNavigate}
            />
          )}

          {/* EXPLORE: Talent Categories, School Tournaments & Choirs */}
          {activeTab === 'explore' && (
            <ExplorePage
              onSelectVideoFeed={handleSelectCategoryFromExplore}
              onNavigateTab={handleNavigate}
            />
          )}

          {/* PROFILE: Student Portfolio */}
          {activeTab === 'profile' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
              <StudentProfile />
            </div>
          )}

          {/* EVENTS & COMPETITIONS */}
          {activeTab === 'events' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <EventsPage />
            </div>
          )}

          {/* MUSIC & CHOIRS */}
          {activeTab === 'music' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <MusicPage />
            </div>
          )}

          {/* ROLE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <RoleDashboard onNavigate={handleNavigate} />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Navigation (Home, Explore, Upload +, Following, Profile) */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Upload Talent Video Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={() => {
          setActiveTab('home');
          window.location.hash = '';
        }}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />

      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={handleNavigate}
      />

      <DatabaseSchemaModal
        isOpen={isDbSchemaOpen}
        onClose={() => setIsDbSchemaOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioPlayerProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AudioPlayerProvider>
    </AuthProvider>
  );
}
