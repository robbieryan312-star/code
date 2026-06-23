#!/usr/bin/env python3
"""
API Registration — Semi-Automated
Script fills the forms, YOU verify and press Enter to continue.
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

def log(msg): print(msg, flush=True)
def pause(n=2): time.sleep(n)

def fill(page, selectors, value):
    for sel in selectors:
        try:
            els = page.locator(sel)
            if els.count() > 0 and els.first.is_visible(timeout=3000):
                els.first.click()
                pause(0.3)
                els.first.fill(value)
                return True
        except Exception:
            pass
    return False

def wait_for_user(site_name):
    log(f"\n  >>> Check the browser window for {site_name}")
    log(f"  >>> Fix anything that didn't fill, solve any CAPTCHA, then click Submit")
    log(f"  >>> Press Enter here when done (or type 'skip' to skip this site): ")
    response = input("  >>> ").strip().lower()
    return response != "skip"

SITES = [
    {
        "name": "1/12  Alpha Vantage",
        "url":  "https://www.alphavantage.co/support/#api-key",
        "note": "KEY SHOWN ON PAGE after submit — write it down before pressing Enter",
        "fields": [
            (["input[name=email]","input[type=email]","input[placeholder*='email' i]"], "email"),
            (["input[name=organization]","input[placeholder*='organ' i]","input[placeholder*='company' i]"], "org"),
        ]
    },
    {
        "name": "2/12  FEC (api.data.gov)",
        "url":  "https://api.data.gov/signup/",
        "note": "Key will be emailed to robbie.ryan312@gmail.com",
        "fields": [
            (["input[name=user_first_name]","input[name*=first]","input[placeholder*='first' i]"], "first"),
            (["input[name=user_last_name]","input[name*=last]","input[placeholder*='last' i]"], "last"),
            (["input[name=user_email]","input[name*=email]","input[type=email]"], "email"),
            (["input[name=user_how_hear]","textarea","input[name*=use]"], "purpose"),
        ]
    },
    {
        "name": "3/12  Congress.gov",
        "url":  "https://api.congress.gov/sign-up/",
        "note": "Key will be emailed to robbie.ryan312@gmail.com",
        "fields": [
            (["input[name*=first]","input[placeholder*='first' i]"], "first"),
            (["input[name*=last]","input[placeholder*='last' i]"], "last"),
            (["input[name*=email]","input[type=email]"], "email"),
            (["input[name*=org]","input[placeholder*='organ' i]"], "org"),
            (["textarea","input[name*=use]","input[name*=purpose]"], "purpose"),
        ]
    },
    {
        "name": "4/12  Census Bureau",
        "url":  "https://api.census.gov/data/key_signup.html",
        "note": "Key will be emailed to robbie.ryan312@gmail.com",
        "fields": [
            (["input[name*=email]","input[type=email]"], "email"),
            (["input[name*=org]","input[placeholder*='organ' i]"], "org"),
        ]
    },
    {
        "name": "5/12  NewsAPI",
        "url":  "https://newsapi.org/register",
        "note": "Key shown in dashboard after registration",
        "fields": [
            (["input[name=firstName]","input[name*=first]","input[placeholder*='first' i]"], "first"),
            (["input[name=lastName]","input[name*=last]","input[placeholder*='last' i]"], "last"),
            (["input[name=email]","input[type=email]"], "email"),
            (["input[name=password]","input[type=password]"], "password"),
        ]
    },
    {
        "name": "6/12  Open States",
        "url":  "https://openstates.org/accounts/signup/",
        "note": "Verify email then find API key in account dashboard",
        "fields": [
            (["input[name=email]","input[type=email]"], "email"),
            (["input[name=password1]","input[name=password]","input[type=password]"], "password"),
            (["input[name=password2]","input[name*=confirm]"], "password"),
        ]
    },
    {
        "name": "7/12  ProPublica Congress API",
        "url":  "https://www.propublica.org/datastore/api/propublica-congress-api",
        "note": "Key will be emailed to robbie.ryan312@gmail.com",
        "fields": [
            (["input[name*=first]","input[placeholder*='first' i]"], "first"),
            (["input[name*=last]","input[placeholder*='last' i]"], "last"),
            (["input[name*=email]","input[type=email]"], "email"),
            (["input[name*=org]","input[placeholder*='organ' i]"], "org"),
            (["textarea","input[name*=use]"], "purpose"),
        ]
    },
    {
        "name": "8/12  LegiScan",
        "url":  "https://legiscan.com/legiscan",
        "note": "Key will be emailed to robbie.ryan312@gmail.com",
        "fields": [
            (["input[name*=first]","input[placeholder*='first' i]"], "first"),
            (["input[name*=last]","input[placeholder*='last' i]"], "last"),
            (["input[name*=email]","input[type=email]"], "email"),
            (["textarea","input[name*=use]"], "purpose"),
        ]
    },
    {
        "name": "9/12  OpenSecrets",
        "url":  "https://www.opensecrets.org/api/admin/index.php?function=signup",
        "note": "Manual approval 1-2 days — key emailed when approved",
        "fields": [
            (["input[name*=first]","input[placeholder*='first' i]"], "first"),
            (["input[name*=last]","input[placeholder*='last' i]"], "last"),
            (["input[name*=email]","input[type=email]"], "email"),
            (["input[name*=org]","input[placeholder*='organ' i]"], "org"),
            (["textarea","input[name*=use]"], "purpose"),
        ]
    },
    {
        "name": "10/12  VoteSmart",
        "url":  "https://votesmart.org/share/api",
        "note": "Manual approval 1-3 days — key emailed when approved",
        "fields": [
            (["input[name*=first]","input[placeholder*='first' i]"], "first"),
            (["input[name*=last]","input[placeholder*='last' i]"], "last"),
            (["input[name*=email]","input[type=email]"], "email"),
            (["input[name*=org]","input[placeholder*='organ' i]"], "org"),
            (["textarea","input[name*=use]"], "purpose"),
        ]
    },
    {
        "name": "11/12  FRED (Federal Reserve)",
        "url":  "https://fredaccount.stlouisfed.org/public/login/index",
        "note": "After account created: My Account → API Keys → Request Key",
        "fields": [
            (["input[name*=email]","input[type=email]"], "email"),
            (["input[type=password]","input[name*=password]"], "password"),
        ]
    },
    {
        "name": "12/12  MediaStack",
        "url":  "https://mediastack.com/signup/free",
        "note": "Key shown in dashboard after signup",
        "fields": [
            (["input[name*=email]","input[type=email]"], "email"),
            (["input[type=password]","input[name*=password]"], "password"),
        ]
    },
]

def main():
    INFO["password"] = getpass.getpass("Choose a password for new accounts (8+ chars): ")
    if len(INFO["password"]) < 8:
        print("Need at least 8 characters.")
        sys.exit(1)

    with sync_playwright() as p:
        log("\nOpening browser...")
        browser = p.chromium.launch(headless=False, slow_mo=100)
        ctx  = browser.new_context(viewport={"width": 1280, "height": 900})
        page = ctx.new_page()
        page.set_default_timeout(20000)

        for site in SITES:
            log(f"\n{'─'*55}")
            log(f"  NEXT: {site['name']}")
            log(f"  Note: {site['note']}")
            log(f"{'─'*55}")

            try:
                page.goto(site["url"], wait_until="networkidle", timeout=25000)
                pause(2)
                for sel_list, key in site["fields"]:
                    val = INFO[key]
                    result = fill(page, sel_list, val)
                    if not result:
                        log(f"  (could not auto-fill a field — fill it manually in the browser)")
            except Exception as e:
                log(f"  Page load issue: {e}")
                log(f"  The browser should still be on the page — fill it manually.")

            wait_for_user(site["name"])

        log(f"\n{'='*55}")
        log("ALL DONE")
        log(f"{'='*55}")
        log(f"Password used: {INFO['password']}  ← SAVE THIS")
        log("\nExpect emails at robbie.ryan312@gmail.com from:")
        log("  FEC, Congress.gov, Census Bureau, ProPublica, LegiScan")
        log("\nApproval pending (keys arrive in 1-3 days):")
        log("  OpenSecrets, VoteSmart")
        log("\nOne more to do manually (needs your Google login):")
        log("  Google Civic → console.cloud.google.com")
        log("  New project 'CivicApp' → Enable Civic Information API → Create API Key")
        log(f"{'='*55}")
        pause(30)
        browser.close()

if __name__ == "__main__":
    main()

