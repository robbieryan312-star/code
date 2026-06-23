#!/usr/bin/env python3
"""
Civic App — API Registration Script (Resilient Version)
Skips any site that fails and continues to the next one.
Run: python3 ~/register_apis.py
"""

from playwright.sync_api import sync_playwright
import time, sys, getpass

INFO = {
    "first":   "Robert",
    "last":    "Ryan",
    "email":   "robbie.ryan312@gmail.com",
    "org":     "Independent",
    "purpose": "Non-commercial civic transparency app displaying objective, sourced voting records, campaign finance data, and documented public positions of elected officials to help voters make informed decisions.",
    "password": "",
}

RESULTS = []

def log(msg): print(msg, flush=True)
def pause(n=3): time.sleep(n)

def fill(page, selectors, value):
    for sel in selectors:
        try:
            els = page.locator(sel)
            if els.count() > 0:
                el = els.first
                if el.is_visible(timeout=3000):
                    el.click()
                    el.fill(value)
                    return True
        except Exception:
            pass
    return False

def click_submit(page):
    for sel in [
        "button[type=submit]", "input[type=submit]",
        "button:has-text('Submit')", "button:has-text('Sign Up')",
        "button:has-text('Register')", "button:has-text('Get Free API Key')",
        "button:has-text('Get API Key')", "button:has-text('Request Key')",
        "button:has-text('Create Account')", "button:has-text('Join')",
    ]:
        try:
            el = page.locator(sel).first
            if el.count() and el.is_visible(timeout=2000):
                el.click()
                return True
        except Exception:
            pass
    return False

def register(page, name, url, steps, note):
    log(f"\n{'='*50}")
    log(f"  {name}")
    log(f"  {url}")
    log(f"{'='*50}")
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=20000)
        pause(3)
        for sel_list, val in steps:
            result = fill(page, sel_list, val)
            if not result:
                log(f"  (field not found — may already be filled or form differs)")
        pause(1)
        click_submit(page)
        pause(4)
        RESULTS.append({"name": name, "status": "SUBMITTED", "note": note})
        log(f"  SUBMITTED — {note}")
    except Exception as e:
        RESULTS.append({"name": name, "status": "FAILED", "note": str(e)[:80]})
        log(f"  FAILED: {e}")
    pause(2)

def main():
    INFO["password"] = getpass.getpass("Choose a password for new accounts (8+ chars): ")
    if len(INFO["password"]) < 8:
        print("Password must be at least 8 characters.")
        sys.exit(1)

    f  = INFO["first"]
    l  = INFO["last"]
    e  = INFO["email"]
    o  = INFO["org"]
    pu = INFO["purpose"]
    pw = INFO["password"]

    # Common selector lists
    fn = ["input[name*=first]",    "input[placeholder*='first' i]",    "#firstName",  "#first_name",  "input[id*=first i]"]
    ln = ["input[name*=last]",     "input[placeholder*='last' i]",     "#lastName",   "#last_name",   "input[id*=last i]"]
    em = ["input[name*=email]",    "input[type=email]",                "#email",      "input[id*=email i]"]
    og = ["input[name*=org]",      "input[placeholder*='organ' i]",    "#organization","input[name*=company]","input[placeholder*='company' i]"]
    us = ["textarea",              "input[name*=use]",                 "input[name*=purpose]", "textarea[name*=descr]", "input[placeholder*='use' i]"]
    pw1= ["input[type=password]",  "input[name*=password]",            "input[name=password1]","input[id*=pass i]"]
    pw2= ["input[name=password2]", "input[name*=confirm]",             "input[id*=confirm i]", "input[placeholder*='confirm' i]"]

    with sync_playwright() as p:
        log("Opening browser...")
        browser = p.chromium.launch(headless=False, slow_mo=200)
        ctx  = browser.new_context(viewport={"width": 1280, "height": 900})
        page = ctx.new_page()
        page.set_default_timeout(15000)

        # ── 1. Alpha Vantage ───────────────────────────────────────────────────
        register(page, "Alpha Vantage (Stock Data)",
            "https://www.alphavantage.co/support/#api-key",
            [(em, e), (og, o)],
            "KEY SHOWN ON PAGE — write it down before moving on")

        # ── 2. FEC / api.data.gov ─────────────────────────────────────────────
        register(page, "FEC Campaign Finance (api.data.gov)",
            "https://api.data.gov/signup/",
            [(fn, f), (ln, l), (em, e), (us, pu)],
            "Key emailed to robbie.ryan312@gmail.com")

        # ── 3. Congress.gov ───────────────────────────────────────────────────
        register(page, "Congress.gov Official Bills API",
            "https://api.congress.gov/sign-up/",
            [(fn, f), (ln, l), (em, e), (og, o), (us, pu)],
            "Key emailed to robbie.ryan312@gmail.com")

        # ── 4. Census Bureau ──────────────────────────────────────────────────
        register(page, "Census Bureau Demographics",
            "https://api.census.gov/data/key_signup.html",
            [(em, e), (og, o)],
            "Key emailed to robbie.ryan312@gmail.com")

        # ── 5. NewsAPI ────────────────────────────────────────────────────────
        register(page, "NewsAPI (News Search)",
            "https://newsapi.org/register",
            [(fn, f), (ln, l), (em, e), (pw1, pw)],
            "Key shown in dashboard after signup")

        # ── 6. MediaStack ─────────────────────────────────────────────────────
        register(page, "MediaStack (News Backup)",
            "https://mediastack.com/signup/free",
            [(em, e), (pw1, pw)],
            "Key shown in dashboard after signup")

        # ── 7. Open States ────────────────────────────────────────────────────
        register(page, "Open States (State Legislatures)",
            "https://openstates.org/accounts/signup/",
            [(em, e), (pw1, pw), (pw2, pw)],
            "Verify email → log in → API Key in dashboard")

        # ── 8. ProPublica ─────────────────────────────────────────────────────
        register(page, "ProPublica Congress API",
            "https://www.propublica.org/datastore/api/propublica-congress-api",
            [(fn, f), (ln, l), (em, e), (og, o), (us, pu)],
            "Key emailed to robbie.ryan312@gmail.com")

        # ── 9. LegiScan ───────────────────────────────────────────────────────
        register(page, "LegiScan (All 50 States Bills)",
            "https://legiscan.com/legiscan",
            [(fn, f), (ln, l), (em, e), (us, pu)],
            "Key emailed to robbie.ryan312@gmail.com")

        # ── 10. OpenSecrets ───────────────────────────────────────────────────
        register(page, "OpenSecrets (Money in Politics)",
            "https://www.opensecrets.org/api/admin/index.php?function=signup",
            [(fn, f), (ln, l), (em, e), (og, o), (us, pu)],
            "Approval takes 1-2 days — key emailed when approved")

        # ── 11. VoteSmart ─────────────────────────────────────────────────────
        register(page, "VoteSmart (Interest Group Ratings)",
            "https://votesmart.org/share/api",
            [(fn, f), (ln, l), (em, e), (og, o), (us, pu)],
            "Manual approval 1-3 business days — key emailed when approved")

        # ── 12. FRED (Federal Reserve) ────────────────────────────────────────
        register(page, "FRED Federal Reserve Economic Data",
            "https://fredaccount.stlouisfed.org/public/login/index",
            [(em, e), (pw1, pw)],
            "After creating account: My Account → API Keys → Request Key")

        # ── 13. Ballotpedia ───────────────────────────────────────────────────
        register(page, "Ballotpedia API (Political Encyclopedia)",
            "https://ballotpedia.org/Ballotpedia:API_support",
            [(em, e), (us, pu)],
            "Contact-based — they will email robbie.ryan312@gmail.com")

        # ── 14. The Marshall Project ──────────────────────────────────────────
        register(page, "The Marshall Project (Criminal Justice Data)",
            "https://www.themarshallproject.org/subscribe",
            [(em, e)],
            "Newsletter + data access")

        # ── 15. CourtListener (Free Law Project) ──────────────────────────────
        register(page, "CourtListener (Federal Court Records)",
            "https://www.courtlistener.com/sign-in/",
            [(em, e), (pw1, pw)],
            "Free API — no key needed but account gives higher limits")

        # ── SUMMARY ───────────────────────────────────────────────────────────
        log(f"\n{'='*60}")
        log("COMPLETE — SUMMARY OF ALL REGISTRATIONS")
        log(f"{'='*60}")
        log(f"Password used for all accounts: {pw}")
        log("SAVE THIS PASSWORD — needed to log into each account\n")

        submitted = [r for r in RESULTS if r["status"] == "SUBMITTED"]
        failed    = [r for r in RESULTS if r["status"] == "FAILED"]

        log(f"Submitted ({len(submitted)}):")
        for r in submitted:
            log(f"  ✓ {r['name']}: {r['note']}")

        if failed:
            log(f"\nFailed ({len(failed)}) — visit these manually:")
            for r in failed:
                log(f"  ✗ {r['name']}: {r['note']}")

        log("\nCheck robbie.ryan312@gmail.com for keys from:")
        log("  FEC, Congress.gov, Census, ProPublica, LegiScan")
        log("\nPending manual approval (keys arrive by email in 1-3 days):")
        log("  OpenSecrets, VoteSmart")
        log("\nStill needs your Google account (do this manually):")
        log("  Google Civic API → console.cloud.google.com")
        log("  New project 'CivicApp' → Enable Civic Information API → Create API Key")
        log(f"{'='*60}")

        log("\nBrowser stays open 2 minutes — check any open tabs for keys.")
        pause(120)
        browser.close()

if __name__ == "__main__":
    main()
