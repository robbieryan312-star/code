'use client';

import { useState } from 'react';
import { mockPoliticians } from '@/lib/data/mockPoliticians';
import { DollarSign, AlertTriangle, Globe, TrendingUp, ArrowRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function FinancePage() {
  const [view, setView] = useState<'overview' | 'lobbyists' | 'foreign'>('overview');
  const [sortBy, setSortBy] = useState<'total' | 'lobbyist' | 'pac'>('total');

  const sorted = [...mockPoliticians].sort((a, b) => {
    if (sortBy === 'lobbyist') {
      const aL = a.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
      const bL = b.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
      return bL - aL;
    }
    if (sortBy === 'pac') return b.campaignFinance.pacDonations - a.campaignFinance.pacDonations;
    return b.campaignFinance.totalRaised - a.campaignFinance.totalRaised;
  });

  const totalRaised = mockPoliticians.reduce((s, p) => s + p.campaignFinance.totalRaised, 0);
  const totalLobbyist = mockPoliticians.reduce((s, p) => s + p.campaignFinance.lobbyistMoney.reduce((sl, l) => sl + l.amount, 0), 0);
  const totalPAC = mockPoliticians.reduce((s, p) => s + p.campaignFinance.pacDonations, 0);
  const totalForeign = mockPoliticians.reduce((s, p) => s + p.campaignFinance.foreignPAC.reduce((sf, f) => sf + f.amount, 0), 0);

  const chartData = sorted.slice(0, 6).map((p) => ({
    name: p.lastName,
    total: Math.round(p.campaignFinance.totalRaised / 1000),
    pac: Math.round(p.campaignFinance.pacDonations / 1000),
    lobbyist: Math.round(p.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0) / 1000),
  }));

  const allLobbyistGroups = mockPoliticians.flatMap((p) =>
    p.campaignFinance.lobbyistMoney.map((l) => ({ ...l, politician: p.name, politicianId: p.id }))
  ).sort((a, b) => b.amount - a.amount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Money & Donors</h1>
        <p className="text-gray-400">Full transparency on campaign finance, lobbying, and foreign influence</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-[#1e3a5f]">
          <DollarSign className="h-5 w-5 text-[#c8a951] mb-1" />
          <div className="text-2xl font-bold text-white">{formatMoney(totalRaised)}</div>
          <div className="text-xs text-gray-400">Total Raised (sample)</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-yellow-400/30">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mb-1" />
          <div className="text-2xl font-bold text-yellow-400">{formatMoney(totalLobbyist)}</div>
          <div className="text-xs text-gray-400">Lobbyist Money</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-orange-400/30">
          <TrendingUp className="h-5 w-5 text-orange-400 mb-1" />
          <div className="text-2xl font-bold text-orange-400">{formatMoney(totalPAC)}</div>
          <div className="text-xs text-gray-400">PAC/Super PAC</div>
        </div>
        <div className="bg-[#0d1f35] rounded-xl p-4 border border-red-400/30">
          <Globe className="h-5 w-5 text-red-400 mb-1" />
          <div className="text-2xl font-bold text-red-400">{formatMoney(totalForeign)}</div>
          <div className="text-xs text-gray-400">Foreign Influence</div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'lobbyists', label: 'Lobbyists' },
          { id: 'foreign', label: 'Foreign PAC' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as typeof view)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === tab.id
                ? 'bg-[#c8a951] text-[#0a1628]'
                : 'bg-[#0d1f35] text-gray-400 border border-[#1e3a5f] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'overview' && (
        <div className="space-y-6">
          {/* Chart */}
          <div className="bg-[#0d1f35] rounded-2xl p-5 border border-[#1e3a5f]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Funding Comparison ($K)</h2>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-[#c8a951]" />Total</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-red-400" />PAC</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-yellow-400" />Lobbyist</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => `$${v}K`}
                  contentStyle={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="total" fill="#c8a951" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pac" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lobbyist" fill="#facc15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Politician Table */}
          <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e3a5f] bg-[#0a1628] flex items-center justify-between">
              <h2 className="text-white font-bold">All Tracked Politicians</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-[#0d1f35] border border-[#1e3a5f] rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
              >
                <option value="total">Sort: Total Raised</option>
                <option value="lobbyist">Sort: Lobbyist Money</option>
                <option value="pac">Sort: PAC Money</option>
              </select>
            </div>
            <div className="divide-y divide-[#1e3a5f]">
              {sorted.map((p) => {
                const lobbyistTotal = p.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
                const indivPct = p.campaignFinance.totalRaised > 0
                  ? Math.round((p.campaignFinance.individualDonations / p.campaignFinance.totalRaised) * 100)
                  : 0;

                return (
                  <Link
                    key={p.id}
                    href={`/politicians/${p.id}?tab=finance`}
                    className="grid grid-cols-5 gap-4 px-5 py-4 hover:bg-[#1e3a5f]/50 transition-colors items-center"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-xs font-bold text-[#c8a951] overflow-hidden">
                        {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover object-top" /> : p.firstName[0]}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{p.name}</div>
                        <div className="text-gray-500 text-xs">{p.party} · {p.stateCode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm font-bold">{formatMoney(p.campaignFinance.totalRaised)}</div>
                      <div className="text-gray-500 text-xs">{indivPct}% individual</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${p.campaignFinance.pacDonations > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {p.campaignFinance.pacDonations > 0 ? formatMoney(p.campaignFinance.pacDonations) : '$0'}
                      </div>
                      <div className="text-gray-500 text-xs">PAC</div>
                    </div>
                    <div className="text-right flex items-center gap-2 justify-end">
                      {lobbyistTotal > 0 && <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />}
                      <div>
                        <div className={`text-sm font-bold ${lobbyistTotal > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {formatMoney(lobbyistTotal)}
                        </div>
                        <div className="text-gray-500 text-xs">Lobbyist</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === 'lobbyists' && (
        <div className="space-y-4">
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-yellow-400 font-semibold text-sm">About Lobbyist Money</div>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                The Lobbying Disclosure Act requires registration and reporting of lobbying activities.
                Contributions shown are from registered lobbyist organizations to elected officials.
                This data is sourced from the FEC and OpenSecrets and covers disclosed contributions only.
              </p>
            </div>
          </div>

          <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e3a5f] bg-[#0a1628]">
              <h2 className="text-white font-bold">Lobbyist Contributions by Organization</h2>
            </div>
            <div className="divide-y divide-[#1e3a5f]">
              {allLobbyistGroups.map((item, i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{item.organization}</div>
                    <div className="text-gray-400 text-xs">{item.sector}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.issues.map((issue) => (
                        <span key={issue} className="text-xs bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-yellow-400 font-bold">{formatMoney(item.amount)}</div>
                    <Link href={`/politicians/${item.politicianId}`} className="text-xs text-gray-400 hover:text-[#c8a951] flex items-center gap-0.5 justify-end mt-0.5">
                      → {item.politician}
                    </Link>
                  </div>
                </div>
              ))}
              {allLobbyistGroups.length === 0 && (
                <div className="px-5 py-12 text-center text-gray-500">
                  No lobbyist contributions recorded in current sample data
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'foreign' && (
        <div className="space-y-4">
          <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4 flex items-start gap-3">
            <Globe className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-400 font-semibold text-sm">About Foreign PAC Contributions</div>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                Federal law prohibits direct contributions from foreign nationals to federal candidates.
                However, foreign-connected PACs and organizations with foreign ownership can legally
                make certain contributions. Data sourced from FEC disclosures.
              </p>
            </div>
          </div>

          <div className="bg-[#0d1f35] rounded-2xl border border-[#1e3a5f] p-6 text-center">
            <Globe className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No foreign PAC contributions recorded in current data sample</p>
            <p className="text-gray-500 text-xs mt-1">Real-time foreign PAC data available via FEC API integration</p>
          </div>
        </div>
      )}
    </div>
  );
}
