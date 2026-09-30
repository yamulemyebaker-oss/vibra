/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  ExternalLink,
  Edit2,
  X
} from 'lucide-react';
import { School } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const AdminSchools: React.FC = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { showToast } = useNotification();

  const [schools, setSchools] = useState<School[]>(() => storageService.getSchools());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newSchool, setNewSchool] = useState({
    name: '',
    code: '',
    district: 'Metropolitan Unified Arts District 4',
    address: '',
    city: 'San Francisco',
    state: 'CA',
    studentCount: 500,
    facultyCount: 40,
    capacity: 800,
    principal: '',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    academicYear: '2025-2026',
    foundedYear: 2020,
    status: 'active' as const
  });

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name || !newSchool.code) {
      showToast('Please enter both school name and code.', 'error');
      return;
    }

    const created = storageService.addSchool(newSchool, currentUser);
    setSchools(storageService.getSchools());
    setIsAddModalOpen(false);
    showToast(`Registered affiliate school "${created.name}".`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-amber-400" />
            <span>School Campuses & District Network</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage multi-campus talent hubs, inter-school tournaments, and district affiliations
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Affiliate School</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80">
          <p className="text-xs text-neutral-400 font-medium">Affiliated Campuses</p>
          <p className="text-3xl font-black text-white mt-1">{schools.length}</p>
          <p className="text-[11px] text-emerald-400 font-mono mt-1">100% active syndication</p>
        </div>
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80">
          <p className="text-xs text-neutral-400 font-medium">Network Student Population</p>
          <p className="text-3xl font-black text-violet-400 mt-1">
            {schools.reduce((acc, s) => acc + s.studentCount, 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 font-mono mt-1">Across California Arts District</p>
        </div>
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80">
          <p className="text-xs text-neutral-400 font-medium">Certified Faculty Roster</p>
          <p className="text-3xl font-black text-sky-400 mt-1">
            {schools.reduce((acc, s) => acc + s.facultyCount, 0)}
          </p>
          <p className="text-[11px] text-neutral-400 font-mono mt-1">Patrons, Mentors & Judges</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter campuses by name, district, or code..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Schools List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchools.map((school) => {
          const isPrimary = school.id === 'school-st-jude';
          return (
            <div
              key={school.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                isPrimary
                  ? 'bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-violet-950/20 border-violet-500/40 shadow-xl shadow-violet-900/10 ring-1 ring-violet-500/20'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={school.logoUrl}
                      alt={school.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {school.code}
                        </span>
                        {isPrimary && (
                          <span className="text-[10px] font-mono uppercase bg-violet-600 text-white px-2 py-0.5 rounded font-bold">
                            Host Academy
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-base mt-1 leading-snug">
                        {school.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{school.address}, {school.city}, {school.state}</span>
                </p>

                <p className="text-xs text-neutral-500 mt-1 font-mono">
                  District: {school.district}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase font-mono">Students</span>
                    <p className="font-bold text-white">{school.studentCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase font-mono">Faculty</span>
                    <p className="font-bold text-white">{school.facultyCount}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase font-mono">Principal / Head</span>
                    <p className="font-bold text-neutral-300 truncate">{school.principal}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase font-mono">Capacity</span>
                    <p className="font-bold text-neutral-300">{school.capacity} seats</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Vibra Hub Active</span>
                </span>

                <span className="text-neutral-500 text-[11px] font-mono">
                  Est. {school.foundedYear}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add School Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Register Affiliate School</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Add a partner academy to the Vibra talent network for inter-school competitions
            </p>

            <form onSubmit={handleCreateSchool} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">School Full Name</label>
                <input
                  type="text"
                  required
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  placeholder="e.g. Oakridge Performing Arts Academy"
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">School Code</label>
                  <input
                    type="text"
                    required
                    value={newSchool.code}
                    onChange={(e) => setNewSchool({ ...newSchool, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. OPA-ARTS-04"
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newSchool.city}
                    onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                    placeholder="San Francisco"
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">District / Network</label>
                <input
                  type="text"
                  value={newSchool.district}
                  onChange={(e) => setNewSchool({ ...newSchool, district: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Principal / Director</label>
                  <input
                    type="text"
                    value={newSchool.principal}
                    onChange={(e) => setNewSchool({ ...newSchool, principal: e.target.value })}
                    placeholder="Dr. Jane Doe"
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Student Enrollment</label>
                  <input
                    type="number"
                    value={newSchool.studentCount}
                    onChange={(e) => setNewSchool({ ...newSchool, studentCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow"
                >
                  Register Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
