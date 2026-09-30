/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  User as UserIcon,
  MessageSquare
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ReportItem } from '../../types';

export const AdminReports: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [reports, setReports] = useState<ReportItem[]>(() => storageService.getReports());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [resolutionAction, setResolutionAction] = useState<string>('Removed violating content and warned author');

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleResolve = (report: ReportItem) => {
    const ok = storageService.resolveReport(report.id, resolutionAction, currentUser);
    if (ok) {
      setReports(storageService.getReports());
      showToast(`Report #${report.id} resolved with action logged.`, 'success');
    }
  };

  const handleDismiss = (report: ReportItem) => {
    const ok = storageService.dismissReport(report.id, currentUser);
    if (ok) {
      setReports(storageService.getReports());
      showToast(`Report #${report.id} dismissed as non-violating.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Safety & Moderation Reports
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review reported items, enforce St. Jude code of conduct, and log corrective actions
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs">
          {(['all', 'pending', 'resolved', 'dismissed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all cursor-pointer ${
                filterStatus === s ? 'bg-violet-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Listing */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800 text-neutral-500 text-xs flex flex-col items-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
            <p className="font-semibold text-white">No reports in this category</p>
            <p className="text-neutral-400 mt-0.5">The platform is currently operating safely.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isPending = report.status === 'pending';
            return (
              <div
                key={report.id}
                className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">Report #{report.id}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {report.targetType}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        report.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : report.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1.5">
                      Target: {report.targetTitle || `ID: ${report.targetId}`}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Reported by {report.reporterName || 'Student Peer'} · {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="text-xs text-neutral-500 font-mono">
                    Target Author: {report.targetAuthorName || 'Campus Member'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs">
                  <p className="text-[11px] font-mono uppercase text-neutral-500 mb-1">Reason for Flag:</p>
                  <p className="text-neutral-200 leading-relaxed">{report.reason}</p>
                  {report.actionTaken && (
                    <div className="mt-2 pt-2 border-t border-neutral-900 text-emerald-400">
                      <span className="font-semibold">Action Record:</span> {report.actionTaken}
                    </div>
                  )}
                </div>

                {isPending && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex-1 max-w-md">
                      <select
                        value={resolutionAction}
                        onChange={(e) => setResolutionAction(e.target.value)}
                        className="w-full p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none"
                      >
                        <option value="Removed violating content and warned author">
                          Remove content + issue warning
                        </option>
                        <option value="Temporarily suspended author for repeated violation">
                          Suspend user account
                        </option>
                        <option value="Approved content with faculty disclaimer">
                          Content approved with disclaimer
                        </option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDismiss(report)}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-semibold cursor-pointer"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() => handleResolve(report)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow"
                      >
                        Enforce Action
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
