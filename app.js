const numberFormat = new Intl.NumberFormat('zh-TW');
let snapshots = [];
let latest = {};

async function init() {
  try {
    const response = await fetch('./data/snapshots.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const history = await response.json();
    snapshots = history.snapshots || [];
    if (!snapshots.length) throw new Error('目前沒有統計快照');
    latest = snapshots[snapshots.length - 1];
    render();
  } catch (error) {
    document.querySelector('#snapshot-date').textContent = '資料讀取失敗';
    document.querySelector('#snapshot-count').textContent = error.message;
  }
}

function render() {
  const counts = latest.certificates || {};
  const certs = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const certificateBadges = latest.certificate_badges || {};

  document.querySelector('#snapshot-date').textContent = latest.date || '—';
  document.querySelector('#snapshot-count').textContent = `已累積 ${numberFormat.format(snapshots.length)} 日快照`;
  document.querySelector('#total-count').textContent = numberFormat.format(latest.total_accounts || 0);
  document.querySelector('#credentialed-count').textContent = numberFormat.format(latest.accounts_with_credentials || 0);
  const share = latest.total_accounts
    ? ((latest.accounts_with_credentials / latest.total_accounts) * 100).toFixed(1)
    : '0.0';
  document.querySelector('#credentialed-share').textContent = `${share}%`;
  document.querySelector('#cert-type-count').textContent = numberFormat.format(certs.length);

  const select = document.querySelector('#chart-cert');
  select.replaceChildren(...certs.map(cert => new Option(cert, cert)));
  select.addEventListener('change', drawChart);
  renderCertificateCards(certs, certificateBadges);
  drawChart();
}

function renderCertificateCards(certs, badges) {
  const grid = document.querySelector('#cert-grid');
  grid.replaceChildren();

  certs.forEach((cert, index) => {
    const card = document.createElement('article');
    card.className = 'cert-card';

    const badgeFrame = document.createElement('div');
    badgeFrame.className = 'badge-frame';
    const badge = document.createElement('img');
    badge.src = badges[cert] || fallbackBadgeUrl(cert);
    badge.alt = `${cert} Badge`;
    badge.loading = 'lazy';
    const fallback = document.createElement('span');
    fallback.className = 'badge-fallback';
    fallback.textContent = cert.slice(0, 1);
    badge.addEventListener('error', () => {
      badge.hidden = true;
      fallback.style.display = 'grid';
    }, { once: true });
    badgeFrame.append(badge, fallback);

    const info = document.createElement('div');
    info.className = 'cert-info';
    const kicker = document.createElement('span');
    kicker.className = 'cert-kicker';
    kicker.textContent = `CERTIFICATE ${String(index + 1).padStart(2, '0')}`;
    const title = document.createElement('h3');
    title.textContent = cert;
    const count = document.createElement('div');
    count.className = 'cert-count';
    const value = document.createElement('strong');
    value.textContent = numberFormat.format(latest.certificates[cert]);
    const label = document.createElement('span');
    label.textContent = '個帳號';
    count.append(value, label);
    info.append(kicker, title, count);
    card.append(badgeFrame, info);
    grid.append(card);
  });
}

function fallbackBadgeUrl(cert) {
  const slugs = {
    'OSCP+': 'OSCP%2B', 'OSCC-SEC': 'OSCC', 'OSCC-SJD': 'OSCC_SJD-100',
    'OSAI+': 'OSAI%2B'
  };
  const slug = slugs[cert] || cert;
  return `https://static.offsec.com/media/lms/credentials/${slug}_Acclaim_Badge.svg`;
}

function drawChart() {
  if (!latest.certificates) return;
  const cert = document.querySelector('#chart-cert').value || Object.keys(latest.certificates)[0];
  const svg = document.querySelector('#trend-chart');
  const values = snapshots.map(snapshot => ({
    date: snapshot.date,
    count: (snapshot.certificates || {})[cert] || 0
  }));
  const current = values[values.length - 1];
  document.querySelector('#chart-current').textContent = `${numberFormat.format(current?.count || 0)} 個帳號`;

  const width = 900, height = 300, left = 50, right = 16, top = 18, bottom = 34;
  const maximum = Math.max(...values.map(point => point.count), 1);
  const scaleTop = Math.ceil(maximum / 10) * 10 || 1;
  const x = index => left + (values.length < 2 ? (width - left - right) / 2 : index * (width - left - right) / (values.length - 1));
  const y = count => top + (scaleTop - count) / scaleTop * (height - top - bottom);

  let markup = '<defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e86c43" stop-opacity=".20"/><stop offset="1" stop-color="#e86c43" stop-opacity="0"/></linearGradient></defs>';
  for (let step = 0; step <= 4; step += 1) {
    const count = scaleTop * step / 4;
    const yPosition = y(count);
    markup += `<line class="gridline" x1="${left}" x2="${width - right}" y1="${yPosition}" y2="${yPosition}"/>`;
    markup += `<text class="axis-label" x="${left - 9}" y="${yPosition + 4}" text-anchor="end">${Math.round(count)}</text>`;
  }

  if (values.length) {
    const points = values.map((point, index) => `${x(index)},${y(point.count)}`).join(' ');
    const area = `${x(0)},${height - bottom} ${points} ${x(values.length - 1)},${height - bottom}`;
    markup += `<polygon class="chart-area" points="${area}"/>`;
    markup += `<polyline class="chart-line" points="${points}"/>`;
    const lastIndex = values.length - 1;
    markup += `<circle class="chart-dot" cx="${x(lastIndex)}" cy="${y(values[lastIndex].count)}" r="5"/>`;
  }

  svg.innerHTML = markup;
  document.querySelector('#chart-first').textContent = values[0]?.date || '—';
  document.querySelector('#chart-latest').textContent = values.at(-1)?.date || '—';
}

init();
