#!/usr/bin/env python3
"""Render crawlable HTML and a sitemap from the latest daily snapshot."""
import argparse
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_URL = "https://mlgzackfly.github.io/offsec-tw-cert-tracker/"
TEMPLATE = ROOT / "index.html"
HISTORY_FILE = ROOT / "data" / "snapshots.json"


def render_podium(holders):
    display_order = [holders[1], holders[0], holders[2]] if len(holders) >= 3 else holders
    cards = []
    for fallback_rank, holder in enumerate(display_order, start=1):
        rank = holder.get("rank", fallback_rank)
        username = html.escape(str(holder.get("username") or "OffSec 使用者"))
        image_url = holder.get("profile_image", "")
        avatar = (
            f'<img src="{html.escape(image_url, quote=True)}" alt="{username} 的公開頭像" loading="lazy" referrerpolicy="no-referrer">'
            if image_url.startswith("https://") else ""
        )
        fallback = html.escape((holder.get("username") or "OS")[:2].upper())
        fallback_style = "" if avatar else ' style="display:grid"'
        credential_tags = "".join(
            f'<span class="holder-cert">{html.escape(cert)}</span>'
            for cert in holder.get("certificates", [])
        )
        labels = {1: "冠軍", 2: "亞軍", 3: "季軍"}
        cards.append(
            f'<article class="podium-card rank-{rank}">'
            f'<div class="podium-place"><span class="podium-medal">{rank}</span><span>{labels.get(rank, "排行")}</span></div>'
            f'<div class="avatar-frame">{avatar}<span class="avatar-fallback"{fallback_style}>{fallback}</span></div>'
            f'<div class="podium-info"><h3>{username}</h3>'
            f'<div class="podium-count"><strong>{holder.get("certificate_count", 0)}</strong><span>張證照</span></div>'
            f'<div class="holder-certs">{credential_tags}</div></div>'
            f'<div class="podium-step">NO. 0{rank}</div></article>'
        )
    return "".join(cards)


def render_certificates(counts, badges, previous, current_date):
    certs = sorted(counts, key=lambda cert: (-counts[cert], cert))
    cards = []
    for index, cert in enumerate(certs, start=1):
        safe_cert = html.escape(cert)
        image_url = badges.get(cert, "")
        image = (
            f'<img src="{html.escape(image_url, quote=True)}" alt="{safe_cert} Badge" loading="lazy">'
            if image_url.startswith("https://") else ""
        )
        delta_markup = ""
        if previous:
            before = previous.get("certificates", {}).get(cert, 0)
            delta = counts[cert] - before
            if delta:
                marker = f"▲ +{delta:,}" if delta > 0 else f"▼ −{abs(delta):,}"
                delta_markup = (
                    f'<span class="cert-count-delta" aria-label="較前一日 {delta:+,}" '
                    f'title="{html.escape(previous["date"])} → {html.escape(current_date)}">'
                    f'{marker}</span>'
                )
        cards.append(
            f'<article class="cert-card"><div class="badge-frame">{image}'
            f'<span class="badge-fallback">{html.escape(cert[:1])}</span></div>'
            f'<div class="cert-info"><span class="cert-kicker">CERTIFICATE {index:02}</span>'
            f'<h3>{safe_cert}</h3><div class="cert-count"><strong>{counts[cert]:,}</strong><span>人</span>{delta_markup}</div></div></article>'
        )
    return certs, "".join(cards)


def render_metric_delta(element_id, current, previous_count, previous_date, current_date):
    if previous_count is None:
        return f'<span class="metric-delta" id="{element_id}" aria-label="較前一日變化">—</span>'
    delta = current - previous_count
    if delta > 0:
        marker = f"▲ +{delta:,}"
    elif delta < 0:
        marker = f"▼ −{abs(delta):,}"
    else:
        marker = "— 0"
    return (
        f'<span class="metric-delta" id="{element_id}" '
        f'aria-label="較前一日 {delta:+,}" '
        f'title="{html.escape(previous_date)} → {html.escape(current_date)}">'
        f'{marker}</span>'
    )


def render(history, output_path):
    snapshots = history.get("snapshots", [])
    if not snapshots:
        raise RuntimeError("No snapshots are available to render.")
    latest = snapshots[-1]
    previous = snapshots[-2] if len(snapshots) > 1 else None
    compare_period = f'{previous["date"]} → {latest["date"]}' if previous else "累積第二日資料後顯示"
    counts = latest.get("certificates", {})
    badges = latest.get("certificate_badges", {})
    certs, certificate_cards = render_certificates(counts, badges, previous, latest["date"])
    template = TEMPLATE.read_text(encoding="utf-8")

    description = (
        f"統計台灣 OffSec 全球排行榜 {latest.get('total_accounts', 0):,} 個帳號與 {len(certs)} 種公開證照，"
        f"追蹤 OSCP、OSCP+、OSEP 等證照持有人數與持證照張數排行。每日更新至 {latest['date']}。"
    )
    replacements = {
        '<meta name="description" content="每日追蹤台灣 OffSec 帳號公開證照與持有人數。">':
            f'<meta name="description" content="{html.escape(description, quote=True)}">',
        '<meta property="og:description" content="每日追蹤台灣 OffSec 帳號公開證照與持有人數。">':
            f'<meta property="og:description" content="{html.escape(description, quote=True)}">',
        '<strong id="snapshot-date">—</strong>': f'<strong id="snapshot-date">{html.escape(latest["date"])}</strong>',
        '<span id="snapshot-count">載入歷史資料…</span>':
            f'<span id="snapshot-count">已累積 {len(snapshots):,} 日快照</span>',
        '<strong id="total-count">—</strong>':
            f'<strong id="total-count">{latest.get("total_accounts", 0):,}</strong>',
        '<strong id="credentialed-count">—</strong>':
            f'<strong id="credentialed-count">{latest.get("accounts_with_credentials", 0):,}</strong>',
        '<span class="metric-delta" id="delta-accounts" aria-label="較前一日變化">—</span>':
            render_metric_delta("delta-accounts", latest.get("total_accounts", 0), previous.get("total_accounts", 0) if previous else None, previous.get("date", "") if previous else "", latest["date"]),
        '<span class="metric-delta" id="delta-credentialed" aria-label="較前一日變化">—</span>':
            render_metric_delta("delta-credentialed", latest.get("accounts_with_credentials", 0), previous.get("accounts_with_credentials", 0) if previous else None, previous.get("date", "") if previous else "", latest["date"]),
        '<span id="credentialed-share">—</span>':
            f'<span id="credentialed-share">{(latest.get("accounts_with_credentials", 0) / max(latest.get("total_accounts", 0), 1) * 100):.1f}%</span>',
        '<span id="cert-type-count">—</span>': f'<span id="cert-type-count">{len(certs)}</span>',
        '<span id="cert-compare-period">較前一日</span>':
            f'<span id="cert-compare-period">{html.escape(compare_period)}</span>',
        '<div id="podium" class="podium" aria-live="polite"></div>':
            f'<div id="podium" class="podium" aria-live="polite">{render_podium(latest.get("top_holders", []))}</div>',
        '<div id="cert-grid" class="cert-grid" aria-live="polite"></div>':
            f'<div id="cert-grid" class="cert-grid" aria-live="polite">{certificate_cards}</div>',
    }
    for before, after in replacements.items():
        if before not in template:
            raise RuntimeError(f"Could not find template marker: {before}")
        template = template.replace(before, after, 1)

    schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "台灣 OffSec 證照觀察",
        "alternateName": "Taiwan OffSec Certificate Tracker",
        "url": SITE_URL,
        "inLanguage": "zh-TW",
    }
    schema_html = json.dumps(schema, ensure_ascii=False).replace("<", "\\u003c")
    template = template.replace('<script id="seo-schema" type="application/ld+json">{}</script>',
                                f'<script id="seo-schema" type="application/ld+json">{schema_html}</script>')

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(template, encoding="utf-8")
    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'  <url><loc>{SITE_URL}</loc><lastmod>{latest["date"]}</lastmod><changefreq>daily</changefreq></url>\n'
        '</urlset>\n'
    )
    (output_path.parent / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    (output_path.parent / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\nSitemap: {SITE_URL}sitemap.xml\n", encoding="utf-8"
    )
    print(f"Rendered crawlable page with {len(certs)} certificate entries and {len(snapshots)} snapshot(s).")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True, help="Path to the rendered index.html")
    args = parser.parse_args()
    history = json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
    render(history, args.output)


if __name__ == "__main__":
    main()
