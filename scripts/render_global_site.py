#!/usr/bin/env python3
"""Pre-render the latest global snapshot into global.html for crawlers."""
import argparse
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "global-snapshots.json"
COUNTRIES_FILE = ROOT / "assets" / "world-countries.geojson"
TEMPLATE = ROOT / "global.html"


def country_names():
    world = json.loads(COUNTRIES_FILE.read_text(encoding="utf-8"))
    names = {}
    for feature in world.get("features", []):
        properties = feature.get("properties", {})
        code = properties.get("ISO_A2_EH") or properties.get("ISO_A2")
        if isinstance(code, str) and len(code) == 2 and code != "-9":
            names[code] = properties.get("ADMIN") or properties.get("NAME_EN") or code
    return names


def render_country_ranking(countries, names):
    ranked = sorted(
        ((code, stats) for code, stats in countries.items() if code not in {"XX", "ZZ"}),
        key=lambda item: (-sum(item[1].get("certificates", {}).values()), item[0]),
    )[:12]
    buttons = []
    for rank, (code, stats) in enumerate(ranked, start=1):
        name = html.escape(names.get(code, code))
        buttons.append(
            f'<li><button type="button" class="country-rank-button" data-country-code="{html.escape(code)}">'
            f'<span class="country-rank-number">{rank:02}</span>'
            f'<span class="country-rank-name">{name}</span>'
            f'<strong class="country-rank-count">{sum(stats.get("certificates", {}).values()):,}</strong>'
            f'</button></li>'
        )
    return "".join(buttons)


def render_certificates(counts, badges):
    certs = sorted(counts, key=lambda name: (-counts[name], name))
    cards = []
    for index, cert in enumerate(certs, start=1):
        name = html.escape(cert)
        image_url = badges.get(cert, "")
        image = (
            f'<img src="{html.escape(image_url, quote=True)}" alt="{name} Badge" loading="lazy">'
            if image_url.startswith("https://") else ""
        )
        cards.append(
            f'<article class="cert-card"><div class="badge-frame">{image}'
            f'<span class="badge-fallback">{html.escape(cert[:1])}</span></div>'
            f'<div class="cert-info"><span class="cert-kicker">GLOBAL CERTIFICATE {index:02}</span>'
            f'<h3>{name}</h3><div class="cert-count"><strong>{counts[cert]:,}</strong><span>holders</span></div></div></article>'
        )
    return certs, "".join(cards)


def render(output_path):
    history = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    snapshots = history.get("snapshots", [])
    if not snapshots:
        raise RuntimeError("No global snapshots are available to render.")
    latest = snapshots[-1]
    countries = latest.get("countries", {})
    unassigned_accounts = latest.get("unknown_country_accounts", 0) + sum(
        countries.get(code, {}).get("accounts", 0) for code in ("XX", "ZZ")
    )
    counts = latest.get("certificates", {})
    certs, cards = render_certificates(counts, latest.get("certificate_badges", {}))
    description = (
        f"Explore {latest.get('total_accounts', 0):,} public OffSec leaderboard accounts across "
        f"{latest.get('countries_with_accounts', 0):,} countries and regions, with {len(certs)} certificate types. "
        f"Updated {latest['date']}."
    )
    template = TEMPLATE.read_text(encoding="utf-8")
    replacements = {
        '<meta name="description" content="Explore public OffSec certificate counts worldwide on an interactive, rotatable globe.">':
            f'<meta name="description" content="{html.escape(description, quote=True)}">',
        '<meta property="og:description" content="Explore public OffSec certificate counts worldwide on an interactive, rotatable globe.">':
            f'<meta property="og:description" content="{html.escape(description, quote=True)}">',
        '<strong id="global-snapshot-date">—</strong>':
            f'<strong id="global-snapshot-date">{html.escape(latest["date"])}</strong>',
        '<span id="global-snapshot-count">Loading history…</span>':
            f'<span id="global-snapshot-count">{len(snapshots):,} daily global snapshots</span>',
        '<strong id="global-total-count">—</strong>':
            f'<strong id="global-total-count">{latest.get("total_accounts", 0):,}</strong>',
        '<span id="global-account-reconciliation"></span>':
            f'<span id="global-account-reconciliation">(API reports {latest.get("reported_total_accounts", latest.get("total_accounts", 0)):,})</span>',
        '<strong id="global-credentialed-count">—</strong>':
            f'<strong id="global-credentialed-count">{latest.get("accounts_with_credentials", 0):,}</strong>',
        '<strong id="global-country-count">—</strong>':
            f'<strong id="global-country-count">{latest.get("countries_with_accounts", 0):,}</strong>',
        '<span id="global-unknown-count">—</span>':
            f'<span id="global-unknown-count">{latest.get("unknown_country_accounts", 0):,}</span>',
        '<strong id="unknown-country-accounts">—</strong>':
            f'<strong id="unknown-country-accounts">{unassigned_accounts:,}</strong>',
        '<strong id="global-cert-count">—</strong>':
            f'<strong id="global-cert-count">{len(certs):,}</strong>',
        '<span id="ranking-count">—</span>':
            f'<span id="ranking-count">{min(len(countries), 12)} countries</span>',
        '<ol id="country-ranking" class="country-ranking"></ol>':
            f'<ol id="country-ranking" class="country-ranking">{render_country_ranking(countries, country_names())}</ol>',
        '<span id="global-cert-section-count">—</span>':
            f'<span id="global-cert-section-count">{len(certs):,}</span>',
        '<div id="global-cert-grid" class="cert-grid" aria-live="polite"></div>':
            f'<div id="global-cert-grid" class="cert-grid" aria-live="polite">{cards}</div>',
    }
    for before, after in replacements.items():
        if before not in template:
            raise RuntimeError(f"Could not find template marker: {before}")
        template = template.replace(before, after, 1)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(template, encoding="utf-8")
    print(f"Rendered global page with {len(countries)} countries and {len(certs)} certificates.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True, help="Path to the rendered global.html")
    args = parser.parse_args()
    render(args.output)


if __name__ == "__main__":
    main()
