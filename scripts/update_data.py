#!/usr/bin/env python3
"""Fetch and append a daily snapshot of Taiwan OffSec leaderboard credentials."""
import json
import math
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "snapshots.json"
CHART_FILE = ROOT / "assets" / "certificate-trends.svg"
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
    cert_badges = {}
    credentialed_accounts = 0
    holders = []
    for row in rows:
        certs = set()
        for item in row.get("credentials") or []:
            short_name = item.get("shortName")
            if item.get("type") != "certificate" or not short_name:
                continue
            certs.add(short_name)
            image_url = item.get("image")
            if image_url and short_name not in cert_badges:
                cert_badges[short_name] = image_url
        if certs:
            credentialed_accounts += 1
            cert_counts.update(certs)
            profile_image = row.get("profileImage") or ""
            if not profile_image.startswith("https://"):
                profile_image = ""
            holders.append({
                "username": row.get("username") or f"User {row.get('userId', '')}",
                "profile_image": profile_image,
                "certificate_count": len(certs),
                "certificates": sorted(certs),
                "score": float(row.get("score") or 0),
            })

    # Rank by number of distinct certificate names; use the leaderboard score
    # to break ties, preserving the API order for any remaining ties.
    holders.sort(key=lambda holder: (-holder["certificate_count"], -holder["score"]))
    top_holders = [
        {
            "rank": rank,
            "username": holder["username"],
            "profile_image": holder["profile_image"],
            "certificate_count": holder["certificate_count"],
            "certificates": holder["certificates"],
        }
        for rank, holder in enumerate(holders[:3], start=1)
    ]

    snapshot = {
        "date": datetime.now(ZoneInfo("Asia/Taipei")).date().isoformat(),
        "total_accounts": payload.get("count", len(rows)),
        "accounts_with_credentials": credentialed_accounts,
        "accounts_without_credentials": len(rows) - credentialed_accounts,
        "certificates": dict(sorted(cert_counts.items())),
        "certificate_badges": dict(sorted(cert_badges.items())),
        "top_holders": top_holders,
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
    write_trend_chart(history)
    print(
        f"Saved {snapshot['date']}: {snapshot['total_accounts']} accounts, "
        f"{credentialed_accounts} with credentials, {len(cert_counts)} certificate types."
    )


def write_trend_chart(history):
    snapshots = history.get("snapshots", [])
    if not snapshots:
        return

    latest_counts = snapshots[-1].get("certificates", {})
    certificates = sorted(latest_counts, key=lambda cert: (-latest_counts[cert], cert))[:5]
    colors = ["#e86c43", "#28715c", "#527da5", "#bd8b27", "#885e91"]
    width, height = 1000, 520
    left, right, top, bottom = 78, 36, 140, 78
    chart_width = width - left - right
    chart_height = height - top - bottom
    max_value = max((snapshot.get("certificates", {}).get(cert, 0)
                     for snapshot in snapshots for cert in certificates), default=1)
    scale_top = max(5, math.ceil(max_value / 50) * 50)

    def x(index):
        if len(snapshots) < 2:
            return left + chart_width / 2
        return left + index * chart_width / (len(snapshots) - 1)

    def y(value):
        return top + chart_height * (1 - value / scale_top)

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">Taiwan OffSec certificate holder trends</title>',
        '<desc id="desc">Daily counts for the five certificates with the most holders in the latest snapshot.</desc>',
        '<rect width="100%" height="100%" rx="12" fill="#fffefa"/>',
        '<text x="38" y="47" fill="#182d32" font-family="Arial,sans-serif" font-size="24" font-weight="700">Taiwan OffSec · Certificate holders</text>',
        f'<text x="38" y="74" fill="#737c77" font-family="Arial,sans-serif" font-size="13">Top certificates in the latest snapshot · {len(snapshots)} daily snapshot(s)</text>',
    ]

    legend_y = 111
    legend_step = 185
    for index, cert in enumerate(certificates):
        legend_x = 40 + index * legend_step
        parts.append(f'<circle cx="{legend_x + 6}" cy="{legend_y - 4}" r="5" fill="{colors[index]}"/>')
        parts.append(f'<text x="{legend_x + 18}" y="{legend_y}" fill="#355057" font-family="Arial,sans-serif" font-size="13">{escape(cert)}</text>')

    for step in range(5):
        value = scale_top * step / 4
        y_pos = y(value)
        parts.append(f'<line x1="{left}" y1="{y_pos:.1f}" x2="{width - right}" y2="{y_pos:.1f}" stroke="#e8e5dc" stroke-width="1"/>')
        parts.append(f'<text x="{left - 12}" y="{y_pos + 4:.1f}" text-anchor="end" fill="#8b928b" font-family="Arial,sans-serif" font-size="11">{round(value)}</text>')

    for index, cert in enumerate(certificates):
        points = [
            (x(point_index), y(snapshot.get("certificates", {}).get(cert, 0)))
            for point_index, snapshot in enumerate(snapshots)
        ]
        if len(points) > 1:
            path = " ".join(f"{'M' if point_index == 0 else 'L'} {point_x:.1f} {point_y:.1f}"
                            for point_index, (point_x, point_y) in enumerate(points))
            parts.append(f'<path d="{path}" fill="none" stroke="{colors[index]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
        for point_x, point_y in points:
            parts.append(f'<circle cx="{point_x:.1f}" cy="{point_y:.1f}" r="4.5" fill="{colors[index]}" stroke="#fffefa" stroke-width="2"/>')

    date_indices = sorted({0, len(snapshots) // 2, len(snapshots) - 1})
    for index in date_indices:
        date = escape(snapshots[index].get("date", ""))
        anchor = "start" if index == 0 else "end" if index == len(snapshots) - 1 else "middle"
        parts.append(f'<text x="{x(index):.1f}" y="{height - 42}" text-anchor="{anchor}" fill="#8b928b" font-family="Arial,sans-serif" font-size="11">{date}</text>')

    if len(snapshots) == 1:
        note = "Trend tracking has started. More daily snapshots will build the lines over time."
        parts.append(f'<text x="{width / 2}" y="{height - 12}" text-anchor="middle" fill="#8b928b" font-family="Arial,sans-serif" font-size="11">{note}</text>')
    else:
        parts.append(f'<text x="{width / 2}" y="{height - 12}" text-anchor="middle" fill="#8b928b" font-family="Arial,sans-serif" font-size="11">Snapshot dates use Asia/Taipei · Source: OffSec public leaderboard</text>')
    parts.append('</svg>')

    CHART_FILE.parent.mkdir(parents=True, exist_ok=True)
    CHART_FILE.write_text("\n".join(parts) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
