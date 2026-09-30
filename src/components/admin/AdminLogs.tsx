/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Filter,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { AuditLog } from '../../types';

export const AdminLogs: React.FC = () => {
  const [logs] = useState<AuditLog[]>(() => storageService.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesAction = true;
    if (filterAction === 'login') {
      matchesAction = log.action.includes('LOGIN');
    } else if (filterAction === 'logout') {
      matchesAction = log.action.includes('LOGOUT');
    } else if (filterAction === 'user_create') {
      matchesAction = log.action.includes('USER_SIGNUP') || log.action.includes('USER_CREATE');
    } else if (filterAction === 'role_change') {
      matchesAction = log.action.includes('ROLE_CHANGE');
    } else if (filterAction === 'content_upload') {
      matchesAction = log.action.includes('UPLOAD') || log.action.includes('CREATE');
    } else if (filterAction === 'content_delete') {
      matchesAction = log.action.includes('DELETE');
    } else if (filterAction === 'moderation') {
      matchesAction = log.action.includes('MODERATION') || log.action.includes('RESOLVE');
    } else if (filterAction === 'settings') {
      matchesAction = log.action.includes('SETTINGS') || log.action.includes('SCHOOL');
    }

    return matchesSearch && matchesAction;
  });

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibra_audit_logs_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Administrator', 'Admin Role', 'Action', 'Resource', 'Status', 'Details'];
    const rows = logs.map(l => [
      `"${l.timestamp}"`,
      `"${l.adminName}"`,
      `"${l.adminRole}"`,
      `"${l.action}"`,
      `"${l.resource.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibra_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-sky-400" />
            <span>Administrative Activity Logs</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Immutable audit record: logins, logouts, user creations, role changes, content actions, and settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Download className="w-4 h-4 text-violet-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Search & Action Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, administrator, resource, or details..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-violet-500 font-medium"
          >
            <option value="all">All Administrative Events</option>
            <option value="login">Login Events</option>
            <option value="logout">Logout Events</option>
            <option value="user_create">User Creation</option>
            <option value="role_change">Role Changes</option>
            <option value="content_upload">Content Uploads</option>
            <option value="content_delete">Content Deletion</option>
            <option value="moderation">Moderation Actions</option>
            <option value="settings">Settings Changes</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No audit records matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-850/40 transition-colors font-mono">
                    {/* Timestamp */}
                    <td className="py-3 px-4 text-neutral-400 whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    {/* Administrator */}
                    <td className="py-3 px-4 font-sans font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{log.adminName}</span>
                        <span className="text-[10px] font-mono uppercase text-violet-400">({log.adminRole})</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 font-bold text-xs text-sky-400">
                      {log.action}
                    </td>

                    {/* Resource */}
                    <td className="py-3 px-4 text-neutral-300 font-sans max-w-xs truncate">
                      {log.resource}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        log.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>

                    {/* Details */}
                    <td className="py-3 px-4 text-neutral-400 font-sans text-[11px] max-w-sm truncate">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
