import MapClient from '@/components/map/MapClient';
import HomeSearchBar from '@/components/search/HomeSearchBar';
import Link from 'next/link';
import { ArrowRight, TrendingUp, DollarSign, Vote, Shield, BarChart2, Users } from 'lucide-react';
import { mockPoliticians } from '@/lib/data/mockPoliticians';
import { mockElections } from '@/lib/data/mockElections';

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const features = [
  {
    icon: Vote,
    title: 'Voting Records',
    desc: 'Every roll-call vote on every bill, cross-referenced with campaign promises and donor interests.',
    href: '/politicians',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: DollarSign,
    title: 'Campaign Finance',
    desc: 'Full donor transparency — who gives money, how much, and whether votes follow the money.',
    href: '/finance',
    color: 'text-[#c8a951]',
    bg: 'bg-[#c8a951]/10 border-[#c8a951]/20',
  },
  {
    icon: Shield,
    title: 'Lobbyist Tracker',
    desc: 'Track domestic and foreign lobbying money with disclosure cross-referencing.',
    href: '/finance?view=lobbyists',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/20',
  },
  {
    icon: TrendingUp,
    title: 'Stock Trades',
    desc: 'STOCK Act disclosures mapped against committee memberships and related votes.',
    href: '/congress',
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
  {
    icon: BarChart2,
    title: 'Promise Tracker',
    desc: 'Campaign statements vs. actual votes — a consistency score built from the record, not opinion.',
    href: '/politicians',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
  },
  {
    icon: Users,
    title: 'Candidate Compare',
    desc: 'Side-by-side objective comparison on issues, funding, and records for any two politicians.',
    href: '/compare',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
  },
];

export default function HomePage() {
  const upcomingElections = mockElections.filter((e) => e.isUpcoming).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ── FULLSCREEN MAP HERO ── */}
      <section className="relative bg-[#06101e]">
        {/* Search Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4">
          <HomeSearchBar />
        </div>

        {/* Map */}
        <div
          className="w-full relative"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          <MapClient />
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#06101e] to-transparent pointer-events-none" />
      </section>

      {/* ── DATA SOURCES STRIP ── */}
      <section className="bg-[#0a1628] border-y border-[#1e3a5f] py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-xs text-gray-500 flex-wrap">
          <span className="text-[#c8a951] font-medium">Verified Sources Only:</span>
          {['FEC.gov', 'Congress.gov', 'ProPublica Congress API', 'OpenSecrets', 'Senate Stock Watcher', 'House Stock Watcher', 'GovTrack.us'].map((s) => (
            <span key={s} className="text-gray-400">{s}</span>
          ))}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#c8a951]/10 border border-[#c8a951]/30 rounded-full px-4 py-1.5 mb-5">
          <Shield className="h-4 w-4 text-[#c8a951]" />
          <span className="text-[#c8a951] text-sm font-medium">100% Objective · No Editorial Bias · Verified Sources Only</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Know exactly who you&apos;re voting for
        </h2>
        <p className="text-gray-300 leading-relaxed mb-3 text-lg">
          90% of elections are won by whoever spends the most money. In most local races,
          voters know nothing about candidates except their party. A 20-second political ad tells you
          your opponent&apos;s worst moments — it doesn&apos;t tell you who you&apos;re actually voting for.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The Ledger changes that. Every piece of data here comes from official government records,
          legally required disclosures, and non-partisan organizations.
          No spin. No editorializing. Just the facts — from national Senate races down to your local school board.
        </p>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl font-bold mb-2">What you can track</h2>
          <p className="text-gray-400 text-sm">All data from official government disclosures — FEC, Congress.gov, STOCK Act</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                href={f.href}
                className={`group rounded-2xl p-5 border ${f.bg} hover:scale-[1.01] transition-transform`}
              >
                <Icon className={`h-7 w-7 ${f.color} mb-3`} />
                <h3 className="text-white font-semibold mb-1.5">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                <div className={`flex items-center gap-1 mt-3 text-sm font-medium ${f.color} group-hover:gap-2 transition-all`}>
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── UPCOMING ELECTIONS ── */}
      <section className="bg-[#08152a] border-t border-[#1e3a5f]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-bold">Upcoming Elections</h2>
            <Link href="/elections" className="text-[#c8a951] hover:text-white text-sm flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingElections.map((election) => (
              <Link
                key={election.id}
                href={`/elections?id=${election.id}`}
                className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f] hover:border-[#c8a951] transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    election.level === 'federal' ? 'bg-blue-400/20 text-blue-400' :
                    election.level === 'state' ? 'bg-purple-400/20 text-purple-400' :
                    'bg-green-400/20 text-green-400'
                  }`}>
                    {election.level.charAt(0).toUpperCase() + election.level.slice(1)}
                  </span>
                  <span className="text-[#c8a951] text-xs font-medium">
                    {new Date(election.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-[#c8a951] transition-colors">
                  {election.title}
                </h3>
                <p className="text-gray-400 text-xs mb-3">{election.candidates.length} candidates</p>
                <div className="space-y-1">
                  {election.candidates.slice(0, 2).map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">{c.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          c.party === 'Democrat' ? 'bg-blue-500/20 text-blue-400' :
                          c.party === 'Republican' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>{c.party[0]}</span>
                        <span className="text-gray-500">{formatMoney(c.fundsRaised)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROFILES ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Featured Profiles</h2>
          <Link href="/politicians" className="text-[#c8a951] hover:text-white text-sm flex items-center gap-1 transition-colors">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockPoliticians.map((p) => (
            <Link
              key={p.id}
              href={`/politicians/${p.id}`}
              className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f] hover:border-[#c8a951] transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <span className="text-[#c8a951] font-bold text-lg">{p.firstName[0]}{p.lastName[0]}</span>
                  )}
                </div>
                <div>
                  <div className="text-white font-semibold group-hover:text-[#c8a951] transition-colors">{p.name}</div>
                  <div className="text-gray-400 text-xs">{p.chamber.replace('_', ' ')} · {p.state}</div>
                </div>
              </div>
              <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mb-3 ${
                p.party === 'Democrat' ? 'bg-blue-500/20 text-blue-400' :
                p.party === 'Republican' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-300'
              }`}>{p.party}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Consistency</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-[#1e3a5f] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.consistency.overallScore >= 75 ? 'bg-green-400' : p.consistency.overallScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${p.consistency.overallScore}%` }}
                    />
                  </div>
                  <span className={`font-medium ${p.consistency.overallScore >= 75 ? 'text-green-400' : p.consistency.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {p.consistency.overallScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-gray-400">Lobbyist $</span>
                <span className={p.campaignFinance.lobbyistMoney.length > 0 ? 'text-yellow-400' : 'text-green-400'}>
                  {formatMoney(p.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DATA TRANSPARENCY ── */}
      <section className="bg-gradient-to-r from-[#0a1628] via-[#0d1f35] to-[#0a1628] border-t border-b border-[#1e3a5f]">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              { label: 'FEC Disclosures', desc: 'Every campaign donation over $200 is public federal record', icon: '📋' },
              { label: 'STOCK Act', desc: 'Congress must disclose all trades ≥$1,000 within 30–45 days', icon: '📈' },
              { label: 'Roll Call Votes', desc: 'Every floor vote in Congress is recorded and public record', icon: '🗳️' },
            ].map((item) => (
              <div key={item.label} className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f] text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-[#c8a951] font-semibold mb-1">{item.label}</div>
                <div className="text-gray-400 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
