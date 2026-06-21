'use client';

import { useState, useMemo } from 'react';
import { mockPoliticians } from '@/lib/data/mockPoliticians';
import { TrendingUp, TrendingDown, AlertTriangle, Info, ArrowRight, ArrowUpDown, Filter } from 'lucide-react';
import Link from 'next/link';
import { StockTrade, Party } from '@/lib/types';

type TradeWithMeta = StockTrade & {
  politician: string;
  politicianId: string;
  party: Party;
  stateCode: string;
  gainLossPct: number | null;
  gainLossDollar: number | null;
};

type SortKey = 'date' | 'amount' | 'gain_pct' | 'conflict';

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function GainLossBadge({ pct, dollar }: { pct: number | null; dollar: number | null }) {
  if (pct === null) return <span className="text-xs text-gray-600">N/A</span>;
  const positive = pct >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <div className={`flex items-center gap-1 text-sm font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
      <Icon className="h-4 w-4" />
      <span>{positive ? '+' : ''}{pct.toFixed(1)}%</span>
      {dollar !== null && (
        <span className="text-xs font-normal opacity-70">
          ({positive ? '+' : ''}{formatMoney(Math.abs(dollar))})
        </span>
      )}
    </div>
  );
}

function ConflictBadge({ score }: { score: number }) {
  const cfg =
    score >= 70 ? { color: 'text-red-400 bg-red-400/10 border-red-400/30', label: 'High Conflict' } :
    score >= 40 ? { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', label: 'Med Conflict' } :
                  { color: 'text-green-400 bg-green-400/10 border-green-400/30', label: 'Low Conflict' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
      <AlertTriangle className="h-3 w-3" />
      {cfg.label} ({score})
    </span>
  );
}

export default function CongressStocksPage() {
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterParty, setFilterParty] = useState<'All' | 'Democrat' | 'Republican' | 'Independent'>('All');
  const [filterType, setFilterType] = useState<'All' | 'Purchase' | 'Sale' | 'Partial Sale'>('All');
  const [filterConflict, setFilterConflict] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [filterSector, setFilterSector] = useState('All');

  const allTrades: TradeWithMeta[] = useMemo(() =>
    mockPoliticians.flatMap((p) =>
      p.stockTrades.map((t) => {
        const gainLossPct = (t.purchasePriceApprox != null && t.currentPrice != null && t.type === 'Purchase')
          ? ((t.currentPrice - t.purchasePriceApprox) / t.purchasePriceApprox) * 100
          : null;
        const gainLossDollar = (gainLossPct !== null && t.purchasePriceApprox != null && t.currentPrice != null)
          ? (t.currentPrice - t.purchasePriceApprox) * (t.amount / t.purchasePriceApprox)
          : null;
        return { ...t, politician: p.name, politicianId: p.id, party: p.party, stateCode: p.stateCode, gainLossPct, gainLossDollar };
      })
    ),
  []);

  const sectors = useMemo(() => ['All', ...Array.from(new Set(allTrades.map((t) => t.sector)))], [allTrades]);

  const filtered = useMemo(() => {
    let out = allTrades.filter((t) => {
      if (filterParty !== 'All' && t.party !== filterParty) return false;
      if (filterType !== 'All' && t.type !== filterType) return false;
      if (filterSector !== 'All' && t.sector !== filterSector) return false;
      if (filterConflict === 'High' && t.conflictScore < 70) return false;
      if (filterConflict === 'Medium' && (t.conflictScore < 40 || t.conflictScore >= 70)) return false;
      if (filterConflict === 'Low' && t.conflictScore >= 40) return false;
      return true;
    });

    out.sort((a, b) => {
      let va: number, vb: number;
      if (sortBy === 'date') {
        va = new Date(a.date).getTime();
        vb = new Date(b.date).getTime();
      } else if (sortBy === 'amount') {
        va = a.amount; vb = b.amount;
      } else if (sortBy === 'gain_pct') {
        va = a.gainLossPct ?? -Infinity;
        vb = b.gainLossPct ?? -Infinity;
      } else {
        va = a.conflictScore; vb = b.conflictScore;
      }
      return sortDir === 'desc' ? vb - va : va - vb;
    });

    return out;
  }, [allTrades, filterParty, filterType, filterSector, filterConflict, sortBy, sortDir]);

  const highConflict = allTrades.filter((t) => t.conflictScore >= 70);
  const totalValue = allTrades.reduce((s, t) => s + t.amount, 0);
  const tradesWithPriceData = allTrades.filter((t) => t.gainLossPct !== null);
  const avgGain = tradesWithPriceData.length > 0
    ? tradesWithPriceData.reduce((s, t) => s + (t.gainLossPct ?? 0), 0) / tradesWithPriceData.length
    : null;

  function toggleSort(key: SortKey) {
    if (sortBy === key) setSortDir((d) => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(key); setSortDir('desc'); }
  }

  function SortBtn({ label, k }: { label: string; k: SortKey }) {
    const active = sortBy === k;
    return (
      <button
        onClick={() => toggleSort(k)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          active ? 'bg-[#c8a951] text-[#0a1628]' : 'bg-[#0d1f35] text-gray-400 border border-[#1e3a5f] hover:border-[#c8a951]'
        }`}
      >
        <ArrowUpDown className="h-3 w-3" />
        {label}
        {active && <span className="opacity-70">{sortDir === 'desc' ? '↓' : '↑'}</span>}
      </button>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Congressional Stock Trades</h1>
        <p className="text-gray-400 text-sm">STOCK Act disclosures · gain/loss since purchase · conflict-of-interest scoring</p>
      </div>

      {/* STOCK Act Info */}
      <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] mb-6 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-white font-semibold mb-1 text-sm">STOCK Act (2012) — Stop Trading on Congressional Knowledge Act</div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Members of Congress must disclose stock trades worth more than $1,000 within 30–45 days of the transaction.
            Gain/loss percentages are estimated using the approximate price at trade date vs. current price (STOCK Act reports value
            ranges, not exact amounts or share prices). Conflict scores (0–100) are computed from committee membership overlap and related votes.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-white">{allTrades.length}</div>
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
        <div className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f] text-center">
          <div className="text-2xl font-bold text-white">{new Set(allTrades.map((t) => t.politicianId)).size}</div>
          <div className="text-xs text-gray-400">Politicians</div>
        </div>
        {avgGain !== null && (
          <div className={`rounded-xl p-3 border text-center ${avgGain >= 0 ? 'border-green-400/20 bg-green-400/5' : 'border-red-400/20 bg-red-400/5'}`}>
            <div className={`text-2xl font-bold ${avgGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {avgGain >= 0 ? '+' : ''}{avgGain.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">Avg Gain/Loss</div>
          </div>
        )}
      </div>

      {/* High Conflict Alert */}
      {highConflict.length > 0 && (
        <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="text-red-400 font-semibold text-sm">{highConflict.length} High-Conflict Trades Detected</div>
          </div>
          <p className="text-gray-300 text-xs">
            These trades correlate with the trader&apos;s committee assignments or related legislation — indicating a potential conflict of interest.
            Correlation does not prove wrongdoing; scores are informational only.
          </p>
        </div>
      )}

      {/* Sort + Filter */}
      <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f] mb-6 space-y-3">
        <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
          <ArrowUpDown className="h-3.5 w-3.5" /> Sort by:
        </div>
        <div className="flex flex-wrap gap-2">
          <SortBtn label="Most Recent" k="date" />
          <SortBtn label="Total Amount" k="amount" />
          <SortBtn label="Gain / Loss %" k="gain_pct" />
          <SortBtn label="Conflict Score" k="conflict" />
        </div>

        <div className="border-t border-[#1e3a5f] pt-3">
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </div>
          <div className="flex flex-wrap gap-2">
            {(['All', 'Democrat', 'Republican', 'Independent'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterParty(p)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  filterParty === p
                    ? p === 'Democrat' ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                    : p === 'Republican' ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                    : 'bg-[#c8a951] text-[#0a1628]'
                    : 'bg-[#0a1628] text-gray-400 border border-[#1e3a5f] hover:border-[#c8a951]'
                }`}
              >
                {p}
              </button>
            ))}
            <span className="text-gray-600 mx-1">|</span>
            {(['All', 'Purchase', 'Sale', 'Partial Sale'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  filterType === t
                    ? 'bg-[#c8a951] text-[#0a1628]'
                    : 'bg-[#0a1628] text-gray-400 border border-[#1e3a5f] hover:border-[#c8a951]'
                }`}
              >
                {t}
              </button>
            ))}
            <span className="text-gray-600 mx-1">|</span>
            {(['All', 'High', 'Medium', 'Low'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilterConflict(c)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  filterConflict === c
                    ? c === 'High' ? 'bg-red-400/30 text-red-400 border border-red-400/50'
                    : c === 'Medium' ? 'bg-yellow-400/30 text-yellow-400 border border-yellow-400/50'
                    : c === 'Low' ? 'bg-green-400/30 text-green-400 border border-green-400/50'
                    : 'bg-[#c8a951] text-[#0a1628]'
                    : 'bg-[#0a1628] text-gray-400 border border-[#1e3a5f] hover:border-[#c8a951]'
                }`}
              >
                {c} Conflict
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs text-gray-500 self-center">Sector:</span>
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setFilterSector(s)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  filterSector === s
                    ? 'bg-[#c8a951] text-[#0a1628]'
                    : 'bg-[#0a1628] text-gray-400 border border-[#1e3a5f] hover:border-[#c8a951]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-3">Showing {filtered.length} of {allTrades.length} trades</div>

      {/* Trade List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] p-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No trades match the current filters</p>
          </div>
        ) : (
          filtered.map((trade) => (
            <div
              key={trade.id}
              className={`bg-[#0d1f35] rounded-xl p-4 border ${
                trade.conflictScore >= 70 ? 'border-red-400/30' :
                trade.conflictScore >= 40 ? 'border-yellow-400/30' : 'border-[#1e3a5f]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Ticker + Company + Type */}
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
                      {trade.type === 'Purchase' ? '↑' : '↓'} {trade.type}
                    </span>
                    <span className="text-xs bg-[#1e3a5f] text-gray-300 px-2 py-0.5 rounded-full">{trade.sector}</span>
                  </div>

                  {/* Politician Link */}
                  <Link
                    href={`/politicians/${trade.politicianId}?tab=stocks`}
                    className="flex items-center gap-1.5 text-sm text-[#c8a951] hover:text-white transition-colors mb-2"
                  >
                    <div className={`text-xs px-1.5 py-0.5 rounded ${
                      trade.party === 'Democrat' ? 'bg-blue-500/20 text-blue-400' :
                      trade.party === 'Republican' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>{trade.party[0]}</div>
                    {trade.politician}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {/* Dates + Disclosure */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-2">
                    <span>Traded: {new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>Disclosed: {new Date(trade.disclosureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className={`px-1.5 py-0.5 rounded ${trade.daysToDisclose > 30 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-[#1e3a5f] text-gray-400'}`}>
                      {trade.daysToDisclose}d to disclose
                    </span>
                  </div>

                  {/* Price Data */}
                  {trade.purchasePriceApprox != null && (
                    <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
                      <span className="text-gray-500">Price at trade: <span className="text-gray-300">${trade.purchasePriceApprox.toFixed(2)}</span></span>
                      {trade.currentPrice != null && (
                        <span className="text-gray-500">Current: <span className="text-gray-300">${trade.currentPrice.toFixed(2)}</span></span>
                      )}
                      {trade.gainLossPct !== null && (
                        <GainLossBadge pct={trade.gainLossPct} dollar={trade.gainLossDollar} />
                      )}
                    </div>
                  )}

                  {/* Related Votes / Committees */}
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

                  <ConflictBadge score={trade.conflictScore} />
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-bold text-lg">{formatMoney(trade.amount)}</div>
                  <div className="text-gray-500 text-xs">{formatMoney(trade.amountMin)}–{formatMoney(trade.amountMax)}</div>
                  {trade.gainLossPct !== null && (
                    <div className={`text-sm font-bold mt-1 ${trade.gainLossPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.gainLossPct >= 0 ? '+' : ''}{trade.gainLossPct.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex items-start gap-2 text-xs text-gray-500 bg-[#0d1f35] rounded-lg p-3 border border-[#1e3a5f]">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          All data from STOCK Act disclosures filed with the Senate or House. Value ranges are reported ranges — exact amounts are
          not disclosed. Gain/loss percentages are estimates using historical price data at the approximate trade date vs. current price;
          actual gains may differ. Conflict scores are informational, not legal determinations.
        </p>
      </div>
    </div>
  );
}
