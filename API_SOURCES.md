# Civic App — Complete API & Data Source Reference

Generated for: Robert Ryan | robbie.ryan312@gmail.com
Purpose: Comprehensive political transparency app using objective, sourced data

---

## HOW TO USE THIS FILE
Give this entire file to Cursor with the instruction:
"Build the data layer for this app using the APIs listed below. 
Replace all mock data with real API calls. Use Next.js API routes 
in app/api/ to proxy all calls server-side. Store keys in .env.local. 
Never expose keys to the browser. Cache all responses in Supabase."

---

## ENVIRONMENT VARIABLES TEMPLATE
Create a file called `.env.local` in the project root with these keys.
Fill in values as you receive them from each service.

```
# === LEGISLATIVE / VOTING RECORDS ===
PROPUBLICA_API_KEY=
CONGRESS_GOV_API_KEY=
LEGISCAN_API_KEY=

# === CAMPAIGN FINANCE ===
FEC_API_KEY=
OPENSECRETS_API_KEY=
FOLLOW_THE_MONEY_API_KEY=

# === ELECTIONS & CIVIC ===
GOOGLE_CIVIC_API_KEY=
VOTESMART_API_KEY=

# === NEWS ===
NEWS_API_KEY=
GDELT_API_KEY=none_required

# === STOCK TRADES (NO KEY NEEDED) ===
SENATE_STOCK_WATCHER_URL=https://senatestockwatcher.com/api/senate-trading
HOUSE_STOCK_WATCHER_URL=https://housestockwatcher.com/api/transactions

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
  - Lobbying registrations (separate endpoint)

**Key endpoints for this app:**
```
GET /members/{chamber}/{state}/current.json         → All senators/reps for a state
GET /members/{member-id}.json                       → Individual member profile
GET /members/{member-id}/votes.json                 → Voting history
GET /bills/search.json?query={term}                → Bill search
GET /members/{member-id}/bills/{type}.json          → Bills sponsored/cosponsored
GET /members/{member-id}/statements.json            → Floor statements
GET /committees/{chamber}/{committee-id}/hearings.json → Committee hearings
```

**Note to Cursor:** If getting "expired key" errors, test with:
`curl -H "X-API-Key: YOUR_KEY" "https://api.propublica.org/congress/v1/members/house/NY/current.json"`
Rate limit errors look like key errors — add exponential backoff retry logic.

---

### 2. FEC API (Federal Election Commission)
- **Register:** https://api.data.gov/signup/
- **Form fields:** First Name, Last Name, Email, How will you use this?
- **Key delivery:** Immediate by email
- **Demo key:** `DEMO_KEY` works for testing (100 req/day, 1000/hour)
- **Base URL:** `https://api.open.fec.gov/v1/`
- **Auth:** Query param `?api_key=YOUR_KEY`
- **Rate limit:** 1000 requests/hour, 10000/day
- **What it covers:**
  - Every campaign finance transaction ever filed
  - Donor names, employers, occupations, amounts
  - PAC and Super PAC contributions
  - Independent expenditures
  - Candidate financial summaries
  - Committee details (who controls what PAC)

**Key endpoints:**
```
GET /candidates/?name={name}                       → Find candidate by name
GET /candidate/{candidate-id}/totals/              → Financial totals
GET /schedules/schedule_a/?contributor_name={name} → Find donor by name
GET /schedules/schedule_b/?candidate_id={id}       → Expenditures
GET /committees/?candidate_id={id}                 → Affiliated committees
GET /candidates/{id}/filings/                      → All FEC filings
```

---

### 3. Congress.gov API (Library of Congress — Official)
- **Register:** https://api.congress.gov/sign-up/
- **Form fields:** Name, Email, Organization, Purpose
- **Key delivery:** Immediate by email
- **Base URL:** `https://api.congress.gov/v3/`
- **Auth:** Query param `?api_key=YOUR_KEY`
- **Rate limit:** 5000 requests/hour
- **What it covers:**
  - Official bill text (full text of every bill)
  - Amendment details
  - Congressional Record entries
  - Committee reports (official)
  - Treaty information
  - Presidential nominations

---

### 4. GovTrack (No Key Required)
- **Base URL:** `https://www.govtrack.us/api/v2/`
- **Auth:** None required
- **What it covers:**
  - DW-NOMINATE ideology scores (liberal-conservative spectrum)
  - Voting records
  - Missed vote percentages
  - Bill sponsorship analysis
  - Party unity scores

**Key endpoints:**
```
GET /person?limit=100&roles__current=true          → All current members
GET /person/{id}                                    → Individual member
GET /vote_voter?person={id}&limit=100              → Person's votes
GET /bill?sponsor={id}                              → Bills sponsored
```

**Note:** GovTrack ideology scores are particularly useful for the "bipartisan" scoring feature.

---

### 5. Voteview (University of California — No Key Required)
- **Base URL:** `https://voteview.com/api/`
- **Auth:** None required
- **What it covers:**
  - DW-NOMINATE ideological coordinates for every member ever (1789–present)
  - Every congressional vote ever recorded
  - Perfect for "how partisan is this member historically"

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
  - State senators and representatives
  - State bill tracking
  - State committee assignments
  - State voting records

---

### 7. VoteSmart API
- **Register:** https://votesmart.org/share/api
- **Form fields:** Name, Email, Organization, Use Case
- **Key delivery:** 1-3 business days
- **Base URL:** `http://api.votesmart.org/`
- **Auth:** Query param `?key=YOUR_KEY`
- **What it covers:**
  - Candidate biographical data
  - Issue positions (from candidates directly)
  - Interest group ratings (NRA, ACLU, AFL-CIO, etc. grades)
  - Political Courage Test answers (candidates answer on record)
  - Speech and statement database
  - Endorsements

**This is uniquely valuable** — interest group ratings show how the NRA, ACLU, Chamber of Commerce, Sierra Club, etc. score every politician.

---

## TIER 2: REQUIRES GOOGLE ACCOUNT (INSTANT)

### 8. Google Civic Information API
- **Setup:** https://console.cloud.google.com
- **Steps:**
  1. Create project "CivicApp"
  2. Enable "Civic Information API"
  3. Create API Key under Credentials
- **Base URL:** `https://www.googleapis.com/civicinfo/v2/`
- **Auth:** Query param `?key=YOUR_KEY`
- **Free quota:** 25,000 requests/day
- **What it covers:**
  - Every elected official for any U.S. address or ZIP code
  - Office details, contact info, social media
  - Upcoming elections for a location
  - Polling place locations
  - Early voting sites

**Key endpoint:**
```
GET /representatives?address={zip}&key={key}       → All officials for ZIP code
```
This powers the entire "My Ledger" local officials feature.

---

## TIER 3: PAID BUT WORTH IT

### 9. OpenSecrets API
- **Register:** https://www.opensecrets.org/api/admin/index.php?function=signup
- **Cost:** Free tier (200 req/day) → $50/month for 2000/day
- **What it covers:**
  - Industry breakdown of donations (best available anywhere)
  - Lobbying registrations and amounts
  - Revolving door (who went from Congress to lobbying)
  - Outside spending by election
  - Dark money tracking

### 10. LegiScan API
- **Register:** https://legiscan.com/legiscan
- **Cost:** Free (300 req/day) → $75/month
- **What it covers:**
  - All 50 states + federal legislative tracking
  - Real-time bill status updates
  - Full bill text
  - Vote results

### 11. Quiver Quantitative (Congressional Trading — Most Complete)
- **Register:** https://www.quiverquant.com/sources/congresstrading
- **Cost:** $50/month
- **What it covers:**
  - All STOCK Act disclosures
  - Trading history by politician
  - Sector/industry analysis
  - Conflict of interest scoring

---

## TIER 4: NEWS SOURCES

### 12. NewsAPI
- **Register:** https://newsapi.org/register
- **Form fields:** First Name, Last Name, Email, Password (no description needed)
- **Key delivery:** Instant
- **Cost:** Free (100 req/day) → $49/month (500 req/day)
- **What it covers:**
  - Search news by politician name
  - Filter by source (AP, Reuters, etc.)
  - Historical articles

### 13. GDELT Project (Free, No Key — Massive Scale)
- **No registration needed**
- **Base URL:** `https://api.gdeltproject.org/api/v2/`
- **What it covers:**
  - Every news event globally since 1979
  - Tone and sentiment analysis
  - Geographic tagging
  - Person and organization mentions
  - This is what researchers use for large-scale media analysis

**Key endpoint for this app:**
```
GET /doc/doc?query={politician_name}&mode=artlist&format=json
→ Returns news articles mentioning this person
```

### 14. MediaStack
- **Register:** https://mediastack.com/signup/free
- **Cost:** 500 articles/month free → $19.99/month
- **Good alternative to NewsAPI**

---

## TIER 5: GOVERNMENT DATA (NO KEY REQUIRED)

### 15. USA Spending API
- **Base URL:** `https://api.usaspending.gov/api/v2/`
- **No key needed**
- **What it covers:**
  - Every federal contract, grant, and loan
  - Which agencies spent what, to whom
  - Congressional district breakdowns
  - Useful for showing voters what federal money goes to their district

### 16. Bureau of Labor Statistics API
- **Base URL:** `https://api.bls.gov/publicAPI/v2/`
- **No key needed for basic use**
- **What it covers:**
  - Employment, unemployment, wages by state/district
  - Consumer price index (inflation data)
  - Useful context for economic policy debates

### 17. Census Bureau API
- **Register:** https://api.census.gov/data/key_signup.html (instant)
- **What it covers:**
  - District demographics (income, education, race, age)
  - Contextualizes why a politician takes certain positions

---

## TIER 6: THINK TANKS & RESEARCH (DATA DOWNLOADS, NOT APIs)

These don't have APIs but publish free downloadable datasets:

### Pew Research Center
- **Download page:** https://www.pewresearch.org/download-datasets/
- **What it covers:** Public opinion on every major political issue, updated regularly
- **Format:** SPSS/CSV — Cursor can parse and import into Supabase
- **Registration:** Free (name + email)

### Brookings Institution
- **Data hub:** https://www.brookings.edu/topics/data/
- **Nonpartisan policy research, economic analysis**

### Kaiser Family Foundation (Health Policy)
- **Data:** https://www.kff.org/statedata/
- **Best source for healthcare policy data by state**

### Urban Institute
- **Data catalog:** https://datacatalog.urban.institute.org/
- **Economic and social policy research**

### FollowTheMoney.org (State Campaign Finance)
- **API:** https://www.followthemoney.org/our-data/the-api/
- **No key required for basic use**
- **Covers state-level campaign finance (where FEC doesn't reach)**

---

## THE AI SUMMARIZATION LAYER

### Claude API (Anthropic)
- **Register:** https://console.anthropic.com
- **Cost:** ~$3 per million input tokens, ~$15 per million output tokens
- **How to use in this app:**

Cursor should build an API route that:
1. Fetches raw data from ProPublica, FEC, VoteSmart for a politician
2. Sends it to Claude with this system prompt:
```
You are a nonpartisan civic information assistant. Summarize this 
politician's record based ONLY on the provided documented data. 
Rules:
- Never write "X supports Y" — always write "Available evidence suggests 
  X [position] based on [specific actions/votes/statements]"
- Cite every claim with the source that provided the data
- If sources conflict, present both with attribution
- Flag when evidence is limited (single source, old data)
- Do not editorialize or draw political conclusions
```
3. Store the result in Supabase so it doesn't need to regenerate on every page view
4. Regenerate weekly or when new votes/bills are detected

---

## RECOMMENDED ARCHITECTURE FOR CURSOR

```
Data Flow:
External APIs → Next.js API Routes → Supabase (cache) → React Components

Folder structure to create:
lib/
  api/
    propublica.ts      ← ProPublica Congress API client
    fec.ts             ← FEC campaign finance client  
    govtrack.ts        ← GovTrack voting + ideology
    stockwatch.ts      ← Senate/House Stock Watcher
    newsapi.ts         ← NewsAPI news fetching
    google-civic.ts    ← Google Civic for ZIP lookup
    claude-summary.ts  ← Claude API for summarization
  db/
    supabase.ts        ← Database client
    politicians.ts     ← DB queries for politician data
    cache.ts           ← Cache invalidation logic

app/api/
  politicians/[id]/route.ts     ← Fetch + cache politician data
  elections/route.ts            ← Elections + polling data
  search/route.ts               ← Cross-politician search
  civic/[zip]/route.ts          ← Local officials by ZIP
```

---

## OBJECTIVE / NONPARTISAN SOURCES TO PRIORITIZE

In order of objectivity/reliability for this app:

1. **Official government records** (.gov) — Congress.gov, FEC, Senate.gov
2. **ProPublica** — Award-winning investigative nonprofit, nonpartisan
3. **AP (Associated Press)** — Wire service, strict editorial standards
4. **Reuters** — International wire service, nonpartisan
5. **GovTrack** — Nonpartisan, data-only, no editorial content
6. **Ballotpedia** — Nonpartisan political encyclopedia
7. **OpenSecrets** — Nonpartisan campaign finance research
8. **Pew Research** — Nonpartisan polling and research
9. **VoteSmart** — Nonpartisan voter information since 1988

**Sources to use with clear labeling (have editorial perspectives):**
- Wall Street Journal (Center-Right)
- New York Times (Center-Left)  
- Washington Post (Center-Left)
- Fox News (Right)
- MSNBC (Left)
→ Use these only for news coverage, always labeled with perspective

---

## QUICK REGISTRATION CHECKLIST

Copy this list and check off as you complete each one:

[ ] ProPublica Congress API — propublica.org/datastore/api/propublica-congress-api
[ ] FEC API — api.data.gov/signup
[ ] Congress.gov API — api.congress.gov/sign-up
[ ] Google Civic API — console.cloud.google.com (needs Google account)
[ ] Open States API — openstates.org/accounts/signup
[ ] VoteSmart API — votesmart.org/share/api (takes 1-3 days)
[ ] OpenSecrets API — opensecrets.org/api/admin/index.php?function=signup
[ ] NewsAPI — newsapi.org/register
[ ] Anthropic (Claude API) — console.anthropic.com
[ ] Supabase — supabase.com (database)

No key needed (just copy URLs directly):
[x] GovTrack — govtrack.us/api/v2
[x] Voteview — voteview.com/api
[x] Senate Stock Watcher — senatestockwatcher.com/api/senate-trading
[x] House Stock Watcher — housestockwatcher.com/api/transactions
[x] GDELT News — api.gdeltproject.org/api/v2
[x] USA Spending — api.usaspending.gov/api/v2
[x] FollowTheMoney — followthemoney.org/our-data/the-api

---

*Last updated: June 2026*
*Built on branch: claude/cool-ride-iomjzf*
