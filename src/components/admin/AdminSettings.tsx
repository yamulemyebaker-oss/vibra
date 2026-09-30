/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Vote, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PlatformSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [settings, setSettings] = useState<PlatformSettings>(() => storageService.getSettings());

  const handleToggle = (key: keyof PlatformSettings) => {
    if (typeof settings[key] === 'boolean') {
      const updated = storageService.updateSettings(
        { [key]: !settings[key] },
        currentUser
      );
      setSettings(updated);
      showToast(`Setting "${key}" updated.`, 'info');
    }
  };

  const handleSaveTextSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storageService.updateSettings(
      {
        schoolName: settings.schoolName,
        academicYear: settings.academicYear,
        maxVideoUploadSizeMb: Number(settings.maxVideoUploadSizeMb),
      },
      currentUser
    );
    setSettings(updated);
    showToast('Platform settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          School Platform Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure upload permissions, content approval gates, and voting windows
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveTextSettings} className="space-y-6 text-xs">
        
        {/* School Profile Section */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-violet-400" />
            <span>School Identification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Official School Academy Name
              </label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Active Academic Year / Term
              </label>
              <input
                type="text"
                value={settings.academicYear}
                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Governance & Safety Toggles */}
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safety & Content Policy Gates</span>
          </h3>

          <div className="divide-y divide-neutral-850">
            {/* Toggle 1: Student Uploads */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Allow Student Direct Uploads</p>
                <p className="text-[11px] text-neutral-400">
                  Permit enrolled students to publish talent videos and original music directly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('allowStudentUploads')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.allowStudentUploads ? 'bg-violet-600' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.allowStudentUploads ? 'translate-x-6' : 'translate-x-1'
                  } top-1 absolute`}
                />
              </button>
            </div>

            {/* Toggle 2: Pre-moderation Gate */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Require Patron Pre-Approval for Public Feed</p>
                <p className="text-[11px] text-neutral-400">
                  When enabled, all student videos must be approved by a faculty patron before appearing in School Feed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('requireContentApproval')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.requireContentApproval ? 'bg-violet-600' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.requireContentApproval ? 'translate-x-6' : 'translate-x-1'
                  } top-1 absolute`}
                />
              </button>
            </div>

            {/* Toggle 3: Global Competition Voting */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Global Competition Voting Active</p>
                <p className="text-[11px] text-neutral-400">
                  Allow verified students to cast 1 ballot per competition. Turn off to lock final counts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('votingEnabledGlobally')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.votingEnabledGlobally ? 'bg-amber-500' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.votingEnabledGlobally ? 'translate-x-6' : 'translate-x-1'
                  } top-1 absolute`}
                />
              </button>
            </div>

            {/* Toggle 4: Guest Preview */}
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Enable Guest / Public Explore View</p>
                <p className="text-[11px] text-neutral-400">
                  Allow external prospective students and parents to view approved school public showcases.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('allowGuestPreview')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.allowGuestPreview ? 'bg-violet-600' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.allowGuestPreview ? 'translate-x-6' : 'translate-x-1'
                  } top-1 absolute`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-lg shadow-violet-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
