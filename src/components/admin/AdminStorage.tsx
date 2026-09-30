/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  HardDrive, 
  Video, 
  Music, 
  FolderTree, 
  FileText, 
  Database,
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const AdminStorage: React.FC = () => {
  const metrics = storageService.getStorageMetrics();
  const pctUsed = Math.round((metrics.totalUsedMb / metrics.maxCapacityMb) * 100);

  const BUCKETS = [
    {
      path: '/videos/',
      label: 'Vertical Talent Reels',
      usedMb: metrics.videosUsedMb,
      quotaMb: 6144, // 6 GB
      icon: Video,
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
    },
    {
      path: '/songs/',
      label: 'Original Audio Tracks & Choirs',
      usedMb: metrics.songsUsedMb,
      quotaMb: 2048, // 2 GB
      icon: Music,
      color: 'bg-sky-500',
      textColor: 'text-sky-400',
    },
    {
      path: '/profiles/',
      label: 'Avatars & Student Portfolio Media',
      usedMb: metrics.profilesUsedMb,
      quotaMb: 1024, // 1 GB
      icon: HardDrive,
      color: 'bg-violet-500',
      textColor: 'text-violet-400',
    },
    {
      path: '/posts/',
      label: 'Community Buzz Image Attachments',
      usedMb: metrics.postsUsedMb,
      quotaMb: 1024, // 1 GB
      icon: FileText,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Cloud Storage & Media Buckets
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Supabase Storage bucket allocation, CDN delivery bandwidth, and quota telemetry
        </p>
      </div>

      {/* Main Quota Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">St. Jude Academy Storage Quota</h3>
              <p className="text-xs text-neutral-400">High-performance CDN with automatic WebP/H.264 transcoding</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-white">
              {(metrics.totalUsedMb / 1024).toFixed(2)} GB
            </span>
            <span className="text-xs text-neutral-500 font-mono"> / {(metrics.maxCapacityMb / 1024).toFixed(0)} GB</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
          {BUCKETS.map((b) => (
            <div
              key={b.path}
              className={`h-full ${b.color}`}
              style={{ width: `${(b.usedMb / metrics.maxCapacityMb) * 100}%` }}
              title={`${b.label}: ${b.usedMb} MB`}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 pt-1">
          <span>{pctUsed}% total capacity utilized</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> All media buckets healthy
          </span>
        </div>
      </div>

      {/* Bucket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BUCKETS.map((bucket) => {
          const Icon = bucket.icon;
          const bPct = Math.round((bucket.usedMb / bucket.quotaMb) * 100);
          return (
            <div
              key={bucket.path}
              className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-neutral-800 ${bucket.textColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{bucket.label}</h4>
                    <p className="font-mono text-[10px] text-neutral-400">{bucket.path}</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-white">
                  {bucket.usedMb} MB
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${bucket.color}`}
                  style={{ width: `${bPct}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-neutral-500 pt-1">
                <span>{bPct}% of bucket quota</span>
                <span>Limit: {(bucket.quotaMb / 1024).toFixed(1)} GB</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
