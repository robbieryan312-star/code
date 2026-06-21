'use client';

import { useState } from 'react';
import { StockTrade } from '@/lib/types';
import { TrendingUp, TrendingDown, AlertTriangle, Info, ArrowUpDown } from 'lucide-react';

type SortKey = 'date' | 'amount' | 'gain_pct' | 'conflict';

function GainLossBadge({ trade }: { trade: StockTrade }) {
  if (trade.purchasePriceApprox == null || trade.currentPrice == null || trade.type !== 'Purchase') return null;
  const pct = ((trade.currentPrice - trade.purchasePriceApprox) / trade.purchasePriceApprox) * 100;
  const positive = pct >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <div className={`flex items-center gap-1 text-xs font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
      <Icon className="h-3 w-3" />
      {positive ? '+' : ''}{pct.toFixed(1)}%
      <span className="text-xs font-normal opacity-60">since purchase</span>
    </div>
  );
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function ConflictBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'text-red-400 bg-red-400/10 border-red-400/30' :
    score >= 40 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
    'text-green-400 bg-green-400/10 border-green-400/30';
  const label = score >= 70 ? 'High Conflict' : score >= 40 ? 'Medium Conflict' : 'Low Conflict';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${color} flex items-center gap-1`}>
      <AlertTriangle className="h-3 w-3" />
      {label} ({score})
    </span>
  );
}

export default function StockTrades({ trades, name }: { trades: StockTrade[]; name: string }) {
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function toggleSort(k: SortKey) {
    if (sortBy === k) setSortDir((d) => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(k); setSortDir('desc'); }
  }

  const sorted = [...trades].sort((a, b) => {
    let va: number, vb: number;
    if (sortBy === 'date') {
      va = new Date(a.date).getTime(); vb = new Date(b.date).getTime();
    } else if (sortBy === 'amount') {
      va = a.amount; vb = b.amount;
    } else if (sortBy === 'gain_pct') {
      const pctA = (a.purchasePriceApprox != null && a.currentPrice != null) ? ((a.currentPrice - a.purchasePriceApprox) / a.purchasePriceApprox) * 100 : -Infinity;
      const pctB = (b.purchasePriceApprox != null && b.currentPrice != null) ? ((b.currentPrice - b.purchasePriceApprox) / b.purchasePriceApprox) * 100 : -Infinity;
      va = pctA; vb = pctB;
    } else {
      va = a.conflictScore; vb = b.conflictScore;
    }
    return sortDir === 'desc' ? vb - va : va - vb;
  });

  if (trades.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-10 w-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">No stock trades reported for {name}</p>
        <p className="text-gray-500 text-xs mt-1">Stock disclosures are required under the STOCK Act (2012)</p>
      </div>
    );
  }

  const highConflict = trades.filter((t) => t.conflictScore >= 70);
  const totalValue = trades.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5">
      {/* Warning Banner */}
      {highConflict.length > 0 && (
        <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-400 font-semibold text-sm">Potential Conflicts of Interest Detected</div>
              <p className="text-gray-300 text-xs mt-1">
                {highConflict.length} stock trade{highConflict.length > 1 ? 's' : ''} may conflict with official duties or votes.
                Conflict scores are calculated based on committee assignments and related votes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-white">{trades.length}</div>
          <div className="text-xs text-gray-400">Total Trades</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-[#c8a951]">{formatMoney(totalValue)}</div>
          <div className="text-xs text-gray-400">Total Value</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-red-400/20 text-center">
          <div className="text-2xl font-bold text-red-400">{highConflict.length}</div>
          <div className="text-xs text-gray-400">High Conflicts</div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 mb-1">
        <span className="text-xs text-gray-500 self-center"><ArrowUpDown className="inline h-3 w-3 mr-1" />Sort:</span>
        {([['date', 'Recent'], ['amount', 'Amount'], ['gain_pct', 'Gain/Loss %'], ['conflict', 'Conflict']] as [SortKey, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => toggleSort(k)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              sortBy === k ? 'bg-[#c8a951] text-[#0a1628]' : 'bg-[#0a1628] text-gray-400 border border-[#1e3a5f] hover:border-[#c8a951]'
            }`}
          >
            {label}{sortBy === k ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
          </button>
        ))}
      </div>

      {/* Trade List */}
      <div className="space-y-3">
        {sorted.map((trade) => (
          <div
            key={trade.id}
            className={`bg-[#0d1f35] rounded-xl p-4 border ${
              trade.conflictScore >= 70 ? 'border-red-400/30' :
              trade.conflictScore >= 40 ? 'border-yellow-400/30' : 'border-[#1e3a5f]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                    trade.type === 'Purchase' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                  }`}>
                    {trade.ticker}
                  </span>
                  <span className="text-white font-medium text-sm">{trade.companyName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    trade.type === 'Purchase' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                  }`}>
                    {trade.type === 'Purchase' ? '↑' : '↓'} {trade.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>Traded: {new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>Disclosed: {new Date(trade.disclosureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className={`px-2 py-0.5 rounded-full ${trade.daysToDisclose > 30 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-[#1e3a5f]'}`}>
                    {trade.daysToDisclose}d disclosure
                  </span>
                  <span className="px-2 py-0.5 bg-[#1e3a5f] rounded-full">{trade.sector}</span>
                </div>

                {trade.purchasePriceApprox != null && (
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                    <span className="text-gray-500">At trade: <span className="text-gray-300">${trade.purchasePriceApprox.toFixed(2)}</span></span>
                    {trade.currentPrice != null && (
                      <span className="text-gray-500">Current: <span className="text-gray-300">${trade.currentPrice.toFixed(2)}</span></span>
                    )}
                    <GainLossBadge trade={trade} />
                  </div>
                )}

                {(trade.relatedVotes?.length || trade.relatedCommittees?.length) && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {trade.relatedVotes?.map((v) => (
                      <span key={v} className="text-xs px-2 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded">
                        Related Vote: {v}
                      </span>
                    ))}
                    {trade.relatedCommittees?.map((c) => (
                      <span key={c} className="text-xs px-2 py-0.5 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded">
                        Committee: {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2">
                  <ConflictBadge score={trade.conflictScore} />
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-white font-bold">{formatMoney(trade.amount)}</div>
                <div className="text-gray-500 text-xs">
                  {formatMoney(trade.amountMin)} – {formatMoney(trade.amountMax)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500 bg-[#0d1f35] rounded-lg p-3 border border-[#1e3a5f]">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          Stock trade disclosures are required under the STOCK Act (Stop Trading on Congressional Knowledge Act, 2012).
          Conflict scores are computed by cross-referencing trade dates with related committee memberships and floor votes.
          Ranges shown because Congress reports value ranges rather than exact amounts.
        </p>
      </div>
    </div>
  );
}
