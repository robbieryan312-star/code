'use client';

import { useState } from 'react';
import { mockPoliticians } from '@/lib/data/mockPoliticians';
import { Politician } from '@/lib/types';
import { CheckCircle, XCircle, AlertTriangle, MinusCircle, Users } from 'lucide-react';

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function ScoreBar({ value, max = 100, colorClass }: { value: number; max?: number; colorClass: string }) {
  return (
    <div className="w-full h-2 bg-[#1e3a5f] rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

function CompareCell({ a, b, label, aVal, bVal, higherIsBetter = true, format = 'number' }: {
  a: Politician; b: Politician; label: string;
  aVal: number; bVal: number; higherIsBetter?: boolean; format?: 'money' | 'percent' | 'number';
}) {
  const aBetter = higherIsBetter ? aVal >= bVal : aVal <= bVal;
  const fmt = (v: number) => format === 'money' ? formatMoney(v) : format === 'percent' ? `${v}%` : v.toString();

  return (
    <div className="grid grid-cols-3 gap-3 items-center py-3 border-b border-[#1e3a5f] last:border-0">
      <div className={`text-sm font-bold text-right ${aBetter ? 'text-white' : 'text-gray-400'}`}>
        {fmt(aVal)}
        {aBetter && aVal !== bVal && <span className="ml-1 text-green-400">✓</span>}
      </div>
      <div className="text-xs text-gray-400 text-center">{label}</div>
      <div className={`text-sm font-bold text-left ${!aBetter ? 'text-white' : 'text-gray-400'}`}>
        {!aBetter && aVal !== bVal && <span className="mr-1 text-green-400">✓</span>}
        {fmt(bVal)}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [aPick, setAPick] = useState<string>(mockPoliticians[0]?.id || '');
  const [bPick, setBPick] = useState<string>(mockPoliticians[1]?.id || '');

  const pA = mockPoliticians.find((p) => p.id === aPick);
  const pB = mockPoliticians.find((p) => p.id === bPick);

  const allIssueCategories = pA && pB
    ? [...new Set([...pA.topIssues.map((i) => i.category), ...pB.topIssues.map((i) => i.category)])]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Compare Politicians</h1>
        <p className="text-gray-400">Side-by-side objective comparison of any two politicians</p>
      </div>

      {/* Picker */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Politician A</label>
          <select
            value={aPick}
            onChange={(e) => setAPick(e.target.value)}
            className="w-full bg-[#0d1f35] border border-[#1e3a5f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c8a951] text-sm"
          >
            {mockPoliticians.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.state})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Politician B</label>
          <select
            value={bPick}
            onChange={(e) => setBPick(e.target.value)}
            className="w-full bg-[#0d1f35] border border-[#1e3a5f] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c8a951] text-sm"
          >
            {mockPoliticians.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.state})</option>
            ))}
          </select>
        </div>
      </div>

      {pA && pB && (
        <div className="space-y-6">
          {/* Profile Headers */}
          <div className="grid grid-cols-2 gap-4">
            {[pA, pB].map((p) => (
              <div key={p.id} className="bg-[#0d1f35] rounded-2xl p-5 border border-[#1e3a5f]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#c8a951] font-bold text-xl">{p.firstName[0]}{p.lastName[0]}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-bold">{p.name}</div>
                    <div className="text-gray-400 text-xs">{p.party} · {p.state}</div>
                    <div className="text-gray-500 text-xs">{p.chamber.replace('_', ' ')}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{p.bio.slice(0, 120)}…</p>
              </div>
            ))}
          </div>

          {/* Numeric Comparison */}
          <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e3a5f] bg-[#0a1628]">
              <h2 className="text-white font-bold">Key Metrics Comparison</h2>
              <div className="grid grid-cols-3 mt-2">
                <div className="text-[#c8a951] text-xs font-medium text-right">{pA.lastName}</div>
                <div className="text-gray-500 text-xs text-center">Metric</div>
                <div className="text-[#c8a951] text-xs font-medium text-left">{pB.lastName}</div>
              </div>
            </div>
            <div className="px-5">
              <CompareCell a={pA} b={pB} label="Consistency Score" aVal={pA.consistency.overallScore} bVal={pB.consistency.overallScore} higherIsBetter={true} />
              <CompareCell a={pA} b={pB} label="Total Raised" aVal={pA.campaignFinance.totalRaised} bVal={pB.campaignFinance.totalRaised} higherIsBetter={false} format="money" />
              <CompareCell a={pA} b={pB} label="Individual Donations %" aVal={pA.campaignFinance.totalRaised > 0 ? Math.round((pA.campaignFinance.individualDonations / pA.campaignFinance.totalRaised) * 100) : 0} bVal={pB.campaignFinance.totalRaised > 0 ? Math.round((pB.campaignFinance.individualDonations / pB.campaignFinance.totalRaised) * 100) : 0} higherIsBetter={true} format="percent" />
              <CompareCell a={pA} b={pB} label="Lobbyist Money" aVal={pA.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0)} bVal={pB.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0)} higherIsBetter={false} format="money" />
              <CompareCell a={pA} b={pB} label="Lobbyist Alignment %" aVal={pA.consistency.lobbyistAlignmentPercentage} bVal={pB.consistency.lobbyistAlignmentPercentage} higherIsBetter={false} format="percent" />
              <CompareCell a={pA} b={pB} label="Party-Line Vote %" aVal={pA.consistency.partyLineVotePercentage} bVal={pB.consistency.partyLineVotePercentage} higherIsBetter={false} format="percent" />
              <CompareCell a={pA} b={pB} label="Stock Trades" aVal={pA.stockTrades.length} bVal={pB.stockTrades.length} higherIsBetter={false} />
              <CompareCell a={pA} b={pB} label="High-Conflict Trades" aVal={pA.stockTrades.filter((t) => t.conflictScore >= 70).length} bVal={pB.stockTrades.filter((t) => t.conflictScore >= 70).length} higherIsBetter={false} />
            </div>
          </div>

          {/* Issue Positions */}
          <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e3a5f] bg-[#0a1628]">
              <h2 className="text-white font-bold">Issue Positions</h2>
            </div>
            <div className="divide-y divide-[#1e3a5f]">
              {allIssueCategories.map((cat) => {
                const aIssue = pA.topIssues.find((i) => i.category === cat);
                const bIssue = pB.topIssues.find((i) => i.category === cat);
                return (
                  <div key={cat} className="grid grid-cols-3 gap-4 p-5">
                    <div>
                      {aIssue ? (
                        <>
                          <div className="text-[#c8a951] text-xs font-medium mb-0.5">{aIssue.position}</div>
                          <div className="text-gray-400 text-xs">{aIssue.detail}</div>
                        </>
                      ) : (
                        <div className="text-gray-600 text-xs italic">No stated position</div>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-xs bg-[#1e3a5f] text-gray-300 px-2 py-1 rounded-full">{cat}</span>
                    </div>
                    <div className="text-right">
                      {bIssue ? (
                        <>
                          <div className="text-[#c8a951] text-xs font-medium mb-0.5">{bIssue.position}</div>
                          <div className="text-gray-400 text-xs">{bIssue.detail}</div>
                        </>
                      ) : (
                        <div className="text-gray-600 text-xs italic">No stated position</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promise Tracker Comparison */}
          <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e3a5f] bg-[#0a1628]">
              <h2 className="text-white font-bold">Campaign Promise Comparison</h2>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[#1e3a5f]">
              {[pA, pB].map((p) => (
                <div key={p.id} className="p-5">
                  <div className="text-[#c8a951] font-semibold mb-3 text-sm">{p.firstName} {p.lastName}</div>
                  <div className="space-y-2">
                    {p.consistency.campaignPromises.map((promise) => (
                      <div key={promise.id} className="flex items-start gap-2">
                        {promise.status === 'Kept' ? <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" /> :
                         promise.status === 'Broken' ? <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" /> :
                         promise.status === 'Compromised' ? <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" /> :
                         <MinusCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />}
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
