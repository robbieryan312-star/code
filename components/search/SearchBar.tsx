'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, User, MapPin, Vote, X } from 'lucide-react';
import { mockPoliticians } from '@/lib/data/mockPoliticians';
import Link from 'next/link';

interface SearchResult {
  type: 'politician' | 'state' | 'election';
  id: string;
  name: string;
  subtitle: string;
  href: string;
}

export default function SearchBar({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const lower = q.toLowerCase();
    const politicianResults: SearchResult[] = mockPoliticians
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.state.toLowerCase().includes(lower) ||
          p.party.toLowerCase().includes(lower)
      )
      .slice(0, 5)
      .map((p) => ({
        type: 'politician' as const,
        id: p.id,
        name: p.name,
        subtitle: `${p.party} · ${p.state} · ${p.chamber.replace('_', ' ')}`,
        href: `/politicians/${p.id}`,
      }));

    setResults(politicianResults);
    setOpen(true);
  };

  const icon = (type: string) => {
    if (type === 'politician') return <User className="h-4 w-4 text-[#c8a951]" />;
    if (type === 'state') return <MapPin className="h-4 w-4 text-blue-400" />;
    return <Vote className="h-4 w-4 text-green-400" />;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={`relative ${large ? 'max-w-2xl mx-auto' : ''}`}>
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${large ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={large ? 'Search politicians, states, elections...' : 'Search...'}
          className={`w-full bg-[#0d1f35] border border-[#1e3a5f] rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:border-[#c8a951] focus:ring-1 focus:ring-[#c8a951] transition-colors
            ${large ? 'pl-12 pr-10 py-4 text-base' : 'pl-10 pr-8 py-2.5 text-sm'}`}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className={large ? 'h-5 w-5' : 'h-4 w-4'} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className={`absolute top-full mt-2 w-full bg-[#0d1f35] border border-[#1e3a5f] rounded-xl shadow-2xl overflow-hidden z-50 ${large ? '' : ''}`}>
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.href}
              onClick={() => { setOpen(false); setQuery(''); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#1e3a5f] transition-colors border-b border-[#1e3a5f] last:border-0"
            >
              <div className="flex-shrink-0">{icon(result.type)}</div>
              <div>
                <div className="text-white text-sm font-medium">{result.name}</div>
                <div className="text-gray-400 text-xs">{result.subtitle}</div>
              </div>
            </Link>
          ))}
          <Link
            href={`/politicians?q=${query}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 bg-[#0a1628] text-[#c8a951] text-sm hover:bg-[#1e3a5f] transition-colors"
          >
            <Search className="h-4 w-4" />
            See all results for &quot;{query}&quot;
          </Link>
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#0d1f35] border border-[#1e3a5f] rounded-xl shadow-2xl p-4 z-50">
          <p className="text-gray-400 text-sm text-center">No results found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
