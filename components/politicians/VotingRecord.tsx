'use client';

import { useState } from 'react';
import { VoteRecord } from '@/lib/types';
import { CheckCircle, XCircle, MinusCircle, AlertTriangle, Filter, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Climate/Economy', 'Healthcare', 'Budget', 'Technology/Economy', 'Infrastructure', 'Gun Safety', 'Democracy', 'Tax Policy', 'Foreign Policy', 'Guns', 'Civil Liberties', 'National Security'];

function VoteRow({ vote }: { vote: VoteRecord }) {
  const [open, setOpen] = useState(false);

  const voteColor =
    vote.vote === 'Yea' ? 'text-green-400' :
    vote.vote === 'Nay' ? 'text-red-400' : 'text-gray-400';

  const VoteIcon =
    vote.vote === 'Yea' ? CheckCircle :
    vote.vote === 'Nay' ? XCircle : MinusCircle;

  const hasBadge = vote.alignsWithDonors || vote.alignsWithCampaign === false;

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      vote.alignsWithDonors ? 'border-yellow-400/30' :
      vote.alignsWithCampaign === false ? 'border-red-400/20' :
      'border-[#1e3a5f]'
    } ${open ? 'bg-[#0a1628]' : ''}`}>

      {/* Collapsed headline row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1e3a5f]/30 transition-colors text-left"
      >
        <VoteIcon className={`h-4 w-4 flex-shrink-0 ${voteColor}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-sm font-medium leading-snug">{vote.billTitle}</span>
            <span className="text-gray-600 text-xs font-mono">{vote.billId}</span>
          </div>
          {hasBadge && (
            <div className="flex items-center gap-1.5 mt-0.5">
              {vote.alignsWithDonors && (
                <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0 rounded-full border border-yellow-400/20">
                  <AlertTriangle className="h-3 w-3" /> Donor Aligned
                </span>
              )}
              {vote.alignsWithCampaign === false && (
                <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0 rounded-full border border-red-400/20">
                  Broke Campaign Stance
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold ${voteColor}`}>{vote.vote}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${vote.result === 'Passed' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
            {vote.result}
          </span>
          {open ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-4 border-t border-[#1e3a5f] bg-[#06101e]/50 space-y-2.5">
          <p className="text-gray-300 text-sm leading-relaxed mt-3">{vote.billDescription}</p>

          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span>{new Date(vote.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="px-2 py-0.5 bg-[#1e3a5f] rounded-full text-gray-400">{vote.category}</span>
          </div>

          {/* Source link */}
          <div className="flex items-center gap-2 pt-1">
            <div className={`text-xs px-2 py-0.5 rounded font-medium ${
              vote.source.tier === 'official'    ? 'bg-green-500/15 text-green-400' :
              vote.source.tier === 'nonpartisan' ? 'bg-blue-500/15 text-blue-400' :
              'bg-gray-500/15 text-gray-400'
            }`}>{vote.source.tier}</div>
            {vote.source.url ? (
              <a
                href={vote.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#c8a951] hover:text-white transition-colors font-medium"
              >
                {vote.source.name} — View official record <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-xs text-gray-500">Source: {vote.source.name}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VotingRecord({ votes }: { votes: VoteRecord[] }) {
  const [filter, setFilter]           = useState('All');
  const [showConflicts, setShowConflicts] = useState(false);

  const activeCategories = ['All', ...Array.from(new Set(votes.map(v => v.category)))];

  const filtered = votes.filter((v) => {
    if (filter !== 'All' && v.category !== filter) return false;
    if (showConflicts && !v.alignsWithDonors && v.alignsWithCampaign !== false) return false;
    return true;
  });

  const yeas      = votes.filter(v => v.vote === 'Yea').length;
  const nays      = votes.filter(v => v.vote === 'Nay').length;
  const conflicts = votes.filter(v => v.alignsWithDonors).length;
  const broken    = votes.filter(v => v.alignsWithCampaign === false).length;

  if (votes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        <p>No voting record available for this official.</p>
        <p className="text-xs mt-1 text-gray-600">Governors and local officials do not hold Congressional voting records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-green-400/20 text-center">
          <div className="text-xl font-bold text-green-400">{yeas}</div>
          <div className="text-xs text-gray-500">Yea</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-red-400/20 text-center">
          <div className="text-xl font-bold text-red-400">{nays}</div>
          <div className="text-xs text-gray-500">Nay</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-yellow-400/20 text-center">
          <div className="text-xl font-bold text-yellow-400">{conflicts}</div>
          <div className="text-xs text-gray-500">Donor Aligned</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-red-400/20 text-center">
          <div className="text-xl font-bold text-orange-400">{broken}</div>
          <div className="text-xs text-gray-500">Broke Stance</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <Filter className="h-4 w-4 text-gray-500" />
          {activeCategories.map((cat) => (
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
          className={`self-start flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            showConflicts
              ? 'bg-yellow-400/15 text-yellow-400 border-yellow-400/40'
              : 'border-[#1e3a5f] text-gray-500 hover:border-yellow-400 hover:text-yellow-400'
          }`}
        >
          <AlertTriangle className="h-3 w-3" /> Flagged Votes Only
        </button>
      </div>

      {/* Info note */}
      <p className="text-xs text-gray-600">
        Click any vote to see full bill description and source. All records sourced from Congress.gov official roll calls.
      </p>

      {/* Vote rows */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">No votes match this filter</div>
        ) : (
          filtered.map(vote => <VoteRow key={vote.id} vote={vote} />)
        )}
      </div>
    </div>
  );
}
