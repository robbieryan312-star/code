import { Election } from '../types';

export const mockElections: Election[] = [
  // ── FLORIDA GOVERNOR 2026 ─────────────────────────────────────────────────
  // Source: Ballotpedia.org — verify current candidates at ballotpedia.org/Florida_gubernatorial_election,_2026
  {
    id: 'fl-gov-2026',
    title: 'Florida Governor 2026 — Open Seat (DeSantis Term-Limited)',
    date: '2026-11-03',
    state: 'Florida',
    stateCode: 'FL',
    level: 'state',
    office: 'Governor',
    chamber: 'governor',
    isUpcoming: true,
    isPrimary: false,
    registrationDeadline: '2026-10-06',
    earlyVotingStart: '2026-10-24',
    dataNote: 'Candidate field is actively forming. Verify at Ballotpedia.org or dos.myflorida.com.',
    candidates: [
      {
        id: 'c-donalds',
        name: 'Byron Donalds',
        party: 'Republican',
        topIssues: [
          { name: 'Economy', position: 'Lower taxes; business growth; fiscal conservatism', detail: 'Member of House Budget Committee; strong record opposing deficit spending and tax increases', category: 'Economy' },
          { name: 'Border / Immigration', position: 'Strict enforcement; oppose sanctuary policies', detail: 'Consistent vote record on border security legislation; ally of Trump immigration agenda', category: 'Immigration' },
          { name: 'Education', position: 'School choice; parental rights', detail: 'Supports Family Empowerment Scholarship expansion and continuation of DeSantis education agenda', category: 'Education' },
        ],
        fundsRaised: 8700000,
        endorsements: ['Donald Trump', 'FL Republican Party'],
      },
      {
        id: 'c-fishback',
        name: 'James Fishback',
        party: 'Democrat',
        topIssues: [
          { name: 'Economy', position: 'AI & workforce investment; economic opportunity', detail: 'Entrepreneur and advocate for AI-driven economic growth and job training programs', category: 'Economy' },
          { name: 'Healthcare', position: 'Expand healthcare access; repeal 6-week ban', detail: 'Supports reproductive rights restoration and Medicaid expansion in Florida', category: 'Healthcare' },
          { name: 'Education', position: 'Increase teacher pay; reverse book restrictions', detail: 'Opposes HB 1467 book review mandates; supports public school funding', category: 'Education' },
        ],
        fundsRaised: 3200000,
        endorsements: ['FL Democratic Party'],
      },
    ],
  },

  // ── CALIFORNIA GOVERNOR 2026 ──────────────────────────────────────────────
  // Newsom is constitutionally term-limited (two consecutive terms) — cannot seek third consecutive term.
  // Source: Ballotpedia.org — verify at ballotpedia.org/California_gubernatorial_election,_2026
  {
    id: 'ca-gov-2026',
    title: 'California Governor 2026 — Open Seat (Newsom Term-Limited)',
    date: '2026-11-04',
    state: 'California',
    stateCode: 'CA',
    level: 'state',
    office: 'Governor',
    chamber: 'governor',
    isUpcoming: true,
    isPrimary: false,
    registrationDeadline: '2026-10-19',
    earlyVotingStart: '2026-10-05',
    dataNote: 'This is an open-seat race. The candidate field is actively forming. Verify at Ballotpedia.org.',
    candidates: [
      {
        id: 'ca-c1',
        name: 'Eleni Kounalakis',
        party: 'Democrat',
        topIssues: [
          { name: 'Climate', position: 'Carbon neutrality; clean energy economy', detail: "Current Lt. Governor; strong climate record including support for CA's 100% clean energy grid mandate", category: 'Environment' },
          { name: 'Housing', position: 'Streamline permitting; build more housing', detail: "Supports housing supply legislation to reduce California's housing shortage", category: 'Housing' },
          { name: 'Economy', position: 'Tech and clean energy job growth', detail: 'Focus on keeping California competitive in technology and emerging industries', category: 'Economy' },
        ],
        fundsRaised: 11400000,
        endorsements: ['CA Democratic Party', 'CA Labor Federation'],
      },
      {
        id: 'ca-c2',
        name: 'Republican Candidate TBD',
        party: 'Republican',
        topIssues: [
          { name: 'Economy', position: 'Reduce taxes and regulations', detail: 'Field actively forming — see Ballotpedia.org for current declared candidates', category: 'Economy' },
        ],
        fundsRaised: 0,
        endorsements: [],
      },
    ],
  },

  // ── TEXAS U.S. SENATE 2026 ────────────────────────────────────────────────
  // Sen. John Cornyn (R) is up for re-election in 2026. Ted Cruz won re-election in 2024.
  // Source: Ballotpedia.org — verify at ballotpedia.org/United_States_Senate_election_in_Texas,_2026
  {
    id: 'tx-sen-2026',
    title: 'Texas U.S. Senate 2026 — Cornyn Re-Election',
    date: '2026-11-03',
    state: 'Texas',
    stateCode: 'TX',
    level: 'federal',
    office: 'U.S. Senate',
    chamber: 'senate',
    isUpcoming: true,
    isPrimary: false,
    registrationDeadline: '2026-10-05',
    dataNote: 'Democratic challenger field not yet declared. Verify at Ballotpedia.org.',
    candidates: [
      {
        id: 'tx-c1',
        name: 'John Cornyn',
        party: 'Republican',
        topIssues: [
          { name: 'National Security', position: 'Strong defense; intelligence funding', detail: 'Member of Senate Intelligence and Finance committees; known for bipartisan work on gun background check reform (Bipartisan Safer Communities Act, 2022)', category: 'National Security' },
          { name: 'Energy', position: 'Fossil fuel protection; LNG exports', detail: 'Strong supporter of Texas oil, gas, and LNG industry; opposes EPA restrictions on energy production', category: 'Economy' },
          { name: 'Border Security', position: 'Physical barrier; enhanced enforcement', detail: "One of Senate's longest-serving immigration hardliners; supports border wall and increased deportation funding", category: 'Immigration' },
        ],
        fundsRaised: 18900000,
        endorsements: ['TX Republican Party', 'NRA', 'TX Oil & Gas Association'],
        incumbentId: 'john-cornyn',
      },
      {
        id: 'tx-c2',
        name: 'Democratic Challenger TBD',
        party: 'Democrat',
        topIssues: [
          { name: 'Healthcare', position: 'Expand Medicaid; protect ACA', detail: 'Field forming — see Ballotpedia.org for current declared candidates', category: 'Healthcare' },
        ],
        fundsRaised: 0,
        endorsements: [],
      },
    ],
  },

  // ── NEW YORK 14TH CONGRESSIONAL 2024 (completed) ─────────────────────────
  {
    id: 'ny-14-2024',
    title: 'New York 14th Congressional District 2024',
    date: '2024-11-05',
    state: 'New York',
    stateCode: 'NY',
    level: 'federal',
    office: 'U.S. House of Representatives',
    chamber: 'house',
    district: '14th',
    isUpcoming: false,
    isPrimary: false,
    candidates: [
      {
        id: 'c5', name: 'Alexandria Ocasio-Cortez', party: 'Democrat',
        topIssues: [
          { name: 'Climate', position: 'Green New Deal', detail: 'Ambitious climate and jobs program', category: 'Environment' },
          { name: 'Healthcare', position: 'Medicare for All', detail: 'Universal single-payer healthcare', category: 'Healthcare' },
        ],
        fundsRaised: 9800000, endorsements: ['NY Democratic Party', 'Working Families Party', 'Sunrise Movement'],
        incumbentId: 'alexandria-ocasio-cortez',
      },
      {
        id: 'c6', name: 'Tina Forte', party: 'Republican',
        topIssues: [
          { name: 'Public Safety', position: 'Increase Policing', detail: 'More police, tougher crime laws', category: 'Public Safety' },
          { name: 'Economy', position: 'Lower Taxes', detail: 'Reduce taxes on small businesses', category: 'Economy' },
        ],
        fundsRaised: 1200000, endorsements: ['NY Republican Party'],
      },
    ],
  },

  // ── CHICAGO MAYOR 2027 ────────────────────────────────────────────────────
  {
    id: 'chicago-mayor-2027',
    title: 'Chicago Mayor 2027',
    date: '2027-02-23',
    state: 'Illinois',
    stateCode: 'IL',
    level: 'local',
    office: 'Mayor',
    chamber: 'mayor',
    isUpcoming: true,
    isPrimary: true,
    registrationDeadline: '2027-02-09',
    dataNote: 'Field actively forming — verify at Ballotpedia.org.',
    candidates: [
      {
        id: 'c7', name: 'Brandon Johnson', party: 'Democrat',
        topIssues: [
          { name: 'Public Safety', position: 'Community Investment', detail: 'Address root causes of crime through investment', category: 'Public Safety' },
          { name: 'Education', position: 'CPS Funding', detail: 'Increase Chicago Public Schools funding', category: 'Education' },
        ],
        fundsRaised: 5200000, endorsements: ['Chicago Teachers Union', 'IL Democratic Party'],
        incumbentId: 'brandon-johnson',
      },
    ],
  },

  // ── KY-4 2024 PRIMARY — Massie vs AIPAC-backed challenger (completed) ─────
  {
    id: 'ky-4-primary-2024',
    title: "Kentucky 4th Congressional District — 2024 Republican Primary",
    date: '2024-05-21',
    state: 'Kentucky',
    stateCode: 'KY',
    level: 'federal',
    office: 'U.S. House of Representatives',
    chamber: 'house',
    district: '4th',
    isUpcoming: false,
    isPrimary: true,
    candidates: [
      {
        id: 'c-massie',
        name: 'Thomas Massie',
        party: 'Republican',
        topIssues: [
          { name: 'Foreign Aid', position: 'Oppose all foreign aid; America First', detail: 'Voted NO on Ukraine aid, Israel aid, and all foreign assistance bills', category: 'Foreign Policy' },
          { name: 'Fiscal Policy', position: 'Balance the budget; no debt ceiling increases', detail: 'Opposes deficit spending in any form', category: 'Economy' },
        ],
        fundsRaised: 3200000,
        endorsements: ['Ron Paul', 'Rand Paul', 'Club for Growth', 'Gun Owners of America'],
        incumbentId: 'rep-massie',
      },
      {
        id: 'c-ausbrooks',
        name: 'Jimmy Ausbrooks',
        party: 'Republican',
        topIssues: [
          { name: 'Israel Support', position: 'Strong U.S.-Israel alliance; support aid', detail: 'Backed by AIPAC specifically because of support for Israel assistance bills', category: 'Foreign Policy' },
          { name: 'National Security', position: 'Strong defense spending', detail: 'Supports conventional Republican defense posture', category: 'National Security' },
        ],
        fundsRaised: 1400000,
        endorsements: ['AIPAC / United Democracy Project ($1.1M+ in outside spending)', 'Republican Jewish Coalition'],
      },
    ],
  },
];
