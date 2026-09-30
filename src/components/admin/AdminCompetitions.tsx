/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  Search, 
  Vote, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Award, 
  Users, 
  Calendar, 
  Clock, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { SchoolEvent } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const AdminCompetitions: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [competitions, setCompetitions] = useState<SchoolEvent[]>(() =>
    storageService.getEvents().filter((e) => e.type === 'competition')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComp, setSelectedComp] = useState<SchoolEvent | null>(null);

  const filteredCompetitions = competitions.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organizerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleVoting = (comp: SchoolEvent) => {
    const updatedEvents = storageService.getEvents().map((e) => {
      if (e.id === comp.id) {
        return { ...e, votingOpen: !e.votingOpen };
      }
      return e;
    });

    localStorage.setItem('vibra_events', JSON.stringify(updatedEvents));
    setCompetitions(updatedEvents.filter((e) => e.type === 'competition'));

    const newStatus = !comp.votingOpen ? 'OPEN' : 'LOCKED';
    showToast(`Voting for "${comp.title}" is now ${newStatus}.`, 'info');

    if (currentUser) {
      storageService.addAuditLog(
        'COMPETITION_VOTE_TOGGLE',
        `Competition: ${comp.title}`,
        'success',
        `Voting ballot status changed to ${newStatus}`,
        currentUser
      );
    }
  };

  const handleCrownWinner = (comp: SchoolEvent, winnerName: string, winnerTalent: string) => {
    const updatedEvents = storageService.getEvents().map((e) => {
      if (e.id === comp.id) {
        return { 
          ...e, 
          winnerName, 
          winnerTalent, 
          status: 'completed' as const,
          votingOpen: false 
        };
      }
      return e;
    });

    localStorage.setItem('vibra_events', JSON.stringify(updatedEvents));
    setCompetitions(updatedEvents.filter((e) => e.type === 'competition'));
    showToast(`Crowned ${winnerName} as winner of "${comp.title}"!`, 'success');

    if (currentUser) {
      storageService.addAuditLog(
        'COMPETITION_WINNER_CROWNED',
        `Competition: ${comp.title}`,
        'success',
        `Winner crowned: ${winnerName} (${winnerTalent})`,
        currentUser
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>School Competitions & Voting Governance</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Supervise verified student ballots, anti-fraud single votes, and official tournament titles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
            {competitions.length} Sanctioned Tournaments
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Total Ballots Cast</span>
            <Vote className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">1,842</p>
          <p className="text-[11px] text-emerald-400 font-mono">100% single-student verified</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Open Voting Contests</span>
            <Unlock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-1">
            {competitions.filter((c) => c.votingOpen).length} Active
          </p>
          <p className="text-[11px] text-neutral-400 font-mono">Live ballots available to students</p>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Registered Contestants</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-3xl font-black text-violet-400 mt-1">
            {competitions.reduce((acc, c) => acc + c.registeredCount, 0)}
          </p>
          <p className="text-[11px] text-neutral-400 font-mono">Enrolled performers & teams</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search competition title, category, or organizer..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Competitions Grid */}
      <div className="space-y-4">
        {filteredCompetitions.map((comp) => {
          const isVotingOpen = !!comp.votingOpen;
          return (
            <div
              key={comp.id}
              className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-5 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={comp.coverImage}
                    alt={comp.title}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                        {comp.category}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        isVotingOpen
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {isVotingOpen ? 'Voting Open' : 'Voting Locked'}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Organized by {comp.organizerName}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">{comp.title}</h3>
                    <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleVoting(comp)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isVotingOpen
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {isVotingOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isVotingOpen ? 'Lock Audience Ballots' : 'Unlock Live Voting'}</span>
                  </button>
                </div>
              </div>

              {/* Tournament Details Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs">
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase font-mono">Date & Venue</span>
                  <p className="font-semibold text-white mt-0.5 truncate">{comp.date}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{comp.venue}</p>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase font-mono">Registered Entries</span>
                  <p className="font-semibold text-white mt-0.5">{comp.registeredCount} Students</p>
                  <p className="text-[11px] text-neutral-400">Capacity: {comp.capacity || 50}</p>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase font-mono">Voting Deadline</span>
                  <p className="font-semibold text-white mt-0.5 truncate">
                    {comp.votingDeadline || 'Show Night 9:00 PM'}
                  </p>
                  <p className="text-[11px] text-neutral-400">Audience single ballot</p>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase font-mono">Winner Status</span>
                  {comp.winnerName ? (
                    <p className="font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> {comp.winnerName}
                    </p>
                  ) : (
                    <p className="text-neutral-400 mt-0.5">Not yet declared</p>
                  )}
                </div>
              </div>

              {/* Simulated Leading Contestants */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">
                  Top Contestant Standings (Live Ballot Share)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Maya Lin</p>
                      <p className="text-[10px] text-neutral-400 font-mono">"Algorithm Sunrise" (Acoustic)</p>
                    </div>
                    <span className="font-mono font-bold text-violet-400">42% (774 votes)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Horizon Choir</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Chamber Ensemble A Cappella</p>
                    </div>
                    <span className="font-mono font-bold text-amber-400">36% (663 votes)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Aaliyah Patel</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Contemporary Solo Rehearsal</p>
                    </div>
                    <span className="font-mono font-bold text-rose-400">22% (405 votes)</span>
                  </div>
                </div>
              </div>

              {/* Crown Winner Quick Action */}
              {!comp.winnerName && (
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 text-[11px]">
                    Judges: {comp.judges?.join(', ') || 'Faculty Committee'}
                  </span>
                  <button
                    onClick={() => handleCrownWinner(comp, 'Maya Lin', 'Original Acoustic Performance')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Crown Leading Entry (Maya Lin)</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
