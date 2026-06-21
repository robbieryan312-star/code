import { Election } from '../types';

export const mockElections: Election[] = [
  {
    id: 'ca-gov-2026',
    title: 'California Governor 2026',
    date: '2026-11-03',
    state: 'California',
    stateCode: 'CA',
    level: 'state',
    office: 'Governor',
    chamber: 'governor',
    isUpcoming: true,
    isPrimary: false,
    registrationDeadline: '2026-10-19',
    earlyVotingStart: '2026-10-05',
    candidates: [
      {
        id: 'c1', name: 'Gavin Newsom', party: 'Democrat',
        topIssues: [
          { name: 'Climate', position: 'Carbon Neutral by 2035', detail: 'Committed to accelerating clean energy transition', category: 'Environment' },
          { name: 'Housing', position: 'Build 2.5M homes', detail: 'Streamline housing permits and reduce barriers', category: 'Housing' },
        ],
        fundsRaised: 28000000, endorsements: ['CA Democratic Party', 'SEIU', 'Sierra Club'],
      },
      {
        id: 'c2', name: 'Brian Dahle', party: 'Republican',
        topIssues: [
          { name: 'Water', position: 'New Reservoirs', detail: 'Build Sites Reservoir and other water storage', category: 'Environment' },
          { name: 'Economy', position: 'Lower Taxes', detail: 'Reduce state income and business taxes', category: 'Economy' },
        ],
        fundsRaised: 4200000, endorsements: ['CA Republican Party', 'CA Farm Bureau'],
      },
    ],
  },
  {
    id: 'tx-sen-2026',
    title: 'Texas U.S. Senate 2026',
    date: '2026-11-03',
    state: 'Texas',
    stateCode: 'TX',
    level: 'federal',
    office: 'U.S. Senate',
    chamber: 'senate',
    isUpcoming: true,
    isPrimary: false,
    registrationDeadline: '2026-10-05',
    candidates: [
      {
        id: 'c3', name: 'Ted Cruz', party: 'Republican',
        topIssues: [
          { name: 'Border Security', position: 'Complete the Wall', detail: 'Finish border wall and increase enforcement', category: 'Immigration' },
          { name: 'Energy', position: 'Fossil Fuel Support', detail: 'Protect Texas oil and gas industry', category: 'Economy' },
        ],
        fundsRaised: 31000000, endorsements: ['TX Republican Party', 'NRA', 'TX Oil & Gas Association'],
        incumbentId: 'ted-cruz',
      },
      {
        id: 'c4', name: 'Colin Allred', party: 'Democrat',
        topIssues: [
          { name: 'Healthcare', position: 'Protect ACA', detail: 'Expand Medicaid and protect preexisting conditions coverage', category: 'Healthcare' },
          { name: 'Education', position: 'Public School Investment', detail: 'Increase federal education funding', category: 'Education' },
        ],
        fundsRaised: 22000000, endorsements: ['TX Democratic Party', 'AFT', 'Planned Parenthood'],
      },
    ],
  },
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
  {
    id: 'fl-gov-2026',
    title: 'Florida Governor 2026',
    date: '2026-11-03',
    state: 'Florida',
    stateCode: 'FL',
    level: 'state',
    office: 'Governor',
    chamber: 'governor',
    isUpcoming: true,
    isPrimary: false,
    registrationDeadline: '2026-10-06',
    candidates: [
      {
        id: 'c8', name: 'Ron DeSantis', party: 'Republican',
        topIssues: [
          { name: 'Education', position: 'School Choice', detail: 'Expand charter schools and vouchers', category: 'Education' },
          { name: 'Immigration', position: 'Border Enforcement', detail: 'Strict enforcement policies', category: 'Immigration' },
        ],
        fundsRaised: 48000000, endorsements: ['FL Republican Party', 'FL Police Chiefs Association'],
        incumbentId: 'ron-desantis',
      },
      {
        id: 'c9', name: 'Nikki Fried', party: 'Democrat',
        topIssues: [
          { name: 'Environment', position: 'Everglades Protection', detail: 'Increase environmental protections', category: 'Environment' },
          { name: 'Healthcare', position: 'Expand Medicaid', detail: 'Accept federal Medicaid expansion funds', category: 'Healthcare' },
        ],
        fundsRaised: 12000000, endorsements: ['FL Democratic Party', 'FL Education Association'],
      },
    ],
  },
];
