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
  Heart, Leaf, Landmark, BookOpen, Globe2, Shield, Clock, Search, ArrowRightLeft,
  CheckCircle, XCircle, MinusCircle,
} from 'lucide-react';
import { use } from 'react';
import TrackButton from '@/components/ui/TrackButton';

const tabs = [
  { id: 'overview',      label: 'Overview',           icon: Briefcase },
  { id: 'sva',           label: 'Statements vs Acts', icon: Scale },
  { id: 'votes',         label: 'Voting Record',      icon: Vote },
  { id: 'finance',       label: 'Money & Donors',     icon: DollarSign },
  { id: 'stocks',        label: 'Stock Trades',       icon: TrendingUp },
  { id: 'consistency',   label: 'Promises',           icon: AlertTriangle },
  { id: 'controversies', label: 'Controversies',      icon: AlertTriangle },
  { id: 'news',          label: 'News',               icon: Newspaper },
  { id: 'endorsements',  label: 'Endorsements',       icon: Users },
];

import { EvidenceItem, Issue, Politician, StatementVsAction, VoteRecord } from '@/lib/types';

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
    <div className="rounded-xl border border-white/[0.08] p-5 mb-6" style={{ background: 'rgba(11,25,41,0.7)' }}>
      <h2 className="text-white font-bold mb-1">Where They Stand — Key Issues</h2>
      <p className="text-white/35 text-xs mb-4">Click any topic to see positions based on recorded votes, statements, and actions — not editorial opinion</p>
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
                      ? 'border-[#d4ac52]/50'
                      : 'border-white/[0.07] hover:border-[#d4ac52]/40'
                    : 'border-white/[0.04] opacity-50'
                }`}
                style={matched && isOpen ? { background: 'rgba(212,172,82,0.08)' } : { background: 'rgba(5,9,15,0.5)' }}
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
                <div className="mt-1 rounded-xl border border-[#d4ac52]/25 p-3 text-xs space-y-2" style={{ background: 'rgba(5,9,15,0.85)' }}>
                  <p className="text-gray-300 leading-relaxed italic">{matched.statement ?? matched.detail}</p>
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

const EVIDENCE_TYPE_STYLE: Record<string, string> = {
  vote:             'bg-blue-500/20 text-blue-300 border-blue-500/20',
  legislation:      'bg-green-500/20 text-green-300 border-green-500/20',
  quote:            'bg-purple-500/20 text-purple-300 border-purple-500/20',
  statement:        'bg-gray-500/20 text-gray-300 border-gray-500/20',
  action:           'bg-orange-500/20 text-orange-300 border-orange-500/20',
  committee_action: 'bg-teal-500/20 text-teal-300 border-teal-500/20',
};

function EvidenceRow({ item }: { item: EvidenceItem }) {
  return (
    <div className="rounded-lg p-2.5 border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-start gap-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold uppercase tracking-wide flex-shrink-0 mt-0.5 ${EVIDENCE_TYPE_STYLE[item.type] || EVIDENCE_TYPE_STYLE.statement}`}>
          {item.type.replace('_', ' ')}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-white/65 text-xs leading-relaxed">{item.description}</p>
          {item.quote && (
            <blockquote className="mt-1 pl-2.5 border-l-2 border-[#c8a951]/40 text-[#c8a951]/70 text-xs italic leading-relaxed">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] text-gray-600">{item.date}</span>
            <span className={`text-[10px] px-1.5 py-0 rounded ${
              item.source.tier === 'official'    ? 'bg-green-500/10 text-green-400' :
              item.source.tier === 'nonpartisan' ? 'bg-blue-500/10 text-blue-400' :
              'bg-gray-500/10 text-gray-400'
            }`}>{item.source.tier}</span>
            {item.source.url ? (
              <a href={item.source.url} target="_blank" rel="noopener noreferrer"
                 className="text-[10px] text-[#c8a951]/70 hover:text-[#c8a951] flex items-center gap-0.5 transition-colors">
                {item.source.name} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ) : (
              <span className="text-[10px] text-gray-600">{item.source.name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConvergenceIndicator({ evidence }: { evidence: EvidenceItem[] }) {
  const uniqueSources = new Set(evidence.map((e) => e.source.name)).size;
  const filled = Math.min(5, evidence.length);
  const label =
    uniqueSources >= 3 ? `${uniqueSources} independent sources point to the same conclusion` :
    uniqueSources === 2 ? 'Corroborated by 2 independent sources' :
    'Single source — treat with appropriate caution';
  const color = uniqueSources >= 3 ? 'text-green-400' : uniqueSources === 2 ? 'text-[#c8a951]' : 'text-gray-500';
  return (
    <div className="flex items-center gap-2 mt-2 mb-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`inline-block w-2 h-2 rounded-full ${n <= filled ? 'bg-[#c8a951]' : 'bg-white/[0.08]'}`} />
        ))}
      </div>
      <span className={`text-[10px] font-medium ${color}`}>{label}</span>
    </div>
  );
}

function IssueAccordion({ issues, politicianName }: { issues: Issue[]; politicianName: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const lastName = politicianName.split(' ').pop() ?? politicianName;

  return (
    <div className="space-y-2">
      {issues.map((issue, i) => (
        <div key={issue.name} className={`border rounded-xl overflow-hidden transition-all ${openIdx === i ? 'border-[#d4ac52]/40' : 'border-white/[0.07]'}`}
             style={{ background: openIdx === i ? 'rgba(212,172,82,0.04)' : 'rgba(5,9,15,0.4)' }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-medium text-sm">{issue.name}</span>
                <span className="text-xs text-white/35 px-2 py-0 rounded-full border border-white/[0.07]">{issue.category}</span>
                {issue.evidence && issue.evidence.length > 0 && (
                  <span className="text-[10px] text-[#c8a951]/60 border border-[#c8a951]/20 px-1.5 py-0 rounded-full">
                    {issue.evidence.length} evidence item{issue.evidence.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#d4ac52' }}>{issue.position}</div>
            </div>
            {openIdx === i
              ? <ChevronDown className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />
              : <ChevronRight className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />}
          </button>

          {openIdx === i && (
            <div className="px-4 pb-4 border-t border-white/[0.06]" style={{ background: 'rgba(5,9,15,0.4)' }}>

              {/* Convergence indicator */}
              {issue.evidence && issue.evidence.length > 0 && (
                <ConvergenceIndicator evidence={issue.evidence} />
              )}

              {/* Qualified statement */}
              <p className="text-white/60 text-xs leading-relaxed pt-2 mb-3 italic border-l-2 border-[#c8a951]/30 pl-3">
                {issue.statement ?? `Available evidence suggests ${lastName} ${issue.detail.charAt(0).toLowerCase()}${issue.detail.slice(1)}`}
              </p>

              {/* Evidence items */}
              {issue.evidence && issue.evidence.length > 0 ? (
                <div className="space-y-2">
                  {issue.evidence.map((ev, j) => (
                    <EvidenceRow key={j} item={ev} />
                  ))}
                </div>
              ) : issue.source ? (
                /* Fallback: single legacy source */
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    issue.source.tier === 'official'    ? 'bg-green-500/15 text-green-400' :
                    issue.source.tier === 'nonpartisan' ? 'bg-blue-500/15 text-blue-400' :
                    'bg-gray-500/15 text-gray-400'
                  }`}>{issue.source.tier}</span>
                  {issue.source.url ? (
                    <a href={issue.source.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-xs hover:text-white transition-colors" style={{ color: '#d4ac52' }}>
                      {issue.source.name} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-white/30">Source: {issue.source.name}</span>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const VERDICT_STYLE: Record<StatementVsAction['verdict'], { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  Contradiction: { label: 'Contradiction', icon: XCircle,     color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/25' },
  Partial:       { label: 'Partial',       icon: MinusCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/25' },
  Consistent:    { label: 'Consistent',    icon: CheckCircle, color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/25' },
};

function StatementsVsActionsTab({ politician }: { politician: Politician }) {
  const items = politician.statementsVsActions ?? [];
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | StatementVsAction['verdict']>('All');

  const filtered = items.filter(item => {
    const matchesSearch = !search || [item.topic, item.statement.quote, item.action.description, item.gap]
      .some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'All' || item.verdict === filter;
    return matchesSearch && matchesFilter;
  });

  if (items.length === 0) {
    return (
      <div className="rounded-xl p-8 border border-white/[0.07] text-center" style={{ background: 'rgba(11,25,41,0.6)' }}>
        <ArrowRightLeft className="h-10 w-10 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">No statement vs. action analysis available for {politician.name} yet</p>
        <p className="text-white/20 text-xs mt-1">Data is added based on documented public record — quotes, votes, and dated actions</p>
      </div>
    );
  }

  const counts = {
    Contradiction: items.filter(i => i.verdict === 'Contradiction').length,
    Partial:       items.filter(i => i.verdict === 'Partial').length,
    Consistent:    items.filter(i => i.verdict === 'Consistent').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
        <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
          <div>
            <h2 className="text-white font-bold flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-[#c8a951]" />
              Stated vs. Documented: {politician.firstName}
            </h2>
            <p className="text-white/35 text-xs mt-1">
              Comparing dated public statements with verified documented actions. Sourced from official records, C-SPAN, AP, Reuters, and Congress.gov — not editorial interpretation.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(counts) as [StatementVsAction['verdict'], number][]).map(([verdict, count]) => {
              const s = VERDICT_STYLE[verdict];
              return (
                <span key={verdict} className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 ${s.color} ${s.bg} ${s.border}`}>
                  <s.icon className="h-3 w-3" />{count} {verdict}
                </span>
              );
            })}
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search topics, quotes, actions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-600 border border-white/[0.08] outline-none focus:border-[#c8a951]/40 transition-colors"
              style={{ background: 'rgba(5,9,15,0.6)' }}
            />
          </div>
          {(['All', 'Contradiction', 'Partial', 'Consistent'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-2 rounded-lg border transition-all font-medium ${
                filter === f
                  ? 'border-[#c8a951]/50 text-[#c8a951]'
                  : 'border-white/[0.07] text-white/40 hover:text-white/60'
              }`}
              style={filter === f ? { background: 'rgba(212,172,82,0.08)' } : { background: 'rgba(5,9,15,0.4)' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-white/30 text-sm">No results for &ldquo;{search}&rdquo;</div>
      ) : (
        <div className="space-y-4">
          {filtered
            .sort((a, b) => (a.importance === 'high' ? -1 : a.importance === 'medium' ? 0 : 1) - (b.importance === 'high' ? -1 : b.importance === 'medium' ? 0 : 1))
            .map(item => {
              const s = VERDICT_STYLE[item.verdict];
              const Icon = s.icon;
              return (
                <div key={item.id} className="rounded-xl border border-white/[0.08] overflow-hidden" style={{ background: 'rgba(11,25,41,0.7)' }}>
                  {/* Topic header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]" style={{ background: 'rgba(5,9,15,0.4)' }}>
                    <div className="flex items-center gap-2">
                      {item.importance === 'high' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8a951]/70 bg-[#c8a951]/10 border border-[#c8a951]/20 px-1.5 py-0.5 rounded">High Profile</span>
                      )}
                      <span className="text-white font-semibold text-sm">{item.topic}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 ${s.color} ${s.bg} ${s.border}`}>
                      <Icon className="h-3.5 w-3.5" /> {s.label}
                    </span>
                  </div>

                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Statement */}
                    <div>
                      <div className="text-xs font-semibold text-[#c8a951]/80 uppercase tracking-wide mb-2">The Statement</div>
                      <div className="rounded-lg border border-[#c8a951]/20 p-3 mb-2" style={{ background: 'rgba(212,172,82,0.05)' }}>
                        <blockquote className="text-white/70 text-xs italic leading-relaxed border-l-2 border-[#c8a951]/40 pl-3 mb-2">
                          &ldquo;{item.statement.quote}&rdquo;
                        </blockquote>
                        <p className="text-white/40 text-xs leading-relaxed">{item.statement.context}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-600">{item.statement.date}</span>
                        <span className={`text-[10px] px-1.5 py-0 rounded ${
                          item.statement.source.tier === 'official' ? 'bg-green-500/10 text-green-400' :
                          item.statement.source.tier === 'nonpartisan' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>{item.statement.source.tier}</span>
                        {item.statement.source.url ? (
                          <a href={item.statement.source.url} target="_blank" rel="noopener noreferrer"
                             className="text-[10px] text-[#c8a951]/60 hover:text-[#c8a951] flex items-center gap-0.5 transition-colors">
                            {item.statement.source.name} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-gray-600">{item.statement.source.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div>
                      <div className="text-xs font-semibold text-blue-400/80 uppercase tracking-wide mb-2">The Action</div>
                      <div className="rounded-lg border border-blue-500/20 p-3 mb-2" style={{ background: 'rgba(59,130,246,0.05)' }}>
                        <p className="text-white/70 text-xs leading-relaxed">{item.action.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-600">{item.action.date}</span>
                        <span className={`text-[10px] px-1.5 py-0 rounded ${
                          item.action.source.tier === 'official' ? 'bg-green-500/10 text-green-400' :
                          item.action.source.tier === 'nonpartisan' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>{item.action.source.tier}</span>
                        {item.action.source.url ? (
                          <a href={item.action.source.url} target="_blank" rel="noopener noreferrer"
                             className="text-[10px] text-[#c8a951]/60 hover:text-[#c8a951] flex items-center gap-0.5 transition-colors">
                            {item.action.source.name} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-gray-600">{item.action.source.name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gap analysis */}
                  <div className={`px-5 py-3 border-t border-white/[0.05] ${s.bg}`}>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${s.color} mr-2`}>Analysis:</span>
                    <span className="text-white/55 text-xs">{item.gap}</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <p className="text-center text-white/20 text-xs pt-2">
        All entries sourced from dated public records. &ldquo;Contradiction&rdquo; means documented factual gap between stated position and subsequent action. &ldquo;Partial&rdquo; means partial follow-through or a shift in degree. &ldquo;Consistent&rdquo; is included for completeness where record-check found alignment.
      </p>
    </div>
  );
}

function EndorsementsTab({ politician }: { politician: Politician }) {
  const e = politician.endorsements;
  if (!e || (e.endorses.length === 0 && e.endorsedBy.length === 0)) {
    return (
      <div className="rounded-xl p-8 border border-white/[0.07] text-center" style={{ background: 'rgba(11,25,41,0.6)' }}>
        <Users className="h-10 w-10 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">No endorsement data on record for {politician.name}</p>
        <p className="text-white/20 text-xs mt-1">Endorsement records will be added as elections approach</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Endorsed By */}
      <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
        <h2 className="text-white font-bold mb-1 flex items-center gap-2">
          <Users className="h-4 w-4 text-[#c8a951]" /> Endorsed By
        </h2>
        <p className="text-gray-500 text-xs mb-4">Who has publicly supported {politician.firstName}</p>
        {e.endorsedBy.length === 0 ? (
          <p className="text-gray-500 text-sm">No endorsements recorded</p>
        ) : (
          <div className="space-y-3">
            {e.endorsedBy.map((endorser, i) => (
              <div key={i} className="border border-white/[0.07] rounded-xl p-3" style={{ background: 'rgba(5,9,15,0.5)' }}>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-white/[0.08]" style={{ background: 'rgba(212,172,82,0.12)' }}>
                    <span className="text-xs font-bold" style={{ color: '#d4ac52' }}>{endorser.name.split(' ').filter(Boolean).map((n: string) => n[0]).slice(0,2).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {endorser.politicianId ? (
                      <Link href={`/politicians/${endorser.politicianId}`} className="text-white font-medium text-sm hover:text-[#d4ac52] transition-colors">
                        {endorser.name}
                      </Link>
                    ) : (
                      <span className="text-white font-medium text-sm">{endorser.name}</span>
                    )}
                    <div className="text-white/40 text-xs">{endorser.office}</div>
                    {endorser.date && <div className="text-white/25 text-xs">{endorser.date.split('-')[0]}</div>}
                    {endorser.source && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs px-1.5 py-0 rounded font-medium ${
                          endorser.source.tier === 'official' ? 'bg-green-500/15 text-green-400' :
                          endorser.source.tier === 'nonpartisan' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-gray-500/15 text-gray-400'
                        }`}>{endorser.source.tier}</span>
                        {endorser.source.url ? (
                          <a href={endorser.source.url} target="_blank" rel="noopener noreferrer"
                             className="text-xs text-white/30 hover:text-[#d4ac52] transition-colors flex items-center gap-1">
                            {endorser.source.name} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-white/25">{endorser.source.name}</span>
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
      <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
        <h2 className="text-white font-bold mb-1 flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400" /> Who {politician.firstName} Endorses
        </h2>
        <p className="text-gray-500 text-xs mb-4">Candidates and officials {politician.firstName} has publicly backed</p>
        {e.endorses.length === 0 ? (
          <p className="text-gray-500 text-sm">No outgoing endorsements recorded</p>
        ) : (
          <div className="space-y-3">
            {e.endorses.map((endorsed, i) => (
              <div key={i} className="border border-white/[0.07] rounded-xl p-3" style={{ background: 'rgba(5,9,15,0.5)' }}>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-white/[0.08]" style={{ background: 'rgba(96,165,250,0.12)' }}>
                    <span className="text-blue-400 text-xs font-bold">{endorsed.name.split(' ').filter(Boolean).map((n: string) => n[0]).slice(0,2).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {endorsed.politicianId ? (
                      <Link href={`/politicians/${endorsed.politicianId}`} className="text-white font-medium text-sm hover:text-[#d4ac52] transition-colors">
                        {endorsed.name}
                      </Link>
                    ) : (
                      <span className="text-white font-medium text-sm">{endorsed.name}</span>
                    )}
                    <div className="text-white/40 text-xs">{endorsed.office}</div>
                    {endorsed.date && <div className="text-white/25 text-xs">{endorsed.date.split('-')[0]}</div>}
                    {endorsed.source && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs px-1.5 py-0 rounded font-medium ${
                          endorsed.source.tier === 'official' ? 'bg-green-500/15 text-green-400' :
                          endorsed.source.tier === 'nonpartisan' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-gray-500/15 text-gray-400'
                        }`}>{endorsed.source.tier}</span>
                        {endorsed.source.url ? (
                          <a href={endorsed.source.url} target="_blank" rel="noopener noreferrer"
                             className="text-xs text-white/30 hover:text-[#d4ac52] transition-colors flex items-center gap-1">
                            {endorsed.source.name} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-white/25">{endorsed.source.name}</span>
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

export default function PoliticianProfile({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { id } = use(params);
  const { tab } = use(searchParams);
  const politician = mockPoliticians.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState(() => tab ?? 'overview');
  const [profileSearch, setProfileSearch] = useState('');

  if (!politician) return notFound();

  const lobbyistTotal = politician.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
  const highConflictTrades = politician.stockTrades.filter((t) => t.conflictScore >= 70);
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
      <div className="rounded-2xl border border-white/[0.08] p-6 mb-6 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, rgba(15,34,54,0.9) 0%, rgba(11,25,41,0.9) 100%)', backdropFilter: 'blur(12px)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 60% 100% at 0% 50%, rgba(30,62,100,0.25) 0%, transparent 70%)' }} />
        <div className="relative flex flex-col md:flex-row gap-5">
          {/* Photo */}
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/[0.1]"
               style={{ background: 'linear-gradient(135deg, #0f2236 0%, #07101f 100%)' }}>
            {politician.imageUrl ? (
              <img src={politician.imageUrl} alt={politician.name} className="w-full h-full object-cover object-top" />
            ) : (
              <span className="font-bold text-4xl" style={{ color: '#d4ac52' }}>{politician.firstName[0]}{politician.lastName[0]}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start flex-wrap gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{politician.name}</h1>
              {politician.inOffice && (
                <span className="text-xs bg-green-400/15 text-green-400 border border-green-400/25 px-2.5 py-1 rounded-full font-medium tracking-wide">In Office</span>
              )}
              <TrackButton politicianId={politician.id} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
              <span className={`font-medium ${partyColor}`}>{politician.party}</span>
              <span className="text-gray-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {politician.state}{politician.district ? ` · District ${politician.district}` : ''}
              </span>
              <span className="text-gray-400">
                {politician.chamber.replaceAll('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              {politician.termEnd && (() => {
                const end = new Date(politician.termEnd);
                const today = new Date();
                const monthsLeft = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));
                const soon = monthsLeft > 0 && monthsLeft <= 18;
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

            {/* Political record summary */}
            <p className="text-white/40 text-xs leading-relaxed mb-2 max-w-2xl line-clamp-3">
              {politician.bio}
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
          <div className="flex md:flex-col gap-2 flex-wrap md:flex-nowrap">
            {politician.inOffice && politician.approvalRating !== undefined && (
              <div className="rounded-xl p-3 border border-white/[0.07] text-center min-w-[90px]" style={{ background: 'rgba(5,9,15,0.5)' }}
                   title={`Approval: ${politician.approvalPollster ?? ''}${politician.approvalSampleSize ? ` (n=${politician.approvalSampleSize.toLocaleString()})` : ''}${politician.approvalDate ? ` · ${politician.approvalDate.split('-')[0]}` : ''}`}>
                <div className={`text-2xl font-bold ${politician.approvalRating >= 50 ? 'text-green-400' : politician.approvalRating >= 35 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {politician.approvalRating}%
                </div>
                <div className="text-xs text-white/40">Approval</div>
                {politician.approvalPollster && (
                  <div className="text-[9px] text-white/20 leading-tight mt-0.5 max-w-[88px] mx-auto truncate">{politician.approvalPollster}</div>
                )}
              </div>
            )}
            <div className="rounded-xl p-3 border border-white/[0.07] text-center min-w-[90px]" style={{ background: 'rgba(5,9,15,0.5)' }}>
              <div className={`text-2xl font-bold ${politician.consistency.overallScore >= 75 ? 'text-green-400' : politician.consistency.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {politician.consistency.overallScore}
              </div>
              <div className="text-xs text-white/40">Consistency</div>
            </div>
            <div className="rounded-xl p-3 border border-white/[0.07] text-center min-w-[90px]" style={{ background: 'rgba(5,9,15,0.5)' }}>
              <div className="text-2xl font-bold" style={{ color: '#d4ac52' }}>{formatMoney(politician.campaignFinance.totalRaised)}</div>
              <div className="text-xs text-white/40">Total Raised</div>
            </div>
            {lobbyistTotal > 0 && (
              <div className="rounded-xl p-3 border border-yellow-400/20 text-center min-w-[90px]" style={{ background: 'rgba(5,9,15,0.5)' }}>
                <div className="text-2xl font-bold text-yellow-400">{formatMoney(lobbyistTotal)}</div>
                <div className="text-xs text-white/40">Lobbyist $</div>
              </div>
            )}
          </div>
        </div>

        {/* Committees */}
        {politician.committees && politician.committees.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] relative">
            <span className="text-xs text-white/35 mr-3">Committees:</span>
            <div className="inline-flex flex-wrap gap-1.5">
              {politician.committees.map((c) => (
                <span key={c} className="text-xs text-white/50 px-2.5 py-0.5 rounded-full border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)' }}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder={`Search ${politician.firstName}'s votes, statements, positions, controversies…`}
          value={profileSearch}
          onChange={e => setProfileSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 border border-white/[0.07] outline-none focus:border-[#c8a951]/40 transition-colors"
          style={{ background: 'rgba(5,9,15,0.6)' }}
        />
        {profileSearch && (
          <button
            onClick={() => setProfileSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab !== tab.id ? 'hover:bg-white/[0.08] hover:text-white/70' : ''
              }`}
              style={activeTab === tab.id
                ? { background: 'linear-gradient(135deg, #d4ac52 0%, #b8922f 100%)', color: '#05090f', boxShadow: '0 2px 12px rgba(212,172,82,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.07)' }
              }
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile-wide search results */}
      {profileSearch && (() => {
        const q = profileSearch.toLowerCase();
        const voteResults = politician.votingRecord.filter(v =>
          v.billTitle.toLowerCase().includes(q) || v.billDescription.toLowerCase().includes(q) || v.category.toLowerCase().includes(q)
        );
        const issueResults = politician.topIssues.filter(i =>
          i.name.toLowerCase().includes(q) || i.position.toLowerCase().includes(q) || i.detail.toLowerCase().includes(q)
        );
        const controversyResults = politician.controversies.filter(c =>
          c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
        );
        const newsResults = politician.news.filter(n =>
          n.headline.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)
        );
        const svaResults = (politician.statementsVsActions ?? []).filter(s =>
          s.topic.toLowerCase().includes(q) || s.statement.quote.toLowerCase().includes(q) ||
          s.action.description.toLowerCase().includes(q) || s.gap.toLowerCase().includes(q)
        );
        const total = voteResults.length + issueResults.length + controversyResults.length + newsResults.length + svaResults.length;

        return (
          <div className="mb-6 rounded-xl border border-[#c8a951]/25 overflow-hidden" style={{ background: 'rgba(5,9,15,0.85)' }}>
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-white/60 text-sm">{total} result{total !== 1 ? 's' : ''} for <span className="text-[#c8a951]">&ldquo;{profileSearch}&rdquo;</span></span>
              <button onClick={() => setProfileSearch('')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Clear</button>
            </div>
            <div className="divide-y divide-white/[0.04] max-h-[480px] overflow-y-auto">
              {issueResults.map(i => (
                <button key={i.name} onClick={() => { setActiveTab('overview'); setProfileSearch(''); }}
                  className="w-full text-left px-5 py-3 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#c8a951]/60 bg-[#c8a951]/10 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">Position</span>
                  <div><div className="text-white text-sm font-medium">{i.name}</div><div className="text-white/40 text-xs">{i.position}</div></div>
                </button>
              ))}
              {voteResults.map(v => (
                <button key={v.id} onClick={() => { setActiveTab('votes'); setProfileSearch(''); }}
                  className="w-full text-left px-5 py-3 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-400/60 bg-blue-500/10 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">Vote</span>
                  <div>
                    <div className="text-white text-sm font-medium">{v.billTitle}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-bold ${v.vote === 'Yea' ? 'text-green-400' : v.vote === 'Nay' ? 'text-red-400' : 'text-gray-400'}`}>{v.vote}</span>
                      <span className="text-white/35 text-xs">{v.date} · {v.category}</span>
                    </div>
                  </div>
                </button>
              ))}
              {svaResults.map(s => (
                <button key={s.id} onClick={() => { setActiveTab('sva'); setProfileSearch(''); }}
                  className="w-full text-left px-5 py-3 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${
                    s.verdict === 'Contradiction' ? 'text-red-400/60 bg-red-500/10' :
                    s.verdict === 'Partial' ? 'text-yellow-400/60 bg-yellow-500/10' :
                    'text-green-400/60 bg-green-500/10'
                  }`}>Stmt vs Act</span>
                  <div><div className="text-white text-sm font-medium">{s.topic}</div><div className="text-white/40 text-xs">{s.verdict}</div></div>
                </button>
              ))}
              {controversyResults.map(c => (
                <button key={c.id} onClick={() => { setActiveTab('controversies'); setProfileSearch(''); }}
                  className="w-full text-left px-5 py-3 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-orange-400/60 bg-orange-500/10 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">Controversy</span>
                  <div><div className="text-white text-sm font-medium">{c.title}</div><div className="text-white/40 text-xs">{c.category} · {c.status}</div></div>
                </button>
              ))}
              {newsResults.map(n => (
                <button key={n.id} onClick={() => { setActiveTab('news'); setProfileSearch(''); }}
                  className="w-full text-left px-5 py-3 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400/60 bg-gray-500/10 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">News</span>
                  <div><div className="text-white text-sm font-medium">{n.headline}</div><div className="text-white/40 text-xs">{n.date} · {n.category}</div></div>
                </button>
              ))}
              {total === 0 && (
                <div className="px-5 py-8 text-center text-white/30 text-sm">No results found</div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <>
          <HotTopicsPanel issues={politician.topIssues} votes={politician.votingRecord} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Issues */}
            <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
              <h2 className="text-white font-bold mb-1">Key Positions</h2>
              <p className="text-gray-500 text-xs mb-4">Click each issue to see evidence and sources — positions expressed as what available records show, not as definitive statements</p>
              <IssueAccordion issues={politician.topIssues} politicianName={politician.name} />
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
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
                    <span className={`font-medium ${highConflictTrades.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {highConflictTrades.length > 0 ? `${highConflictTrades.length} detected` : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
                <h2 className="text-white font-bold mb-3">Compare with Others</h2>
                <p className="text-gray-400 text-sm mb-3">See how this politician compares side-by-side</p>
                <Link
                  href={`/compare?a=${politician.id}`}
                  className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Start Comparison
                </Link>
              </div>
            </div>
          </div>
          </>
        )}

        {activeTab === 'sva' && (
          <StatementsVsActionsTab politician={politician} />
        )}

        {activeTab === 'votes' && (
          <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
            <h2 className="text-white font-bold mb-4">Voting Record</h2>
            <VotingRecord votes={politician.votingRecord} />
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
            <h2 className="text-white font-bold mb-4">Campaign Finance & Donors</h2>
            <DonorChart finance={politician.campaignFinance} />
          </div>
        )}

        {activeTab === 'stocks' && (
          <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
            <h2 className="text-white font-bold mb-4">Stock Trade Disclosures</h2>
            <StockTrades trades={politician.stockTrades} name={politician.name} />
          </div>
        )}

        {activeTab === 'consistency' && (
          <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
            <h2 className="text-white font-bold mb-4">Campaign Promise Tracker</h2>
            <ConsistencyScore data={politician.consistency} name={politician.name} />
          </div>
        )}

        {activeTab === 'controversies' && (
          <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
            <h2 className="text-white font-bold mb-4">Controversies & Allegations</h2>
            <ControversySection controversies={politician.controversies} name={politician.name} />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="rounded-xl p-5 border border-white/[0.08]" style={{ background: 'rgba(11,25,41,0.7)' }}>
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
