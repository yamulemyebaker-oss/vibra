/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  UserCheck, 
  UserX, 
  Trash2, 
  Filter, 
  Sparkles, 
  Check, 
  AlertCircle,
  MoreVertical,
  GraduationCap,
  Eye,
  X,
  Award,
  Calendar,
  Building2,
  Clock
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface AdminUsersProps {
  filterRole?: UserRole | 'all';
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ filterRole = 'all' }) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { showToast } = useNotification();

  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const schools = storageService.getSchools();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>(filterRole);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'suspended'>('all');
  
  // Selected user for details inspection modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesSchool = selectedSchool === 'all' || u.schoolId === selectedSchool;
    const matchesStatus = 
      selectedStatus === 'all' ||
      (selectedStatus === 'suspended' ? u.status === 'suspended' : u.status !== 'suspended');

    return matchesSearch && matchesRole && matchesSchool && matchesStatus;
  });

  const handleToggleStatus = (u: User) => {
    if (u.role === 'superadmin' && !isSuperAdmin) {
      showToast('Super Administrators cannot be suspended by standard administrators.', 'error');
      return;
    }
    const updated = storageService.toggleUserStatus(u.id, currentUser);
    if (updated) {
      setUsers(storageService.getUsers());
      if (selectedUser?.id === u.id) setSelectedUser(updated);
      showToast(`Account for ${u.name} is now ${updated.status?.toUpperCase()}.`, 'info');
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (newRole === 'superadmin' && !isSuperAdmin) {
      showToast('Only Super Administrators can promote users to Super Admin.', 'error');
      return;
    }
    const updated = storageService.updateUserRole(userId, newRole, currentUser);
    if (updated) {
      setUsers(storageService.getUsers());
      setEditingRoleId(null);
      if (selectedUser?.id === userId) setSelectedUser(updated);
      showToast(`Role for ${updated.name} updated to ${newRole.toUpperCase()}.`, 'success');
    }
  };

  const handleDeleteUser = (u: User) => {
    if (u.role === 'superadmin') {
      showToast('Super Administrator accounts cannot be deleted.', 'error');
      return;
    }
    if (!window.confirm(`Permanently remove ${u.name}'s account and talent portfolio?`)) return;

    const ok = storageService.deleteUser(u.id, currentUser);
    if (ok) {
      setUsers(storageService.getUsers());
      if (selectedUser?.id === u.id) setSelectedUser(null);
      showToast(`User ${u.name} deleted.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-violet-400" />
            <span>User Accounts & Permissions</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Monitor verified student, faculty patron, and administrator directory
          </p>
        </div>

        {/* Global User Count Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
            {users.length} Total Registered Accounts
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, username, email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
            className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers / Patrons</option>
            <option value="admin">School Administrators</option>
            <option value="superadmin">Super Admins</option>
          </select>
        </div>

        <div>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Schools & Campuses</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'suspended')}
            className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Class / School</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Recent Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No users matching search filters found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuspended = u.status === 'suspended';
                  return (
                    <tr key={u.id} className="hover:bg-neutral-850/40 transition-colors">
                      {/* Name / Avatar / Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{u.name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">@{u.username} · {u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role selection dropdown or pill */}
                      <td className="py-3.5 px-4 font-mono">
                        {editingRoleId === u.id ? (
                          <select
                            defaultValue={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="p-1 rounded bg-neutral-950 border border-violet-500 text-xs text-white"
                          >
                            <option value="student">student</option>
                            <option value="teacher">teacher</option>
                            <option value="admin">admin</option>
                            {isSuperAdmin && <option value="superadmin">superadmin</option>}
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditingRoleId(u.id)}
                            className="hover:underline text-[11px] uppercase font-bold"
                            title="Click to edit role"
                          >
                            {u.role === 'superadmin' ? (
                              <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">super admin</span>
                            ) : u.role === 'admin' ? (
                              <span className="text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">admin</span>
                            ) : u.role === 'teacher' ? (
                              <span className="text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded border border-violet-400/20">teacher</span>
                            ) : (
                              <span className="text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded">student</span>
                            )}
                          </button>
                        )}
                      </td>

                      {/* Grade / School */}
                      <td className="py-3.5 px-4 text-neutral-300">
                        <p className="font-medium text-white">{u.grade || '—'}</p>
                        <p className="text-[10px] text-neutral-500 font-mono truncate">{u.schoolName}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isSuspended 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          <span>{isSuspended ? 'Suspended' : 'Active'}</span>
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Recent Activity */}
                      <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="Inspect User Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isSuspended
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                            }`}
                            title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Dossier Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-5">
              <img
                src={selectedUser.avatarUrl}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/30"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {selectedUser.role}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono">@{selectedUser.username} · {selectedUser.email}</p>
                <p className="text-xs text-violet-400 mt-0.5">{selectedUser.grade} · {selectedUser.schoolName}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold mb-1">Biography</p>
                <p className="text-neutral-300 leading-relaxed">{selectedUser.bio || 'No biography written yet.'}</p>
              </div>

              {selectedUser.talents && selectedUser.talents.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold mb-1.5">Registered Talents</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.talents.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-medium">
                        ★ {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.badges && selectedUser.badges.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold mb-1.5">Earned Badges & Honors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.badges.map((b) => (
                      <span key={b} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                  <p className="text-[10px] text-neutral-500 font-mono">Registration Date</p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                  <p className="text-[10px] text-neutral-500 font-mono">Recent Activity</p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Recent'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  selectedUser.status === 'suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {selectedUser.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
