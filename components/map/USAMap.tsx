'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { mockStates, mockPoliticians } from '@/lib/data/mockPoliticians';
import { mockElections } from '@/lib/data/mockElections';
import { countyByFips, countiesByState } from '@/lib/data/mockCounties';
import Link from 'next/link';
import {
  X, ChevronDown, ChevronRight, Calendar, Users, AlertTriangle, Vote,
  MapPin, Building2, Star, Quote, ArrowLeft,
} from 'lucide-react';
import { Politician, CountyOfficial, CountyData } from '@/lib/types';

const GEO_STATES   = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const GEO_COUNTIES = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

type MapLevel = 'national' | 'state';
interface MapPosition { center: [number, number]; zoom: number }

// ZoomableGroup zoom values: 1 = full US view; higher = more zoomed in
const STATE_CENTERS: Record<string, MapPosition> = {
  AL: { center: [-86.79, 32.78], zoom: 6 },
  AK: { center: [-153.37, 64.20], zoom: 3 },
  AZ: { center: [-111.09, 34.05], zoom: 5.5 },
  AR: { center: [-92.37, 34.80], zoom: 6.5 },
  CA: { center: [-119.68, 36.78], zoom: 5 },
  CO: { center: [-105.55, 39.06], zoom: 6 },
  CT: { center: [-72.73, 41.60], zoom: 12 },
  DE: { center: [-75.50, 39.16], zoom: 14 },
  FL: { center: [-81.52, 27.66], zoom: 5.5 },
  GA: { center: [-83.64, 32.97], zoom: 6 },
  HI: { center: [-155.90, 20.31], zoom: 7 },
  ID: { center: [-114.74, 44.24], zoom: 5.5 },
  IL: { center: [-89.20, 40.35], zoom: 5.5 },
  IN: { center: [-86.13, 40.27], zoom: 7 },
  IA: { center: [-93.10, 42.01], zoom: 6.5 },
  KS: { center: [-98.38, 38.52], zoom: 6.5 },
  KY: { center: [-84.27, 37.67], zoom: 7 },
  LA: { center: [-91.96, 31.17], zoom: 7 },
  ME: { center: [-69.38, 45.37], zoom: 7 },
  MD: { center: [-76.80, 39.05], zoom: 10 },
  MA: { center: [-71.53, 42.23], zoom: 11 },
  MI: { center: [-85.60, 44.35], zoom: 5.5 },
  MN: { center: [-94.30, 46.39], zoom: 5.5 },
  MS: { center: [-89.67, 32.74], zoom: 7 },
  MO: { center: [-92.29, 38.46], zoom: 6 },
  MT: { center: [-110.45, 46.88], zoom: 5.5 },
  NE: { center: [-99.90, 41.49], zoom: 6 },
  NV: { center: [-116.42, 38.80], zoom: 5.5 },
  NH: { center: [-71.58, 43.45], zoom: 10 },
  NJ: { center: [-74.52, 40.09], zoom: 11 },
  NM: { center: [-106.25, 34.52], zoom: 5.5 },
  NY: { center: [-75.22, 42.97], zoom: 6 },
  NC: { center: [-79.81, 35.63], zoom: 7 },
  ND: { center: [-100.47, 47.53], zoom: 7 },
  OH: { center: [-82.79, 40.39], zoom: 7 },
  OK: { center: [-97.49, 35.49], zoom: 7 },
  OR: { center: [-120.55, 44.57], zoom: 5.5 },
  PA: { center: [-77.19, 41.20], zoom: 7 },
  RI: { center: [-71.56, 41.68], zoom: 14 },
  SC: { center: [-80.95, 33.86], zoom: 8 },
  SD: { center: [-100.22, 44.44], zoom: 7 },
  TN: { center: [-86.34, 35.86], zoom: 7 },
  TX: { center: [-99.34, 31.05], zoom: 4.5 },
  UT: { center: [-111.09, 39.33], zoom: 6 },
  VT: { center: [-72.71, 44.05], zoom: 11 },
  VA: { center: [-78.66, 37.77], zoom: 7 },
  WA: { center: [-120.73, 47.38], zoom: 6.5 },
  WV: { center: [-80.45, 38.64], zoom: 8 },
  WI: { center: [-89.76, 44.27], zoom: 6.5 },
  WY: { center: [-107.55, 43.00], zoom: 6.5 },
  DC: { center: [-77.04, 38.91], zoom: 18 },
};

const STATE_FIPS: Record<string, string> = {
  AL:'01',AK:'02',AZ:'04',AR:'05',CA:'06',CO:'08',CT:'09',DE:'10',DC:'11',FL:'12',
  GA:'13',HI:'15',ID:'16',IL:'17',IN:'18',IA:'19',KS:'20',KY:'21',LA:'22',ME:'23',
  MD:'24',MA:'25',MI:'26',MN:'27',MS:'28',MO:'29',MT:'30',NE:'31',NV:'32',NH:'33',
  NJ:'34',NM:'35',NY:'36',NC:'37',ND:'38',OH:'39',OK:'40',OR:'41',PA:'42',RI:'44',
  SC:'45',SD:'46',TN:'47',TX:'48',UT:'49',VT:'50',VA:'51',WA:'53',WV:'54',WI:'55',WY:'56',
};

const STATE_ABBR: Record<string, string> = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
  'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
  'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS',
  'Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH',
  'New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC',
  'North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA',
  'Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN',
  'Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA',
  'West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY','District of Columbia':'DC',
};

const NATIONAL: MapPosition = { center: [-97, 38], zoom: 1 };

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── OfficialCard ─────────────────────────────────────────────────────────────
function OfficialCard({ official }: { official: CountyOfficial }) {
  const [expanded, setExpanded] = useState(false);
  const partyColor =
    official.party === 'Democrat'   ? 'bg-blue-500/20 text-blue-400' :
    official.party === 'Republican' ? 'bg-red-500/20 text-red-400' :
    'bg-gray-500/20 text-gray-300';

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${expanded ? 'border-[#c8a951]/40' : 'border-[#1e3a5f]'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 p-3 hover:bg-[#1e3a5f]/40 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
          <span className="text-[#c8a951] text-xs font-bold">
            {official.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold truncate">{official.name}</div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-1.5 rounded ${partyColor}`}>{official.party[0]}</span>
            <span className="text-gray-400 text-xs">{official.position}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${official.inOffice ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {official.inOffice ? 'In Office' : 'Former'}
          </span>
          {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-[#1e3a5f] bg-[#06101e]/60 space-y-3">
          <p className="text-gray-400 text-xs leading-relaxed mt-2.5">{official.bio}</p>

          {official.termEnd && (
            <div className="text-xs text-gray-500">
              Term ends: <span className="text-gray-300">{official.termEnd}</span>
              {official.nextElection && (
                <span className="ml-2 text-[#c8a951]">Next election: {official.nextElection}</span>
              )}
            </div>
          )}

          {official.topIssues && official.topIssues.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Star className="h-3 w-3" /> Key Positions
              </div>
              <div className="space-y-1">
                {official.topIssues.map((issue) => (
                  <div key={issue.name} className="text-xs bg-[#0d1f35] rounded-lg p-2">
                    <span className="text-[#c8a951] font-medium">{issue.name}:</span>{' '}
                    <span className="text-gray-300">{issue.position}</span>
                    {issue.detail && <p className="text-gray-500 mt-0.5">{issue.detail}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {official.statements && official.statements.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Quote className="h-3 w-3" /> On Record
              </div>
              <div className="space-y-2">
                {official.statements.map((s, i) => (
                  <div key={i} className="bg-[#0d1f35] rounded-lg p-2 border-l-2 border-[#c8a951]/40">
                    <p className="text-gray-300 text-xs italic">&ldquo;{s.quote}&rdquo;</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-500 text-xs">{s.context} · {s.date}</span>
                      <span className={`text-xs px-1.5 rounded ${
                        s.source.tier === 'official'    ? 'bg-green-500/20 text-green-400' :
                        s.source.tier === 'nonpartisan' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>{s.source.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {official.website && (
            <a href={official.website} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-xs text-[#c8a951] hover:text-white transition-colors">
              <Building2 className="h-3 w-3" /> Official website
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── PoliticianRow ─────────────────────────────────────────────────────────────
function PoliticianRow({ politician }: { politician: Politician }) {
  const [expanded, setExpanded] = useState(false);
  const lobbyistTotal = politician.campaignFinance.lobbyistMoney.reduce((s, l) => s + l.amount, 0);
  const partyColor =
    politician.party === 'Democrat'   ? 'bg-blue-500/20 text-blue-400' :
    politician.party === 'Republican' ? 'bg-red-500/20 text-red-400' :
    'bg-gray-500/20 text-gray-300';

  return (
    <div className={`border border-[#1e3a5f] rounded-xl overflow-hidden ${expanded ? 'border-[#c8a951]/40' : ''}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 p-3 hover:bg-[#1e3a5f]/40 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center overflow-hidden flex-shrink-0">
          {politician.imageUrl
            ? <img src={politician.imageUrl} alt={politician.name} className="w-full h-full object-cover" />
            : <span className="text-[#c8a951] text-xs font-bold">{politician.firstName[0]}{politician.lastName[0]}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold truncate">{politician.name}</div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-1.5 py-0 rounded ${partyColor}`}>{politician.party[0]}</span>
            <span className="text-gray-400 text-xs">{politician.chamber.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {lobbyistTotal > 0 && <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />}
          {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-[#1e3a5f] bg-[#06101e]/60">
          <p className="text-gray-400 text-xs leading-relaxed mt-2.5 mb-2">
            {politician.bio.slice(0, 180)}{politician.bio.length > 180 ? '…' : ''}
          </p>
          <div className="space-y-1 mb-2.5">
            {politician.topIssues.slice(0, 2).map(issue => (
              <div key={issue.name} className="text-xs">
                <span className="text-[#c8a951] font-medium">{issue.name}: </span>
                <span className="text-gray-400">{issue.position}</span>
              </div>
            ))}
          </div>
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
          {politician.votingRecord.length > 0 && (
            <div className="mb-2.5 text-xs text-gray-500">
              Recent vote: <span className="text-gray-300">{politician.votingRecord[0].billTitle}</span>
              <span className={`ml-1 ${politician.votingRecord[0].vote === 'Yea' ? 'text-green-400' : 'text-red-400'}`}>
                ({politician.votingRecord[0].vote})
              </span>
            </div>
          )}
          <Link
            href={`/politicians/${politician.id}`}
            className="w-full flex items-center justify-center gap-1.5 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white text-xs py-2 rounded-lg transition-colors font-medium"
          >
            Full Profile & Record <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function USAMap() {
  const [mapLevel, setMapLevel]           = useState<MapLevel>('national');
  const [position, _setPosition]          = useState<MapPosition>(NATIONAL);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState]   = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [hoveredCounty, setHoveredCounty]   = useState<{ fips: string; name: string } | null>(null);

  const posRef  = useRef<MapPosition>(NATIONAL);
  const animRef = useRef<number>(0);

  const setPosition = useCallback((p: MapPosition) => {
    posRef.current = p;
    _setPosition(p);
  }, []);

  const flyTo = useCallback((target: MapPosition) => {
    cancelAnimationFrame(animRef.current);
    const start = { ...posRef.current };
    const t0 = performance.now();
    const duration = 900;

    function frame(now: number) {
      const raw = Math.min((now - t0) / duration, 1);
      const e = easeInOutCubic(raw);
      setPosition({
        center: [
          start.center[0] + (target.center[0] - start.center[0]) * e,
          start.center[1] + (target.center[1] - start.center[1]) * e,
        ],
        zoom: start.zoom + (target.zoom - start.zoom) * e,
      });
      if (raw < 1) animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);
  }, [setPosition]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const handleStateClick = (stateCode: string) => {
    if (mapLevel === 'state' && stateCode !== selectedState) return; // ignore other states when zoomed
    setSelectedState(prev => prev === stateCode ? null : stateCode);
  };

  const zoomIntoState = (code: string) => {
    const info = STATE_CENTERS[code];
    if (!info) return;
    setMapLevel('state');
    setSelectedCounty(null);
    flyTo(info);
  };

  const backToNational = () => {
    setMapLevel('national');
    setSelectedState(null);
    setSelectedCounty(null);
    flyTo(NATIONAL);
  };

  const selectedStateData  = selectedState ? mockStates.find(s => s.code === selectedState) : null;
  const statePoliticians   = selectedState ? mockPoliticians.filter(p => p.stateCode === selectedState) : [];
  const stateElections     = selectedState ? mockElections.filter(e => e.stateCode === selectedState) : [];
  const stateFips          = selectedState ? STATE_FIPS[selectedState] : null;
  const stateCounties: CountyData[] = selectedState ? (countiesByState[selectedState] || []) : [];
  const selectedCountyData = selectedCounty ? countyByFips[selectedCounty] : null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── Map ── */}
      <ComposableMap
        projection="geoAlbersUsa"
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.center}
          minZoom={0.5}
          maxZoom={20}
          onMoveEnd={({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) => {
            // sync after user manually pans/scrolls
            cancelAnimationFrame(animRef.current);
            setPosition({ center: coordinates, zoom });
          }}
        >
          {/* County boundaries — only when zoomed into a state */}
          {mapLevel === 'state' && stateFips && (
            <Geographies geography={GEO_COUNTIES}>
              {({ geographies }: { geographies: any[] }) =>
                geographies
                  .filter((geo: any) => String(geo.id).padStart(5, '0').slice(0, 2) === stateFips)
                  .map((geo: any) => {
                    const fips = String(geo.id).padStart(5, '0');
                    const hasData   = !!countyByFips[fips];
                    const isSelC    = selectedCounty === fips;
                    const isHovC    = hoveredCounty?.fips === fips;
                    return (
                      <Geography
                        key={`c-${geo.rsmKey}`}
                        geography={geo}
                        onMouseEnter={() => setHoveredCounty({ fips, name: geo.properties.name || fips })}
                        onMouseLeave={() => setHoveredCounty(null)}
                        onClick={() => setSelectedCounty(fips === selectedCounty ? null : fips)}
                        style={{
                          default: {
                            fill: isSelC ? '#c8a951' : isHovC ? '#2d5a8e' : hasData ? '#162d4a' : '#0d1f35',
                            stroke: isSelC ? '#c8a951' : '#0a1628',
                            strokeWidth: isSelC ? 0.3 : 0.1,
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          hover:   { fill: '#2d5a8e', stroke: '#c8a951', strokeWidth: 0.2, outline: 'none', cursor: 'pointer' },
                          pressed: { fill: '#c8a951', stroke: '#c8a951', strokeWidth: 0.3, outline: 'none' },
                        }}
                      />
                    );
                  })
              }
            </Geographies>
          )}

          {/* State boundaries */}
          <Geographies geography={GEO_STATES}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const stateName = geo.properties.name;
                const stateCode = STATE_ABBR[stateName];
                const isSel     = selectedState === stateCode;
                const isHov     = hoveredState === stateCode;
                const isDimmed  = mapLevel === 'state' && !isSel;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => !isDimmed && setHoveredState(stateCode)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => !isDimmed && handleStateClick(stateCode)}
                    style={{
                      default: {
                        fill:        isDimmed ? '#04080f' : isSel && mapLevel === 'state' ? 'transparent' : isSel ? '#c8a951' : isHov ? '#2d5a8e' : '#1e3a5f',
                        stroke:      isDimmed ? '#04080f' : isSel ? '#c8a951' : '#0a1628',
                        strokeWidth: isDimmed ? 0 : isSel ? 0.3 : 0.15,
                        outline:     'none',
                        cursor:      isDimmed ? 'default' : 'pointer',
                        fillOpacity: isDimmed ? 0.2 : 1,
                        transition:  'fill 0.2s ease',
                      },
                      hover: {
                        fill:        isDimmed ? '#04080f' : isSel ? '#d4b86a' : '#2d5a8e',
                        stroke:      isDimmed ? '#04080f' : '#c8a951',
                        strokeWidth: isDimmed ? 0 : 0.25,
                        outline:     'none',
                        cursor:      isDimmed ? 'default' : 'pointer',
                      },
                      pressed: { fill: '#c8a951', stroke: '#c8a951', strokeWidth: 0.3, outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* ── "Zoom into state" button — national mode, state selected ── */}
      {mapLevel === 'national' && selectedState && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => zoomIntoState(selectedState)}
            className="flex items-center gap-2 bg-[#c8a951] hover:bg-[#b8944a] text-[#0a1628] px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Zoom into {selectedStateData?.name ?? selectedState} — view counties
          </button>
        </div>
      )}

      {/* ── Back to national button ── */}
      {mapLevel === 'state' && (
        <button
          onClick={backToNational}
          className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-[#08152a]/90 border border-[#1e3a5f] hover:border-[#c8a951] text-white px-3 py-2 rounded-xl text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[#c8a951]" />
          All States
        </button>
      )}

      {/* ── County hover tooltip ── */}
      {hoveredCounty && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-[#08152a]/95 border border-[#1e3a5f] rounded-lg px-3 py-1.5 text-sm text-white">
            <span className="text-[#c8a951] font-medium">{hoveredCounty.name}</span>
            {countyByFips[hoveredCounty.fips] && (
              <span className="text-gray-400 ml-2 text-xs">
                {countyByFips[hoveredCounty.fips].officials.length} official{countyByFips[hoveredCounty.fips].officials.length !== 1 ? 's' : ''} tracked
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Side panel ── */}
      {selectedState && (
        <div className="absolute top-0 right-0 h-full w-80 bg-[#08152a]/97 backdrop-blur-sm border-l border-[#1e3a5f] overflow-y-auto z-20 flex flex-col">

          {/* Header / breadcrumb */}
          <div className="sticky top-0 bg-[#08152a] border-b border-[#1e3a5f] px-4 py-3 z-10">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <button onClick={backToNational} className="hover:text-[#c8a951] transition-colors">All States</button>
              <ChevronRight className="h-3 w-3" />
              <button
                onClick={() => setSelectedCounty(null)}
                className={`transition-colors ${selectedCountyData ? 'hover:text-[#c8a951]' : 'text-gray-300'}`}
              >
                {selectedStateData?.name ?? selectedState}
              </button>
              {selectedCountyData && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-[#c8a951]">{selectedCountyData.name}</span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-lg">
                  {selectedCountyData ? selectedCountyData.name : (selectedStateData?.name ?? selectedState)}
                </div>
                <div className="text-gray-400 text-xs">
                  {selectedCountyData
                    ? `${selectedCountyData.officials.length} official(s) tracked`
                    : `${selectedStateData?.activePoliticians ?? 0} officials tracked`}
                </div>
              </div>
              <button
                onClick={backToNational}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1e3a5f] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 space-y-4">

            {/* ── County detail view ── */}
            {selectedCountyData ? (
              <>
                <button
                  onClick={() => setSelectedCounty(null)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#c8a951] transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to {selectedStateData?.name ?? selectedState}
                </button>

                {(selectedCountyData.seat || selectedCountyData.population) && (
                  <div className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f] space-y-1">
                    {selectedCountyData.seat && (
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Building2 className="h-3 w-3" />
                        County seat: <span className="text-gray-300">{selectedCountyData.seat}</span>
                      </div>
                    )}
                    {selectedCountyData.population && (
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        Population: <span className="text-gray-300">{selectedCountyData.population.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">County Officials</span>
                  </div>
                  <div className="space-y-2">
                    {selectedCountyData.officials.map(o => (
                      <OfficialCard key={o.id} official={o} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ── State view ── */}

                {/* County directory (only when zoomed into state) */}
                {mapLevel === 'state' && stateCounties.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-[#c8a951]" />
                      <span className="text-[#c8a951] text-xs font-semibold uppercase tracking-wider">
                        Counties with Data ({stateCounties.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {stateCounties.map(county => (
                        <button
                          key={county.fips}
                          onClick={() => setSelectedCounty(county.fips)}
                          className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-[#0d1f35] hover:bg-[#1e3a5f] transition-colors"
                        >
                          <span className="text-white text-xs font-medium">{county.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-500 text-xs">{county.officials.length} official{county.officials.length !== 1 ? 's' : ''}</span>
                            <ChevronRight className="h-3 w-3 text-gray-500" />
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">Or click a county on the map</p>
                  </div>
                )}

                {/* Zoom prompt in national mode */}
                {mapLevel === 'national' && (
                  <div className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f] text-center">
                    <MapPin className="h-5 w-5 text-[#c8a951] mx-auto mb-1.5" />
                    <p className="text-gray-300 text-xs">Use the button below the map to zoom in and explore individual counties and local officials.</p>
                  </div>
                )}

                {/* Upcoming elections */}
                {stateElections.filter(e => e.isUpcoming).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-[#c8a951]" />
                      <span className="text-[#c8a951] text-xs font-semibold uppercase tracking-wider">Upcoming Elections</span>
                    </div>
                    <div className="space-y-2">
                      {stateElections.filter(e => e.isUpcoming).map(election => (
                        <div key={election.id} className="bg-[#0d1f35] rounded-xl p-3 border border-[#1e3a5f]">
                          <div className="text-white text-sm font-medium mb-1">{election.title}</div>
                          <div className="text-[#c8a951] text-xs mb-2">
                            {new Date(election.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="space-y-1.5">
                            {election.candidates.map(c => (
                              <div key={c.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-1.5 rounded ${
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
                          <Link href={`/compare?election=${election.id}`}
                                className="mt-2 flex items-center gap-1 text-xs text-[#c8a951] hover:text-white transition-colors">
                            <Vote className="h-3 w-3" /> Compare candidates
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* State-level politicians */}
                {statePoliticians.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Federal & State Officials</span>
                    </div>
                    <div className="space-y-2">
                      {statePoliticians.map(p => <PoliticianRow key={p.id} politician={p} />)}
                    </div>
                  </div>
                )}

                {statePoliticians.length === 0 && stateElections.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p>Full data for {selectedStateData?.name ?? selectedState} coming soon</p>
                    <p className="text-xs mt-1 text-gray-600">Integration with Congress.gov API in progress</p>
                  </div>
                )}

                <Link href={`/politicians?state=${selectedState}`}
                      className="flex items-center justify-center gap-2 w-full bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <Users className="h-4 w-4" /> All {selectedStateData?.name ?? selectedState} Politicians
                </Link>
                <Link href={`/elections?state=${selectedState}`}
                      className="flex items-center justify-center gap-2 w-full bg-[#c8a951] hover:bg-[#b8944a] text-[#0a1628] py-2.5 rounded-xl text-sm font-bold transition-colors">
                  <Calendar className="h-4 w-4" /> All {selectedStateData?.name ?? selectedState} Elections
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── National hint ── */}
      {!selectedState && mapLevel === 'national' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0a1628]/80 border border-[#1e3a5f] rounded-full px-4 py-2 text-xs text-gray-400 pointer-events-none">
          Click any state · then zoom in to explore counties
        </div>
      )}
    </div>
  );
}
