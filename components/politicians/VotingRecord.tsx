'use client';

import { useState } from 'react';
import { VoteRecord } from '@/lib/types';
import { CheckCircle, XCircle, MinusCircle, AlertTriangle, Filter } from 'lucide-react';

const categories = ['All', 'Climate/Economy', 'Healthcare', 'Budget', 'Technology/Economy', 'Infrastructure', 'Gun Safety', 'Democracy', 'Tax Policy'];

export default function VotingRecord({ votes }: { votes: VoteRecord[] }) {
  const [filter, setFilter] = useState('All');
  const [showConflicts, setShowConflicts] = useState(false);

  const filtered = votes.filter((v) => {
    if (filter !== 'All' && v.category !== filter) return false;
    if (showConflicts && v.alignsWithDonors !== false) return false;
    return true;
  });

  const voteIcon = (vote: string) => {
    if (vote === 'Yea') return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (vote === 'Nay') return <XCircle className="h-5 w-5 text-red-400" />;
    return <MinusCircle className="h-5 w-5 text-gray-400" />;
  };

  const yeas = votes.filter((v) => v.vote === 'Yea').length;
  const nays = votes.filter((v) => v.vote === 'Nay').length;
  const conflicts = votes.filter((v) => v.alignsWithDonors === true).length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-green-400/20 text-center">
          <div className="text-2xl font-bold text-green-400">{yeas}</div>
          <div className="text-xs text-gray-400">Yea Votes</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-red-400/20 text-center">
          <div className="text-2xl font-bold text-red-400">{nays}</div>
          <div className="text-xs text-gray-400">Nay Votes</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-yellow-400/20 text-center">
          <div className="text-2xl font-bold text-yellow-400">{conflicts}</div>
          <div className="text-xs text-gray-400">Donor Aligned</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-gray-400" />
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                filter === cat
                  ? 'bg-[#c8a951] text-[#0a1628] border-[#c8a951] font-semibold'
                  : 'border-[#1e3a5f] text-gray-400 hover:border-[#c8a951] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowConflicts(!showConflicts)}
          className={`ml-auto text-xs px-3 py-1 rounded-full border transition-colors flex items-center gap-1 ${
            showConflicts
              ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/40'
              : 'border-[#1e3a5f] text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
          }`}
        >
          <AlertTriangle className="h-3 w-3" />
          Donor Conflicts Only
        </button>
      </div>

      {/* Vote List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No votes match this filter</div>
        ) : (
          filtered.map((vote) => (
            <div
              key={vote.id}
              className={`bg-[#0d1f35] rounded-xl p-4 border transition-colors ${
                vote.alignsWithDonors ? 'border-yellow-400/30' : 'border-[#1e3a5f]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{voteIcon(vote.vote)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="text-white font-medium text-sm">{vote.billTitle}</span>
                    <span className="text-xs text-gray-500 font-mono">{vote.billId}</span>
                    {vote.alignsWithDonors && (
                      <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="h-3 w-3" />
                        Donor Aligned
                      </span>
                    )}
                    {vote.alignsWithCampaign === false && (
                      <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/30 px-2 py-0.5 rounded-full">
                        Broke Campaign Stance
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{vote.billDescription}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{new Date(vote.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="px-2 py-0.5 bg-[#1e3a5f] rounded-full">{vote.category}</span>
                    <span className={vote.result === 'Passed' ? 'text-green-400' : 'text-red-400'}>
                      Bill {vote.result}
                    </span>
                  </div>
                </div>
                <div className={`flex-shrink-0 text-sm font-bold ${vote.vote === 'Yea' ? 'text-green-400' : vote.vote === 'Nay' ? 'text-red-400' : 'text-gray-400'}`}>
                  {vote.vote}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
