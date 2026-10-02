#!/usr/bin/env python3
"""Fetch and aggregate the full OffSec leaderboard into a global snapshot."""
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "global-snapshots.json"
API = "https://portal.offsec.com/services/competitions/v1/leaderboard/global"
PAGE_SIZE = 1000
PAGE_OVERLAP = 300
RETRIES = 5


def fetch_page(offset):
    params = urllib.parse.urlencode({
        "limit": PAGE_SIZE,
        "offset": offset,
        "timeFilter": "ALL_TIME",
    })
    request = urllib.request.Request(
        f"{API}?{params}", headers={"User-Agent": "OffSec-Global-Cert-Tracker/1.0"}
    )
    for attempt in range(RETRIES):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code not in (408, 425, 429, 500, 502, 503, 504) or attempt == RETRIES - 1:
                raise
            delay = int(error.headers.get("Retry-After", 0) or 0) or min(2 ** attempt, 30)
            time.sleep(delay)
        except (TimeoutError, urllib.error.URLError):
            if attempt == RETRIES - 1:
                raise
            time.sleep(min(2 ** attempt, 30))


def main():
    seen_user_ids = set()
    expected_count = None
    offset = 0
    last_progress = 0
    certificate_counts = Counter()
    certificate_badges = {}
    country_accounts = defaultdict(int)
    country_credentialed = defaultdict(int)
    country_certificates = defaultdict(Counter)
    total_credentialed = 0
    unknown_country_accounts = 0

    def collect_row(row, fallback_id):
        nonlocal total_credentialed, unknown_country_accounts
        account_id = row.get("userId")
        account_id = str(account_id) if account_id is not None else f"offset:{fallback_id}"
        if account_id in seen_user_ids:
            return
        seen_user_ids.add(account_id)

        country = row.get("country")
        country = country.upper() if isinstance(country, str) and re.fullmatch(r"[A-Za-z]{2}", country) else None
        if country:
            country_accounts[country] += 1
        else:
            unknown_country_accounts += 1

        credentials = row.get("credentials") or []
        certs = {
            item.get("shortName")
            for item in credentials
            if item.get("type") == "certificate" and item.get("shortName")
        }
        for item in credentials:
            name = item.get("shortName")
            image = item.get("image")
            if item.get("type") == "certificate" and name and image and name not in certificate_badges:
                certificate_badges[name] = image
        if certs:
            total_credentialed += 1
            certificate_counts.update(certs)
            if country:
                country_credentialed[country] += 1
                country_certificates[country].update(certs)

    while True:
        payload = fetch_page(offset)
        rows = payload.get("data")
        if not isinstance(rows, list) or not rows:
            raise RuntimeError(f"API returned an empty or invalid page at offset {offset}.")
        page_count = payload.get("count")
        if not isinstance(page_count, int) or page_count < 1:
            raise RuntimeError("API did not provide a valid global account count.")
        expected_count = page_count

        for index, row in enumerate(rows):
            collect_row(row, offset + index)

        offset += PAGE_SIZE - PAGE_OVERLAP
        if not payload.get("hasNext"):
            break
        if offset >= expected_count:
            raise RuntimeError("API still reports another page after its reported account count.")
        progress = len(seen_user_ids) // 10000
        if progress > last_progress:
            print(f"Collected {len(seen_user_ids):,} / {expected_count:,} unique accounts.", flush=True)
            last_progress = progress
        time.sleep(0.15)

    countries = {
        country: {
            "accounts": country_accounts[country],
            "accounts_with_credentials": country_credentialed[country],
            "certificates": dict(sorted(country_certificates[country].items())),
        }
        for country in sorted(country_accounts)
    }
    snapshot = {
        "date": datetime.now(ZoneInfo("Asia/Taipei")).date().isoformat(),
        "total_accounts": len(seen_user_ids),
        "reported_total_accounts": expected_count,
        "accounts_with_credentials": total_credentialed,
        "accounts_without_credentials": len(seen_user_ids) - total_credentialed,
        "countries_with_accounts": len(countries),
        "countries_with_credentialed_accounts": sum(
            1 for count in country_credentialed.values() if count
        ),
        "unknown_country_accounts": unknown_country_accounts,
        "certificates": dict(sorted(certificate_counts.items())),
        "certificate_badges": dict(sorted(certificate_badges.items())),
        "countries": countries,
        "source": API,
    }

    if DATA_FILE.exists():
        history = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    else:
        history = {"timezone": "Asia/Taipei", "snapshots": []}
    snapshots = [item for item in history.get("snapshots", []) if item.get("date") != snapshot["date"]]
    snapshots.append(snapshot)
    snapshots.sort(key=lambda item: item["date"])
    history["timezone"] = "Asia/Taipei"
    history["snapshots"] = snapshots
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(history, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(
        f"Saved global snapshot {snapshot['date']}: {snapshot['total_accounts']:,} accounts, "
        f"{total_credentialed:,} with credentials, {len(countries)} countries, "
        f"{len(certificate_counts)} certificate types."
    )


if __name__ == "__main__":
    main()
