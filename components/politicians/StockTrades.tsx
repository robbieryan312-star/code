'use client';

import { useState } from 'react';
import { StockTrade, TradeTimelineEvent } from '@/lib/types';
import { TrendingUp, TrendingDown, AlertTriangle, Info, ArrowUpDown, ChevronDown, ChevronRight, Vote, MessageSquare, Landmark, BarChart2, FileText, Calendar } from 'lucide-react';

type SortKey = 'date' | 'amount' | 'gain_pct' | 'conflict';

const EVENT_ICONS: Record<TradeTimelineEvent['type'], typeof Vote> = {
  vote: Vote,
  statement: MessageSquare,
  committee_action: Landmark,
  hearing: Landmark,
  bill_signed: FileText,
  market_event: BarChart2,
};

const EVENT_COLORS: Record<TradeTimelineEvent['type'], string> = {
  vote: 'text-blue-400',
  statement: 'text-purple-400',
  committee_action: 'text-orange-400',
  hearing: 'text-orange-400',
  bill_signed: 'text-green-400',
  market_event: 'text-[#c8a951]',
};

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

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

function ConflictBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'text-red-400 bg-red-400/10 border-red-400/30' :
    score >= 40 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
    'text-green-400 bg-green-400/10 border-green-400/30';
  const label = score >= 70 ? 'High Conflict' : score >= 40 ? 'Medium Conflict' : 'Low Conflict';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${color} inline-flex items-center gap-1`}>
      <AlertTriangle className="h-3 w-3" />
      {label} ({score})
    </span>
  );
}

function TradeTimeline({ events, tradeDate }: { events: TradeTimelineEvent[]; tradeDate: string }) {
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const flagged = events.filter((e) => e.isFlagged);

  return (
    <div className="mt-3 border-t border-[#1e3a5f] pt-3">
      {flagged.length > 0 && (
        <div className="flex items-start gap-2 bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-3 text-xs">
          <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-red-400 font-bold">FLAG: </span>
            <span className="text-gray-300">
              {flagged.length} event{flagged.length > 1 ? 's' : ''} in this trade's timeline show potential correlation between the stock position and official actions.
              Correlation is not proof of insider trading — it is presented for informational purposes.
            </span>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Event Timeline</div>

      <div className="relative pl-4">
        {/* Vertical line */}
        <div className="absolute left-1.5 top-0 bottom-0 w-px bg-[#1e3a5f]" />

        <div className="space-y-3">
          {sorted.map((event, i) => {
            const Icon = EVENT_ICONS[event.type];
            const color = EVENT_COLORS[event.type];
            const isTrade = event.daysRelativeToTrade === 0;
            const dayLabel = event.daysRelativeToTrade === 0
              ? 'Trade Date'
              : event.daysRelativeToTrade < 0
                ? `${Math.abs(event.daysRelativeToTrade)}d before trade`
                : `${event.daysRelativeToTrade}d after trade`;

            return (
              <div key={i} className="relative">
                {/* Dot on timeline */}
                <div className={`absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 ${
                  isTrade ? 'bg-[#c8a951] border-[#c8a951]' :
                  event.isFlagged ? 'bg-red-400/30 border-red-400' :
                  'bg-[#0d1f35] border-[#2d5a8e]'
                }`} />

                <div className={`rounded-lg p-2.5 ${
                  isTrade ? 'bg-[#c8a951]/10 border border-[#c8a951]/30' :
                  event.isFlagged ? 'bg-red-400/5 border border-red-400/20' :
                  'bg-[#0a1628]'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        {!isTrade && <Icon className={`h-3 w-3 flex-shrink-0 ${color}`} />}
                        <span className={`text-xs font-semibold ${isTrade ? 'text-[#c8a951]' : 'text-white'}`}>
                          {event.title}
                        </span>
                        {event.isFlagged && !isTrade && (
                          <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0 rounded bg-red-400/15 text-red-400 border border-red-400/30 font-bold">
                            <AlertTriangle className="h-2.5 w-2.5" /> FLAGGED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">{event.description}</p>
                      {event.priceAtEvent != null && (
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span className="text-gray-600">
                            Price: <span className="text-gray-300">${event.priceAtEvent.toFixed(2)}</span>
                          </span>
                          {event.priceChangePct != null && (
                            <span className={`font-bold ${event.priceChangePct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {event.priceChangePct >= 0 ? '+' : ''}{event.priceChangePct.toFixed(1)}% move
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        isTrade ? 'text-[#c8a951]' :
                        event.daysRelativeToTrade < 0 ? 'text-orange-400' : 'text-blue-400'
                      }`}>
                        {dayLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TradeCard({ trade }: { trade: StockTrade }) {
  const [expanded, setExpanded] = useState(false);
  const hasTimeline = (trade.timelineEvents?.length ?? 0) > 0;
  const flaggedEvents = trade.timelineEvents?.filter((e) => e.isFlagged) ?? [];

  return (
    <div className={`bg-[#0d1f35] rounded-xl border overflow-hidden ${
      trade.conflictScore >= 70 ? 'border-red-400/30' :
      trade.conflictScore >= 40 ? 'border-yellow-400/30' : 'border-[#1e3a5f]'
    }`}>
      <div className="p-4">
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

            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Traded: {new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
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

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <ConflictBadge score={trade.conflictScore} />
              {flaggedEvents.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-400/15 text-red-400 border border-red-400/30 font-bold">
                  <AlertTriangle className="h-3 w-3" />
                  {flaggedEvents.length} suspicious event{flaggedEvents.length > 1 ? 's' : ''} in timeline
                </span>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-white font-bold">{formatMoney(trade.amount)}</div>
            <div className="text-gray-500 text-xs">
              {formatMoney(trade.amountMin)} – {formatMoney(trade.amountMax)}
            </div>
            {trade.purchasePriceApprox != null && trade.currentPrice != null && (
              <div className={`text-sm font-bold mt-1 ${
                trade.currentPrice >= trade.purchasePriceApprox ? 'text-green-400' : 'text-red-400'
              }`}>
                {trade.currentPrice >= trade.purchasePriceApprox ? '+' : ''}
                {(((trade.currentPrice - trade.purchasePriceApprox) / trade.purchasePriceApprox) * 100).toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {hasTimeline && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1.5 text-xs text-[#c8a951] hover:text-white transition-colors"
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            {expanded ? 'Hide' : 'Show'} full event timeline
            {flaggedEvents.length > 0 && (
              <span className="text-red-400 ml-1">({flaggedEvents.length} flagged)</span>
            )}
          </button>
        )}

        {expanded && trade.timelineEvents && (
          <TradeTimeline events={trade.timelineEvents} tradeDate={trade.date} />
        )}
      </div>
    </div>
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
  const totalFlagged = trades.reduce((s, t) => s + (t.timelineEvents?.filter((e) => e.isFlagged).length ?? 0), 0);

  return (
    <div className="space-y-5">
      {totalFlagged > 0 && (
        <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-400 font-semibold text-sm">Suspicious Trade-Event Correlations Detected</div>
              <p className="text-gray-300 text-xs mt-1">
                {totalFlagged} event{totalFlagged > 1 ? 's' : ''} in trade timelines show potential correlation between stock positions and official votes, statements, or committee actions.
                Click "Show full event timeline" on each trade to review. Correlation is not legal proof — presented for informational transparency.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-white">{trades.length}</div>
          <div className="text-xs text-gray-400">Total Trades</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-[#c8a951]">{formatMoney(totalValue)}</div>
          <div className="text-xs text-gray-400">Total Value</div>
        </div>
        <div className={`rounded-xl p-3 border text-center ${totalFlagged > 0 ? 'border-red-400/30 bg-red-400/5' : 'border-[#1e3a5f]'}`}>
          <div className={`text-2xl font-bold ${totalFlagged > 0 ? 'text-red-400' : 'text-green-400'}`}>{totalFlagged}</div>
          <div className="text-xs text-gray-400">Flagged Events</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
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

      <div className="space-y-3">
        {sorted.map((trade) => <TradeCard key={trade.id} trade={trade} />)}
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500 bg-[#0d1f35] rounded-lg p-3 border border-[#1e3a5f]">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          Stock trade disclosures are required under the STOCK Act (Stop Trading on Congressional Knowledge Act, 2012).
          Conflict scores are computed by cross-referencing trade dates with related committee memberships and floor votes.
          Event timelines are sourced from official congressional records and verified news sources.
          Ranges shown because Congress reports value ranges rather than exact amounts. Gain/loss estimates use historical price approximations.
        </p>
      </div>
    </div>
  );
}
