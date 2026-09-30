/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Compass, Plus, Users, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenUpload 
}) => {
  const { currentUser } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 px-4 py-1.5 flex items-center justify-around">
      {/* Home (Video Feed) */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors cursor-pointer ${
          activeTab === 'home' ? 'text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] leading-tight">Home</span>
      </button>

      {/* Explore */}
      <button
        onClick={() => setActiveTab('explore')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors cursor-pointer ${
          activeTab === 'explore' ? 'text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] leading-tight">Explore</span>
      </button>

      {/* Upload Button */}
      <button
        onClick={onOpenUpload}
        className="flex items-center justify-center -mt-2 cursor-pointer"
        title="Upload Talent Video"
        aria-label="Upload talent"
      >
        <div className="w-11 h-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 ring-2 ring-neutral-950 active:scale-95 transition-transform">
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </div>
      </button>

      {/* Following */}
      <button
        onClick={() => setActiveTab('following')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors cursor-pointer ${
          activeTab === 'following' ? 'text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] leading-tight">Following</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors cursor-pointer ${
          activeTab === 'profile' ? 'text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        {currentUser?.avatarUrl ? (
          <img
            src={currentUser.avatarUrl}
            alt="Profile"
            className={`w-5 h-5 rounded-full object-cover ring-1 ${
              activeTab === 'profile' ? 'ring-violet-400' : 'ring-neutral-600'
            }`}
          />
        ) : (
          <UserIcon className="w-5 h-5" />
        )}
        <span className="text-[10px] leading-tight">Profile</span>
      </button>
    </nav>
  );
};
