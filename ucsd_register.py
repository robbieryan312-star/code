#!/usr/bin/env python3
"""
Auto-register for every API listed on the UCSD Political Science API guide.
Opens the page, extracts every external link, visits each one, fills the form.
Run: python3 ~/ucsd_register.py
"""
from playwright.sync_api import sync_playwright
import time, getpass, json

INFO = {
    "first":    "Robert",
    "last":     "Ryan",
    "email":    "robbie.ryan312@gmail.com",
    "org":      "Independent",
    "purpose":  "Non-commercial civic transparency app displaying objective, sourced voting records, campaign finance data, and documented public positions of elected officials to help voters make informed decisions.",
    "password": "",
}

RESULTS = []

def log(msg): print(msg, flush=True)
def snooze(n): time.sleep(n)

def smart_fill(page, value, labels=(), placeholders=(), css=()):
    for label in labels:
        try:
            el = page.get_by_label(label, exact=False)
            if el.count() and el.first.is_visible(timeout=2000):
                el.first.click(); snooze(0.3); el.first.fill(value); return True
        except: pass
    for ph in placeholders:
        try:
            el = page.get_by_placeholder(ph, exact=False)
            if el.count() and el.first.is_visible(timeout=2000):
                el.first.click(); snooze(0.3); el.first.fill(value); return True
        except: pass
    for sel in css:
        try:
            el = page.locator(sel).first
            if el.count() and el.is_visible(timeout=2000):
                el.click(); snooze(0.3); el.fill(value); return True
        except: pass
    return False

def try_fill_form(page):
    f, l, e, o, pu, pw = (
        INFO["first"], INFO["last"], INFO["email"],
        INFO["org"], INFO["purpose"], INFO["password"]
    )
    filled = 0

    # First name
    if smart_fill(page, f,
        labels=["First Name","First name","Given name"],
        placeholders=["First name","First","Given"],
        css=["input[name*=first i]","input[id*=first i]","#firstName","#first_name"]):
        filled += 1

    # Last name
    if smart_fill(page, l,
        labels=["Last Name","Last name","Surname","Family name"],
        placeholders=["Last name","Last","Surname"],
        css=["input[name*=last i]","input[id*=last i]","#lastName","#last_name"]):
        filled += 1

    # Full name (some forms have one field)
    if smart_fill(page, f"{f} {l}",
        labels=["Full name","Full Name","Name","Your name"],
        placeholders=["Full name","Your name","Name"],
        css=["input[name=name]","input[name=full_name]","input[placeholder='Name']"]):
        filled += 1

    # Email
    if smart_fill(page, e,
        labels=["Email","Email address","E-mail","Your email"],
        placeholders=["Email","Email address","your@email.com"],
        css=["input[type=email]","input[name*=email i]","input[id*=email i]"]):
        filled += 1

    # Organization
    if smart_fill(page, o,
        labels=["Organization","Organisation","Company","Institution","Affiliation"],
        placeholders=["Organization","Company","Institution"],
        css=["input[name*=org i]","input[name*=company i]","input[id*=org i]"]):
        filled += 1

    # Purpose / use
    if smart_fill(page, pu,
        labels=["Purpose","Use","How will you use","Intended use","Description","Tell us","Why","Reason"],
        placeholders=["purpose","describe","how will","intended","tell us"],
        css=["textarea","input[name*=use i]","input[name*=purpose i]","input[name*=descr i]"]):
        filled += 1

    # Password
    if smart_fill(page, pw,
        labels=["Password","Create password","Choose password"],
        placeholders=["Password","Create a password"],
        css=["input[type=password]","input[name*=password i]"]):
        filled += 1

    # Password confirm
    smart_fill(page, pw,
        labels=["Confirm password","Repeat password","Password again","Password (again)"],
        placeholders=["Confirm","Repeat","Again"],
        css=["input[name*=confirm i]","input[name*=password2]","input[id*=confirm i]"])

    return filled

def try_submit(page):
    for method in [
        lambda: page.get_by_role("button", name="Submit",    exact=False).first.click(),
        lambda: page.get_by_role("button", name="Sign up",   exact=False).first.click(),
        lambda: page.get_by_role("button", name="Register",  exact=False).first.click(),
        lambda: page.get_by_role("button", name="Get API",   exact=False).first.click(),
        lambda: page.get_by_role("button", name="Request",   exact=False).first.click(),
        lambda: page.get_by_role("button", name="Create",    exact=False).first.click(),
        lambda: page.get_by_role("button", name="Join",      exact=False).first.click(),
        lambda: page.get_by_role("button", name="Send",      exact=False).first.click(),
        lambda: page.locator("button[type=submit]").first.click(),
        lambda: page.locator("input[type=submit]").first.click(),
    ]:
        try: method(); return True
        except: pass
    return False

def accept_terms(page):
    for sel in [
        "input[type=checkbox][name*=term i]",
        "input[type=checkbox][name*=agree i]",
        "input[type=checkbox][id*=term i]",
        "input[type=checkbox][id*=agree i]",
        "input[type=checkbox]",
    ]:
        try:
            boxes = page.locator(sel)
            for i in range(min(boxes.count(), 5)):
                try:
                    if not boxes.nth(i).is_checked():
                        boxes.nth(i).check()
                except: pass
        except: pass

def main():
    INFO["password"] = getpass.getpass("Password for new accounts (8+ chars): ")
    if len(INFO["password"]) < 8:
        print("Need 8+ characters."); return

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=120)
        ctx  = browser.new_context(viewport={"width": 1280, "height": 900})
        page = ctx.new_page()
        page.set_default_timeout(20000)

        # ── Step 1: Load source pages and extract all external API links ────────
        source_pages = [
            "https://blogs.mulesoft.com/dev-guides/15-apis-to-track-election-data/",
        ]

        skip_domains = [
            "mulesoft.com", "salesforce.com", "javascript:", "mailto:",
            "twitter.com", "facebook.com", "linkedin.com", "youtube.com", "google.com",
        ]

        seen = set()
        api_links = []

        for source_url in source_pages:
            log(f"\nLoading: {source_url}")
            try:
                page.goto(source_url, wait_until="networkidle", timeout=30000)
                snooze(3)
                raw_links = page.eval_on_selector_all(
                    "a[href^='http']",
                    "els => els.map(e => ({href: e.href, text: e.innerText.trim()}))"
                )
                before = len(api_links)
                for lnk in raw_links:
                    href = lnk.get("href", "")
                    text = lnk.get("text", "").strip()
                    if not href or not text: continue
                    if any(d in href for d in skip_domains): continue
                    if href in seen: continue
                    seen.add(href)
                    api_links.append({"href": href, "text": text})
                log(f"  Found {len(api_links) - before} new links")
            except Exception as ex:
                log(f"  Could not load page: {ex}")

        log(f"\nFound {len(api_links)} external API/data sources on the UCSD page:")
        for i, lnk in enumerate(api_links, 1):
            log(f"  {i:2}. {lnk['text'][:60]:60} → {lnk['href'][:60]}")

        if not api_links:
            log("No links found — the page may require a login. Trying hardcoded list...")
            api_links = [
                {"text": "ProPublica Congress API",    "href": "https://www.propublica.org/datastore/api/propublica-congress-api"},
                {"text": "FEC (api.data.gov)",          "href": "https://api.data.gov/signup/"},
                {"text": "Congress.gov API",            "href": "https://api.congress.gov/sign-up/"},
                {"text": "OpenSecrets API",             "href": "https://www.opensecrets.org/api/admin/index.php?function=signup"},
                {"text": "VoteSmart API",               "href": "https://votesmart.org/share/api"},
                {"text": "GovTrack",                    "href": "https://www.govtrack.us/developers/api"},
                {"text": "LegiScan",                    "href": "https://legiscan.com/legiscan"},
                {"text": "Census Bureau API",           "href": "https://api.census.gov/data/key_signup.html"},
                {"text": "NewsAPI",                     "href": "https://newsapi.org/register"},
                {"text": "Alpha Vantage",               "href": "https://www.alphavantage.co/support/#api-key"},
                {"text": "Open States",                 "href": "https://openstates.org/accounts/signup/"},
                {"text": "FRED Federal Reserve",        "href": "https://fredaccount.stlouisfed.org/public/login/index"},
                {"text": "MediaStack",                  "href": "https://mediastack.com/signup/free"},
            ]

        snooze(2)

        # ── Step 2: Visit each link and register ──────────────────────────────
        for i, lnk in enumerate(api_links, 1):
            name = lnk["text"][:50]
            url  = lnk["href"]
            log(f"\n{'─'*60}")
            log(f"  [{i}/{len(api_links)}] {name}")
            log(f"  {url}")

            try:
                page.goto(url, wait_until="networkidle", timeout=25000)
                snooze(3)

                accept_terms(page)
                snooze(0.5)

                filled = try_fill_form(page)
                snooze(1)

                submitted = try_submit(page)
                snooze(4)

                status = "SUBMITTED" if submitted else ("FILLED" if filled else "NO FORM FOUND")
                RESULTS.append({"name": name, "url": url, "status": status})
                log(f"  → {status} ({filled} fields filled)")

            except Exception as ex:
                RESULTS.append({"name": name, "url": url, "status": f"ERROR: {str(ex)[:60]}"})
                log(f"  → ERROR: {ex}")

        # ── Summary ──────────────────────────────────────────────────────────
        log(f"\n{'='*60}")
        log("ALL DONE — RESULTS")
        log(f"{'='*60}")
        submitted = [r for r in RESULTS if "SUBMITTED" in r["status"]]
        other     = [r for r in RESULTS if "SUBMITTED" not in r["status"]]
        log(f"\nSubmitted ({len(submitted)}):")
        for r in submitted: log(f"  ✓  {r['name']}")
        if other:
            log(f"\nNot submitted ({len(other)}):")
            for r in other: log(f"  ✗  {r['name']} — {r['status']}")
        log(f"\n  Password used: {INFO['password']}  ← SAVE THIS")
        log(f"  Keys emailed to: {INFO['email']}")
        log(f"{'='*60}")
        snooze(90)
        browser.close()

if __name__ == "__main__":
    main()
