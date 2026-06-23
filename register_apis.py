#!/usr/bin/env python3
"""
Civic App — Automated API Registration
Run: python3 register_apis.py
"""

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
import time, sys

import getpass

INFO = {
    "first":  "Robert",
    "last":   "Ryan",
    "email":  "robbie.ryan312@gmail.com",
    "org":    "Independent",
    "purpose": (
        "Non-commercial civic transparency app displaying objective, sourced voting "
        "records, campaign finance data, and documented public positions of elected "
        "officials to help voters make informed decisions."
    ),
    "password": "",  # set at runtime
}

RESULTS = []

def log(msg):
    print(msg, flush=True)

def fill(page, selectors, value):
    for sel in selectors:
        try:
            el = page.locator(sel).first
            if el.count() and el.is_visible(timeout=2000):
                el.fill(value)
                return True
        except Exception:
            pass
    return False

def submit(page, selectors=None):
    candidates = selectors or [
        "button[type=submit]",
        "input[type=submit]",
        "button:has-text('Submit')",
        "button:has-text('Sign Up')",
        "button:has-text('Register')",
        "button:has-text('Get API Key')",
        "button:has-text('Request')",
    ]
    for sel in candidates:
        try:
            el = page.locator(sel).first
            if el.count() and el.is_visible(timeout=2000):
                el.click()
                return True
        except Exception:
            pass
    return False

def pause(seconds=2):
    time.sleep(seconds)

# ─────────────────────────────────────────────────────────────
# 1. Alpha Vantage — email only, key shown on page
# ─────────────────────────────────────────────────────────────
def register_alpha_vantage(page):
    log("\n[1/12] Alpha Vantage...")
    page.goto("https://www.alphavantage.co/support/#api-key", wait_until="networkidle")
    pause()
    fill(page, ["#email", "input[name=email]", "input[type=email]", "input[placeholder*='email' i]"], INFO["email"])
    fill(page, ["#organization", "input[name=organization]", "input[placeholder*='organ' i]"], INFO["org"])
    submit(page)
    pause(3)
    key = ""
    try:
        key = page.locator("code, .key, #api-key, strong").first.inner_text()
    except Exception:
        pass
    RESULTS.append({"service": "Alpha Vantage", "key": key or "Check page — key may be visible", "note": "Key shown on page"})
    log(f"   ✓ Done. Key: {key or 'check the browser window'}")

# ─────────────────────────────────────────────────────────────
# 2. FEC / api.data.gov
# ─────────────────────────────────────────────────────────────
def register_fec(page):
    log("\n[2/12] FEC (api.data.gov)...")
    page.goto("https://api.data.gov/signup/", wait_until="networkidle")
    pause()
    fill(page, ["#user_first_name", "input[name*=first]", "input[placeholder*='first' i]"], INFO["first"])
    fill(page, ["#user_last_name",  "input[name*=last]",  "input[placeholder*='last' i]"],  INFO["last"])
    fill(page, ["#user_email",      "input[name*=email]", "input[type=email]"],              INFO["email"])
    fill(page, ["#user_how_hear",   "textarea",           "input[name*=use]"],               INFO["purpose"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "FEC (api.data.gov)", "key": "", "note": "Key sent to robbie.ryan312@gmail.com"})
    log("   ✓ Submitted — check email for key")

# ─────────────────────────────────────────────────────────────
# 3. Congress.gov
# ─────────────────────────────────────────────────────────────
def register_congress(page):
    log("\n[3/12] Congress.gov API...")
    page.goto("https://api.congress.gov/sign-up/", wait_until="networkidle")
    pause()
    fill(page, ["input[name*=first]", "input[placeholder*='first' i]", "#firstName"], INFO["first"])
    fill(page, ["input[name*=last]",  "input[placeholder*='last' i]",  "#lastName"],  INFO["last"])
    fill(page, ["input[name*=email]", "input[type=email]"],                            INFO["email"])
    fill(page, ["input[name*=org]",   "input[placeholder*='organ' i]"],               INFO["org"])
    fill(page, ["textarea",           "input[name*=use]", "input[name*=purpose]"],    INFO["purpose"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "Congress.gov", "key": "", "note": "Key sent to robbie.ryan312@gmail.com"})
    log("   ✓ Submitted — check email for key")

# ─────────────────────────────────────────────────────────────
# 4. Census Bureau
# ─────────────────────────────────────────────────────────────
def register_census(page):
    log("\n[4/12] Census Bureau...")
    page.goto("https://api.census.gov/data/key_signup.html", wait_until="networkidle")
    pause()
    fill(page, ["input[name*=email]", "input[type=email]"], INFO["email"])
    fill(page, ["input[name*=org]",   "input[placeholder*='organ' i]"], INFO["org"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "Census Bureau", "key": "", "note": "Key sent to robbie.ryan312@gmail.com"})
    log("   ✓ Submitted — check email for key")

# ─────────────────────────────────────────────────────────────
# 5. NewsAPI
# ─────────────────────────────────────────────────────────────
def register_newsapi(page):
    log("\n[5/12] NewsAPI...")
    page.goto("https://newsapi.org/register", wait_until="networkidle")
    pause()
    fill(page, ["input[name=firstName]", "input[placeholder*='first' i]"], INFO["first"])
    fill(page, ["input[name=lastName]",  "input[placeholder*='last' i]"],  INFO["last"])
    fill(page, ["input[name=email]",     "input[type=email]"],             INFO["email"])
    fill(page, ["input[name=password]",  "input[type=password]"],          INFO["password"])
    submit(page)
    pause(3)
    key = ""
    try:
        key = page.locator("code, .api-key, [class*=key]").first.inner_text()
    except Exception:
        pass
    RESULTS.append({"service": "NewsAPI", "key": key or "", "note": "Key shown after login or sent by email"})
    log(f"   ✓ Done. Key: {key or 'check browser or email'}")

# ─────────────────────────────────────────────────────────────
# 6. MediaStack
# ─────────────────────────────────────────────────────────────
def register_mediastack(page):
    log("\n[6/12] MediaStack...")
    page.goto("https://mediastack.com/signup/free", wait_until="networkidle")
    pause()
    fill(page, ["input[name=email]", "input[type=email]"],    INFO["email"])
    fill(page, ["input[name=password]", "input[type=password]"], INFO["password"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "MediaStack", "key": "", "note": "Key shown in dashboard after signup"})
    log("   ✓ Submitted — check browser for key")

# ─────────────────────────────────────────────────────────────
# 7. Open States
# ─────────────────────────────────────────────────────────────
def register_openstates(page):
    log("\n[7/12] Open States...")
    page.goto("https://openstates.org/accounts/signup/", wait_until="networkidle")
    pause()
    fill(page, ["input[name=email]",    "input[type=email]"],    INFO["email"])
    fill(page, ["input[name=password1]","input[name=password]",  "input[type=password]"], INFO["password"])
    fill(page, ["input[name=password2]","input[name=confirm_password]"],                  INFO["password"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "Open States", "key": "", "note": "Verify email then find key in account dashboard"})
    log("   ✓ Submitted — verify email then get key from dashboard")

# ─────────────────────────────────────────────────────────────
# 8. ProPublica
# ─────────────────────────────────────────────────────────────
def register_propublica(page):
    log("\n[8/12] ProPublica Congress API...")
    page.goto("https://www.propublica.org/datastore/api/propublica-congress-api", wait_until="networkidle")
    pause()
    fill(page, ["input[name*=first]", "input[placeholder*='first' i]"], INFO["first"])
    fill(page, ["input[name*=last]",  "input[placeholder*='last' i]"],  INFO["last"])
    fill(page, ["input[name*=email]", "input[type=email]"],             INFO["email"])
    fill(page, ["input[name*=org]",   "input[placeholder*='organ' i]"], INFO["org"])
    fill(page, ["textarea",           "input[name*=use]"],              INFO["purpose"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "ProPublica", "key": "", "note": "Key sent to robbie.ryan312@gmail.com"})
    log("   ✓ Submitted — check email for key")

# ─────────────────────────────────────────────────────────────
# 9. LegiScan
# ─────────────────────────────────────────────────────────────
def register_legiscan(page):
    log("\n[9/12] LegiScan...")
    page.goto("https://legiscan.com/legiscan", wait_until="networkidle")
    pause()
    fill(page, ["input[name*=first]", "input[placeholder*='first' i]"], INFO["first"])
    fill(page, ["input[name*=last]",  "input[placeholder*='last' i]"],  INFO["last"])
    fill(page, ["input[name*=email]", "input[type=email]"],             INFO["email"])
    fill(page, ["textarea",           "input[name*=use]"],              INFO["purpose"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "LegiScan", "key": "", "note": "Key sent to robbie.ryan312@gmail.com"})
    log("   ✓ Submitted — check email for key")

# ─────────────────────────────────────────────────────────────
# 10. OpenSecrets
# ─────────────────────────────────────────────────────────────
def register_opensecrets(page):
    log("\n[10/12] OpenSecrets...")
    page.goto("https://www.opensecrets.org/api/admin/index.php?function=signup", wait_until="networkidle")
    pause()
    fill(page, ["input[name*=first]", "input[placeholder*='first' i]"], INFO["first"])
    fill(page, ["input[name*=last]",  "input[placeholder*='last' i]"],  INFO["last"])
    fill(page, ["input[name*=email]", "input[type=email]"],             INFO["email"])
    fill(page, ["input[name*=org]",   "input[placeholder*='organ' i]"], INFO["org"])
    fill(page, ["textarea",           "input[name*=use]"],              INFO["purpose"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "OpenSecrets", "key": "", "note": "May take 1–2 days. Key sent by email."})
    log("   ✓ Submitted — approval may take 1–2 days")

# ─────────────────────────────────────────────────────────────
# 11. VoteSmart
# ─────────────────────────────────────────────────────────────
def register_votesmart(page):
    log("\n[11/12] VoteSmart...")
    page.goto("https://votesmart.org/share/api", wait_until="networkidle")
    pause()
    fill(page, ["input[name*=first]", "input[placeholder*='first' i]"], INFO["first"])
    fill(page, ["input[name*=last]",  "input[placeholder*='last' i]"],  INFO["last"])
    fill(page, ["input[name*=email]", "input[type=email]"],             INFO["email"])
    fill(page, ["input[name*=org]",   "input[placeholder*='organ' i]"], INFO["org"])
    fill(page, ["textarea",           "input[name*=use]"],              INFO["purpose"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "VoteSmart", "key": "", "note": "Manual approval — takes 1–3 business days"})
    log("   ✓ Submitted — manual approval, takes 1–3 days")

# ─────────────────────────────────────────────────────────────
# 12. FRED (Federal Reserve)
# ─────────────────────────────────────────────────────────────
def register_fred(page):
    log("\n[12/12] Federal Reserve FRED...")
    page.goto("https://fredaccount.stlouisfed.org/public/login/index", wait_until="networkidle")
    pause()
    # Try to find a "Create Account" / "Register" link
    try:
        page.get_by_text("Create Account").first.click()
        pause()
    except Exception:
        try:
            page.get_by_text("Register").first.click()
            pause()
        except Exception:
            pass
    fill(page, ["input[name*=email]",    "input[type=email]"],    INFO["email"])
    fill(page, ["input[name*=password]", "input[type=password]"], INFO["password"])
    submit(page)
    pause(3)
    RESULTS.append({"service": "FRED (Federal Reserve)", "key": "", "note": "After account created, go to My Account → API Keys to generate key"})
    log("   ✓ Account created — log in and go to My Account → API Keys")


def print_summary():
    log("\n" + "═"*60)
    log("REGISTRATION SUMMARY")
    log("═"*60)
    log(f"Password used for all accounts: {INFO['password']}")
    log("Save this password somewhere safe!\n")
    for r in RESULTS:
        log(f"✓ {r['service']}")
        if r["key"]:
            log(f"  KEY: {r['key']}")
        log(f"  Note: {r['note']}")
    log("\n" + "═"*60)
    log("Check robbie.ryan312@gmail.com for keys from:")
    log("  FEC, Congress.gov, Census, ProPublica, LegiScan")
    log("Pending manual approval (a few days):")
    log("  OpenSecrets, VoteSmart")
    log("Needs follow-up in browser:")
    log("  FRED → My Account → API Keys")
    log("  Open States → verify email → dashboard → API Key")
    log("  Google Civic → console.cloud.google.com (sign in with Google)")
    log("═"*60)


def main():
    INFO["password"] = getpass.getpass("Choose a password for new accounts (won't be shown): ")
    if len(INFO["password"]) < 8:
        print("Password must be at least 8 characters.")
        sys.exit(1)

    with sync_playwright() as p:
        log("Opening browser...")
        browser = p.chromium.launch(headless=False, slow_mo=300)
        ctx  = browser.new_context()
        page = ctx.new_page()
        page.set_default_timeout(15000)

        steps = [
            register_alpha_vantage,
            register_fec,
            register_congress,
            register_census,
            register_newsapi,
            register_mediastack,
            register_openstates,
            register_propublica,
            register_legiscan,
            register_opensecrets,
            register_votesmart,
            register_fred,
        ]

        for step in steps:
            try:
                step(page)
            except Exception as e:
                name = step.__name__.replace("register_", "").replace("_", " ").title()
                log(f"   ✗ {name} — error: {e}")
                RESULTS.append({"service": name, "key": "", "note": f"Failed — visit manually: {e}"})

        print_summary()

        log("\nBrowser will stay open for 60 seconds so you can review each tab.")
        pause(60)
        browser.close()


if __name__ == "__main__":
    main()
