'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, User, Vote, X } from 'lucide-react';
import { mockPoliticians, mockStates } from '@/lib/data/mockPoliticians';
import { mockElections } from '@/lib/data/mockElections';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ZIP → state mapping (abbreviated – full version would have all 40k+ ZIPs)
const ZIP_TO_STATE: Record<string, { state: string; code: string; city: string }> = {
  '10001': { state: 'New York', code: 'NY', city: 'New York, NY' },
  '90001': { state: 'California', code: 'CA', city: 'Los Angeles, CA' },
  '60601': { state: 'Illinois', code: 'IL', city: 'Chicago, IL' },
  '77001': { state: 'Texas', code: 'TX', city: 'Houston, TX' },
  '30301': { state: 'Georgia', code: 'GA', city: 'Atlanta, GA' },
  '02101': { state: 'Massachusetts', code: 'MA', city: 'Boston, MA' },
  '98101': { state: 'Washington', code: 'WA', city: 'Seattle, WA' },
  '85001': { state: 'Arizona', code: 'AZ', city: 'Phoenix, AZ' },
  '19101': { state: 'Pennsylvania', code: 'PA', city: 'Philadelphia, PA' },
  '78201': { state: 'Texas', code: 'TX', city: 'San Antonio, TX' },
  '33101': { state: 'Florida', code: 'FL', city: 'Miami, FL' },
  '80201': { state: 'Colorado', code: 'CO', city: 'Denver, CO' },
  '05401': { state: 'Vermont', code: 'VT', city: 'Burlington, VT' },
  '40201': { state: 'Kentucky', code: 'KY', city: 'Louisville, KY' },
  '41001': { state: 'Kentucky', code: 'KY', city: 'Covington, KY' },
};

interface SearchResult {
  type: 'zip' | 'state' | 'politician' | 'election';
  id: string;
  label: string;
  sublabel: string;
  href?: string;
  stateCode?: string;
}

export default function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const search = (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); setOpen(false); return; }

    const lower = q.toLowerCase().trim();
    const out: SearchResult[] = [];

    // ZIP code match
    if (/^\d{3,5}$/.test(q)) {
      const fullZip = ZIP_TO_STATE[q];
      if (fullZip) {
        out.push({
          type: 'zip', id: `zip-${q}`,
          label: `ZIP ${q} — ${fullZip.city}`,
          sublabel: 'View local elections & officials',
          stateCode: fullZip.code,
          href: `/elections?state=${fullZip.code}&zip=${q}`,
        });
      } else if (q.length === 5) {
        // Try partial matches by first 2 digits
        out.push({
          type: 'zip', id: `zip-${q}`,
          label: `ZIP Code ${q}`,
          sublabel: 'Search elections near this ZIP',
          href: `/elections?zip=${q}`,
        });
      }
    }

    // State name match
    const stateMatch = mockStates.filter((s) =>
      s.name.toLowerCase().includes(lower) || s.code.toLowerCase() === lower
    ).slice(0, 3);
    stateMatch.forEach((s) => {
      out.push({
        type: 'state', id: `state-${s.code}`,
        label: s.name,
        sublabel: `${s.activePoliticians} officials · ${s.upcomingElections} upcoming elections`,
        stateCode: s.code,
        href: `/politicians?state=${s.code}`,
      });
    });

    // Politician match
    const polMatch = mockPoliticians.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.state.toLowerCase().includes(lower)
    ).slice(0, 4);
    polMatch.forEach((p) => {
      out.push({
        type: 'politician', id: `pol-${p.id}`,
        label: p.name,
        sublabel: `${p.party} · ${p.chamber.replace('_',' ')} · ${p.state}`,
        href: `/politicians/${p.id}`,
      });
    });

    // Election match
    const elMatch = mockElections.filter(
      (e) => e.title.toLowerCase().includes(lower) || e.state.toLowerCase().includes(lower)
    ).slice(0, 2);
    elMatch.forEach((e) => {
      out.push({
        type: 'election', id: `el-${e.id}`,
        label: e.title,
        sublabel: `${e.state} · ${new Date(e.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
        href: `/elections?id=${e.id}`,
      });
    });

    setResults(out.slice(0, 8));
    setOpen(out.length > 0);
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    if (result.href) router.push(result.href);
  };

  const iconForType = (type: string) => {
    if (type === 'zip') return <MapPin className="h-4 w-4 text-green-400" />;
    if (type === 'state') return <MapPin className="h-4 w-4 text-blue-400" />;
    if (type === 'politician') return <User className="h-4 w-4 text-[#c8a951]" />;
    return <Vote className="h-4 w-4 text-purple-400" />;
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search by ZIP code, state, politician name..."
          className="w-full bg-[#0a1628]/95 backdrop-blur-sm border border-[#2d5a8e] rounded-2xl pl-12 pr-10 py-3.5 text-white text-base placeholder-gray-500 focus:outline-none focus:border-[#c8a951] focus:ring-2 focus:ring-[#c8a951]/20 shadow-2xl"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#0d1f35] border border-[#1e3a5f] rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1e3a5f] transition-colors border-b border-[#1e3a5f]/50 last:border-0 text-left"
            >
              <div className="flex-shrink-0">{iconForType(result.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{result.label}</div>
                <div className="text-gray-400 text-xs truncate">{result.sublabel}</div>
              </div>
              {result.type === 'zip' && (
                <span className="text-xs bg-green-400/20 text-green-400 px-2 py-0.5 rounded-full flex-shrink-0">
                  Local
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ZIP hint */}
      <div className="absolute -bottom-7 left-0 right-0 text-center">
        <span className="text-xs text-gray-500">
          Enter a ZIP code for local elections · Click any state on the map
        </span>
      </div>
    </div>
  );
}
