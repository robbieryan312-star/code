'use client';

import { useState } from 'react';
import { mockPoliticians, mockStates } from '@/lib/data/mockPoliticians';
import { Politician, Party, Level, Chamber } from '@/lib/types';
import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';
import { Filter, TrendingUp, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const partyColors: Record<string, string> = {
  Democrat: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Republican: 'bg-red-500/20 text-red-400 border-red-500/30',
  Independent: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  Green: 'bg-green-500/20 text-green-400 border-green-500/30',
  Libertarian: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export default function PoliticiansPage() {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedParty, setSelectedParty] = useState<string>('');
  const [selectedChamber, setSelectedChamber] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'consistency' | 'lobbyist'>('name');

  const filtered = mockPoliticians
    .filter((p) => {
      if (selectedState && p.stateCode !== selectedState) return false;
      if (selectedParty && p.party !== selectedParty) return false;
      if (selectedChamber && p.chamber !== selectedChamber) return false;
      if (selectedLevel && p.level !== selectedLevel) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'consistency') return b.consistency.overallScore - a.consistency.overallScore;
      if (sortBy === 'lobbyist') {
        const aL = a.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
        const bL = b.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
        return bL - aL;
      }
      return a.lastName.localeCompare(b.lastName);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Politicians</h1>
        <p className="text-gray-400">Browse every politician with objective, verified records</p>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-gray-300 text-sm font-medium">Filter & Sort</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#c8a951]"
          >
            <option value="">All States</option>
            {mockStates.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#c8a951]"
          >
            <option value="">All Parties</option>
            {['Democrat', 'Republican', 'Independent', 'Green', 'Libertarian'].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={selectedChamber}
            onChange={(e) => setSelectedChamber(e.target.value)}
            className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#c8a951]"
          >
            <option value="">All Chambers</option>
            {['senate', 'house', 'governor', 'state_senate', 'state_house', 'mayor', 'city_council'].map((c) => (
              <option key={c} value={c}>{c.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#c8a951]"
          >
            <option value="">All Levels</option>
            <option value="federal">Federal</option>
            <option value="state">State</option>
            <option value="local">Local</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'consistency' | 'lobbyist')}
            className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#c8a951]"
          >
            <option value="name">Sort: Name</option>
            <option value="consistency">Sort: Consistency Score</option>
            <option value="lobbyist">Sort: Lobbyist Money</option>
          </select>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-4">{filtered.length} politicians shown</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((politician) => {
          const lobbyistTotal = politician.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
          return (
            <Link
              key={politician.id}
              href={`/politicians/${politician.id}`}
              className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f] hover:border-[#c8a951] transition-colors group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {politician.imageUrl ? (
                    <img src={politician.imageUrl} alt={politician.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#c8a951] font-bold text-xl">
                      {politician.firstName[0]}{politician.lastName[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold group-hover:text-[#c8a951] transition-colors truncate">
                    {politician.name}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    {politician.chamber.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} · {politician.state}
                  </div>
                  <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full border ${partyColors[politician.party] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                    {politician.party}
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-2 border-t border-[#1e3a5f] pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Consistency Score
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-[#1e3a5f] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${politician.consistency.overallScore >= 75 ? 'bg-green-400' : politician.consistency.overallScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${politician.consistency.overallScore}%` }}
                      />
                    </div>
                    <span className={`font-bold ${politician.consistency.overallScore >= 75 ? 'text-green-400' : politician.consistency.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {politician.consistency.overallScore}/100
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Total Raised
                  </span>
                  <span className="text-white font-medium">{formatMoney(politician.campaignFinance.totalRaised)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`flex items-center gap-1 ${lobbyistTotal > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    <AlertTriangle className="h-3 w-3" /> Lobbyist $
                  </span>
                  <span className={`font-medium ${lobbyistTotal > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {lobbyistTotal > 0 ? formatMoney(lobbyistTotal) : 'None'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Votes Recorded</span>
                  <span className="text-white">{politician.votingRecord.length}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-[#c8a951] flex items-center gap-1 group-hover:gap-2 transition-all">
                View Full Profile <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No politicians match your filters</p>
          <p className="text-sm mt-1">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
