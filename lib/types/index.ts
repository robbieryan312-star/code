export type Chamber = 'senate' | 'house' | 'governor' | 'state_senate' | 'state_house' | 'mayor' | 'city_council' | 'school_board';
export type Party = 'Democrat' | 'Republican' | 'Independent' | 'Green' | 'Libertarian' | 'Other';
export type Level = 'federal' | 'state' | 'local';
export type VoteChoice = 'Yea' | 'Nay' | 'Not Voting' | 'Present';

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
  date: string;
  disclosureDate: string;
  relatedVotes?: string[];
  relatedCommittees?: string[];
  conflictScore: number; // 0-100, how much this conflicts
  sector: string;
}

export interface ConsistencyData {
  overallScore: number; // 0-100
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
