'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Scale, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Map', href: '/' },
  {
    label: 'Politicians',
    href: '/politicians',
    sub: [
      { label: 'Browse All', href: '/politicians' },
      { label: 'Senate', href: '/politicians?chamber=senate' },
      { label: 'House', href: '/politicians?chamber=house' },
      { label: 'Governors', href: '/politicians?chamber=governor' },
      { label: 'State & Local', href: '/politicians?level=state' },
    ],
  },
  {
    label: 'Elections',
    href: '/elections',
    sub: [
      { label: 'Upcoming Elections', href: '/elections' },
      { label: 'Compare Candidates', href: '/compare' },
      { label: 'Election Calendar', href: '/elections?view=calendar' },
    ],
  },
  {
    label: 'Money & Donors',
    href: '/finance',
    sub: [
      { label: 'Campaign Finance', href: '/finance' },
      { label: 'Lobbyist Tracker', href: '/finance?view=lobbyists' },
      { label: 'Foreign Influence', href: '/finance?view=foreign' },
    ],
  },
  { label: 'Stock Trades', href: '/congress' },
  { label: 'Compare', href: '/compare' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-[#0a1628] border-b border-[#1e3a5f] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#c8a951] rounded-full p-1.5">
              <Scale className="h-5 w-5 text-[#0a1628]" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">The Ledger</span>
              <span className="text-[#c8a951] text-xs block leading-none">Political Transparency</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.sub && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'bg-[#1e3a5f] text-[#c8a951]'
                      : 'text-gray-300 hover:text-white hover:bg-[#1e3a5f]'
                  }`}
                >
                  {item.label}
                  {item.sub && <ChevronDown className="h-3 w-3" />}
                </Link>
                {item.sub && openDropdown === item.label && (
                  <div className="absolute top-full left-0 w-52 bg-[#0d1f35] border border-[#1e3a5f] rounded-md shadow-xl py-1 mt-0.5">
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1e3a5f] hover:text-white"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-xs text-gray-400 text-right">
              <div className="text-[#c8a951] font-medium">Data Sources</div>
              <div>FEC · ProPublica · OpenSecrets</div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0d1f35] border-t border-[#1e3a5f] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href ? 'bg-[#1e3a5f] text-[#c8a951]' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.sub?.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="block pl-6 py-1.5 text-xs text-gray-400 hover:text-gray-200"
                  onClick={() => setMobileOpen(false)}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
