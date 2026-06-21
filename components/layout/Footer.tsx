import Link from 'next/link';
import { Scale, ExternalLink } from 'lucide-react';

const dataSources = [
  { name: 'Federal Election Commission', url: 'https://www.fec.gov', description: 'Campaign finance data' },
  { name: 'ProPublica Congress API', url: 'https://projects.propublica.org/api-docs/congress-api/', description: 'Voting records & bills' },
  { name: 'OpenSecrets', url: 'https://www.opensecrets.org', description: 'Lobbying & donor data' },
  { name: 'Congress.gov', url: 'https://www.congress.gov', description: 'Official legislative records' },
  { name: 'Senate Stock Watcher', url: 'https://senatestockwatcher.com', description: 'Senator stock disclosures' },
  { name: 'House Stock Watcher', url: 'https://housestockwatcher.com', description: 'Representative stock disclosures' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-[#1e3a5f] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#c8a951] rounded-full p-1.5">
                <Scale className="h-4 w-4 text-[#0a1628]" />
              </div>
              <span className="text-white font-bold text-lg">The Ledger</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing objective, fact-based information about politicians at every level of government.
              All data sourced from official government records and non-partisan organizations.
            </p>
            <div className="mt-4 p-3 bg-[#0d1f35] rounded-lg border border-[#1e3a5f]">
              <p className="text-xs text-[#c8a951] font-medium mb-1">Non-Partisan Commitment</p>
              <p className="text-xs text-gray-400">
                The Ledger presents verified facts only. No opinion, no editorial bias.
                All politicians are evaluated using the same objective criteria.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Data Sources</h3>
            <ul className="space-y-2">
              {dataSources.map((source) => (
                <li key={source.name} className="flex items-start gap-2">
                  <ExternalLink className="h-3 w-3 text-[#c8a951] mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-300 hover:text-[#c8a951] transition-colors font-medium"
                    >
                      {source.name}
                    </a>
                    <p className="text-xs text-gray-500">{source.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigate</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Map', '/'],
                ['Browse Politicians', '/politicians'],
                ['Upcoming Elections', '/elections'],
                ['Compare Candidates', '/compare'],
                ['Campaign Finance', '/finance'],
                ['Stock Trades', '/congress'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#c8a951] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e3a5f] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 The Ledger. All data sourced from public government records. For informational purposes only.
          </p>
          <p className="text-gray-500 text-xs">
            Not affiliated with any political party, candidate, or government agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
