'use client';

import { StockTrade } from '@/lib/types';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';

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

      {/* Trade List */}
      <div className="space-y-3">
        {trades.map((trade) => (
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
                  <span className="px-2 py-0.5 bg-[#1e3a5f] rounded-full">{trade.sector}</span>
                </div>

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
