#!/usr/bin/env python3
"""
API Registration — Full Automation v3
Run: python3 ~/register_apis.py
"""
from playwright.sync_api import sync_playwright
import time, sys, getpass

INFO = {
    "first":    "Robert",
    "last":     "Ryan",
    "email":    "robbie.ryan312@gmail.com",
    "org":      "Independent",
    "purpose":  "Non-commercial civic transparency app displaying objective, sourced voting records, campaign finance data, and documented public positions of elected officials to help voters make informed decisions.",
    "password": "",
}

DONE = []

def log(msg): print(msg, flush=True)
def snooze(n): time.sleep(n)

def smart_fill(page, value, labels=(), placeholders=(), css=()):
    for label in labels:
        try:
            el = page.get_by_label(label, exact=False)
            if el.count() and el.first.is_visible(timeout=2000):
                el.first.click(); snooze(0.2); el.first.fill(value); return True
        except: pass
    for ph in placeholders:
        try:
            el = page.get_by_placeholder(ph, exact=False)
            if el.count() and el.first.is_visible(timeout=2000):
                el.first.click(); snooze(0.2); el.first.fill(value); return True
        except: pass
    for sel in css:
        try:
            el = page.locator(sel).first
            if el.count() and el.is_visible(timeout=2000):
                el.click(); snooze(0.2); el.fill(value); return True
        except: pass
    return False

def smart_submit(page):
    for method in [
        lambda: page.get_by_role("button", name="Submit").first.click(),
        lambda: page.get_by_role("button", name="Sign Up").first.click(),
        lambda: page.get_by_role("button", name="Register").first.click(),
        lambda: page.get_by_role("button", name="Create Account").first.click(),
        lambda: page.get_by_role("button", name="Get API Key").first.click(),
        lambda: page.get_by_role("button", name="Request").first.click(),
        lambda: page.locator("button[type=submit]").first.click(),
        lambda: page.locator("input[type=submit]").first.click(),
    ]:
        try: method(); return True
        except: pass
    return False

def go(page, name, url, actions, note):
    log(f"\n→ {name}")
    try:
        page.goto(url, wait_until="networkidle", timeout=30000)
        snooze(3)
        for action in actions:
            action(page)
            snooze(0.5)
        smart_submit(page)
        snooze(4)
        DONE.append(f"✓  {name} — {note}")
        log(f"   submitted")
    except Exception as e:
        DONE.append(f"✗  {name} — FAILED ({str(e)[:60]})")
        log(f"   failed: {e}")

def main():
    INFO["password"] = getpass.getpass("Password for new accounts (8+ chars): ")
    if len(INFO["password"]) < 8: sys.exit("Need 8+ characters.")

    f, l, e, o, pu, pw = (INFO["first"], INFO["last"], INFO["email"],
                           INFO["org"], INFO["purpose"], INFO["password"])

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=150)
        page = browser.new_context(viewport={"width":1280,"height":900}).new_page()
        page.set_default_timeout(12000)

        # 1 ── Alpha Vantage ──────────────────────────────────────────────────
        go(page, "Alpha Vantage", "https://www.alphavantage.co/support/#api-key", [
            lambda pg: smart_fill(pg, e, labels=["Email","Your email","E-mail"], placeholders=["email","Email"], css=["input[type=email]","input[name=email]"]),
            lambda pg: smart_fill(pg, o, labels=["Organization","Company"], placeholders=["organization","company"], css=["input[name=organization]"]),
        ], "KEY SHOWN ON PAGE — note it before closing")

        # 2 ── FEC ────────────────────────────────────────────────────────────
        go(page, "FEC / api.data.gov", "https://api.data.gov/signup/", [
            lambda pg: smart_fill(pg, f, labels=["First Name","First name"], placeholders=["First name","first name"], css=["input[name=user_first_name]","input[name*=first]"]),
            lambda pg: smart_fill(pg, l, labels=["Last Name","Last name"], placeholders=["Last name","last name"], css=["input[name=user_last_name]","input[name*=last]"]),
            lambda pg: smart_fill(pg, e, labels=["Email","Email address"], placeholders=["email"], css=["input[type=email]","input[name=user_email]"]),
            lambda pg: smart_fill(pg, pu, labels=["How will you use","Use","Purpose"], placeholders=["How will you use","describe"], css=["textarea","input[name=user_how_hear]"]),
        ], "key emailed to robbie.ryan312@gmail.com")

        # 3 ── Congress.gov ───────────────────────────────────────────────────
        go(page, "Congress.gov", "https://api.congress.gov/sign-up/", [
            lambda pg: smart_fill(pg, f, labels=["First Name"], placeholders=["First name"], css=["input[name*=first]"]),
            lambda pg: smart_fill(pg, l, labels=["Last Name"], placeholders=["Last name"], css=["input[name*=last]"]),
            lambda pg: smart_fill(pg, e, labels=["Email"], placeholders=["Email"], css=["input[type=email]"]),
            lambda pg: smart_fill(pg, o, labels=["Organization"], placeholders=["Organization"], css=["input[name*=org]"]),
            lambda pg: smart_fill(pg, pu, labels=["Purpose","Use","How will you use"], placeholders=["purpose","use"], css=["textarea"]),
        ], "key emailed to robbie.ryan312@gmail.com")

        # 4 ── Census ─────────────────────────────────────────────────────────
        go(page, "Census Bureau", "https://api.census.gov/data/key_signup.html", [
            lambda pg: smart_fill(pg, e, labels=["Email","Email Address"], placeholders=["email"], css=["input[type=email]"]),
            lambda pg: smart_fill(pg, o, labels=["Organization"], placeholders=["Organization"], css=["input[name*=org]"]),
        ], "key emailed to robbie.ryan312@gmail.com")

        # 5 ── NewsAPI ────────────────────────────────────────────────────────
        go(page, "NewsAPI", "https://newsapi.org/register", [
            lambda pg: smart_fill(pg, f, labels=["First name","First Name"], placeholders=["First name"], css=["input[name=firstName]"]),
            lambda pg: smart_fill(pg, l, labels=["Last name","Last Name"], placeholders=["Last name"], css=["input[name=lastName]"]),
            lambda pg: smart_fill(pg, e, labels=["Email"], placeholders=["Email address","email"], css=["input[name=email]","input[type=email]"]),
            lambda pg: smart_fill(pg, pw, labels=["Password"], placeholders=["Password"], css=["input[type=password]"]),
        ], "key shown in dashboard after login")

        # 6 ── MediaStack ─────────────────────────────────────────────────────
        go(page, "MediaStack", "https://mediastack.com/signup/free", [
            lambda pg: smart_fill(pg, e, labels=["Email","Email Address"], placeholders=["email"], css=["input[type=email]"]),
            lambda pg: smart_fill(pg, pw, labels=["Password"], placeholders=["Password"], css=["input[type=password]"]),
        ], "key shown in dashboard after login")

        # 7 ── Open States ────────────────────────────────────────────────────
        go(page, "Open States", "https://openstates.org/accounts/signup/", [
            lambda pg: smart_fill(pg, e, labels=["Email","Email Address"], placeholders=["email"], css=["input[name=email]","input[type=email]"]),
            lambda pg: smart_fill(pg, pw, labels=["Password"], placeholders=["Password"], css=["input[name=password1]","input[type=password]"]),
            lambda pg: smart_fill(pg, pw, labels=["Password (again)","Confirm"], placeholders=["Confirm","again"], css=["input[name=password2]"]),
        ], "verify email then get key from dashboard")

        # 8 ── ProPublica ─────────────────────────────────────────────────────
        go(page, "ProPublica", "https://www.propublica.org/datastore/api/propublica-congress-api", [
            lambda pg: smart_fill(pg, f, labels=["First Name"], placeholders=["First name"], css=["input[name*=first]"]),
            lambda pg: smart_fill(pg, l, labels=["Last Name"], placeholders=["Last name"], css=["input[name*=last]"]),
            lambda pg: smart_fill(pg, e, labels=["Email"], placeholders=["Email"], css=["input[type=email]"]),
            lambda pg: smart_fill(pg, o, labels=["Organization"], placeholders=["Organization"], css=["input[name*=org]"]),
            lambda pg: smart_fill(pg, pu, labels=["Intended Use","How will you use","Use"], placeholders=["intended use","how will"], css=["textarea"]),
        ], "key emailed to robbie.ryan312@gmail.com")

        # 9 ── LegiScan ───────────────────────────────────────────────────────
        go(page, "LegiScan", "https://legiscan.com/legiscan", [
            lambda pg: smart_fill(pg, f, labels=["First Name"], placeholders=["First"], css=["input[name*=first]"]),
            lambda pg: smart_fill(pg, l, labels=["Last Name"], placeholders=["Last"], css=["input[name*=last]"]),
            lambda pg: smart_fill(pg, e, labels=["Email"], placeholders=["Email"], css=["input[type=email]"]),
            lambda pg: smart_fill(pg, pu, labels=["Use","Purpose","How will"], placeholders=["use","purpose"], css=["textarea"]),
        ], "key emailed to robbie.ryan312@gmail.com")

        # 10 ── OpenSecrets ───────────────────────────────────────────────────
        go(page, "OpenSecrets", "https://www.opensecrets.org/api/admin/index.php?function=signup", [
            lambda pg: smart_fill(pg, f, labels=["First Name"], placeholders=["First"], css=["input[name*=first]"]),
            lambda pg: smart_fill(pg, l, labels=["Last Name"], placeholders=["Last"], css=["input[name*=last]"]),
            lambda pg: smart_fill(pg, e, labels=["Email"], placeholders=["Email"], css=["input[type=email]"]),
            lambda pg: smart_fill(pg, o, labels=["Organization"], placeholders=["Organization"], css=["input[name*=org]"]),
            lambda pg: smart_fill(pg, pu, labels=["Use","Purpose","Describe"], placeholders=["use","purpose"], css=["textarea"]),
        ], "manual approval 1-2 days — key emailed when approved")

        # 11 ── VoteSmart ─────────────────────────────────────────────────────
        go(page, "VoteSmart", "https://votesmart.org/share/api", [
            lambda pg: smart_fill(pg, f, labels=["First Name"], placeholders=["First"], css=["input[name*=first]"]),
            lambda pg: smart_fill(pg, l, labels=["Last Name"], placeholders=["Last"], css=["input[name*=last]"]),
            lambda pg: smart_fill(pg, e, labels=["Email"], placeholders=["Email"], css=["input[type=email]"]),
            lambda pg: smart_fill(pg, o, labels=["Organization"], placeholders=["Organization"], css=["input[name*=org]"]),
            lambda pg: smart_fill(pg, pu, labels=["Use","Purpose","How will"], placeholders=["use","purpose"], css=["textarea"]),
        ], "manual approval 1-3 days — key emailed when approved")

        # 12 ── FRED ──────────────────────────────────────────────────────────
        go(page, "FRED (Federal Reserve)", "https://fredaccount.stlouisfed.org/public/login/index", [
            lambda pg: (
                page.get_by_text("Create Account").click() if page.get_by_text("Create Account").count() else None
            ),
            lambda pg: smart_fill(pg, e, labels=["Email"], placeholders=["email"], css=["input[type=email]"]),
            lambda pg: smart_fill(pg, pw, labels=["Password"], placeholders=["password"], css=["input[type=password]"]),
        ], "after signup: My Account → API Keys → Request Key")

        # ── Summary ──────────────────────────────────────────────────────────
        log(f"\n{'='*55}")
        log("DONE — RESULTS")
        log(f"{'='*55}")
        for line in DONE: log(f"  {line}")
        log(f"\n  Password used: {pw}  ← SAVE THIS")
        log("\n  Check robbie.ryan312@gmail.com for keys from:")
        log("  FEC, Congress.gov, Census, ProPublica, LegiScan")
        log("\n  Pending approval (1-3 days): OpenSecrets, VoteSmart")
        log("\n  Do manually: Google Civic → console.cloud.google.com")
        log("  New project 'CivicApp' → Enable Civic Information API → Create API Key")
        log(f"{'='*55}")

        snooze(90)
        browser.close()

if __name__ == "__main__":
    main()
