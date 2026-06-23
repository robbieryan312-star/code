# Civic App — Complete API & Data Source Reference

Generated for: Robert Ryan | robbie.ryan312@gmail.com
Purpose: Comprehensive political transparency app using objective, sourced data

---

## HOW TO USE THIS FILE

Paste this entire file into Cursor with this instruction:

> "Read API_SOURCES.md completely. Build the full data layer for this civic
> transparency app. Replace every mock value in lib/data/mockPoliticians.ts
> with real API calls. Create a TypeScript client in lib/api/ for each service
> below. Proxy ALL external calls through Next.js API routes in app/api/ —
> never call external APIs directly from the browser. Read keys from
> .env.local using process.env. Cache every API response in Supabase with a
> TTL column so we never hit rate limits on page loads. Add exponential
> backoff (2s, 4s, 8s, 16s) on every fetch. Log every cache hit/miss.
> Return a typed TypeScript response for every endpoint."

---

## ENVIRONMENT VARIABLES TEMPLATE

Create `.env.local` in the project root. Fill in values as you get each key.

```
# === LEGISLATIVE / VOTING RECORDS ===
PROPUBLICA_API_KEY=
CONGRESS_GOV_API_KEY=
LEGISCAN_API_KEY=
OPEN_STATES_API_KEY=

# === CAMPAIGN FINANCE ===
FEC_API_KEY=
OPENSECRETS_API_KEY=
FOLLOW_THE_MONEY_API_KEY=

# === ELECTIONS & CIVIC ===
GOOGLE_CIVIC_API_KEY=
VOTESMART_API_KEY=

# === IDEOLOGY / VOTING ANALYSIS ===
# GovTrack and Voteview need no key — use base URLs directly

# === NEWS ===
NEWS_API_KEY=
GDELT_API_KEY=none_required
MEDIASTACK_API_KEY=

# === FACT-CHECKING (RSS — no key needed) ===
POLITIFACT_RSS_URL=https://www.politifact.com/rss/
FACTCHECK_RSS_URL=https://www.factcheck.org/feed/
AP_FACT_CHECK_RSS_URL=https://apnews.com/apf-TopNews?format=rss

# === STOCK TRADES (NO KEY NEEDED) ===
SENATE_STOCK_WATCHER_URL=https://senatestockwatcher.com/api/senate-trading
HOUSE_STOCK_WATCHER_URL=https://housestockwatcher.com/api/transactions

# === STOCK PRICE DATA (for trade correlation) ===
ALPHA_VANTAGE_API_KEY=

# === ECONOMIC CONTEXT ===
FRED_API_KEY=

# === GOVERNMENT ACCOUNTABILITY (NO KEY NEEDED) ===
FEDERAL_REGISTER_URL=https://www.federalregister.gov/api/v1
SEC_EDGAR_URL=https://efts.sec.gov/LATEST/search-index
USASPENDING_URL=https://api.usaspending.gov/api/v2
OVERSIGHT_GOV_URL=https://www.oversight.gov/api

# === CORPORATE / BUSINESS RELATIONSHIPS ===
OPENCORPORATES_API_KEY=none_required_for_basic

# === AI SUMMARIZATION ===
ANTHROPIC_API_KEY=

# === DATABASE ===
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
```

---

## TIER 1: FREE, NO CREDIT CARD — REGISTER FIRST

### 1. ProPublica Congress API
- **Register:** https://www.propublica.org/datastore/api/propublica-congress-api
- **Form fields:** First Name, Last Name, Email, Organization, Intended Use
- **Suggested use description:** "Non-commercial civic transparency app showing voters objective, sourced information on elected officials."
- **Key delivery:** Immediate by email
- **Base URL:** `https://api.propublica.org/congress/v1/`
- **Auth:** Header `X-API-Key: YOUR_KEY`
- **Rate limit:** 500 requests/day free
- **What it covers:**
  - All Senate/House members (current + historical)
  - Full voting records on every bill
  - Bill details, status, sponsors, cosponsors
  - Committee memberships and hearings
  - Floor statements and speeches
  - Member attendance records
  - Party unity scores
  - Lobbying registrations

**Key endpoints:**
```
GET /members/{chamber}/{state}/current.json              → All senators/reps for a state
GET /members/{member-id}.json                            → Individual member profile
GET /members/{member-id}/votes.json                      → Full voting history
GET /bills/search.json?query={term}                      → Bill search
GET /members/{member-id}/bills/{type}.json               → Bills sponsored/cosponsored
GET /members/{member-id}/statements.json                 → Floor statements
GET /committees/{chamber}/{committee-id}/hearings.json   → Committee hearings
GET /members/{member-id}/attendance.json                 → Missed votes
GET /{congress}/members/{chamber}/leaving.json           → Members not returning
```

**Note to Cursor:** Rate limit errors surface as key errors. Test with:
`curl -H "X-API-Key: YOUR_KEY" "https://api.propublica.org/congress/v1/members/house/NY/current.json"`
Add exponential backoff: 2s, 4s, 8s, 16s before treating as failed.

---

### 2. FEC API (Federal Election Commission)
- **Register:** https://api.data.gov/signup/
- **Form fields:** First Name, Last Name, Email, Use description
- **Key delivery:** Immediate by email
- **Demo key:** `DEMO_KEY` works immediately (100 req/day, 1000/hour) for testing
- **Base URL:** `https://api.open.fec.gov/v1/`
- **Auth:** Query param `?api_key=YOUR_KEY`
- **Rate limit:** 1000 requests/hour, 10,000/day with real key
- **What it covers:**
  - Every campaign finance transaction ever filed since 1980
  - Donor names, employers, occupations, amounts
  - PAC and Super PAC contributions
  - Independent expenditures (dark money adjacent)
  - Candidate financial summaries
  - Committee details (who controls which PAC)

**Key endpoints:**
```
GET /candidates/?name={name}                              → Find candidate by name
GET /candidate/{candidate-id}/totals/                     → Financial totals by cycle
GET /schedules/schedule_a/?contributor_name={name}        → Find donor by name
GET /schedules/schedule_b/?candidate_id={id}              → All expenditures
GET /committees/?candidate_id={id}                        → Affiliated committees/PACs
GET /candidates/{id}/filings/                             → All FEC filings
GET /schedules/schedule_e/?candidate_id={id}              → Independent expenditures for/against
```

---

### 3. Congress.gov API (Library of Congress — Official Source)
- **Register:** https://api.congress.gov/sign-up/
- **Form fields:** Name, Email, Organization, Purpose
- **Key delivery:** Immediate by email
- **Base URL:** `https://api.congress.gov/v3/`
- **Auth:** Query param `?api_key=YOUR_KEY`
- **Rate limit:** 5000 requests/hour
- **What it covers:**
  - Official full text of every bill ever introduced
  - Amendment details and outcomes
  - Congressional Record entries (official floor transcript)
  - Committee reports (official government documents)
  - Congressional Research Service (CRS) reports — nonpartisan analysis
  - Treaty information
  - Presidential nominations and confirmation votes

**Key endpoints:**
```
GET /bill/{congress}/{type}/{number}                      → Specific bill
GET /bill/{congress}/{type}/{number}/text                 → Full bill text
GET /member/{bioguideId}/sponsored-legislation           → Bills member sponsored
GET /congressional-record/{year}/{month}/{day}           → Official floor record
GET /committee-report/{congress}/{type}/{number}         → Official committee report
```

---

### 4. GovTrack (No Key Required)
- **Base URL:** `https://www.govtrack.us/api/v2/`
- **Auth:** None required
- **What it covers:**
  - DW-NOMINATE ideology scores (0 = most liberal, 1 = most conservative)
  - Voting records with position relative to party
  - Missed vote percentages
  - Bill sponsorship analysis
  - Party unity scores

**Key endpoints:**
```
GET /person?limit=100&roles__current=true                 → All current members
GET /person/{id}                                          → Individual member + ideology score
GET /vote_voter?person={id}&limit=100                     → Person's full vote history
GET /bill?sponsor={id}                                    → Bills sponsored
GET /vote?limit=100&chamber=senate                        → Recent Senate votes
```

**Note:** DW-NOMINATE scores power the bipartisan scoring feature. Score < 0 = liberal, > 0 = conservative. Bipartisan score = how often member crosses party median.

---

### 5. Voteview (University of California — No Key Required)
- **Base URL:** `https://voteview.com/api/`
- **Auth:** None required
- **What it covers:**
  - DW-NOMINATE ideological coordinates for every member since 1789
  - Every congressional vote ever recorded (50,000+ roll calls)
  - Historical context — "how has this member's ideology shifted over time?"

**Key endpoints:**
```
GET /api/members?congress=118&chamber=House               → All House members + scores
GET /api/votes/search?congress=118&chamber=Senate         → Senate votes
```

---

### 6. Open States API (State Legislatures)
- **Register:** https://openstates.org/accounts/signup/
- **Form fields:** Email, Password
- **Key delivery:** Immediate
- **Base URL:** `https://v3.openstates.org/`
- **Auth:** Header `X-API-KEY: YOUR_KEY`
- **Free tier:** 500 requests/day
- **What it covers:**
  - All 50 state legislatures
  - State senators and representatives with profile data
  - State bill tracking (text, status, vote results)
  - State committee assignments
  - State voting records

---

### 7. VoteSmart API
- **Register:** https://votesmart.org/share/api
- **Form fields:** Name, Email, Organization, Use Case
- **Key delivery:** 1–3 business days (manual approval)
- **Base URL:** `http://api.votesmart.org/`
- **Auth:** Query param `?key=YOUR_KEY&o=JSON`
- **What it covers:**
  - Candidate biographical data (education, career, family)
  - Issue positions (from candidates' own submitted statements)
  - Interest group ratings — NRA, ACLU, AFL-CIO, Chamber of Commerce, Sierra Club, ADA, ACU
  - Political Courage Test answers (candidates answer policy questions on record)
  - Speech and statement archive
  - Endorsements given and received

**Key endpoints:**
```
GET /Rating.getCandidateRating?candidateId={id}           → All interest group ratings
GET /CandidateBio.getBio?candidateId={id}                 → Full biography
GET /Votes.getByOfficial?candidateId={id}                 → State/fed voting record
GET /Speech.getByOfficial?candidateId={id}                → Public statements
```

**This is uniquely valuable:** Interest group ratings objectively show how the NRA, ACLU, Chamber of Commerce, Sierra Club, AFL-CIO score every politician. No editorial judgment — just the groups' own assessments.

---

### 8. Alpha Vantage (Stock Price Data — Free Tier)
- **Register:** https://www.alphavantage.co/support/#api-key
- **Form fields:** Email only
- **Key delivery:** Instant
- **Base URL:** `https://www.alphavantage.co/query`
- **Auth:** Query param `?apikey=YOUR_KEY`
- **Free tier:** 25 requests/day, 500/month (no credit card)
- **What it covers:**
  - Real-time and historical stock prices
  - 20+ years of daily OHLCV data
  - Intraday prices (for precise trade timing)

**Why this matters for the app:**
Correlate congressional stock trades with price movements. If a senator buys $50K of a pharma stock on Monday and votes on a drug pricing bill on Friday, show the stock chart for that week.

**Key endpoints:**
```
GET /query?function=TIME_SERIES_DAILY&symbol={TICKER}     → Daily price history
GET /query?function=TIME_SERIES_INTRADAY&symbol={TICKER}  → Intraday prices
GET /query?function=OVERVIEW&symbol={TICKER}              → Company overview
```

---

### 9. Federal Reserve FRED API (Economic Context)
- **Register:** https://fred.stlouisfed.org/docs/api/api_key.html
- **Form fields:** Email, Password
- **Key delivery:** Instant
- **Base URL:** `https://api.stlouisfed.org/fred/`
- **Auth:** Query param `?api_key=YOUR_KEY`
- **Free tier:** 120 requests/minute, unlimited/day
- **What it covers:**
  - Unemployment rate by state and congressional district
  - GDP growth by quarter
  - Inflation (CPI) over time
  - Federal funds rate history
  - Housing prices by metro area
  - 800,000+ economic data series

**Why this matters:** Shows voters how economic indicators trended during a politician's tenure. "Unemployment in [district] was X% when [Senator] took office and Y% when they left."

**Key endpoints:**
```
GET /series/observations?series_id=UNRATE                 → National unemployment rate
GET /series/observations?series_id=CPIAUCSL              → CPI (inflation)
GET /release/series?release_id=10                         → State unemployment data
GET /series?search_text=unemployment+{state}              → Find state-specific series
```

---

### 10. OpenCorporates (Business Relationships — No Key for Basic)
- **Base URL:** `https://api.opencorporates.com/v0.4/`
- **Auth:** None required for basic queries; `?api_token=YOUR_KEY` for higher limits
- **Free tier:** 50 requests/day without key, more with free registration
- **Register (optional):** https://opencorporates.com/users/sign_up
- **What it covers:**
  - World's largest open company database (200M+ companies)
  - Director and officer relationships (who sits on what board)
  - Corporate family trees (subsidiaries, parent companies)
  - Historical company records

**Why this matters:** Find if a politician or their immediate family sits on boards of companies they regulate or vote on.

**Key endpoints:**
```
GET /officers/search?q={name}                             → Find person's board seats
GET /companies/search?q={company_name}&jurisdiction_code=us → Find company
GET /companies/{jurisdiction}/{number}/officers           → Company board members
```

---

## TIER 2: REQUIRES GOOGLE ACCOUNT (INSTANT)

### 11. Google Civic Information API
- **Setup:** https://console.cloud.google.com
- **Steps:**
  1. Create project named "CivicApp"
  2. Enable "Civic Information API" in the API Library
  3. Create API Key under Credentials → API Key
- **Base URL:** `https://www.googleapis.com/civicinfo/v2/`
- **Auth:** Query param `?key=YOUR_KEY`
- **Free quota:** 25,000 requests/day
- **What it covers:**
  - Every elected official for any U.S. address or ZIP code (federal + state + local)
  - Office details, contact info, social media handles
  - Upcoming elections for a specific location
  - Polling place locations
  - Early voting sites and hours

**Key endpoint:**
```
GET /representatives?address={zip}&key={key}              → All officials for ZIP/address
GET /elections?key={key}                                  → All upcoming elections
GET /voterinfo?address={zip}&electionId={id}&key={key}   → Voter info for specific election
```

This powers the "My Ledger" feature — every official from school board to U.S. Senator for a given ZIP code.

---

## TIER 3: PAID BUT HIGH VALUE

### 12. OpenSecrets API
- **Register:** https://www.opensecrets.org/api/admin/index.php?function=signup
- **Cost:** Free tier (200 req/day) → $50/month for 2,000/day
- **What it covers:**
  - Industry breakdown of donations — the best available anywhere
  - Lobbying registrations and dollar amounts
  - Revolving door tracking (who went from Congress to K Street and back)
  - Outside spending by election cycle
  - Dark money 501(c)(4) tracking
  - Top donors by candidate (industry + individual)

**Key endpoints:**
```
GET /candIndByInd.json?cid={id}&cycle={year}              → Industry breakdown of donations
GET /candSector.json?cid={id}&cycle={year}                → Sector breakdown
GET /lobbyist.json?lob={name}                             → Lobbying activity
GET /revolvingDoor.json?eid={id}                          → Revolving door record
```

---

### 13. LegiScan API
- **Register:** https://legiscan.com/legiscan
- **Cost:** Free (300 req/day) → $75/month for higher volume
- **What it covers:**
  - All 50 states + federal — one unified API
  - Real-time bill status updates (push notifications available)
  - Full bill text with version history
  - Vote results with member-level detail
  - Amendment tracking

---

### 14. Quiver Quantitative (Congressional Trading — Most Complete Dataset)
- **Register:** https://www.quiverquant.com/sources/congresstrading
- **Cost:** $50/month
- **What it covers:**
  - Every STOCK Act disclosure ever filed — cleaner than raw PDFs
  - Trading history searchable by politician, ticker, sector, or date
  - Sector/industry concentration analysis
  - Conflict of interest scoring (automated)
  - Pre-built correlation between trades and related votes

---

## TIER 4: NEWS SOURCES

### 15. NewsAPI
- **Register:** https://newsapi.org/register
- **Form fields:** First Name, Last Name, Email, Password (no description required)
- **Key delivery:** Instant
- **Cost:** Free (100 req/day, developer plan) → $49/month (500 req/day)
- **Base URL:** `https://newsapi.org/v2/`
- **Auth:** Header `X-Api-Key: YOUR_KEY`
- **What it covers:**
  - Search news by politician name across 150,000+ sources
  - Filter by source (AP, Reuters, NPR, etc.) to prioritize objective outlets
  - Date range filtering

**Key endpoints:**
```
GET /everything?q={name}&sortBy=publishedAt&language=en   → News about a person
GET /everything?q={name}&sources=associated-press,reuters → AP + Reuters only
GET /top-headlines?category=politics&country=us           → Top political headlines
```

---

### 16. GDELT Project (Free, No Key — Research-Grade Scale)
- **No registration needed**
- **Base URL:** `https://api.gdeltproject.org/api/v2/`
- **What it covers:**
  - Every news event globally since 1979 — 500M+ articles indexed
  - Tone and sentiment analysis (positive/negative/neutral per article)
  - Geographic and person entity tagging
  - What researchers use for large-scale nonpartisan media analysis

**Key endpoints:**
```
GET /doc/doc?query={name}&mode=artlist&format=json        → Articles mentioning person
GET /doc/doc?query={name}&mode=tonechart&format=json      → Sentiment over time
GET /doc/doc?query={name}&startdatetime={YYYYMMDD}&mode=artlist → Date-range search
```

---

### 17. MediaStack
- **Register:** https://mediastack.com/signup/free
- **Cost:** 500 articles/month free → $19.99/month for 10,000
- **Good alternative to NewsAPI with better international coverage**

---

## TIER 5: FACT-CHECKING FEEDS (NO KEY REQUIRED)

These are RSS feeds — parse them server-side and match articles to politician names.

### 18. PolitiFact
- **RSS Feed:** `https://www.politifact.com/rss/`
- **By person:** `https://www.politifact.com/rss/people/{slug}/`
- **Ratings:** True, Mostly True, Half True, Mostly False, False, Pants on Fire
- **Founded:** 2007, Pulitzer Prize winner, widely cited as nonpartisan benchmark
- **How to use:** When displaying a politician's statements, query PolitiFact for their name and show the fact-check rating alongside each statement.

---

### 19. FactCheck.org
- **RSS Feed:** `https://www.factcheck.org/feed/`
- **Published by:** Annenberg Public Policy Center, University of Pennsylvania
- **Founded:** 2003 — the original U.S. political fact-checker
- **Covers:** Presidential claims, congressional claims, political advertising

---

### 20. AP Fact Check
- **RSS Feed:** `https://apnews.com/APFactCheck`
- **Why use it:** Associated Press is the most widely trusted wire service globally
- **Coverage:** National and international political claims

---

### 21. Washington Post Fact Checker
- **RSS Feed:** `https://feeds.washingtonpost.com/rss/politics`
- **Rating system:** Pinocchio scale (1–4 Pinocchios, Geppetto Checkmark for true)
- **Label it:** Center-Left outlet but fact-checking team follows rigorous methodology
- **Note for Cursor:** Tag all WaPo content with `sourceBias: 'Center-Left'` in the Source type

---

## TIER 6: GOVERNMENT DATA (NO KEY REQUIRED)

### 22. USA Spending API
- **Base URL:** `https://api.usaspending.gov/api/v2/`
- **No key needed**
- **What it covers:**
  - Every federal contract, grant, and loan ever awarded
  - Which agencies spent what, to whom, and where
  - Congressional district breakdowns — what federal money came to this district
  - Spending by recipient company (useful for donor/spending correlation)

**Key endpoints:**
```
POST /search/spending_by_award/                           → Search contracts/grants
GET /recipient/                                           → Find recipients by name
GET /financial_balances/agencies/                         → Agency budget breakdown
GET /spending_by_geography/?scope=district                → By congressional district
```

---

### 23. Federal Register API (Presidential Actions — No Key)
- **Base URL:** `https://www.federalregister.gov/api/v1/`
- **No key needed**
- **What it covers:**
  - Every executive order ever signed with full text
  - Presidential memoranda and proclamations
  - Agency rulemaking (regulations proposed and finalized)
  - Useful for showing what a president or governor actually *did* vs. said

**Key endpoints:**
```
GET /documents.json?conditions[type][]=PRESDOCU&conditions[president][]={name}
  → All executive orders by a president
GET /articles.json?conditions[term]={topic}
  → Federal Register entries on a topic
```

---

### 24. SEC EDGAR (Financial Disclosures — No Key)
- **Base URL:** `https://efts.sec.gov/LATEST/search-index`
- **No key needed**
- **What it covers:**
  - Annual financial disclosures filed by public company executives
  - 13F filings (large investment disclosures)
  - Insider trading reports (Form 4) — when corporate insiders buy/sell
  - Useful for finding politician business ties to regulated industries

**Key endpoints:**
```
GET /efts.sec.gov/LATEST/search-index?q={name}&dateRange=custom&startdt={date}&enddt={date}
  → Search SEC filings by person or company name
GET /cgi-bin/browse-edgar?action=getcompany&company={name}&type=4&dateb=&owner=include&count=40
  → Form 4 insider trades
```

---

### 25. House Financial Disclosures (Official STOCK Act Source — No Key)
- **URL:** `https://disclosures.house.gov/FinancialDisclosure`
- **API-like endpoint:** `https://disclosures.house.gov/FinancialDisclosure/ViewMemberSearchResult`
- **No key needed, returns JSON**
- **What it covers:**
  - Official STOCK Act trade disclosures filed by House members
  - Annual financial disclosure reports (assets, income, outside positions)
  - Amendment filings when members correct errors
- **Note:** Data comes as PDFs for older filings; newer ones have structured data.

---

### 26. Senate Financial Disclosures (Official STOCK Act Source — No Key)
- **URL:** `https://efts.senate.gov/public/index.cfm/financial-disclosures`
- **Search endpoint:** `https://efts.senate.gov/public/index.cfm/filings?search={name}`
- **No key needed**
- **What it covers:**
  - Senate STOCK Act disclosures
  - Annual financial reports for all senators
- **Note to Cursor:** Use Senate Stock Watcher and House Stock Watcher APIs first (already in .env.local) — they parse the PDFs for you. Use these official sources to cross-reference and verify.

---

### 27. Oversight.gov — Inspector General Reports (No Key)
- **Base URL:** `https://www.oversight.gov/api`
- **No key needed**
- **What it covers:**
  - Reports from all 74 federal Inspectors General
  - Investigations of fraud, waste, and abuse in every agency
  - Audit findings, management alerts, whistleblower-based investigations
  - Covers DOD, VA, HHS, DOJ, DHS, and all other major agencies

**Why this matters:** Shows voters documented government failures and corruption at the agency level — fact-based, official, and nonpartisan by definition.

---

### 28. Bureau of Labor Statistics API (No Key for Basic)
- **Base URL:** `https://api.bls.gov/publicAPI/v2/`
- **What it covers:**
  - Employment and unemployment by state and metro area
  - Consumer Price Index (inflation data) over time
  - Wage data by occupation and industry
  - Economic context for policy debates

---

### 29. Census Bureau API (Instant Key)
- **Register:** https://api.census.gov/data/key_signup.html
- **Key delivery:** Instant
- **What it covers:**
  - District demographics: income, education, race, age, poverty rate
  - American Community Survey — the most detailed district-level data available
  - Historical trend data (how has a district changed during a politician's tenure?)

---

## TIER 7: THINK TANKS & RESEARCH DATASETS

These have no API but publish free downloadable datasets — import once into Supabase.

### Pew Research Center
- **Download:** https://www.pewresearch.org/download-datasets/
- **Registration:** Free (name + email)
- **Format:** SPSS/CSV
- **What it covers:** Public opinion on every major political issue, updated regularly. The gold standard for nonpartisan polling data.
- **How to use:** Import CSVs into Supabase. Show "What percentage of Americans support [position]?" alongside a politician's stance.

### Brookings Institution
- **Data hub:** https://www.brookings.edu/topics/data/
- **Coverage:** Nonpartisan economic and policy analysis, education, housing, race

### Kaiser Family Foundation (KFF)
- **Data:** https://www.kff.org/statedata/
- **Coverage:** The definitive source for healthcare policy data by state — insurance rates, Medicaid expansion, drug pricing

### Urban Institute
- **Catalog:** https://datacatalog.urban.institute.org/
- **Coverage:** Economic and social policy research with emphasis on low-income populations

### FollowTheMoney.org (State Campaign Finance)
- **API:** https://www.followthemoney.org/our-data/the-api/
- **No key required for basic use**
- **Coverage:** State-level campaign finance where FEC doesn't reach — every state election, PAC, and donor

### Congressional Budget Office (CBO)
- **Data:** https://www.cbo.gov/data
- **No registration needed**
- **Coverage:** Official nonpartisan cost estimates for every major bill. Shows how much legislation actually costs vs. what politicians claimed.

---

## THE AI SUMMARIZATION LAYER

### Claude API (Anthropic)
- **Register:** https://console.anthropic.com
- **Cost:** ~$3/million input tokens, ~$15/million output tokens
- **Model to use:** `claude-sonnet-4-6` (fastest and most cost-effective for summaries)

**Cursor should build an API route that:**
1. Fetches raw data from ProPublica, FEC, VoteSmart, GovTrack for a politician
2. Sends it to Claude with this exact system prompt:

```
You are a nonpartisan civic information assistant. Summarize this
politician's record based ONLY on the provided documented data.

Rules:
- Never write "X supports Y" — always write "Available evidence suggests
  X [position] based on [specific actions/votes/statements]"
- Cite every claim with the source that provided the data
- If sources conflict, present both with clear attribution
- Flag when evidence is limited (single source, old data, incomplete record)
- Do not editorialize, draw political conclusions, or speculate
- Present contradictions between statements and actions factually without commentary
- Use the source tier system: official > nonpartisan > media > alleged > unverified
```

3. Store the result in Supabase with a `generated_at` timestamp
4. Return cached version on page load — only regenerate when new votes/bills detected or weekly on a cron job

---

## RECOMMENDED ARCHITECTURE FOR CURSOR

```
Data Flow:
External APIs → Next.js API Routes (app/api/) → Supabase Cache → React Components

lib/
  api/
    propublica.ts         ← ProPublica Congress API client
    fec.ts                ← FEC campaign finance client
    congress-gov.ts       ← Congress.gov official bill data
    govtrack.ts           ← GovTrack ideology scores + votes
    voteview.ts           ← DW-NOMINATE historical scores
    open-states.ts        ← State legislature data
    votesmart.ts          ← Interest group ratings + positions
    google-civic.ts       ← ZIP code → all officials
    stockwatch.ts         ← Senate/House Stock Watcher
    alpha-vantage.ts      ← Stock price data
    fred.ts               ← Federal Reserve economic data
    newsapi.ts            ← News search
    gdelt.ts              ← News sentiment + scale
    federal-register.ts   ← Executive orders
    usaspending.ts        ← Federal contracts/grants
    oversight.ts          ← Inspector General reports
    fact-check.ts         ← PolitiFact/FactCheck RSS parser
    claude-summary.ts     ← Claude AI summarization
  db/
    supabase.ts           ← Database client
    politicians.ts        ← Politician DB queries
    cache.ts              ← Cache invalidation logic (TTL-based)
  utils/
    retry.ts              ← Exponential backoff (2s, 4s, 8s, 16s)
    source-tier.ts        ← Source credibility classification

app/api/
  politicians/[id]/route.ts        ← Fetch + cache politician data
  politicians/[id]/votes/route.ts  ← Voting record
  politicians/[id]/finance/route.ts← Campaign finance
  politicians/[id]/stocks/route.ts ← Stock trades + price correlation
  politicians/[id]/news/route.ts   ← News search
  elections/route.ts               ← Elections + polling data
  search/route.ts                  ← Cross-politician search
  civic/[zip]/route.ts             ← Local officials by ZIP
  fact-check/[name]/route.ts       ← PolitiFact/FactCheck results
  economic/[district]/route.ts     ← FRED economic context

Supabase Tables to Create:
  politicians              (id, name, propublica_id, govtrack_id, fec_id, cached_at)
  vote_records             (politician_id, bill_id, vote, date, source, cached_at)
  campaign_finance         (politician_id, cycle, totals_json, donors_json, cached_at)
  stock_trades             (politician_id, ticker, amount, date, disclosure_date, cached_at)
  news_items               (politician_id, headline, url, source, date, cached_at)
  fact_checks              (politician_id, statement, rating, source, date, cached_at)
  ai_summaries             (politician_id, summary_json, generated_at)
  ideology_scores          (politician_id, dw_nominate, party_unity, bipartisan_score)
```

---

## NONPARTISAN SOURCE PRIORITY

Ranked by objectivity and reliability for this app:

| Priority | Source | Why |
|----------|--------|-----|
| 1 | Official .gov records | Primary source — Congress.gov, FEC, Senate.gov, Federal Register |
| 2 | ProPublica | Award-winning investigative nonprofit, Pulitzer history |
| 3 | AP (Associated Press) | Global wire service, strictest editorial standards |
| 4 | Reuters | International wire service, editorial independence |
| 5 | GovTrack | Data-only, no editorial content, academic methodology |
| 6 | Voteview (UC) | Academic, peer-reviewed methodology since 1970s |
| 7 | Ballotpedia | Nonpartisan political encyclopedia |
| 8 | OpenSecrets | Nonpartisan campaign finance research |
| 9 | Pew Research | Nonpartisan polling, gold standard methodology |
| 10 | VoteSmart | Nonpartisan voter information since 1988 |
| 11 | PolitiFact | Pulitzer Prize, consistent methodology |
| 12 | FactCheck.org | Annenberg Public Policy Center, academic standards |
| 13 | CBO | Official congressional budget analysis, nonpartisan by law |

**Sources to use with editorial label (have documented perspectives):**
- Wall Street Journal → label: `"Center-Right"`
- New York Times → label: `"Center-Left"`
- Washington Post → label: `"Center-Left"`
- Fox News → label: `"Right"`
- MSNBC → label: `"Left"`
- NPR → label: `"Center-Left"`

Use editorial sources only for news coverage. Always display their `sourceBias` tag.

---

## COMPLETE REGISTRATION CHECKLIST

### Must Register (keys required):

- [ ] **ProPublica Congress API** — propublica.org/datastore/api/propublica-congress-api
  - Fields: First Name, Last Name, Email, Organization (use: "Independent"), Intended Use
  - Use: "Non-commercial civic transparency app displaying objective voting records and documented public positions of elected officials."
  
- [ ] **FEC API** — api.data.gov/signup
  - Fields: First Name, Last Name, Email, Use
  - Can use `DEMO_KEY` to test immediately
  
- [ ] **Congress.gov API** — api.congress.gov/sign-up
  - Fields: Name, Email, Organization, Purpose

- [ ] **Google Civic API** — console.cloud.google.com
  - Steps: New project → Enable Civic Information API → Create API Key

- [ ] **Open States API** — openstates.org/accounts/signup
  - Fields: Email, Password

- [ ] **VoteSmart API** — votesmart.org/share/api
  - Fields: Name, Email, Organization, Use Case
  - Delivery: 1–3 business days (manual review)

- [ ] **OpenSecrets API** — opensecrets.org/api/admin/index.php?function=signup
  - Free tier: 200 req/day

- [ ] **NewsAPI** — newsapi.org/register
  - Fields: First Name, Last Name, Email, Password

- [ ] **Alpha Vantage** — alphavantage.co/support/#api-key
  - Fields: Email only. Free tier: 25 req/day.

- [ ] **FRED (Federal Reserve)** — fred.stlouisfed.org/docs/api/api_key.html
  - Fields: Email, Password. Free, unlimited.

- [ ] **Census Bureau** — api.census.gov/data/key_signup.html
  - Fields: Email only. Instant.

- [ ] **Anthropic (Claude API)** — console.anthropic.com
  - Requires payment method; usage-based pricing

- [ ] **Supabase** — supabase.com
  - Free tier: 500MB database, 2GB bandwidth/month

### No Registration Needed (use URLs directly):

- [x] **GovTrack** — govtrack.us/api/v2
- [x] **Voteview** — voteview.com/api
- [x] **Senate Stock Watcher** — senatestockwatcher.com/api/senate-trading
- [x] **House Stock Watcher** — housestockwatcher.com/api/transactions
- [x] **GDELT News** — api.gdeltproject.org/api/v2
- [x] **USA Spending** — api.usaspending.gov/api/v2
- [x] **Federal Register** — federalregister.gov/api/v1
- [x] **SEC EDGAR** — efts.sec.gov/LATEST/search-index
- [x] **Oversight.gov** — oversight.gov/api
- [x] **OpenCorporates (basic)** — api.opencorporates.com/v0.4
- [x] **FollowTheMoney** — followthemoney.org/our-data/the-api
- [x] **PolitiFact RSS** — politifact.com/rss/
- [x] **FactCheck.org RSS** — factcheck.org/feed/
- [x] **AP Fact Check RSS** — apnews.com/APFactCheck
- [x] **CBO Data** — cbo.gov/data
- [x] **BLS (Bureau of Labor Statistics)** — api.bls.gov/publicAPI/v2
- [x] **House Financial Disclosures** — disclosures.house.gov/FinancialDisclosure
- [x] **Senate Financial Disclosures** — efts.senate.gov/public/index.cfm/financial-disclosures

---

*Last updated: June 2026*
*Built on branch: claude/cool-ride-iomjzf*
*Repository: robbieryan312-star/code*
