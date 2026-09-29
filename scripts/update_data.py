#!/usr/bin/env python3
"""Fetch and append a daily snapshot of Taiwan OffSec leaderboard credentials."""
import json
import os
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "snapshots.json"
API = "https://portal.offsec.com/services/competitions/v1/leaderboard/global"


def main():
    params = urllib.parse.urlencode({
        "limit": 1000,
        "offset": 0,
        "timeFilter": "ALL_TIME",
        "countryCode": "TW",
    })
    request = urllib.request.Request(
        f"{API}?{params}", headers={"User-Agent": "Taiwan-OffSec-Cert-Tracker/1.0"}
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.load(response)

    rows = payload.get("data")
    if not isinstance(rows, list) or not rows:
        raise RuntimeError("API returned no leaderboard rows; keeping previous history.")
    # The current endpoint returns the full country result with limit=1000. Fail
    # closed if that changes, rather than silently recording a partial snapshot.
    if payload.get("hasNext"):
        raise RuntimeError("API indicates more pages; refusing to save a partial snapshot.")

    cert_counts = Counter()
    credentialed_accounts = 0
    for row in rows:
        certs = {
            item.get("shortName")
            for item in (row.get("credentials") or [])
            if item.get("type") == "certificate" and item.get("shortName")
        }
        if certs:
            credentialed_accounts += 1
            cert_counts.update(certs)

    snapshot = {
        "date": datetime.now(ZoneInfo("Asia/Taipei")).date().isoformat(),
        "total_accounts": payload.get("count", len(rows)),
        "accounts_with_credentials": credentialed_accounts,
        "accounts_without_credentials": len(rows) - credentialed_accounts,
        "certificates": dict(sorted(cert_counts.items())),
        "source": API,
    }

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    if DATA_FILE.exists():
        history = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    else:
        history = {"timezone": "Asia/Taipei", "snapshots": []}
    snapshots = history.setdefault("snapshots", [])
    # Make reruns on the same Taipei calendar day idempotent.
    snapshots = [item for item in snapshots if item.get("date") != snapshot["date"]]
    snapshots.append(snapshot)
    snapshots.sort(key=lambda item: item["date"])
    history["timezone"] = "Asia/Taipei"
    history["snapshots"] = snapshots
    DATA_FILE.write_text(json.dumps(history, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"Saved {snapshot['date']}: {snapshot['total_accounts']} accounts, "
        f"{credentialed_accounts} with credentials, {len(cert_counts)} certificate types."
    )


if __name__ == "__main__":
    main()
