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
  renderDailyCompare();
  renderPodium(latest.top_holders || []);
  renderCertificateCards(certs, certificateBadges);
  drawChart();
}

function formatDelta(value) {
  return `${value > 0 ? '+' : ''}${numberFormat.format(value)}`;
}

function formatStockDelta(value) {
  if (value > 0) return `▲ +${numberFormat.format(value)}`;
  if (value < 0) return `▼ −${numberFormat.format(Math.abs(value))}`;
  return '— 0';
}

function renderDailyCompare() {
  const previous = snapshots.at(-2);
  const period = document.querySelector('#delta-period');
  const accountDelta = document.querySelector('#delta-accounts');
  const credentialedDelta = document.querySelector('#delta-credentialed');
  const changeCount = document.querySelector('#delta-change-count');
  const list = document.querySelector('#delta-cert-list');
  const empty = document.querySelector('#delta-empty');
  list.replaceChildren();

  if (!previous) {
    period.textContent = '尚無前一日快照';
    accountDelta.textContent = '—';
    credentialedDelta.textContent = '—';
    changeCount.textContent = '尚無比較';
    empty.textContent = '累積到第二日快照後，這裡就會顯示每日變化。';
    empty.hidden = false;
    return;
  }

  period.textContent = `${previous.date} → ${latest.date}`;
  const accountChange = (latest.total_accounts || 0) - (previous.total_accounts || 0);
  const credentialedChange = (latest.accounts_with_credentials || 0) - (previous.accounts_with_credentials || 0);
  accountDelta.textContent = formatStockDelta(accountChange);
  credentialedDelta.textContent = formatStockDelta(credentialedChange);
  accountDelta.title = `${previous.date} → ${latest.date}`;
  credentialedDelta.title = `${previous.date} → ${latest.date}`;
  accountDelta.setAttribute('aria-label', `較前一日 ${formatDelta(accountChange)}`);
  credentialedDelta.setAttribute('aria-label', `較前一日 ${formatDelta(credentialedChange)}`);

  const oldCounts = previous.certificates || {};
  const newCounts = latest.certificates || {};
  const changes = [...new Set([...Object.keys(oldCounts), ...Object.keys(newCounts)])]
    .map(cert => ({ cert, before: oldCounts[cert] || 0, after: newCounts[cert] || 0 }))
    .map(item => ({ ...item, delta: item.after - item.before }))
    .filter(item => item.delta !== 0)
    .sort((a, b) => b.delta - a.delta || a.cert.localeCompare(b.cert));

  changeCount.textContent = `${numberFormat.format(changes.length)} 種有變化`;
  empty.hidden = changes.length > 0;
  empty.textContent = '各證照持有人數與前一日相同。';
  changes.forEach(({ cert, before, after, delta }) => {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'delta-cert-name';
    name.textContent = cert;
    const counts = document.createElement('span');
    counts.className = 'delta-cert-counts';
    counts.textContent = `${numberFormat.format(before)} → ${numberFormat.format(after)}`;
    const change = document.createElement('span');
    change.className = `delta-change ${delta > 0 ? 'delta-up' : 'delta-down'}`;
    change.textContent = `${formatDelta(delta)} 人`;
    item.append(name, counts, change);
    list.append(item);
  });
}

function makeBadge(cert, url, className = 'badge-frame') {
  const frame = document.createElement('div');
  frame.className = className;
  const image = document.createElement('img');
  image.src = url || fallbackBadgeUrl(cert);
  image.alt = `${cert} Badge`;
  image.loading = 'lazy';
  const fallback = document.createElement('span');
  fallback.className = 'badge-fallback';
  fallback.textContent = cert.slice(0, 1);
  image.addEventListener('error', () => {
    image.hidden = true;
    fallback.style.display = 'grid';
  }, { once: true });
  frame.append(image, fallback);
  return frame;
}

function makeAvatar(holder) {
  const frame = document.createElement('div');
  frame.className = 'avatar-frame';
  const fallback = document.createElement('span');
  fallback.className = 'avatar-fallback';
  fallback.textContent = (holder.username || 'OS').slice(0, 2).toUpperCase();
  const url = holder.profile_image || '';
  if (url.startsWith('https://')) {
    const image = document.createElement('img');
    image.src = url;
    image.alt = `${holder.username} 的公開頭像`;
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => {
      image.hidden = true;
      fallback.style.display = 'grid';
    }, { once: true });
    frame.append(image);
  } else {
    fallback.style.display = 'grid';
  }
  frame.append(fallback);
  return frame;
}

function renderPodium(holders) {
  const podium = document.querySelector('#podium');
  podium.replaceChildren();
  const displayOrder = [holders[1], holders[0], holders[2]].filter(Boolean);
  displayOrder.forEach((holder, index) => {
    const rank = holder.rank || [2, 1, 3][index];
    const card = document.createElement('article');
    card.className = `podium-card rank-${rank}`;
    const place = document.createElement('div');
    place.className = 'podium-place';
    const medal = document.createElement('span');
    medal.className = 'podium-medal';
    medal.textContent = String(rank);
    const placeText = document.createElement('span');
    placeText.textContent = ['冠軍', '亞軍', '季軍'][rank - 1];
    place.append(medal, placeText);

    const info = document.createElement('div');
    info.className = 'podium-info';
    const title = document.createElement('h3');
    title.textContent = holder.username || 'OffSec 使用者';
    const count = document.createElement('div');
    count.className = 'podium-count';
    const value = document.createElement('strong');
    value.textContent = numberFormat.format(holder.certificate_count || 0);
    const unit = document.createElement('span');
    unit.textContent = '張證照';
    count.append(value, unit);
    const credentials = document.createElement('div');
    credentials.className = 'holder-certs';
    (holder.certificates || []).forEach(cert => {
      const tag = document.createElement('span');
      tag.className = 'holder-cert';
      tag.textContent = cert;
      credentials.append(tag);
    });
    info.append(title, count, credentials);

    const step = document.createElement('div');
    step.className = 'podium-step';
    step.textContent = `NO. 0${rank}`;
    card.append(place, makeAvatar(holder), info, step);
    podium.append(card);
  });
}

function renderCertificateCards(certs, badges) {
  const grid = document.querySelector('#cert-grid');
  grid.replaceChildren();

  certs.forEach((cert, index) => {
    const card = document.createElement('article');
    card.className = 'cert-card';

    const badgeFrame = makeBadge(cert, badges[cert]);

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
    label.textContent = '人';
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
  document.querySelector('#chart-current').textContent = `${numberFormat.format(current?.count || 0)} 人`;

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
