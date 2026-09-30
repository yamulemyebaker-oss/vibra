/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Trophy, 
  Vote, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { SchoolEvent, EventType } from '../../types';

export const EventsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});
  const [hasVotedForCompetition, setHasVotedForCompetition] = useState<Record<string, string>>({});
  
  const { showToast } = useNotification();
  const { currentUser, role, isGuest, canVote } = useAuth();
  const events = storageService.getEvents();

  const filteredEvents = selectedType === 'all'
    ? events
    : events.filter(e => e.type === selectedType);

  const handleRegister = (evt: SchoolEvent) => {
    if (isGuest) {
      showToast('Please sign in as a student to register for events.', 'warning');
      return;
    }
    const ok = storageService.registerForEvent(evt.id);
    if (ok) {
      setRegisteredEvents(prev => ({ ...prev, [evt.id]: true }));
      showToast(`Successfully registered for ${evt.title}!`, 'success');
    }
  };

  const handleCastVote = (contestId: string, contestant: string) => {
    if (isGuest) {
      showToast('Only enrolled students and faculty can cast official competition votes.', 'warning');
      return;
    }
    if (hasVotedForCompetition[contestId]) {
      showToast(`You have already submitted your vote for this competition (${hasVotedForCompetition[contestId]}). Duplicate voting is prevented.`, 'error');
      return;
    }
    setHasVotedForCompetition(prev => ({ ...prev, [contestId]: contestant }));
    showToast(`Official vote recorded for ${contestant}! Thank you for participating.`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-sky-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Events, Contests & Auditions</h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Register for auditions, perform in tournaments, and vote in approved student competitions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
          {['all', 'competition', 'audition', 'concert'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                selectedType === t
                  ? 'bg-sky-600 text-white font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Events' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Events Listing */}
      <div className="space-y-6">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredEvents[evt.id];
          const votedCandidate = hasVotedForCompetition[evt.id];

          return (
            <div
              key={evt.id}
              className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 space-y-6 hover:border-neutral-700 transition-all shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                      {evt.type}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {evt.category}
                    </span>
                    {evt.votingOpen && (
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold animate-pulse">
                        Voting Active
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-white tracking-tight">{evt.title}</h2>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
                    {evt.description}
                  </p>

                  {/* Date, Time, Venue metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-2 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{evt.date}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{evt.time}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{evt.venue}</span>
                    </span>
                  </div>
                </div>

                {/* Right side registration card */}
                <div className="w-full md:w-64 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between shrink-0">
                  <div>
                    <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1">Registration Status</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white">
                        {evt.registeredCount + (isRegistered ? 1 : 0)} / {evt.capacity || 50}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">Open</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegister(evt)}
                    disabled={isRegistered}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                      isRegistered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white hover:bg-neutral-200 text-neutral-950 shadow'
                    }`}
                  >
                    {isRegistered ? 'Spot Confirmed ✓' : 'Register for Event'}
                  </button>
                </div>
              </div>

              {/* Voting Module for Competitions */}
              {evt.type === 'competition' && evt.votingOpen && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/20 to-neutral-950 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Vote className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">Official Audience Ballot</span>
                      <span className="text-[10px] font-mono text-neutral-400">· 1 vote per verified student</span>
                    </div>
                    {votedCandidate && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Voted for: {votedCandidate} ✓
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300">
                    Select one candidate entry below to support. Voting closes at 9:00 PM on competition night.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {[
                      { name: 'Maya Lin', act: 'Acoustic Indie Original', house: 'North House' },
                      { name: 'Horizon Chamber Choir', act: 'Choral Polyphony', house: 'East House' },
                      { name: 'Liam Vance & Jordan Blake', act: 'Electronic Synthesizer Beats', house: 'West House' }
                    ].map((contestant) => {
                      const isVoted = votedCandidate === contestant.name;
                      return (
                        <div
                          key={contestant.name}
                          className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                            isVoted
                              ? 'bg-amber-500/15 border-amber-500 text-white'
                              : 'bg-neutral-900/80 border-neutral-800 text-neutral-300'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-white">{contestant.name}</p>
                            <p className="text-[10px] text-neutral-400">{contestant.act}</p>
                            <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">{contestant.house}</p>
                          </div>
                          <button
                            onClick={() => handleCastVote(evt.id, contestant.name)}
                            disabled={!!votedCandidate}
                            className={`mt-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                              isVoted
                                ? 'bg-amber-500 text-neutral-950'
                                : votedCandidate
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-neutral-800 hover:bg-neutral-750 text-white'
                            }`}
                          >
                            {isVoted ? 'Your Voted Entry' : 'Vote for Candidate'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Event Rules & Announcements Accordion */}
              <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1.5 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Participation Guidelines</span>
                  </p>
                  <ul className="space-y-1 text-[11px] text-neutral-400">
                    {evt.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-neutral-600">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] font-mono uppercase text-neutral-500 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Official Announcements</span>
                  </p>
                  <div className="space-y-1 text-[11px] text-neutral-300">
                    {evt.announcements.map((ann, aIdx) => (
                      <p key={aIdx} className="p-2 rounded-lg bg-neutral-950 border border-neutral-850">
                        {ann}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
