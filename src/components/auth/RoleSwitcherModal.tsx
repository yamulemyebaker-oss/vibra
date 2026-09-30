/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check, Shield, GraduationCap, Sparkles, Eye, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { role, switchRole, currentUser } = useAuth();
  const { showToast } = useNotification();

  if (!isOpen) return null;

  const rolesList: {
    id: UserRole;
    title: string;
    persona: string;
    description: string;
    icon: typeof GraduationCap;
    color: string;
    permissions: string[];
  }[] = [
    {
      id: 'superadmin',
      title: 'Super Admin',
      persona: 'Marcus Thorne (Platform Trustee)',
      description: 'Supreme governance clearance: oversee all school administrators, security audit logs, cloud storage quotas, role promotions, and global policies.',
      icon: Shield,
      color: 'border-amber-400 text-amber-300 bg-amber-500/20 font-bold',
      permissions: ['Full Root Access', 'Administer Admins', 'Storage Telemetry', 'Security Audit Trail', 'Global Platform Lockdown']
    },
    {
      id: 'admin',
      title: 'School Administrator',
      persona: 'Dr. Sarah Vance (Principal)',
      description: 'School administration: configure voting rules, manage accounts, publish official announcements, handle safety reports, and platform telemetry.',
      icon: Shield,
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      permissions: ['Full Content & User Governance', 'Configure Voting Systems', 'Resolve Safety Reports', 'School-wide Announcements', 'Platform Analytics']
    },
    {
      id: 'teacher',
      title: 'Teacher / Activity Patron',
      persona: 'Mr. David Sterling (Head of Performing Arts)',
      description: 'Review submitted student content, manage approved auditions and events, monitor voting, moderate posts, and feature student talent.',
      icon: Sparkles,
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
      permissions: ['Manage Auditions & Events', 'Review Submissions', 'Moderate Community Buzz', 'Feature Student Works', 'Patron Analytics']
    },
    {
      id: 'student',
      title: 'Student Role',
      persona: 'Maya Lin (Grade 11)',
      description: 'Upload music, showcase talents, register for auditions, vote in competitions, chat with peers, and follow creators.',
      icon: GraduationCap,
      color: 'border-violet-500/40 text-violet-400 bg-violet-500/10',
      permissions: ['Browse & Play Music', 'Register for Auditions', 'Vote in Approved Contests', 'Create Community Posts', 'Build Talent Portfolio']
    },
    {
      id: 'guest',
      title: 'Guest / Public Visitor',
      persona: 'Public School Visitor',
      description: 'Explore public school showcases, featured choirs, and upcoming events. Private student records and direct messaging are strictly protected.',
      icon: Eye,
      color: 'border-neutral-700 text-neutral-400 bg-neutral-800/40',
      permissions: ['View Public School Showcases', 'Listen to Public Choirs & Songs', 'Read Event Calendars', 'No Access to Private Data']
    }
  ];

  const handleSelectRole = (r: UserRole) => {
    switchRole(r);
    showToast(`Switched active persona to ${r.toUpperCase()} mode.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Test Role Switcher
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            Switch between personas to test how Vibra behaves for students, faculty patrons, administrators, and visitors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {rolesList.map((item) => {
            const Icon = item.icon;
            const isSelected = role === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectRole(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-violet-500 bg-violet-950/20 shadow-lg shadow-violet-500/10'
                    : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono border ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.title}</span>
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white mt-1">{item.persona}</p>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-snug">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80">
                  <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1.5">Permitted Actions:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.permissions.slice(0, 3).map((p, idx) => (
                      <span key={idx} className="text-[10px] text-neutral-300 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
