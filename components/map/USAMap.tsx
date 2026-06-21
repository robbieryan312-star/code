'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { mockStates } from '@/lib/data/mockPoliticians';
import { mockPoliticians } from '@/lib/data/mockPoliticians';
import { mockElections } from '@/lib/data/mockElections';
import Link from 'next/link';
import { X, ChevronDown, ChevronRight, Calendar, Users, DollarSign, AlertTriangle, TrendingUp, Vote } from 'lucide-react';
import { Politician } from '@/lib/types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const STATE_ABBR: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH',
  'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
  'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA',
  'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN',
  'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
  'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
};

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function PoliticianRow({ politician }: { politician: Politician }) {
  const [expanded, setExpanded] = useState(false);
  const lobbyistTotal = politician.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);

  const partyColor =
    politician.party === 'Democrat' ? 'bg-blue-500/20 text-blue-400' :
    politician.party === 'Republican' ? 'bg-red-500/20 text-red-400' :
    'bg-gray-500/20 text-gray-300';

  return (
    <div className={`border border-[#1e3a5f] rounded-xl overflow-hidden transition-colors ${expanded ? 'border-[#c8a951]/40' : ''}`}>
      {/* Collapsed Row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 p-3 hover:bg-[#1e3a5f]/40 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center overflow-hidden flex-shrink-0">
          {politician.imageUrl ? (
            <img src={politician.imageUrl} alt={politician.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#c8a951] text-xs font-bold">{politician.firstName[0]}{politician.lastName[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold truncate">{politician.name}</div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-1.5 py-0 rounded ${partyColor}`}>{politician.party.slice(0,1)}</span>
            <span className="text-gray-400 text-xs">{politician.chamber.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {lobbyistTotal > 0 && <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />}
          {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-[#1e3a5f] bg-[#06101e]/60">
          {/* Bio */}
          <p className="text-gray-400 text-xs leading-relaxed mt-2.5 mb-2">
            {politician.bio.slice(0, 180)}{politician.bio.length > 180 ? '…' : ''}
          </p>

          {/* Top Issues */}
          <div className="space-y-1 mb-2.5">
            {politician.topIssues.slice(0, 2).map((issue) => (
              <div key={issue.name} className="text-xs">
                <span className="text-[#c8a951] font-medium">{issue.name}: </span>
                <span className="text-gray-400">{issue.position}</span>
              </div>
            ))}
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            <div className="bg-[#0d1f35] rounded-lg p-2">
              <div className="text-xs text-gray-500">Consistency</div>
              <div className={`text-sm font-bold ${politician.consistency.overallScore >= 75 ? 'text-green-400' : politician.consistency.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {politician.consistency.overallScore}/100
              </div>
            </div>
            <div className={`rounded-lg p-2 ${lobbyistTotal > 0 ? 'bg-yellow-400/10' : 'bg-[#0d1f35]'}`}>
              <div className="text-xs text-gray-500">Lobbyist $</div>
              <div className={`text-sm font-bold ${lobbyistTotal > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                {lobbyistTotal > 0 ? formatMoney(lobbyistTotal) : 'None'}
              </div>
            </div>
          </div>

          {/* Votes highlights */}
          {politician.votingRecord.length > 0 && (
            <div className="mb-2.5 text-xs text-gray-500">
              Recent vote: <span className="text-gray-300">{politician.votingRecord[0].billTitle}</span>
              <span className={`ml-1 ${politician.votingRecord[0].vote === 'Yea' ? 'text-green-400' : 'text-red-400'}`}>
                ({politician.votingRecord[0].vote})
              </span>
            </div>
          )}

          {/* Sources note */}
          <div className="text-xs text-gray-600 mb-2">
            Sources: Congress.gov · FEC · OpenSecrets
          </div>

          <Link
            href={`/politicians/${politician.id}`}
            className="w-full flex items-center justify-center gap-1.5 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white text-xs py-2 rounded-lg transition-colors font-medium"
          >
            Full Profile & Record
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function USAMap() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const selectedStateData = selectedState ? mockStates.find((s) => s.code === selectedState) : null;
  const statePoliticians = selectedState
    ? mockPoliticians.filter((p) => p.stateCode === selectedState)
    : [];
  const stateElections = selectedState
    ? mockElections.filter((e) => e.stateCode === selectedState)
    : [];

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoAlbersUsa"
        className="w-full h-auto"
        style={{ background: 'transparent' }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const stateName = geo.properties.name;
                const stateCode = STATE_ABBR[stateName];
                const isSelected = selectedState === stateCode;
                const isHovered = hoveredState === stateCode;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredState(stateCode)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => setSelectedState(stateCode === selectedState ? null : stateCode)}
                    style={{
                      default: {
                        fill: isSelected ? '#c8a951' : isHovered ? '#2d5a8e' : '#1e3a5f',
                        stroke: '#0a1628',
                        strokeWidth: 0.8,
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'fill 0.15s ease',
                      },
                      hover: {
                        fill: isSelected ? '#d4b86a' : '#2d5a8e',
                        stroke: '#c8a951',
                        strokeWidth: 1.2,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#c8a951',
                        stroke: '#c8a951',
                        strokeWidth: 1.5,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* State Detail Panel */}
      {selectedState && selectedStateData && (
        <div className="absolute top-0 right-0 h-full w-80 bg-[#08152a]/97 backdrop-blur-sm border-l border-[#1e3a5f] overflow-y-auto z-20 flex flex-col">
          {/* Panel Header */}
          <div className="sticky top-0 bg-[#08152a] border-b border-[#1e3a5f] px-4 py-3 flex items-center justify-between z-10">
            <div>
              <div className="text-white font-bold text-lg">{selectedStateData.name}</div>
              <div className="text-gray-400 text-xs">{selectedStateData.activePoliticians} officials tracked</div>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1e3a5f] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 p-3 space-y-4">
            {/* Upcoming Elections */}
            {stateElections.filter(e => e.isUpcoming).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#c8a951]" />
                  <span className="text-[#c8a951] text-xs font-semibold uppercase tracking-wider">Upcoming Elections</span>
                </div>
                <div className="space-y-2">
                  {stateElections.filter(e => e.isUpcoming).map((election) => (
                    <div key={election.id} className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f]">
                      <div className="text-white text-sm font-medium mb-1">{election.title}</div>
                      <div className="text-[#c8a951] text-xs mb-2">
                        {new Date(election.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="space-y-1.5">
                        {election.candidates.map((c) => (
                          <div key={c.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0 rounded ${
                                c.party === 'Democrat' ? 'bg-blue-500/20 text-blue-400' :
                                c.party === 'Republican' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>{c.party[0]}</span>
                              <span className="text-gray-300 font-medium">{c.name}</span>
                            </div>
                            <span className="text-gray-500">{formatMoney(c.fundsRaised)}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        href={`/compare?election=${election.id}`}
                        className="mt-2 flex items-center gap-1 text-xs text-[#c8a951] hover:text-white transition-colors"
                      >
                        <Vote className="h-3 w-3" /> Compare candidates
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Officials */}
            {statePoliticians.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Current Officials</span>
                </div>
                <div className="space-y-2">
                  {statePoliticians.map((p) => (
                    <PoliticianRow key={p.id} politician={p} />
                  ))}
                </div>
              </div>
            )}

            {statePoliticians.length === 0 && stateElections.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p>Full data for {selectedStateData.name} coming soon</p>
                <p className="text-xs mt-1 text-gray-600">Integration with Congress.gov API in progress</p>
              </div>
            )}

            {/* Browse All */}
            <Link
              href={`/politicians?state=${selectedState}`}
              className="flex items-center justify-center gap-2 w-full bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <Users className="h-4 w-4" />
              All {selectedStateData.name} Politicians
            </Link>
            <Link
              href={`/elections?state=${selectedState}`}
              className="flex items-center justify-center gap-2 w-full bg-[#c8a951] hover:bg-[#b8944a] text-[#0a1628] py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <Calendar className="h-4 w-4" />
              All {selectedStateData.name} Elections
            </Link>
          </div>
        </div>
      )}

      {/* Hint */}
      {!selectedState && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0a1628]/80 border border-[#1e3a5f] rounded-full px-4 py-2 text-xs text-gray-400 pointer-events-none">
          Click any state to see officials and elections · Scroll to zoom
        </div>
      )}
    </div>
  );
}
