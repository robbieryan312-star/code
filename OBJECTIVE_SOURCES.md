# Civic App — Objective Sources, Trusted Media & Research Reference

Purpose: Every source in this file meets at least one of these criteria:
- Peer-reviewed or government-produced (primary source)
- Wire service standard (AP, Reuters — no opinion, just verified fact)
- Long-established nonpartisan track record with documented methodology
- Academic institution with transparent research standards

Sources with a political lean are included but clearly labeled — presenting
multiple labeled perspectives is more honest than pretending lean doesn't exist.

---

## HOW TO USE WITH CURSOR

> "Read OBJECTIVE_SOURCES.md. For every source with an RSS feed, create a
> parser in lib/api/feeds.ts. For every source with an API, add a client in
> lib/api/. Tag every piece of content with the source's lean rating from
> this file before storing in Supabase. Never display content from a leaning
> source without showing its lean label to the user."

---

## TIER 1: WIRE SERVICES — GOLD STANDARD FOR FACTS

These are the sources that other outlets cite. No opinion, no analysis —
only verified, sourced reporting held to the strictest editorial standards.

### Associated Press (AP)
- **Lean:** None — wire service standard
- **Founded:** 1846 — oldest and largest news organization in the world
- **Why it's the benchmark:** 52 Pulitzer Prizes. Every AP story requires
  two independent sources for every factual claim. Used as the record of
  fact by courts, governments, and encyclopedias.
- **RSS:** https://rsshub.app/apnews/politics
- **AP Fact Check RSS:** https://apnews.com/APFactCheck
- **Topics RSS:** https://apnews.com/politics
- **Cursor:** Parse AP RSS, tag `sourceLean: "none"`, `sourceTier: "wire"`

### Reuters
- **Lean:** None — wire service standard
- **Founded:** 1851
- **Why trusted:** International wire service with editorial independence
  guaranteed by the Thomson Reuters Trust Principles since 1941. Covers
  U.S. politics from an explicitly international perspective.
- **RSS:** https://feeds.reuters.com/Reuters/PoliticsNews
- **Cursor:** Tag `sourceLean: "none"`, `sourceTier: "wire"`

---

## TIER 2: PUBLIC BROADCASTING — NONPARTISAN BY CHARTER

### C-SPAN
- **Lean:** None — gavel-to-gavel, zero commentary
- **Why unique:** The only outlet that shows the full, unedited congressional
  floor record. No anchors, no commentary, no framing. What you see is what
  happened. Used as the primary citation source for quotes in this app.
- **YouTube API:** https://www.googleapis.com/youtube/v3/
  - Channel ID: UCb-oTHQsEPvS4FCTLG3IFkA (C-SPAN official)
  - Search: `GET /search?channelId=UCb-oTHQsEPvS4FCTLG3IFkA&q={politician+name}`
- **Video archive search:** https://www.c-span.org/search/?searchtype=Videos
- **Cursor:** Use YouTube Data API to find C-SPAN videos for any politician.
  Display as primary source for any quoted statement.

### PBS NewsHour
- **Lean:** Center — slight left lean documented by multiple media bias surveys
- **Why included:** One of the most factually accurate news programs in U.S.
  broadcasting. Long-form policy interviews with politicians from both parties.
- **RSS:** https://www.pbs.org/newshour/feeds/rss/politics
- **Label:** `sourceLean: "center"`

### NPR Politics
- **Lean:** Center-Left (documented by AllSides, Ad Fontes Media)
- **Why included:** Widely trusted, rigorous fact-checking standards,
  strong coverage of state and local politics beyond major outlets.
- **RSS:** https://feeds.npr.org/1014/rss.xml
- **Label:** `sourceLean: "center-left"`

---

## TIER 3: NONPARTISAN FACT-CHECKERS

### PolitiFact
- **Lean:** None — methodology-driven
- **Founded:** 2007, Tampa Bay Times. Pulitzer Prize 2009.
- **Methodology:** Every rating reviewed by three editors before publication.
  Rates: True / Mostly True / Half True / Mostly False / False / Pants on Fire
- **RSS:** https://www.politifact.com/rss/
- **By politician:** https://www.politifact.com/rss/people/{slug}/
- **API-like endpoint:** https://www.politifact.com/api/v/2/statement/
- **Cursor:** Fetch by politician slug, display rating badge on any statement

### FactCheck.org
- **Lean:** None — academic institution
- **Published by:** Annenberg Public Policy Center, University of Pennsylvania
- **Founded:** 2003 — the original U.S. political fact-checker
- **RSS:** https://www.factcheck.org/feed/
- **Label:** `sourceTier: "nonpartisan"`, `sourceLean: "none"`

### Washington Post Fact Checker
- **Lean:** Center-Left outlet, but fact-checking team uses independent methodology
- **Rating system:** Pinocchio scale (1–4 Pinocchios, Geppetto Checkmark for true)
- **Why include despite lean:** Glenn Kessler's database is the most comprehensive
  single-politician statement archive in existence. Over 30,000 claims checked.
- **RSS:** https://www.washingtonpost.com/news/fact-checker/feed/
- **Label:** `sourceLean: "center-left"`, note: `"fact-checking team uses independent methodology"`

### Snopes (Political section)
- **Lean:** Slight Center-Left
- **Best for:** Viral misinformation and forwarded claims — not primary source
  for policy reporting but essential for flagging `sourceTier: "unverified"` claims
- **RSS:** https://www.snopes.com/feed/
- **Use only for:** Flagging viral claims, not policy analysis

---

## TIER 4: DATA JOURNALISM — NUMBERS OVER NARRATIVE

### FiveThirtyEight
- **Lean:** Center (slight left lean in editorial tone, neutral in data methodology)
- **Why valuable:** The gold standard for polling aggregation and election
  forecasting. Nate Silver's methodology is peer-reviewed and transparent.
- **What to use:**
  - Poll averages for any race
  - Presidential approval tracking
  - Generic ballot tracker
  - Partisan voting index (PVI) by district
- **Data downloads:** https://github.com/fivethirtyeight/data (free, public GitHub)
- **RSS:** https://fivethirtyeight.com/politics/feed/
- **Cursor:** Clone their public GitHub data repo into Supabase on a weekly cron

### RealClearPolitics
- **Lean:** Center-Right in editorial, neutral in poll aggregation
- **Why valuable:** The most comprehensive poll aggregation site. Shows
  every poll for every major race with methodologies listed.
- **Poll averages:** https://www.realclearpolitics.com/epolls/
- **RSS:** https://www.realclearpolitics.com/xml/politics.xml
- **Label:** `sourceLean: "center-right"` for editorial, `"none"` for raw poll data

### The Upshot (New York Times)
- **Lean:** Center-Left (NYT outlet)
- **Why include:** Best data visualization team in political journalism.
  District-level economic and demographic analysis.
- **Note for Cursor:** Label all NYT content `sourceLean: "center-left"`

### Bloomberg Government
- **Lean:** Center
- **Why valuable:** Best coverage of the intersection of business, finance,
  and policy. Particularly strong on lobbying and regulatory data.
- **RSS:** https://www.bloomberg.com/politics/feeds/site.xml
- **Label:** `sourceLean: "center"`

---

## TIER 5: INVESTIGATIVE JOURNALISM — NONPARTISAN WATCHDOGS

### ProPublica
- **Lean:** None — nonprofit, nonpartisan
- **Founded:** 2008. 6 Pulitzer Prizes.
- **Why it's in a category of its own:** Publishes machine-readable databases
  alongside investigative stories. Has actual APIs, not just articles.
- **Data stores:** https://www.propublica.org/datastore/
- **Congress API:** Already in API_SOURCES.md
- **Nonprofit Explorer:** https://projects.propublica.org/nonprofits/api
  - Covers all 1.8M U.S. nonprofits, including political 501(c)(4)s
- **Label:** `sourceTier: "nonpartisan"`, `sourceLean: "none"`

### The Marshall Project
- **Lean:** None — nonpartisan criminal justice reporting
- **Why valuable:** Best source for criminal justice policy data and
  incarceration statistics — essential for any politician's criminal justice record
- **Data:** https://www.themarshallproject.org/records
- **RSS:** https://feeds.themarshallproject.org/marshall-project-all
- **Label:** `sourceTier: "nonpartisan"`

### The Intercept
- **Lean:** Left
- **Why include with label:** Strong investigative reporting on surveillance,
  national security, corporate influence. Must be labeled prominently.
- **Label:** `sourceLean: "left"` — display with clear lean indicator

### The American Conservative
- **Lean:** Right (paleoconservative)
- **Why include with label:** Provides non-mainstream conservative
  perspective on foreign policy and civil liberties. Balance to mainstream
  center-right outlets.
- **Label:** `sourceLean: "right"`

---

## TIER 6: BIPARTISAN & CROSS-AISLE OUTLETS

These outlets either explicitly cover both sides with equal weight, or are
staffed by journalists from across the political spectrum:

### Axios
- **Lean:** Center
- **Format:** Short, structured — "What happened / Why it matters / The other side"
- **Why valuable:** Explicitly presents multiple perspectives in every story.
  Strong on breaking policy news.
- **RSS:** https://api.axios.com/feed/
- **Label:** `sourceLean: "center"`

### The Hill
- **Lean:** Center
- **Why valuable:** Covers Congress from both sides equally. Strong sourcing
  from Hill staff on both sides of the aisle.
- **RSS:** https://thehill.com/rss/syndicator/19110
- **Label:** `sourceLean: "center"`

### Politico
- **Lean:** Center (slight insider/establishment lean)
- **Why valuable:** Best day-to-day congressional and White House coverage.
  Playbook newsletter is the closest thing to an internal congressional memo.
- **RSS:** https://rss.politico.com/politics-news.xml
- **Label:** `sourceLean: "center"`

### The Dispatch
- **Lean:** Center-Right (founded by former Weekly Standard editors)
- **Why include:** Rigorous conservative journalism with strong fact-checking.
  Explicit Never-Trump perspective provides balance to mainstream right outlets.
- **RSS:** https://thedispatch.com/feed/
- **Label:** `sourceLean: "center-right"`

### The Bulwark
- **Lean:** Center-Right (anti-Trump conservative)
- **Why include:** Former Republican journalists covering the right critically.
  Useful for showing non-monolithic conservative perspectives.
- **RSS:** https://thebulwark.com/feed/
- **Label:** `sourceLean: "center-right"`

### Reason Magazine
- **Lean:** Libertarian
- **Why include:** Only major libertarian outlet. Essential for showing
  a third perspective beyond Democrat/Republican binary on civil liberties,
  drug policy, criminal justice, and government spending.
- **RSS:** https://reason.com/feed/
- **Label:** `sourceLean: "libertarian"`

---

## TIER 7: ELECTION ANALYSIS — RACE RATINGS & FORECASTING

### Sabato's Crystal Ball (University of Virginia)
- **Lean:** None — academic
- **Why it's trusted:** Larry Sabato has rated races since 1984 with documented
  accuracy. University-affiliated, no financial conflicts.
- **Rating scale:** Safe D / Likely D / Lean D / Toss-up / Lean R / Likely R / Safe R
- **Free data:** https://centerforpolitics.org/crystalball/
- **RSS:** https://centerforpolitics.org/crystalball/feed/
- **Label:** `sourceTier: "nonpartisan"`, `sourceType: "academic"`

### Cook Political Report
- **Lean:** None — subscription-based political handicapper
- **Founded:** 1984 by Charlie Cook
- **Rating methodology:** Explicitly documented, updated after every major event
- **Free access (limited):** https://www.cookpolitical.com/
- **Label:** `sourceTier: "nonpartisan"`

### MIT Election Data and Science Lab
- **Lean:** None — academic
- **URL:** https://electionlab.mit.edu/data
- **What it covers:**
  - Every U.S. election result since 1976, down to precinct level
  - Voter turnout by demographic
  - Election administration data (polling wait times, provisional ballots)
  - Cost of voting index by state
- **Data downloads:** https://dataverse.harvard.edu/dataverse/medsl
- **Free:** Yes — Harvard Dataverse
- **Cursor:** Download CSVs and import historical election results into Supabase

### Redistricting Data Hub
- **Lean:** None
- **URL:** https://redistrictingdatahub.org/
- **What it covers:** Every district map, demographic data, partisan voting
  index for every congressional and state legislative district
- **Free downloads:** Yes
- **Essential for:** Showing voters exactly what their district looks like
  and how it compares to others

---

## TIER 8: THINK TANKS — LABELED BY ORIENTATION

**Critical note for Cursor:** Every think tank has a philosophical orientation.
Display their lean label on every piece of content. Showing multiple
perspectives from labeled sources is more honest than showing only "neutral" ones.

### Bipartisan Policy Center (BPC)
- **Lean:** Center — explicitly bipartisan by design
- **Founded by:** Former Senate Majority Leaders from both parties
  (Howard Baker R, Tom Daschle D, Bob Dole R, George Mitchell D)
- **URL:** https://bipartisanpolicy.org/
- **RSS:** https://bipartisanpolicy.org/feed/
- **Best for:** Health care, budget, immigration — areas where they publish
  joint D+R proposals
- **Label:** `sourceLean: "center"`, `sourceType: "think-tank"`

### RAND Corporation
- **Lean:** None — explicitly nonpartisan, DoD-funded research
- **URL:** https://www.rand.org/
- **Best for:** Defense policy, veterans issues, international security
- **Free research:** https://www.rand.org/pubs/research_reports.html
- **Label:** `sourceTier: "nonpartisan"`, `sourceType: "research"`

### Brookings Institution
- **Lean:** Center-Left (documented by multiple think tank surveys)
- **URL:** https://www.brookings.edu/
- **RSS:** https://www.brookings.edu/feed/
- **Best for:** Economic policy, education, urban policy, governance
- **Data hub:** https://www.brookings.edu/topics/data/
- **Label:** `sourceLean: "center-left"`, `sourceType: "think-tank"`

### Urban Institute
- **Lean:** Center-Left
- **URL:** https://www.urban.org/
- **Best for:** Housing, income, poverty, social safety net analysis
- **Data catalog:** https://datacatalog.urban.institute.org/
- **API:** https://datacatalog.urban.institute.org/api/action/
- **Label:** `sourceLean: "center-left"`, `sourceType: "research"`

### Tax Policy Center (Urban + Brookings joint)
- **Lean:** Center — joint project of two institutions
- **URL:** https://www.taxpolicycenter.org/
- **Best for:** Distributional analysis of every major tax proposal —
  "who actually benefits from this bill?"
- **Data:** https://www.taxpolicycenter.org/resources/data
- **Label:** `sourceLean: "center"`, `sourceType: "research"`

### Committee for a Responsible Federal Budget (CRFB)
- **Lean:** Center — bipartisan fiscal watchdog
- **URL:** https://www.crfb.org/
- **Best for:** Deficit, debt, budget scoring — "how much does this actually cost?"
- **RSS:** https://www.crfb.org/rss.xml
- **Label:** `sourceLean: "center"`, `sourceType: "fiscal-watchdog"`

### Cato Institute
- **Lean:** Libertarian
- **URL:** https://www.cato.org/
- **Best for:** Civil liberties, criminal justice, drug policy, foreign policy
  from a small-government perspective
- **RSS:** https://www.cato.org/rss/all-op-eds.rss
- **Label:** `sourceLean: "libertarian"`, `sourceType: "think-tank"`

### Heritage Foundation
- **Lean:** Conservative
- **URL:** https://www.heritage.org/
- **Best for:** Defense, immigration, economic policy from a conservative perspective
- **RSS:** https://www.heritage.org/rss/commentary.xml
- **Label:** `sourceLean: "conservative"`, `sourceType: "think-tank"`

### Center on Budget and Policy Priorities (CBPP)
- **Lean:** Center-Left
- **URL:** https://www.cbpp.org/
- **Best for:** Social safety net programs, Medicaid, SNAP, housing assistance
- **RSS:** https://www.cbpp.org/rss.xml
- **Label:** `sourceLean: "center-left"`, `sourceType: "think-tank"`

### Tax Foundation
- **Lean:** Center-Right
- **URL:** https://taxfoundation.org/
- **Best for:** Tax burden analysis, business tax competitiveness
- **RSS:** https://taxfoundation.org/feed/
- **Label:** `sourceLean: "center-right"`, `sourceType: "think-tank"`

### Economic Policy Institute (EPI)
- **Lean:** Center-Left (labor-focused)
- **URL:** https://www.epi.org/
- **Best for:** Wages, unions, trade impact on workers
- **Data:** https://www.epi.org/data/
- **Label:** `sourceLean: "center-left"`, `sourceType: "think-tank"`

### Peterson Institute for International Economics (PIIE)
- **Lean:** Center (internationalist)
- **URL:** https://www.piie.com/
- **Best for:** Trade policy, tariffs, globalization — essential for
  evaluating any politician's trade claims
- **RSS:** https://www.piie.com/rss.xml
- **Label:** `sourceLean: "center"`, `sourceType: "research"`

---

## TIER 9: ACADEMIC RESEARCH DATABASES

### Harvard Dataverse
- **URL:** https://dataverse.harvard.edu/
- **API:** https://dataverse.harvard.edu/api/
- **What it covers:** Thousands of political science datasets including
  election results, voting behavior, public opinion, legislative data
- **Free:** Yes — Harvard's open data repository
- **Cursor:** Search and download relevant datasets into Supabase

### Pew Research Center
- **Lean:** None — academic polling organization
- **URL:** https://www.pewresearch.org/
- **Download datasets:** https://www.pewresearch.org/download-datasets/
- **What it covers:**
  - Public opinion on every major political issue
  - Political polarization tracking (1994–present)
  - Media consumption habits by party
  - Trust in government and institutions
  - Demographic breakdowns of political views
- **Registration:** Free (name + email)
- **Format:** SPSS/CSV — import into Supabase
- **Label:** `sourceTier: "nonpartisan"`, `sourceType: "polling"`

### Gallup
- **Lean:** None — oldest polling organization in the U.S.
- **URL:** https://news.gallup.com/
- **Free data:** Presidential approval ratings back to Truman
- **RSS:** https://news.gallup.com/rss.aspx
- **Most valuable for this app:** Presidential and gubernatorial approval ratings
- **Label:** `sourceTier: "nonpartisan"`, `sourceType: "polling"`

### General Social Survey (GSS)
- **Published by:** NORC at University of Chicago
- **URL:** https://gss.norc.org/
- **What it covers:** Annual survey on American attitudes since 1972 —
  the longest-running social survey in the U.S. Covers political views,
  trust, religion, demographics
- **Free data:** https://gss.norc.org/get-the-data
- **Label:** `sourceTier: "nonpartisan"`, `sourceType: "academic"`

### Cooperative Election Study (CES)
- **Published by:** Harvard University
- **URL:** https://cces.gov.harvard.edu/
- **What it covers:** 60,000-person survey every election year — the most
  detailed voter opinion data available anywhere
- **Free download:** Yes
- **Essential for:** Showing what voters in a specific district actually think

---

## TIER 10: GOVERNMENT ACCOUNTABILITY & WATCHDOGS

### CREW (Citizens for Responsibility and Ethics in Washington)
- **Lean:** Center-Left (but covers both parties)
- **URL:** https://www.citizensforethics.org/
- **What it covers:**
  - Ethics complaints against members of Congress
  - FOIA requests and results
  - Financial disclosure analysis
  - Conflicts of interest
- **RSS:** https://www.citizensforethics.org/feed/
- **Label:** `sourceLean: "center-left"`, `sourceType: "watchdog"`

### POGO (Project on Government Oversight)
- **Lean:** None — explicitly nonpartisan
- **URL:** https://www.pogo.org/
- **What it covers:** Federal contractor fraud, Pentagon waste, whistleblower
  protection, revolving door tracking
- **RSS:** https://www.pogo.org/feed
- **Label:** `sourceTier: "nonpartisan"`, `sourceType: "watchdog"`

### OpenSecrets (already in API_SOURCES.md)
- **Additional data:** Revolving door database, dark money tracker
- **Revolving door:** https://www.opensecrets.org/revolving/
- **Dark money:** https://www.opensecrets.org/outsidespending/nonprof_summ.php

### Sunlight Foundation (Archived)
- **URL:** https://sunlightfoundation.com/
- **Note:** Defunct but datasets still available at archive.org and via
  their GitHub: https://github.com/sunlightlabs
- **Historical value:** Pioneered open government data — many datasets
  still useful for historical analysis

---

## TIER 11: LEGAL RECORDS

### CourtListener (Free Law Project)
- **Lean:** None — open legal data nonprofit
- **URL:** https://www.courtlistener.com/
- **API:** https://www.courtlistener.com/api/rest/v3/
- **What it covers:**
  - All federal court opinions
  - PACER dockets (federal cases)
  - Judge profiles and recusal records
  - Supreme Court oral argument audio
- **Free API:** Yes, no key required for basic use
- **Key endpoint:**
  ```
  GET /api/rest/v3/search/?q={politician+name}&type=r  → Cases mentioning person
  GET /api/rest/v3/dockets/?case_name={name}           → Case dockets
  ```
- **Cursor:** Search for a politician's name to find any federal court involvement

### Supreme Court Database (Washington University)
- **URL:** http://scdb.wustl.edu/
- **What it covers:** Every Supreme Court decision since 1791 — votes,
  issues, outcomes, ideological direction
- **Free download:** Yes (CSV)
- **Useful for:** Showing a politician's positions on judicial nominees
  relative to how those justices actually ruled

---

## TIER 12: INTERNATIONAL & DEMOCRACY METRICS

### Freedom House
- **Lean:** None — U.S. government-funded but editorially independent
- **URL:** https://freedomhouse.org/
- **What it covers:** Annual freedom ratings for every country and U.S. state
  (civil liberties, political rights scores)
- **Data download:** https://freedomhouse.org/report/freedom-world
- **Use for:** International context — how does the U.S. compare globally

### Transparency International
- **Lean:** None
- **URL:** https://www.transparency.org/
- **What it covers:** Corruption Perceptions Index for 180 countries
- **API:** https://www.transparency.org/en/cpi/
- **Use for:** International corruption comparison context

### V-Dem (Varieties of Democracy, University of Gothenburg)
- **Lean:** None — academic
- **URL:** https://www.v-dem.net/
- **What it covers:** 500 democracy indicators for 202 countries since 1789 —
  the most comprehensive democracy dataset ever assembled
- **API:** https://www.v-dem.net/data/api/
- **Free:** Yes
- **Use for:** Historical democratic health indicators

---

## TRUSTED JOURNALIST STANDARDS — WHAT MAKES A SOURCE RELIABLE

For displaying individual bylined journalism in the app, use these criteria
to determine credibility tier. Cursor should apply these as source metadata:

```typescript
interface JournalistStandard {
  tier: 'wire' | 'nonpartisan' | 'quality' | 'opinion';
  requiresTwoSources: boolean;      // AP/Reuters standard
  hasEditorReview: boolean;         // Reviewed before publication
  hasCorrectionsPolicy: boolean;    // Published corrections on errors
  isTransparent: boolean;           // Methodology/sourcing disclosed
}
```

**Wire service standard (AP, Reuters):**
- Every factual claim needs two independent sources
- No opinion, no analysis — only verified fact
- Corrections published prominently
- Reporters rotate beats to prevent capture

**Quality outlet standard (NYT, WaPo, WSJ, BBC, The Economist):**
- Editors review before publication
- Public corrections policy
- Named sources preferred, anonymous sources explained
- Potential conflicts of interest disclosed

**Opinion/editorial (clearly labeled in the app):**
- Any op-ed, editorial, or column — regardless of outlet
- Always displayed with `isOpinion: true` in the NewsItem type
- Never used as a source for factual claims — only for "public reaction" sections

---

## COMPLETE SOURCE LEAN REFERENCE TABLE

| Source | Lean | Tier | Type |
|--------|------|------|------|
| AP | None | Wire | Wire service |
| Reuters | None | Wire | Wire service |
| C-SPAN | None | Official | Public record |
| Congress.gov | None | Official | Government |
| FEC | None | Official | Government |
| ProPublica | None | Nonpartisan | Investigative |
| PolitiFact | None | Nonpartisan | Fact-check |
| FactCheck.org | None | Nonpartisan | Fact-check |
| GovTrack | None | Nonpartisan | Data |
| Voteview | None | Nonpartisan | Academic |
| Ballotpedia | None | Nonpartisan | Encyclopedia |
| OpenSecrets | None | Nonpartisan | Watchdog |
| VoteSmart | None | Nonpartisan | Data |
| Gallup | None | Nonpartisan | Polling |
| Pew Research | None | Nonpartisan | Polling |
| MIT Election Lab | None | Nonpartisan | Academic |
| RAND | None | Nonpartisan | Research |
| Sabato's Crystal Ball | None | Nonpartisan | Academic |
| BPC | Center | Think tank | Bipartisan |
| Tax Policy Center | Center | Research | Bipartisan |
| CRFB | Center | Watchdog | Fiscal |
| Axios | Center | Media | News |
| The Hill | Center | Media | News |
| Politico | Center | Media | News |
| Bloomberg | Center | Media | News |
| PBS NewsHour | Center | Public | Broadcast |
| PIIE | Center | Research | Trade |
| FiveThirtyEight | Center | Media | Data |
| BBC | Center | International | Broadcast |
| The Economist | Center | International | News |
| NPR | Center-Left | Public | Broadcast |
| NYT | Center-Left | Media | News |
| Washington Post | Center-Left | Media | News |
| Brookings | Center-Left | Think tank | Research |
| Urban Institute | Center-Left | Research | Data |
| CBPP | Center-Left | Think tank | Policy |
| EPI | Center-Left | Think tank | Labor |
| CREW | Center-Left | Watchdog | Ethics |
| The Dispatch | Center-Right | Media | News |
| The Bulwark | Center-Right | Media | News |
| WSJ (news desk) | Center-Right | Media | News |
| Tax Foundation | Center-Right | Think tank | Fiscal |
| Cato Institute | Libertarian | Think tank | Policy |
| Reason | Libertarian | Media | News |
| Heritage Foundation | Conservative | Think tank | Policy |
| Fox News (news desk) | Right | Media | News |
| WSJ (editorial) | Right | Opinion | Editorial |
| The Intercept | Left | Media | Investigative |
| MSNBC | Left | Media | Broadcast |

---

## RECOMMENDED SUPABASE TABLE: sources

```sql
CREATE TABLE sources (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  url          TEXT,
  lean         TEXT,  -- 'none','center','center-left','center-right','left','right','libertarian','conservative'
  tier         TEXT,  -- 'official','wire','nonpartisan','quality','opinion'
  source_type  TEXT,  -- 'government','wire','think-tank','research','polling','watchdog','media','academic'
  rss_url      TEXT,
  api_url      TEXT,
  notes        TEXT
);
```

Every `NewsItem`, `Source`, and `EvidenceItem` in the app should reference
a row in this table so lean labels are applied consistently everywhere.

---

*Last updated: June 2026*
*Companion file to: API_SOURCES.md*
