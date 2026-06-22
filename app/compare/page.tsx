'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockPoliticians } from '@/lib/data/mockPoliticians';
import { Politician } from '@/lib/types';
import { CheckCircle, XCircle, AlertTriangle, MinusCircle } from 'lucide-react';

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function CompareCell({ label, aVal, bVal, higherIsBetter = true, format = 'number' }: {
  label: string;
  aVal: number; bVal: number; higherIsBetter?: boolean; format?: 'money' | 'percent' | 'number';
}) {
  const aBetter = higherIsBetter ? aVal >= bVal : aVal <= bVal;
  const fmt = (v: number) => format === 'money' ? formatMoney(v) : format === 'percent' ? `${v}%` : v.toString();

  return (
    <div className="grid grid-cols-3 gap-3 items-center py-3 border-b border-white/[0.05] last:border-0">
      <div className={`text-sm font-bold text-right ${aBetter ? 'text-white' : 'text-white/35'}`}>
        {fmt(aVal)}
        {aBetter && aVal !== bVal && <span className="ml-1 text-green-400">✓</span>}
      </div>
      <div className="text-xs text-white/35 text-center">{label}</div>
      <div className={`text-sm font-bold text-left ${!aBetter ? 'text-white' : 'text-white/35'}`}>
        {!aBetter && aVal !== bVal && <span className="mr-1 text-green-400">✓</span>}
        {fmt(bVal)}
      </div>
    </div>
  );
}

const cardStyle = { background: 'rgba(11,25,41,0.7)', backdropFilter: 'blur(12px)' };
const headerStyle = { background: 'rgba(5,9,15,0.5)' };

function CompareContent() {
  const searchParams = useSearchParams();
  const defaultA = mockPoliticians[0]?.id || '';
  const defaultB = mockPoliticians[1]?.id || '';

  const [aPick, setAPick] = useState<string>(defaultA);
  const [bPick, setBPick] = useState<string>(defaultB);

  useEffect(() => {
    const paramA = searchParams.get('a');
    const paramB = searchParams.get('b');
    if (paramA && mockPoliticians.find(p => p.id === paramA)) setAPick(paramA);
    if (paramB && mockPoliticians.find(p => p.id === paramB)) setBPick(paramB);
  }, [searchParams]);

  const pA = mockPoliticians.find((p) => p.id === aPick);
  const pB = mockPoliticians.find((p) => p.id === bPick);

  const allIssueCategories = pA && pB
    ? [...new Set([...pA.topIssues.map((i) => i.category), ...pB.topIssues.map((i) => i.category)])]
    : [];

  const selectStyle: React.CSSProperties = {
    background: 'rgba(5,9,15,0.7)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Compare Politicians</h1>
        <p className="text-white/40">Side-by-side objective comparison of any two politicians</p>
      </div>

      {/* Picker */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {(['a', 'b'] as const).map((side) => {
          const pick = side === 'a' ? aPick : bPick;
          const other = side === 'a' ? bPick : aPick;
          const setPick = side === 'a' ? setAPick : setBPick;
          return (
            <div key={side}>
              <label className="text-white/35 text-xs font-medium uppercase tracking-wider mb-2 block">
                Politician {side.toUpperCase()}
              </label>
              <select
                value={pick}
                onChange={(e) => setPick(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={selectStyle}
              >
                {mockPoliticians.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === other}>
                    {p.name} ({p.state}){p.id === other ? ' — already selected' : ''}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {aPick === bPick && (
        <div className="rounded-xl p-4 mb-6 border border-yellow-400/25 text-yellow-400 text-sm" style={{ background: 'rgba(212,172,82,0.08)' }}>
          Select two different politicians to compare them side-by-side.
        </div>
      )}

      {pA && pB && aPick !== bPick && (
        <div className="space-y-5">
          {/* Profile Headers */}
          <div className="grid grid-cols-2 gap-4">
            {[pA, pB].map((p) => (
              <div key={p.id} className="rounded-2xl p-5 border border-white/[0.08]" style={cardStyle}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/[0.09]"
                       style={{ background: 'linear-gradient(135deg, #0f2236 0%, #07101f 100%)' }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-xl" style={{ color: '#d4ac52' }}>{p.firstName[0]}{p.lastName[0]}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-bold">{p.name}</div>
                    <div className="text-white/40 text-xs">{p.party} · {p.state}</div>
                    <div className="text-white/30 text-xs">{p.chamber.replaceAll('_', ' ')}</div>
                  </div>
                </div>
                <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{p.bio}</p>
              </div>
            ))}
          </div>

          {/* Numeric Comparison */}
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={cardStyle}>
            <div className="px-5 py-4 border-b border-white/[0.06]" style={headerStyle}>
              <h2 className="text-white font-bold">Key Metrics</h2>
              <div className="grid grid-cols-3 mt-2">
                <div className="text-xs font-medium text-right" style={{ color: '#d4ac52' }}>{pA.lastName}</div>
                <div className="text-white/25 text-xs text-center">Metric</div>
                <div className="text-xs font-medium text-left" style={{ color: '#d4ac52' }}>{pB.lastName}</div>
              </div>
            </div>
            <div className="px-5">
              <CompareCell label="Consistency Score" aVal={pA.consistency.overallScore} bVal={pB.consistency.overallScore} />
              <CompareCell label="Total Raised" aVal={pA.campaignFinance.totalRaised} bVal={pB.campaignFinance.totalRaised} higherIsBetter={false} format="money" />
              <CompareCell label="Individual Donors %" aVal={pA.campaignFinance.totalRaised > 0 ? Math.round((pA.campaignFinance.individualDonations / pA.campaignFinance.totalRaised) * 100) : 0} bVal={pB.campaignFinance.totalRaised > 0 ? Math.round((pB.campaignFinance.individualDonations / pB.campaignFinance.totalRaised) * 100) : 0} higherIsBetter={true} format="percent" />
              <CompareCell label="Lobbyist Money" aVal={pA.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0)} bVal={pB.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0)} higherIsBetter={false} format="money" />
              <CompareCell label="Lobbyist Alignment %" aVal={pA.consistency.lobbyistAlignmentPercentage} bVal={pB.consistency.lobbyistAlignmentPercentage} higherIsBetter={false} format="percent" />
              <CompareCell label="Party-Line Vote %" aVal={pA.consistency.partyLineVotePercentage} bVal={pB.consistency.partyLineVotePercentage} higherIsBetter={false} format="percent" />
              <CompareCell label="Stock Trades" aVal={pA.stockTrades.length} bVal={pB.stockTrades.length} higherIsBetter={false} />
              <CompareCell label="High-Conflict Trades" aVal={pA.stockTrades.filter((t) => t.conflictScore >= 70).length} bVal={pB.stockTrades.filter((t) => t.conflictScore >= 70).length} higherIsBetter={false} />
            </div>
          </div>

          {/* Issue Positions */}
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={cardStyle}>
            <div className="px-5 py-4 border-b border-white/[0.06]" style={headerStyle}>
              <h2 className="text-white font-bold">Issue Positions</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {allIssueCategories.map((cat) => {
                const aIssue = pA.topIssues.find((i) => i.category === cat);
                const bIssue = pB.topIssues.find((i) => i.category === cat);
                return (
                  <div key={cat} className="grid grid-cols-3 gap-4 p-5">
                    <div>
                      {aIssue ? (
                        <>
                          <div className="text-xs font-medium mb-0.5" style={{ color: '#d4ac52' }}>{aIssue.position}</div>
                          <div className="text-white/40 text-xs">{aIssue.detail}</div>
                        </>
                      ) : (
                        <div className="text-white/20 text-xs italic">No stated position</div>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-white/40 px-2 py-1 rounded-full border border-white/[0.07]">{cat}</span>
                    </div>
                    <div className="text-right">
                      {bIssue ? (
                        <>
                          <div className="text-xs font-medium mb-0.5" style={{ color: '#d4ac52' }}>{bIssue.position}</div>
                          <div className="text-white/40 text-xs">{bIssue.detail}</div>
                        </>
                      ) : (
                        <div className="text-white/20 text-xs italic">No stated position</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promise Tracker */}
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={cardStyle}>
            <div className="px-5 py-4 border-b border-white/[0.06]" style={headerStyle}>
              <h2 className="text-white font-bold">Campaign Promise Tracker</h2>
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/[0.05]">
              {[pA, pB].map((p) => (
                <div key={p.id} className="p-5">
                  <div className="font-semibold mb-3 text-sm" style={{ color: '#d4ac52' }}>{p.firstName} {p.lastName}</div>
                  <div className="space-y-2">
                    {p.consistency.campaignPromises.map((promise) => (
                      <div key={promise.id} className="flex items-start gap-2">
                        {promise.status === 'Kept'        ? <CheckCircle   className="h-4 w-4 text-green-400  flex-shrink-0 mt-0.5" /> :
                         promise.status === 'Broken'      ? <XCircle       className="h-4 w-4 text-red-400    flex-shrink-0 mt-0.5" /> :
                         promise.status === 'Compromised' ? <AlertTriangle  className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" /> :
                                                            <MinusCircle   className="h-4 w-4 text-blue-400   flex-shrink-0 mt-0.5" />}
                        <div>
                          <div className="text-xs text-white font-medium">{promise.issue}</div>
                          <div className={`text-xs ${promise.status === 'Kept' ? 'text-green-400' : promise.status === 'Broken' ? 'text-red-400' : promise.status === 'Compromised' ? 'text-yellow-400' : 'text-blue-400'}`}>
                            {promise.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}
