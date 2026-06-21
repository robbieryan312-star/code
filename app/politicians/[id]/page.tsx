'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { mockPoliticians } from '@/lib/data/mockPoliticians';
import VotingRecord from '@/components/politicians/VotingRecord';
import DonorChart from '@/components/politicians/DonorChart';
import StockTrades from '@/components/politicians/StockTrades';
import ConsistencyScore from '@/components/politicians/ConsistencyScore';
import ControversySection from '@/components/politicians/ControversySection';
import NewsSection from '@/components/politicians/NewsSection';
import Link from 'next/link';
import {
  ArrowLeft, X, Globe, Calendar, MapPin,
  TrendingUp, DollarSign, Vote, AlertTriangle, Briefcase, Newspaper, Scale,
  ExternalLink, Users, ChevronDown, ChevronRight, Baby, Crosshair, Plane,
  Heart, Leaf, Landmark, BookOpen, Globe2, Shield, Clock,
} from 'lucide-react';
import { use } from 'react';

const tabs = [
  { id: 'overview',      label: 'Overview',       icon: Briefcase },
  { id: 'votes',         label: 'Voting Record',  icon: Vote },
  { id: 'finance',       label: 'Money & Donors', icon: DollarSign },
  { id: 'stocks',        label: 'Stock Trades',   icon: TrendingUp },
  { id: 'consistency',   label: 'Promises',       icon: AlertTriangle },
  { id: 'controversies', label: 'Controversies',  icon: Scale },
  { id: 'news',          label: 'News',           icon: Newspaper },
  { id: 'endorsements',  label: 'Endorsements',   icon: Users },
];

import { Issue, Politician, VoteRecord } from '@/lib/types';

// ── Hot Topics quick-view ────────────────────────────────────────────────────
type HotTopicDef = { id: string; label: string; Icon: React.ElementType; keywords: string[] };
const HOT_TOPICS: HotTopicDef[] = [
  { id: 'abortion',    label: 'Abortion',          Icon: Baby,      keywords: ['abortion','reproductive','pro-life','pro-choice','6-week','15-week','roe'] },
  { id: 'guns',        label: 'Gun Control',       Icon: Crosshair, keywords: ['gun','firearm','second amendment','2nd amendment','2a','nra','carry','weapon'] },
  { id: 'immigration', label: 'Immigration',       Icon: Plane,     keywords: ['immigration','border','migrants','undocumented','sanctuary','e-verify'] },
  { id: 'healthcare',  label: 'Healthcare',        Icon: Heart,     keywords: ['healthcare','health care','medicaid','medicare','aca','obamacare','insurance','hospital'] },
  { id: 'climate',     label: 'Climate / Energy',  Icon: Leaf,      keywords: ['climate','environment','energy','green','carbon','fossil','everglades','drilling'] },
  { id: 'economy',     label: 'Economy / Taxes',   Icon: Landmark,  keywords: ['economy','tax','fiscal','budget','debt','spending','esg','inflation'] },
  { id: 'education',   label: 'Education',         Icon: BookOpen,  keywords: ['education','school','learning','student','teacher','curriculum','book','woke'] },
  { id: 'foreign',     label: 'Foreign Policy',    Icon: Globe2,    keywords: ['foreign','ukraine','israel','nato','war','military','aid','china','taiwan'] },
  { id: 'civil',       label: 'Civil Liberties',   Icon: Shield,    keywords: ['civil liberties','surveillance','privacy','fisa','patriot','4th amendment','speech','censorship'] },
];

function matchTopic(issues: Issue[], topic: HotTopicDef): Issue | null {
  const kw = topic.keywords;
  // Direct category match first
  const byCategory = issues.find(i =>
    kw.some(k => i.category.toLowerCase().includes(k) || i.name.toLowerCase().includes(k))
  );
  if (byCategory) return byCategory;
  // Then scan position + detail text
  return issues.find(i =>
    kw.some(k =>
      (i.position?.toLowerCase() || '').includes(k) ||
      (i.detail?.toLowerCase() || '').includes(k)
    )
  ) || null;
}

function HotTopicsPanel({ issues, votes }: { issues: Issue[]; votes: VoteRecord[] }) {
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  return (
    <div className="bg-[#0d1f35] rounded-xl border border-[#1e3a5f] p-5 mb-6">
      <h2 className="text-white font-bold mb-1">Where They Stand — Key Issues</h2>
      <p className="text-gray-500 text-xs mb-4">Click any topic to see their position, actions taken, and source</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {HOT_TOPICS.map(topic => {
          const matched = matchTopic(issues, topic);
          const Icon = topic.Icon;
          const isOpen = openTopic === topic.id;

          return (
            <div key={topic.id} className="col-span-1">
              <button
                onClick={() => setOpenTopic(isOpen ? null : topic.id)}
                className={`w-full text-left rounded-xl p-3 border transition-all ${
                  matched
                    ? isOpen
                      ? 'border-[#c8a951] bg-[#c8a951]/10'
                      : 'border-[#1e3a5f] hover:border-[#c8a951]/60 bg-[#0a1628] hover:bg-[#0a1628]'
                    : 'border-[#1e3a5f]/40 bg-[#0a1628]/40 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 flex-shrink-0 ${matched ? 'text-[#c8a951]' : 'text-gray-600'}`} />
                  <span className={`text-xs font-semibold ${matched ? 'text-white' : 'text-gray-600'}`}>{topic.label}</span>
                </div>
                <div className="text-xs text-gray-400 leading-tight line-clamp-2">
                  {matched ? matched.position : 'No record'}
                </div>
              </button>

              {isOpen && matched && (
                <div className="mt-1 rounded-xl border border-[#c8a951]/30 bg-[#06101e] p-3 text-xs space-y-2">
                  <p className="text-gray-300 leading-relaxed">{matched.detail}</p>
                  {matched.source && (
                    <div className="flex items-center gap-2 pt-1 border-t border-[#1e3a5f]">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        matched.source.tier === 'official'    ? 'bg-green-500/15 text-green-400' :
                        matched.source.tier === 'nonpartisan' ? 'bg-blue-500/15 text-blue-400' :
                        'bg-gray-500/15 text-gray-400'
                      }`}>{matched.source.tier}</span>
                      {matched.source.url ? (
                        <a href={matched.source.url} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-1 text-[#c8a951] hover:text-white transition-colors font-medium">
                          {matched.source.name} <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500">Source: {matched.source.name}{matched.source.date ? ` (${matched.source.date.split('-')[0]})` : ''}</span>
                      )}
                    </div>
                  )}
                  {/* Related votes */}
                  {votes.length > 0 && (() => {
                    const kw = topic.keywords;
                    const related = votes.filter(v =>
                      kw.some(k => v.billTitle.toLowerCase().includes(k) || v.billDescription.toLowerCase().includes(k) || v.category.toLowerCase().includes(k))
                    ).slice(0, 2);
                    if (!related.length) return null;
                    return (
                      <div className="pt-1 border-t border-[#1e3a5f]">
                        <div className="text-gray-500 mb-1">Related votes:</div>
                        {related.map(v => (
                          <div key={v.id} className="flex items-center gap-1.5 text-xs">
                            <span className={`font-bold ${v.vote === 'Yea' ? 'text-green-400' : v.vote === 'Nay' ? 'text-red-400' : 'text-gray-400'}`}>{v.vote}</span>
                            <span className="text-gray-400">{v.billTitle}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function IssueAccordion({ issues }: { issues: Issue[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {issues.map((issue, i) => (
        <div key={issue.name} className={`border rounded-xl overflow-hidden transition-colors ${openIdx === i ? 'border-[#c8a951]/40' : 'border-[#1e3a5f]'}`}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1e3a5f]/30 transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-medium text-sm">{issue.name}</span>
                <span className="text-xs bg-[#1e3a5f] text-gray-400 px-2 py-0 rounded-full">{issue.category}</span>
              </div>
              <div className="text-[#c8a951] text-xs mt-0.5">{issue.position}</div>
            </div>
            {openIdx === i
              ? <ChevronDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
              : <ChevronRight className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />}
          </button>
          {openIdx === i && (
            <div className="px-4 pb-3 border-t border-[#1e3a5f] bg-[#06101e]/50 space-y-2">
              <p className="text-gray-300 text-xs leading-relaxed pt-2">{issue.detail}</p>
              {issue.source && (
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    issue.source.tier === 'official'    ? 'bg-green-500/15 text-green-400' :
                    issue.source.tier === 'nonpartisan' ? 'bg-blue-500/15 text-blue-400' :
                    'bg-gray-500/15 text-gray-400'
                  }`}>{issue.source.tier}</span>
                  {issue.source.url ? (
                    <a href={issue.source.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-xs text-[#c8a951] hover:text-white transition-colors">
                      {issue.source.name} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500">Source: {issue.source.name}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EndorsementsTab({ politician }: { politician: Politician }) {
  const e = politician.endorsements;
  if (!e || (e.endorses.length === 0 && e.endorsedBy.length === 0)) {
    return (
      <div className="bg-[#0d1f35] rounded-xl p-8 border border-[#1e3a5f] text-center">
        <Users className="h-10 w-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">No endorsement data on record for {politician.name}</p>
        <p className="text-gray-600 text-xs mt-1">Endorsement records will be added as elections approach</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Endorsed By */}
      <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
        <h2 className="text-white font-bold mb-1 flex items-center gap-2">
          <Users className="h-4 w-4 text-[#c8a951]" /> Endorsed By
        </h2>
        <p className="text-gray-500 text-xs mb-4">Who has publicly supported {politician.firstName}</p>
        {e.endorsedBy.length === 0 ? (
          <p className="text-gray-500 text-sm">No endorsements recorded</p>
        ) : (
          <div className="space-y-3">
            {e.endorsedBy.map((endorser, i) => (
              <div key={i} className="border border-[#1e3a5f] rounded-xl p-3 bg-[#0a1628]">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#c8a951] text-xs font-bold">{endorser.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {endorser.politicianId ? (
                      <Link href={`/politicians/${endorser.politicianId}`} className="text-white font-medium text-sm hover:text-[#c8a951] transition-colors">
                        {endorser.name}
                      </Link>
                    ) : (
                      <span className="text-white font-medium text-sm">{endorser.name}</span>
                    )}
                    <div className="text-gray-400 text-xs">{endorser.office}</div>
                    {endorser.date && <div className="text-gray-600 text-xs">{endorser.date.split('-')[0]}</div>}
                    {endorser.source && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs px-1.5 py-0 rounded font-medium ${
                          endorser.source.tier === 'official' ? 'bg-green-500/15 text-green-400' :
                          endorser.source.tier === 'nonpartisan' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-gray-500/15 text-gray-400'
                        }`}>{endorser.source.tier}</span>
                        {endorser.source.url ? (
                          <a href={endorser.source.url} target="_blank" rel="noopener noreferrer"
                             className="text-xs text-gray-500 hover:text-[#c8a951] transition-colors flex items-center gap-1">
                            {endorser.source.name} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-600">{endorser.source.name}</span>
                        )}
                        {endorser.source.description && (
                          <span className="text-xs text-gray-600">— {endorser.source.description}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Endorses */}
      <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
        <h2 className="text-white font-bold mb-1 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400" /> Who {politician.firstName} Endorses
        </h2>
        <p className="text-gray-500 text-xs mb-4">Candidates and officials {politician.firstName} has publicly backed</p>
        {e.endorses.length === 0 ? (
          <p className="text-gray-500 text-sm">No outgoing endorsements recorded</p>
        ) : (
          <div className="space-y-3">
            {e.endorses.map((endorsed, i) => (
              <div key={i} className="border border-[#1e3a5f] rounded-xl p-3 bg-[#0a1628]">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">{endorsed.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {endorsed.politicianId ? (
                      <Link href={`/politicians/${endorsed.politicianId}`} className="text-white font-medium text-sm hover:text-[#c8a951] transition-colors">
                        {endorsed.name}
                      </Link>
                    ) : (
                      <span className="text-white font-medium text-sm">{endorsed.name}</span>
                    )}
                    <div className="text-gray-400 text-xs">{endorsed.office}</div>
                    {endorsed.date && <div className="text-gray-600 text-xs">{endorsed.date.split('-')[0]}</div>}
                    {endorsed.source && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs px-1.5 py-0 rounded font-medium ${
                          endorsed.source.tier === 'official' ? 'bg-green-500/15 text-green-400' :
                          endorsed.source.tier === 'nonpartisan' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-gray-500/15 text-gray-400'
                        }`}>{endorsed.source.tier}</span>
                        {endorsed.source.url ? (
                          <a href={endorsed.source.url} target="_blank" rel="noopener noreferrer"
                             className="text-xs text-gray-500 hover:text-[#c8a951] transition-colors flex items-center gap-1">
                            {endorsed.source.name} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-600">{endorsed.source.name}</span>
                        )}
                        {endorsed.source.description && (
                          <span className="text-xs text-gray-600">— {endorsed.source.description}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PoliticianProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const politician = mockPoliticians.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!politician) return notFound();

  const lobbyistTotal = politician.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
  const partyColor =
    politician.party === 'Democrat' ? 'text-blue-400' :
    politician.party === 'Republican' ? 'text-red-400' :
    'text-gray-300';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back */}
      <Link href="/politicians" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Politicians
      </Link>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-[#0d1f35] to-[#0a1628] rounded-2xl border border-[#1e3a5f] p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Photo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-[#1e3a5f] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {politician.imageUrl ? (
              <img src={politician.imageUrl} alt={politician.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#c8a951] font-bold text-4xl">{politician.firstName[0]}{politician.lastName[0]}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start flex-wrap gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{politician.name}</h1>
              {politician.inOffice && (
                <span className="text-xs bg-green-400/20 text-green-400 border border-green-400/30 px-2 py-1 rounded-full">In Office</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
              <span className={`font-medium ${partyColor}`}>{politician.party}</span>
              <span className="text-gray-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {politician.state}{politician.district ? ` · District ${politician.district}` : ''}
              </span>
              <span className="text-gray-400">
                {politician.chamber.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              {politician.termEnd && (() => {
                const end = new Date(politician.termEnd);
                const today = new Date();
                const monthsLeft = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));
                const soon = monthsLeft <= 18 && monthsLeft >= 0;
                return (
                  <span className={`flex items-center gap-1 ${soon ? 'text-[#c8a951]' : 'text-gray-400'}`}>
                    <Clock className="h-3.5 w-3.5" />
                    Term ends {politician.termEnd.split('-')[0]}
                    {soon && <span className="text-xs bg-[#c8a951]/20 px-1.5 py-0.5 rounded-full">({monthsLeft}mo)</span>}
                  </span>
                );
              })()}
              {politician.nextElection && (
                <span className="flex items-center gap-1 text-blue-400 text-xs bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                  <Calendar className="h-3 w-3" />
                  Next election: {politician.nextElection}
                </span>
              )}
            </div>

            {/* Political record summary — first 2 sentences only, no biography */}
            <p className="text-gray-400 text-xs leading-relaxed mb-2 max-w-2xl line-clamp-3">
              {politician.bio.split('. ').slice(-3).join('. ').trim()}
            </p>

            <div className="flex flex-wrap gap-2">
              {politician.termStart && (
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> In office since {politician.termStart.split('-')[0]}
                </span>
              )}
              {politician.website && (
                <a href={politician.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-white border border-[#1e3a5f] rounded-lg px-2 py-1 hover:border-white transition-colors">
                  <Globe className="h-3 w-3" /> Official site
                </a>
              )}
              {politician.twitter && (
                <a href={`https://twitter.com/${politician.twitter}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-white border border-[#1e3a5f] rounded-lg px-2 py-1 hover:border-white transition-colors">
                  <X className="h-3 w-3" /> @{politician.twitter}
                </a>
              )}
            </div>
          </div>

          {/* Key Stats */}
          <div className="flex md:flex-col gap-3 flex-wrap md:flex-nowrap">
            <div className="bg-[#0a1628] rounded-xl p-3 border border-[#1e3a5f] text-center min-w-[90px]">
              <div className={`text-2xl font-bold ${politician.consistency.overallScore >= 75 ? 'text-green-400' : politician.consistency.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {politician.consistency.overallScore}
              </div>
              <div className="text-xs text-gray-400">Consistency</div>
            </div>
            <div className="bg-[#0a1628] rounded-xl p-3 border border-[#1e3a5f] text-center min-w-[90px]">
              <div className="text-2xl font-bold text-[#c8a951]">{formatMoney(politician.campaignFinance.totalRaised)}</div>
              <div className="text-xs text-gray-400">Total Raised</div>
            </div>
            {lobbyistTotal > 0 && (
              <div className="bg-[#0a1628] rounded-xl p-3 border border-yellow-400/30 text-center min-w-[90px]">
                <div className="text-2xl font-bold text-yellow-400">{formatMoney(lobbyistTotal)}</div>
                <div className="text-xs text-gray-400">Lobbyist $</div>
              </div>
            )}
          </div>
        </div>

        {/* Committees */}
        {politician.committees && politician.committees.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#1e3a5f]">
            <span className="text-xs text-gray-400 mr-3">Committees:</span>
            <div className="inline-flex flex-wrap gap-2">
              {politician.committees.map((c) => (
                <span key={c} className="text-xs bg-[#1e3a5f] text-gray-300 px-2 py-0.5 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#c8a951] text-[#0a1628]'
                  : 'bg-[#0d1f35] text-gray-400 hover:text-white border border-[#1e3a5f] hover:border-[#c8a951]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <>
          <HotTopicsPanel issues={politician.topIssues} votes={politician.votingRecord} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Issues */}
            <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
              <h2 className="text-white font-bold mb-1">Key Positions</h2>
              <p className="text-gray-500 text-xs mb-4">Click each issue to see detail and sources</p>
              <IssueAccordion issues={politician.topIssues} />
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
                <h2 className="text-white font-bold mb-4">At a Glance</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Party-Line Vote Rate</span>
                    <span className="text-white font-medium">{politician.consistency.partyLineVotePercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lobbyist Alignment</span>
                    <span className={`font-medium ${politician.consistency.lobbyistAlignmentPercentage > 50 ? 'text-red-400' : 'text-green-400'}`}>
                      {politician.consistency.lobbyistAlignmentPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Individual Donations</span>
                    <span className="text-white font-medium">{formatMoney(politician.campaignFinance.individualDonations)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">PAC/Super PAC Money</span>
                    <span className={`font-medium ${politician.campaignFinance.pacDonations > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {politician.campaignFinance.pacDonations > 0 ? formatMoney(politician.campaignFinance.pacDonations) : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lobbyist Money</span>
                    <span className={`font-medium ${lobbyistTotal > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {lobbyistTotal > 0 ? formatMoney(lobbyistTotal) : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stock Trades</span>
                    <span className={`font-medium ${politician.stockTrades.length > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {politician.stockTrades.length > 0 ? `${politician.stockTrades.length} trades` : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">High-Conflict Trades</span>
                    <span className={`font-medium ${politician.stockTrades.filter((t) => t.conflictScore >= 70).length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {politician.stockTrades.filter((t) => t.conflictScore >= 70).length > 0
                        ? `${politician.stockTrades.filter((t) => t.conflictScore >= 70).length} detected`
                        : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
                <h2 className="text-white font-bold mb-3">Compare with Others</h2>
                <p className="text-gray-400 text-sm mb-3">See how this politician compares side-by-side</p>
                <Link
                  href={`/compare?a=${politician.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Start Comparison
                </Link>
              </div>
            </div>
          </div>
          </>
        )}

        {activeTab === 'votes' && (
          <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
            <h2 className="text-white font-bold mb-4">Voting Record</h2>
            <VotingRecord votes={politician.votingRecord} />
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
            <h2 className="text-white font-bold mb-4">Campaign Finance & Donors</h2>
            <DonorChart finance={politician.campaignFinance} />
          </div>
        )}

        {activeTab === 'stocks' && (
          <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
            <h2 className="text-white font-bold mb-4">Stock Trade Disclosures</h2>
            <StockTrades trades={politician.stockTrades} name={politician.name} />
          </div>
        )}

        {activeTab === 'consistency' && (
          <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
            <h2 className="text-white font-bold mb-4">Campaign Promise Tracker</h2>
            <ConsistencyScore data={politician.consistency} name={politician.name} />
          </div>
        )}

        {activeTab === 'controversies' && (
          <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
            <h2 className="text-white font-bold mb-4">Controversies & Allegations</h2>
            <ControversySection controversies={politician.controversies} name={politician.name} />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="bg-[#0d1f35] rounded-xl p-5 border border-[#1e3a5f]">
            <h2 className="text-white font-bold mb-4">News & Coverage</h2>
            <NewsSection news={politician.news} name={politician.name} />
          </div>
        )}

        {activeTab === 'endorsements' && (
          <EndorsementsTab politician={politician} />
        )}
      </div>
    </div>
  );
}
