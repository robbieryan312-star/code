'use client';

import { useState } from 'react';
import { mockElections } from '@/lib/data/mockElections';
import Link from 'next/link';
import { Calendar, MapPin, Users, DollarSign, ArrowRight, Filter, Vote } from 'lucide-react';

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const partyColors: Record<string, string> = {
  Democrat: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Republican: 'bg-red-500/20 text-red-400 border-red-500/30',
  Independent: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

export default function ElectionsPage() {
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  const filtered = mockElections.filter((e) => {
    if (upcomingOnly && !e.isUpcoming) return false;
    if (levelFilter && e.level !== levelFilter) return false;
    if (stateFilter && e.stateCode !== stateFilter) return false;
    return true;
  });

  const states = [...new Set(mockElections.map((e) => e.stateCode))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Elections</h1>
        <p className="text-gray-400">Find upcoming elections and research every candidate</p>
      </div>

      {/* Filters */}
      <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />

          <button
            onClick={() => setUpcomingOnly(!upcomingOnly)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              upcomingOnly ? 'bg-[#c8a951] text-[#0a1628] border-[#c8a951] font-semibold' : 'border-[#1e3a5f] text-gray-400 hover:text-white'
            }`}
          >
            Upcoming Only
          </button>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-[#c8a951]"
          >
            <option value="">All Levels</option>
            <option value="federal">Federal</option>
            <option value="state">State</option>
            <option value="local">Local</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-[#c8a951]"
          >
            <option value="">All States</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-4">{filtered.length} elections</p>

      <div className="space-y-5">
        {filtered.map((election) => (
          <div key={election.id} className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] overflow-hidden">
            {/* Election Header */}
            <div className="p-5 border-b border-[#1e3a5f]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      election.level === 'federal' ? 'bg-blue-400/20 text-blue-400' :
                      election.level === 'state' ? 'bg-purple-400/20 text-purple-400' :
                      'bg-green-400/20 text-green-400'
                    }`}>
                      {election.level.charAt(0).toUpperCase() + election.level.slice(1)}
                    </span>
                    {election.isPrimary && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-400/20 text-orange-400">Primary</span>
                    )}
                    {election.isUpcoming && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#c8a951]/20 text-[#c8a951]">Upcoming</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{election.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(election.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {election.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {election.candidates.length} candidates
                    </span>
                  </div>
                </div>

                {election.registrationDeadline && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-0.5">Registration Deadline</div>
                    <div className="text-white font-medium text-sm">
                      {new Date(election.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Candidates */}
            <div className="p-5">
              <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Candidates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {election.candidates.map((candidate) => (
                  <div key={candidate.id} className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-white font-semibold">{candidate.name}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${partyColors[candidate.party] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                          {candidate.party}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[#c8a951] font-bold text-sm">{formatMoney(candidate.fundsRaised)}</div>
                        <div className="text-gray-500 text-xs">raised</div>
                      </div>
                    </div>

                    {/* Top Issues */}
                    <div className="space-y-1.5 mb-3">
                      {candidate.topIssues.slice(0, 2).map((issue) => (
                        <div key={issue.name} className="text-xs">
                          <span className="text-[#c8a951] font-medium">{issue.name}: </span>
                          <span className="text-gray-400">{issue.position}</span>
                        </div>
                      ))}
                    </div>

                    {/* Endorsements */}
                    {candidate.endorsements.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {candidate.endorsements.slice(0, 3).map((e) => (
                          <span key={e} className="text-xs bg-[#1e3a5f] text-gray-400 px-1.5 py-0.5 rounded">
                            {e}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Link to existing politician profile */}
                    {candidate.incumbentId && (
                      <Link
                        href={`/politicians/${candidate.incumbentId}`}
                        className="mt-3 flex items-center gap-1 text-xs text-[#c8a951] hover:text-white transition-colors"
                      >
                        View full record <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/compare?election=${election.id}`}
                  className="flex items-center gap-1.5 text-sm bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Vote className="h-4 w-4" />
                  Compare Candidates
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-600" />
          <p className="text-lg">No elections match your filters</p>
          <button onClick={() => { setLevelFilter(''); setStateFilter(''); setUpcomingOnly(false); }} className="mt-3 text-sm text-[#c8a951] hover:text-white">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
