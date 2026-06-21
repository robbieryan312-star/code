'use client';

import { mockPoliticians } from '@/lib/data/mockPoliticians';
import { TrendingUp, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function CongressStocksPage() {
  const allTrades = mockPoliticians.flatMap((p) =>
    p.stockTrades.map((t) => ({ ...t, politician: p.name, politicianId: p.id, party: p.party }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const highConflict = allTrades.filter((t) => t.conflictScore >= 70);
  const totalValue = allTrades.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Congressional Stock Trades</h1>
        <p className="text-gray-400">STOCK Act disclosures cross-referenced with committee assignments and votes</p>
      </div>

      {/* STOCK Act Info */}
      <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f] mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-white font-semibold mb-1">STOCK Act (2012)</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The Stop Trading on Congressional Knowledge Act requires members of Congress to disclose stock trades
              worth more than $1,000 within 30-45 days. The Ledger cross-references each trade with committee
              memberships and related votes to compute a conflict-of-interest score (0–100).
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-white">{allTrades.length}</div>
          <div className="text-xs text-gray-400">Total Trades</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-[#c8a951]">{formatMoney(totalValue)}</div>
          <div className="text-xs text-gray-400">Total Value</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-red-400/30 text-center">
          <div className="text-2xl font-bold text-red-400">{highConflict.length}</div>
          <div className="text-xs text-gray-400">High Conflicts</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-white">
            {new Set(allTrades.map((t) => t.politicianId)).size}
          </div>
          <div className="text-xs text-gray-400">Politicians with Trades</div>
        </div>
      </div>

      {/* High Conflict Alert */}
      {highConflict.length > 0 && (
        <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="text-red-400 font-semibold">{highConflict.length} High-Conflict Trades Detected</div>
          </div>
          <p className="text-gray-300 text-sm">
            These trades show significant correlation between the trade date, the trader&apos;s committee assignments,
            and related legislation or votes — indicating a potential conflict of interest.
          </p>
        </div>
      )}

      {/* Trade List */}
      <div className="space-y-3">
        {allTrades.length === 0 ? (
          <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] p-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No stock trades in current data sample</p>
            <p className="text-gray-500 text-sm mt-1">Real trades pulled from Senate/House Stock Watcher APIs</p>
          </div>
        ) : (
          allTrades.map((trade) => (
            <div
              key={trade.id}
              className={`bg-[#0d1f35] rounded-xl p-4 border ${
                trade.conflictScore >= 70 ? 'border-red-400/30' :
                trade.conflictScore >= 40 ? 'border-yellow-400/30' : 'border-[#1e3a5f]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                      trade.type === 'Purchase' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                    }`}>
                      {trade.ticker}
                    </span>
                    <span className="text-white font-medium">{trade.companyName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      trade.type === 'Purchase' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                    }`}>
                      {trade.type}
                    </span>
                    <span className="text-xs bg-[#1e3a5f] text-gray-300 px-2 py-0.5 rounded-full">{trade.sector}</span>
                  </div>

                  <Link href={`/politicians/${trade.politicianId}?tab=stocks`} className="flex items-center gap-1.5 text-sm text-[#c8a951] hover:text-white transition-colors mb-2">
                    <div className={`text-xs px-1.5 py-0.5 rounded ${
                      trade.party === 'Democrat' ? 'bg-blue-500/20 text-blue-400' :
                      trade.party === 'Republican' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>{trade.party[0]}</div>
                    {trade.politician}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-2">
                    <span>Traded: {new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>Disclosed: {new Date(trade.disclosureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {(trade.relatedVotes?.length || trade.relatedCommittees?.length) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {trade.relatedVotes?.map((v) => (
                        <span key={v} className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded">
                          Vote: {v}
                        </span>
                      ))}
                      {trade.relatedCommittees?.map((c) => (
                        <span key={c} className="text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20 px-2 py-0.5 rounded">
                          Committee: {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                    trade.conflictScore >= 70 ? 'text-red-400 bg-red-400/10 border-red-400/30' :
                    trade.conflictScore >= 40 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
                    'text-green-400 bg-green-400/10 border-green-400/30'
                  }`}>
                    <AlertTriangle className="h-3 w-3" />
                    {trade.conflictScore >= 70 ? 'High' : trade.conflictScore >= 40 ? 'Medium' : 'Low'} Conflict
                    ({trade.conflictScore}/100)
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-white font-bold text-lg">{formatMoney(trade.amount)}</div>
                  <div className="text-gray-500 text-xs">{formatMoney(trade.amountMin)}–{formatMoney(trade.amountMax)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
