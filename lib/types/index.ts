export type Chamber = 'senate' | 'house' | 'governor' | 'state_senate' | 'state_house' | 'mayor' | 'city_council' | 'school_board';
export type Party = 'Democrat' | 'Republican' | 'Independent' | 'Green' | 'Libertarian' | 'Other';
export type Level = 'federal' | 'state' | 'local';
export type VoteChoice = 'Yea' | 'Nay' | 'Not Voting' | 'Present';

// Source credibility tiers — applied identically to all sources regardless of political lean
export type SourceTier =
  | 'official'      // .gov, STOCK Act, FEC, court records — fully verified primary source
  | 'nonpartisan'   // Ballotpedia, OpenSecrets, GovTrack, Pew, AP, Reuters — established fact-checking
  | 'media'         // Named mainstream outlet — verifiable story, editorial process unknown
  | 'alleged'       // Credible but unproven claim — clearly labeled, no adjudication yet
  | 'unverified';   // Circulating claim with no verified sourcing — shown with maximum caveat

export interface Source {
  name: string;
  url?: string;
  tier: SourceTier;
  date?: string;
  description?: string;
}

export interface Controversy {
  id: string;
  title: string;
  summary: string;
  category: 'Ethics' | 'Legal' | 'Financial' | 'Campaign' | 'Conduct' | 'Policy' | 'Conflict of Interest';
  status: 'Resolved' | 'Ongoing' | 'Dismissed' | 'Convicted' | 'Acquitted' | 'Under Investigation' | 'Alleged';
  date: string;
  sources: Source[];
  isVerified: boolean;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  date: string;
  source: Source;
  category: string;
  isOpinion: boolean;
  isVerified: boolean;
  url?: string;
}

// Chronological event tied to a specific stock trade
export interface TradeTimelineEvent {
  date: string;
  type: 'vote' | 'statement' | 'committee_action' | 'hearing' | 'bill_signed' | 'market_event';
  title: string;
  description: string;
  daysRelativeToTrade: number;  // negative = before trade, positive = after trade
  priceAtEvent?: number;
  priceChangePct?: number;       // % price change in the day(s) following this event
  isFlagged: boolean;
  source: Source;
}

export interface Politician {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  party: Party;
  state: string;
  stateCode: string;
  district?: string;
  chamber: Chamber;
  level: Level;
  imageUrl?: string;
  bio: string;
  website?: string;
  twitter?: string;
  inOffice: boolean;
  termStart?: string;
  termEnd?: string;
  nextElection?: string;
  committees?: string[];
  votingRecord: VoteRecord[];
  campaignFinance: CampaignFinance;
  stockTrades: StockTrade[];
  consistency: ConsistencyData;
  topIssues: Issue[];
  controversies: Controversy[];
  news: NewsItem[];
  endorsements?: {
    endorses: { name: string; office: string; politicianId?: string; date?: string; source?: Source }[];
    endorsedBy: { name: string; office: string; politicianId?: string; date?: string; source?: Source }[];
  };
}

export interface VoteRecord {
  id: string;
  billId: string;
  billTitle: string;
  billDescription: string;
  date: string;
  vote: VoteChoice;
  result: 'Passed' | 'Failed';
  category: string;
  alignsWithCampaign?: boolean;
  alignsWithDonors?: boolean;
  source: Source;
}

export interface CampaignFinance {
  totalRaised: number;
  totalSpent: number;
  cashOnHand: number;
  cycle: string;
  donors: Donor[];
  topIndustries: IndustryDonation[];
  lobbyistMoney: LobbyistDonation[];
  foreignPAC: ForeignPACDonation[];
  individualDonations: number;
  pacDonations: number;
  selfFunding: number;
}

export interface Donor {
  id: string;
  name: string;
  type: 'Individual' | 'PAC' | 'Super PAC' | 'Corporation' | 'Union' | '501(c)(4)';
  amount: number;
  date: string;
  occupation?: string;
  employer?: string;
  isLobbyist?: boolean;
  isForeign?: boolean;
}

export interface IndustryDonation {
  industry: string;
  amount: number;
  donors: number;
  percentage: number;
}

export interface LobbyistDonation {
  organization: string;
  amount: number;
  sector: string;
  issues: string[];
}

export interface ForeignPACDonation {
  organization: string;
  country: string;
  amount: number;
  date: string;
}

export interface StockTrade {
  id: string;
  ticker: string;
  companyName: string;
  type: 'Purchase' | 'Sale' | 'Partial Sale';
  amount: number;
  amountMin: number;
  amountMax: number;
  purchasePriceApprox?: number;
  currentPrice?: number;
  date: string;
  disclosureDate: string;
  daysToDisclose: number;
  relatedVotes?: string[];
  relatedCommittees?: string[];
  conflictScore: number;
  sector: string;
  source: Source;
  timelineEvents?: TradeTimelineEvent[];
}

export interface ConsistencyData {
  overallScore: number;
  campaignPromises: CampaignPromise[];
  partyLineVotePercentage: number;
  lobbyistAlignmentPercentage: number;
  termConsistency: TermConsistency[];
}

export interface CampaignPromise {
  id: string;
  issue: string;
  statement: string;
  category: string;
  status: 'Kept' | 'Broken' | 'Compromised' | 'In Progress' | 'Stalled';
  evidence?: string;
  evidenceSource?: Source;
  relatedVotes?: string[];
}

export interface TermConsistency {
  year: number;
  score: number;
  keyChanges: string[];
}

export interface Issue {
  name: string;
  position: string;
  detail: string;
  category: string;
  source?: Source;
}

export interface Election {
  id: string;
  title: string;
  date: string;
  state: string;
  stateCode: string;
  level: Level;
  office: string;
  chamber: Chamber;
  district?: string;
  candidates: Candidate[];
  isUpcoming: boolean;
  isPrimary: boolean;
  registrationDeadline?: string;
  earlyVotingStart?: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: Party;
  imageUrl?: string;
  website?: string;
  topIssues: Issue[];
  fundsRaised: number;
  endorsements: string[];
  incumbentId?: string;
}

export interface USState {
  code: string;
  name: string;
  senators: string[];
  representatives: number;
  governor?: string;
  upcomingElections: number;
  activePoliticians: number;
}

// County-level elected officials
export interface CountyOfficial {
  id: string;
  name: string;
  position: string;
  party: Party;
  inOffice: boolean;
  bio: string;
  imageUrl?: string;
  termEnd?: string;
  nextElection?: string;
  website?: string;
  topIssues?: Issue[];
  statements?: { quote: string; context: string; date: string; source: Source }[];
}

export interface CountyData {
  fips: string;
  name: string;
  stateName: string;
  stateCode: string;
  seat?: string;
  population?: number;
  officials: CountyOfficial[];
  website?: string;
}
