const translations = {
  en: {
    taiwanLink: 'Taiwan edition ↗', globalLeaderboard: 'Global public leaderboard', languageLabel: 'Language', stampAria: 'Snapshot update information',
    heroEyebrow: 'Worldwide · Public leaderboard data', heroTitle: 'OffSec Global<br><span>Certificate Map</span>',
    heroLede: 'Explore public certificate counts from the global leaderboard. Rotate the globe and select a country to see its breakdown.',
    latestSnapshot: 'Latest global snapshot', updateSchedule: 'Taipei time · Updated twice daily', loadingHistory: 'Loading history…',
    snapshots: n => `${n} daily global snapshots`, metricsLabel: 'OffSec global leaderboard statistics',
    totalAccounts: 'Global leaderboard accounts', accountsCaption: 'Fetched and deduplicated', reported: n => `(API reports ${n})`,
    credentialedAccounts: 'Accounts with at least one certificate', credentialedCaption: 'Leaderboard accounts with public certificates',
    countriesWithAccounts: 'Countries / regions with accounts', unknownCountryCaption: 'accounts without a country',
    certificateTypes: 'Public certificate types', certificateTypesCaption: 'Aggregated from the public global leaderboard',
    globeEyebrow: 'Interactive globe', worldTitle: 'Where are certificate holders?',
    worldDescription: 'Country colors show the selected total. Select a country or ranking entry for details.',
    globeMetric: 'Show on globe', globeMetricAria: 'Choose a statistic to show on the globe', credentialedAccountsShort: 'With at least one certificate', allAccounts: 'Leaderboard accounts',
    mapCertificatesTotal: 'Certificate total', mapAccountsTotal: 'Account total',
    globeHelp: 'Drag to rotate · Scroll to zoom', globeAria: 'Interactive globe colored by public OffSec account and certificate counts',
    loadingGlobe: 'Loading globe and country statistics…', globeReady: 'Globe ready · Drag to rotate, scroll to zoom, select a country for details',
    fewer: 'Fewer', more: 'More', countryData: 'Country details', globalRankLabel: 'Global rank', rankMetricCertificates: 'by certificate total', rankMetricAccounts: 'by account total', notRanked: 'Not ranked', countryPickerLabel: 'Find a country or region', countryPickerPlaceholder: 'Choose a country or region…', ipLookupPrefix: 'For IP-based country selection, this page queries', ipLookupSuffix: '; the service receives your public IP.', ipDetecting: 'Detecting country from IP…', ipSelected: country => `Country preselected: ${country}.`, ipManual: 'Country selected manually.', ipFailed: 'Could not detect your country. Choose it from the list.', countryPrompt: 'Select a country on the globe or choose one from the ranking.',
    certificateHolders: 'Public certificate holders', noPublicCertificates: 'No public certificates listed',
    countryRankingCertificates: 'Certificate total', countryRankingAccounts: 'Account total',
    countries: n => `${n} countries`, tooltipAccounts: 'leaderboard accounts', tooltipCredentialed: 'accounts with certificates', tooltipCertificates: 'public certificates',
    unknownCountryEyebrow: 'COUNTRY NOT SET', unknownCountryTitle: 'Unknown / country not set', unknownCountryAccounts: 'accounts without a country in their profile',
    coverageNoteTitle: 'Country-level estimate', coverageNoteText: 'Because country values come from profile settings, certificate counts by country may differ slightly from the actual distribution.',
    certificateCatalog: 'Certificate directory', certificateTitle: 'How many people hold each certificate?',
    certificateCountCaption: 'public certificates · each account is counted once per certificate',
    dataNotes: 'Data notes', dataTitle: 'About these statistics',
    dataDescription: 'Data comes from the public OffSec Portal global leaderboard. Pages are aggregated by leaderboard account; only global and country totals are stored, not account-level records. Certificate counts reflect public leaderboard accounts and may differ from an official deduplicated holder list. Accounts without a country are included in the global total. Country boundaries: Natural Earth 1:110m. Interactive globe: Globe.GL.',
    sourceLink: 'View OffSec Portal source ↗', githubProject: 'GitHub project ↗', taipeiTime: 'Times shown in Taipei time',
    fetchError: 'Data could not be loaded', globeError: e => `Could not load the interactive globe: ${e}. Country rankings are still available.`
  },
  'zh-Hant': {
    taiwanLink: '台灣版 ↗', globalLeaderboard: '全球公開排行榜', languageLabel: '語言', stampAria: '資料更新資訊',
    heroEyebrow: 'Worldwide · 公開排行榜資料', heroTitle: 'OffSec 全球<br><span>證照地圖</span>',
    heroLede: '瀏覽全球公開證照統計，旋轉地球並選擇國家查看分布。',
    latestSnapshot: '最新全球快照', updateSchedule: '台北時間 · 每日更新兩次', loadingHistory: '載入歷史資料…',
    snapshots: n => `已累積 ${n} 日全球快照`, metricsLabel: 'OffSec 全球排行榜統計',
    totalAccounts: '全球排行榜帳號', accountsCaption: '分頁取得並去重', reported: n => `（API 回報 ${n}）`,
    credentialedAccounts: '至少擁有一張證照', credentialedCaption: '排行榜帳號列有公開證照',
    countriesWithAccounts: '有帳號的國家／地區', unknownCountryCaption: '個帳號未設定國家',
    certificateTypes: '公開證照種類', certificateTypesCaption: '依全球排行榜公開資料彙總',
    globeEyebrow: '互動地球', worldTitle: '證照持有人遍布哪裡？',
    worldDescription: '國家顏色代表所選統計總數；點選地球或國家排行查看詳細資料。',
    globeMetric: '地球顯示', globeMetricAria: '選擇地球顯示的統計項目', credentialedAccountsShort: '至少擁有一張證照', allAccounts: '排行榜帳號總數',
    mapCertificatesTotal: '證照總數', mapAccountsTotal: '帳號總數',
    globeHelp: '拖曳旋轉 · 滾輪縮放', globeAria: '依 OffSec 公開帳號與證照持有人數著色的互動式地球',
    loadingGlobe: '正在載入地球與國家統計…', globeReady: '地球已載入 · 拖曳旋轉，滾輪縮放，點選國家查看資料',
    fewer: '較少', more: '較多', countryData: '國家資料', globalRankLabel: '全球排名', rankMetricCertificates: '依證照總數排名', rankMetricAccounts: '依帳號總數排名', notRanked: '尚無排名', countryPickerLabel: '尋找國家或地區', countryPickerPlaceholder: '選擇國家或地區…', ipLookupPrefix: 'IP 自動選國會查詢', ipLookupSuffix: '；該服務會收到你的公開 IP。', ipDetecting: '正在依 IP 判斷國家…', ipSelected: country => `已依 IP 預選：${country}`, ipManual: '已手動選擇國家。', ipFailed: '無法判斷國家，請從下拉選單選擇。', countryPrompt: '在地球上選一個國家，或從排行挑選。',
    certificateHolders: '公開證照持有人數', noPublicCertificates: '尚無列出公開證照',
    countryRankingCertificates: '證照總數', countryRankingAccounts: '帳號總數',
    countries: n => `${n} 個國家`, tooltipAccounts: '排行榜帳號', tooltipCredentialed: '至少一張證照', tooltipCertificates: '張公開證照',
    unknownCountryEyebrow: '未設定國家', unknownCountryTitle: '未知／未設定國家', unknownCountryAccounts: '個人檔案未設定國家的帳號',
    coverageNoteTitle: '國別數量提醒', coverageNoteText: '由於個人檔案中的國家設定，按國家統計的證照數量可能與實際分布略有差異。',
    certificateCatalog: '全球證照圖鑑', certificateTitle: '每張證照有多少持有人？',
    certificateCountCaption: '種公開證照 · 同一帳號每種證照計一次',
    dataNotes: '資料說明', dataTitle: '資料怎麼統計',
    dataDescription: '資料來自 OffSec Portal 公開全球排行榜，程式逐頁讀取後以排行榜帳號為計數單位，只保存全球及各國彙總數字，不保存完整帳號明細。證照持有人數是公開排行榜帳號數，不等同 OffSec 官方去重後的個人名冊；未設定國家的帳號仍計入全球總數。國界資料採 Natural Earth 1:110m，互動地球使用 Globe.GL。',
    sourceLink: '查看 OffSec Portal 資料來源 ↗', githubProject: 'GitHub 專案 ↗', taipeiTime: '時間採台北時區',
    fetchError: '資料讀取失敗', globeError: e => `互動地球載入失敗：${e}。下方國家排行仍可使用。`
  },
  ja: {
    taiwanLink: '台湾版 ↗', globalLeaderboard: 'グローバル公開ランキング', languageLabel: '言語', stampAria: 'スナップショット更新情報',
    heroEyebrow: 'Worldwide · 公開ランキングデータ', heroTitle: 'OffSec グローバル<br><span>資格マップ</span>',
    heroLede: 'グローバルランキングの公開資格数を確認できます。地球を回転し、国を選択して内訳を表示します。',
    latestSnapshot: '最新のグローバルスナップショット', updateSchedule: '台北時間 · 毎日2回更新', loadingHistory: '履歴を読み込み中…',
    snapshots: n => `グローバル履歴 ${n} 日分`, metricsLabel: 'OffSec グローバルランキング統計',
    totalAccounts: 'グローバルランキングのアカウント数', accountsCaption: 'ページごとに取得し重複を除外', reported: n => `（API 報告値 ${n}）`,
    credentialedAccounts: '資格を1つ以上保有するアカウント', credentialedCaption: '公開資格が登録されたランキングアカウント',
    countriesWithAccounts: 'アカウントがある国・地域', unknownCountryCaption: 'アカウントは国未設定',
    certificateTypes: '公開資格の種類', certificateTypesCaption: '公開グローバルランキングを集計',
    globeEyebrow: 'インタラクティブ地球儀', worldTitle: '資格保有者はどこにいる？',
    worldDescription: '国の色は選択した合計値を示します。地球またはランキングから国を選ぶと詳細を表示します。',
    globeMetric: '地球儀に表示', globeMetricAria: '地球儀に表示する統計を選択', credentialedAccountsShort: '資格を1つ以上保有', allAccounts: 'ランキングアカウント総数',
    mapCertificatesTotal: '資格総数', mapAccountsTotal: 'アカウント総数',
    globeHelp: 'ドラッグで回転 · スクロールでズーム', globeAria: 'OffSec 公開アカウントと資格数を色で示すインタラクティブ地球儀',
    loadingGlobe: '地球儀と国別統計を読み込み中…', globeReady: '地球儀を表示しました · ドラッグで回転、スクロールでズーム、国を選択して詳細を表示',
    fewer: '少ない', more: '多い', countryData: '国別データ', globalRankLabel: '世界ランキング', rankMetricCertificates: '資格総数順', rankMetricAccounts: 'アカウント総数順', notRanked: 'ランキング対象外', countryPickerLabel: '国・地域を検索', countryPickerPlaceholder: '国・地域を選択…', ipLookupPrefix: 'IP による国の自動選択では', ipLookupSuffix: 'に問い合わせます。このサービスには公開 IP が送信されます。', ipDetecting: 'IP から国を確認しています…', ipSelected: country => `IP に基づき${country}を選択しました。`, ipManual: '国を手動で選択しました。', ipFailed: '国を判定できませんでした。リストから選択してください。', countryPrompt: '地球儀上の国、またはランキングから国を選択してください。',
    certificateHolders: '公開資格の保有者数', noPublicCertificates: '公開資格はありません',
    countryRankingCertificates: '資格総数', countryRankingAccounts: 'アカウント総数',
    countries: n => `${n} か国`, tooltipAccounts: 'ランキングアカウント', tooltipCredentialed: '資格保有アカウント', tooltipCertificates: '公開資格',
    unknownCountryEyebrow: '国の設定なし', unknownCountryTitle: '不明／未設定の国', unknownCountryAccounts: 'プロフィールで国が設定されていないアカウント',
    coverageNoteTitle: '国別集計について', coverageNoteText: 'プロフィールの国設定に基づくため、国別の資格数は実際の分布と多少異なる場合があります。',
    certificateCatalog: '資格一覧', certificateTitle: '各資格の保有者数',
    certificateCountCaption: '種類の公開資格 · アカウントごとに資格を1回集計',
    dataNotes: 'データについて', dataTitle: '統計方法',
    dataDescription: 'OffSec Portal の公開グローバルランキングを利用しています。ページごとのデータをランキングアカウント単位で集計し、保存するのは全体および国別の合計値のみです。アカウント単位の記録は保存しません。資格数は公開ランキング上のアカウント数であり、OffSec 公式の重複排除済み保有者リストとは異なる場合があります。国が未設定のアカウントも全体数に含まれます。国境データ：Natural Earth 1:110m。地球儀：Globe.GL。',
    sourceLink: 'OffSec Portal のデータソース ↗', githubProject: 'GitHub プロジェクト ↗', taipeiTime: '時刻は台北時間',
    fetchError: 'データを読み込めませんでした', globeError: e => `地球儀を読み込めませんでした：${e}。国別ランキングは引き続き利用できます。`
  }
};
let currentLanguage = 'en';
let globalNumber = new Intl.NumberFormat('en');
const globalApi = {
  globe: null,
  features: [],
  featureByCode: new Map(),
  latest: null,
  countryCode: null,
  manuallySelectedCountry: false,
  ipDetectionState: 'idle',
  ipDetectedCountryCode: null,
  globeState: 'loading',
  globeError: null,
  metric: 'certificates'
};

async function initGlobal() {
  const selector = document.querySelector('#language-selector');
  try { currentLanguage = localStorage.getItem('offsec-global-language') || 'en'; } catch (_) { currentLanguage = 'en'; }
  if (!translations[currentLanguage]) currentLanguage = 'en';
  selector.value = currentLanguage;
  selector.addEventListener('change', () => {
    currentLanguage = translations[selector.value] ? selector.value : 'en';
    try { localStorage.setItem('offsec-global-language', currentLanguage); } catch (_) {}
    applyLanguage();
    if (globalApi.latest) {
      renderGlobalSummary(window.globalHistorySnapshots || []);
      renderGlobalCertificates();
      renderCountryRanking();
      populateCountrySelector();
      if (globalApi.countryCode) selectCountry(globalApi.countryCode);
      if (globalApi.globe) updateGlobeColors();
    }
  });
  applyLanguage();
  const countrySelector = document.querySelector('#country-selector');
  countrySelector.addEventListener('change', () => {
    markManualCountrySelection();
    const code = countrySelector.value;
    if (!code) {
      clearCountrySelection();
      return;
    }
    const feature = globalApi.featureByCode.get(code);
    const props = feature?.properties;
    const coords = props ? { lat: props.LABEL_Y || 0, lng: props.LABEL_X || 0 } : null;
    selectCountry(code, coords);
  });
  try {
    const response = await fetch('./data/global-snapshots.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const history = await response.json();
    window.globalHistorySnapshots = history.snapshots || [];
    globalApi.latest = history.snapshots?.at(-1);
    if (!globalApi.latest) throw new Error('No global snapshots available');
    renderGlobalSummary(history.snapshots);
    renderGlobalCertificates();

    try {
      const worldResponse = await fetch('./assets/world-countries.geojson');
      if (!worldResponse.ok) throw new Error(`GeoJSON HTTP ${worldResponse.status}`);
      const world = await worldResponse.json();
      globalApi.features = world.features.filter(feature => countryCode(feature));
      globalApi.features.forEach(feature => {
        const code = countryCode(feature);
        if (code && !globalApi.featureByCode.has(code)) globalApi.featureByCode.set(code, feature);
      });
      populateCountrySelector();
      renderCountryRanking();
      detectCountryByIp();
      initializeGlobe();
    } catch (error) {
      populateCountrySelector();
      renderCountryRanking();
      detectCountryByIp();
      globalApi.globeState = 'error';
      globalApi.globeError = error.message;
      renderGlobeStatus();
    }
  } catch (error) {
    document.querySelector('#global-snapshot-date').textContent = t('fetchError');
    document.querySelector('#global-snapshot-count').textContent = error.message;
    globalApi.globeState = 'data-error';
    renderGlobeStatus();
  }
}

function t(key) { return translations[currentLanguage][key]; }

function renderGlobeStatus() {
  const status = document.querySelector('#globe-status');
  if (!status) return;
  if (globalApi.globeState === 'ready') status.textContent = t('globeReady');
  else if (globalApi.globeState === 'error') status.textContent = t('globeError')(globalApi.globeError || '');
  else if (globalApi.globeState === 'data-error') status.textContent = t('fetchError');
  else status.textContent = t('loadingGlobe');
}

function applyLanguage() {
  globalNumber = new Intl.NumberFormat(currentLanguage === 'zh-Hant' ? 'zh-TW' : currentLanguage === 'ja' ? 'ja-JP' : 'en');
  document.documentElement.lang = currentLanguage === 'zh-Hant' ? 'zh-Hant' : currentLanguage;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = t(element.dataset.i18n);
    if (value === undefined) return;
    if (element.dataset.i18n === 'heroTitle') element.innerHTML = value;
    else element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const value = t(element.dataset.i18nAria);
    if (value !== undefined) element.setAttribute('aria-label', value);
  });
  document.title = currentLanguage === 'zh-Hant' ? 'OffSec 全球證照地圖與統計' : currentLanguage === 'ja' ? 'OffSec グローバル資格マップと統計' : 'OffSec Global Certificate Map and Statistics';
  const description = currentLanguage === 'zh-Hant'
    ? '每日統計 OffSec 全球排行榜公開證照持有人數，透過可旋轉世界地球查看各國分布。'
    : currentLanguage === 'ja' ? 'OffSec グローバルランキングの公開資格保有数を、回転できる地球儀で確認できます。'
      : 'Explore public OffSec certificate counts worldwide on an interactive, rotatable globe.';
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:locale"]').content = currentLanguage === 'zh-Hant' ? 'zh_TW' : currentLanguage === 'ja' ? 'ja_JP' : 'en_US';
  document.querySelector('#global-snapshot-count').textContent = t('loadingHistory');
  renderGlobeStatus();
  renderIpStatus();
  if (globalApi.latest && window.globalHistorySnapshots) renderGlobalSummary(window.globalHistorySnapshots);
}

function renderIpStatus() {
  const status = document.querySelector('#ip-country-status');
  if (!status) return;
  if (globalApi.ipDetectionState === 'detecting') status.textContent = t('ipDetecting');
  else if (globalApi.ipDetectionState === 'selected' && globalApi.ipDetectedCountryCode) {
    const code = globalApi.ipDetectedCountryCode;
    status.textContent = t('ipSelected')(countryName(globalApi.featureByCode.get(code), code));
  } else if (globalApi.ipDetectionState === 'manual') status.textContent = t('ipManual');
  else if (globalApi.ipDetectionState === 'failed') status.textContent = t('ipFailed');
  else status.textContent = '';
}

function markManualCountrySelection() {
  globalApi.manuallySelectedCountry = true;
  globalApi.ipDetectionState = 'manual';
  renderIpStatus();
}

async function detectCountryByIp() {
  if (globalApi.manuallySelectedCountry) return;
  globalApi.ipDetectionState = 'detecting';
  renderIpStatus();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch('https://ipapi.co/country/', { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const code = (await response.text()).trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code) || isUnknownCountry(code)) throw new Error('No country code');
    if (globalApi.manuallySelectedCountry) {
      renderIpStatus();
      return;
    }
    globalApi.ipDetectedCountryCode = code;
    populateCountrySelector([code]);
    const feature = globalApi.featureByCode.get(code);
    const props = feature?.properties;
    const coords = props ? { lat: props.LABEL_Y || 0, lng: props.LABEL_X || 0 } : null;
    selectCountry(code, coords);
    globalApi.ipDetectionState = 'selected';
    renderIpStatus();
  } catch (_) {
    if (!globalApi.manuallySelectedCountry) globalApi.ipDetectionState = 'failed';
    renderIpStatus();
  } finally {
    window.clearTimeout(timeout);
  }
}

function renderGlobalSummary(snapshots) {
  const latest = globalApi.latest;
  document.querySelector('#global-snapshot-date').textContent = latest.date || '—';
  document.querySelector('#global-snapshot-count').textContent = t('snapshots')(globalNumber.format(snapshots.length));
  document.querySelector('#global-total-count').textContent = globalNumber.format(latest.total_accounts || 0);
  document.querySelector('#global-account-reconciliation').textContent = latest.reported_total_accounts
    ? t('reported')(globalNumber.format(latest.reported_total_accounts)) : '';
  document.querySelector('#global-credentialed-count').textContent = globalNumber.format(latest.accounts_with_credentials || 0);
  document.querySelector('#global-country-count').textContent = globalNumber.format(latest.countries_with_accounts || 0);
  document.querySelector('#global-unknown-count').textContent = globalNumber.format(latest.unknown_country_accounts || 0);
  document.querySelector('#unknown-country-accounts').textContent = globalNumber.format(unknownCountryAccounts(latest));
  document.querySelector('#global-cert-count').textContent = globalNumber.format(Object.keys(latest.certificates || {}).length);
}

function countryCode(feature) {
  const properties = feature?.properties || {};
  return [properties.ISO_A2_EH, properties.ISO_A2, properties.ADM0_A3]
    .find(code => typeof code === 'string' && /^[A-Z]{2}$/.test(code)) || null;
}

function isUnknownCountry(code) {
  return code === 'XX' || code === 'ZZ';
}

function unknownCountryAccounts(snapshot) {
  const codedUnknown = ['XX', 'ZZ'].reduce((sum, code) => sum + Number(snapshot.countries?.[code]?.accounts || 0), 0);
  return Number(snapshot.unknown_country_accounts || 0) + codedUnknown;
}

function countryName(feature, fallbackCode = null) {
  const code = fallbackCode || countryCode(feature);
  if (isUnknownCountry(code)) return t('unknownCountryTitle');
  if (code) {
    try {
      const localized = new Intl.DisplayNames([currentLanguage === 'zh-Hant' ? 'zh-TW' : currentLanguage === 'ja' ? 'ja-JP' : 'en'], { type: 'region' }).of(code);
      if (localized && localized !== code) return localized;
    } catch (_) {}
  }
  return feature?.properties?.ADMIN || feature?.properties?.NAME_EN || code || 'Unknown';
}

function populateCountrySelector(extraCodes = []) {
  const selector = document.querySelector('#country-selector');
  if (!selector || !globalApi.latest) return;
  const selectedCode = globalApi.countryCode || '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = t('countryPickerPlaceholder');
  const codes = new Set([
    ...globalApi.features.map(countryCode),
    ...Object.keys(globalApi.latest.countries || {}),
    ...extraCodes
  ]);
  codes.delete(null);
  const names = [...codes]
    .filter(code => !isUnknownCountry(code))
    .map(code => ({ code, name: countryName(globalApi.featureByCode.get(code), code) }))
    .sort((a, b) => a.name.localeCompare(b.name, currentLanguage === 'zh-Hant' ? 'zh-TW' : currentLanguage === 'ja' ? 'ja-JP' : 'en'));
  selector.replaceChildren(placeholder);
  names.forEach(({ code, name }) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    selector.append(option);
  });
  selector.value = selectedCode;
}

function clearCountrySelection() {
  globalApi.countryCode = null;
  document.querySelector('#country-prompt').hidden = false;
  document.querySelector('#country-detail').hidden = true;
  document.querySelectorAll('.country-rank-button').forEach(button => button.classList.remove('is-selected'));
  globalApi.globe?.polygonAltitude(feature => metricValue(globalApi.latest.countries?.[countryCode(feature)]) ? 0.006 : 0.0015);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function metricValue(country) {
  if (globalApi.metric === 'certificates') {
    return Object.values(country?.certificates || {}).reduce((total, count) => total + Number(count || 0), 0);
  }
  return Number(country?.[globalApi.metric] || 0);
}

function renderCountryRanking() {
  const countryData = globalApi.latest?.countries || {};
  const ranking = Object.entries(countryData)
    .filter(([code]) => !isUnknownCountry(code))
    .map(([code, value]) => ({ code, value, feature: globalApi.featureByCode.get(code) }))
    .sort((a, b) => metricValue(b.value) - metricValue(a.value) || a.code.localeCompare(b.code))
    .slice(0, 12);
  const list = document.querySelector('#country-ranking');
  list.replaceChildren();
  ranking.forEach(({ code, value, feature }, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'country-rank-button';
    button.dataset.countryCode = code;
    const rank = document.createElement('span');
    rank.className = 'country-rank-number';
    rank.textContent = String(index + 1).padStart(2, '0');
    const name = document.createElement('span');
    name.className = 'country-rank-name';
    name.textContent = countryName(feature, code);
    const count = document.createElement('strong');
    count.className = 'country-rank-count';
    count.textContent = globalNumber.format(metricValue(value));
    button.append(rank, name, count);
    button.addEventListener('click', () => {
      markManualCountrySelection();
      const coords = feature?.properties;
      selectCountry(code, coords ? { lat: coords.LABEL_Y || 0, lng: coords.LABEL_X || 0 } : null);
      if (globalApi.globe && coords) {
        globalApi.globe.pointOfView({ lat: coords.LABEL_Y || 0, lng: coords.LABEL_X || 0, altitude: 1.5 }, 700);
      }
    });
    item.append(button);
    list.append(item);
  });
  document.querySelector('#ranking-count').textContent = t('countries')(globalNumber.format(ranking.length));
  document.querySelector('#country-ranking-title').textContent = globalApi.metric === 'accounts'
    ? t('countryRankingAccounts') : t('countryRankingCertificates');
}

function selectCountry(code, coordinates) {
  globalApi.countryCode = code;
  document.querySelector('#country-selector').value = code || '';
  const feature = globalApi.featureByCode.get(code);
  const record = globalApi.latest.countries?.[code] || { accounts: 0, accounts_with_credentials: 0, certificates: {} };
  document.querySelector('#country-prompt').hidden = true;
  document.querySelector('#country-detail').hidden = false;
  document.querySelector('#country-code').textContent = code;
  document.querySelector('#country-name').textContent = `${code} · ${countryName(feature, code)}`;
  document.querySelector('#country-accounts').textContent = globalNumber.format(record.accounts || 0);
  document.querySelector('#country-credentialed').textContent = globalNumber.format(record.accounts_with_credentials || 0);
  updateSelectedCountryRank();
  const certList = document.querySelector('#country-cert-list');
  certList.replaceChildren();
  Object.entries(record.certificates || {})
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .forEach(([cert, count]) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = cert;
      const value = document.createElement('strong');
      value.textContent = globalNumber.format(count);
      item.append(name, value);
      certList.append(item);
    });
  if (!certList.children.length) {
    const item = document.createElement('li');
    item.textContent = t('noPublicCertificates');
    certList.append(item);
  }
  document.querySelectorAll('.country-rank-button').forEach(button => {
    button.classList.toggle('is-selected', button.dataset.countryCode === code);
  });
  if (coordinates && globalApi.globe) {
    globalApi.globe.pointOfView({ lat: coordinates.lat, lng: coordinates.lng, altitude: 1.5 }, 700);
  }
  globalApi.globe?.polygonAltitude(feature => countryCode(feature) === code ? 0.012 : (metricValue(globalApi.latest.countries?.[countryCode(feature)]) ? 0.006 : 0.0015));
}

function updateSelectedCountryRank() {
  const code = globalApi.countryCode;
  if (!code) return;
  const ranking = Object.entries(globalApi.latest?.countries || {})
    .filter(([country]) => !isUnknownCountry(country))
    .sort((a, b) => metricValue(b[1]) - metricValue(a[1]) || a[0].localeCompare(b[0]));
  const rank = ranking.findIndex(([country]) => country === code);
  document.querySelector('#country-global-rank').textContent = rank >= 0
    ? `#${globalNumber.format(rank + 1)}` : t('notRanked');
  document.querySelector('#country-rank-metric').textContent = globalApi.metric === 'accounts'
    ? t('rankMetricAccounts') : t('rankMetricCertificates');
}

function colorFor(value, maximum) {
  if (!value) return '#23383e';
  const intensity = Math.log1p(value) / Math.log1p(Math.max(maximum, 1));
  const stops = [
    { at: 0, rgb: [59, 82, 139] },
    { at: 0.5, rgb: [33, 145, 140] },
    { at: 1, rgb: [253, 231, 37] }
  ];
  const upperIndex = stops.findIndex(stop => intensity <= stop.at);
  const lower = stops[Math.max(0, upperIndex - 1)];
  const upper = stops[upperIndex < 0 ? stops.length - 1 : upperIndex];
  const mix = (intensity - lower.at) / Math.max(upper.at - lower.at, Number.EPSILON);
  const channel = index => Math.round(lower.rgb[index] + (upper.rgb[index] - lower.rgb[index]) * mix);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

function polygonTooltip(feature) {
  const code = countryCode(feature);
  const country = globalApi.latest.countries?.[code];
  const amount = metricValue(country);
  const label = globalApi.metric === 'accounts' ? t('tooltipAccounts') : t('tooltipCertificates');
  return `<b>${escapeHtml(countryName(feature, code))}</b><br>${globalNumber.format(amount)} ${label}`;
}

function updateGlobeColors() {
  const countries = globalApi.latest.countries || {};
  const maxValue = Math.max(...Object.values(countries).map(metricValue), 1);
  globalApi.globe
    .polygonCapColor(feature => colorFor(metricValue(countries[countryCode(feature)]), maxValue))
    .polygonAltitude(feature => metricValue(countries[countryCode(feature)]) ? 0.006 : 0.0015);
  document.querySelector('#map-legend-max').textContent = globalNumber.format(maxValue);
}

function initializeGlobe() {
  const container = document.querySelector('#world-globe');
  if (!window.Globe) throw new Error('Globe.GL 腳本尚未載入');
  globalApi.globe = new window.Globe(container)
    .width(container.clientWidth)
    .height(container.clientHeight)
    .backgroundColor('#182d32')
    .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
    .showAtmosphere(true)
    .atmosphereColor('#608f91')
    .atmosphereAltitude(0.12)
    .showGraticules(true)
    .polygonsData(globalApi.features)
    .polygonCapColor(() => '#29484e')
    .polygonSideColor(() => 'rgba(28, 46, 50, 0.75)')
    .polygonStrokeColor(() => '#9bb9ac')
    .polygonAltitude(0.002)
    .polygonLabel(polygonTooltip)
    .polygonsTransitionDuration(300)
    .onPolygonClick((feature, _event, coords) => {
      markManualCountrySelection();
      selectCountry(countryCode(feature), coords);
    });

  const controls = globalApi.globe.controls();
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotateSpeed = 0.28;
  globalApi.globe.pointOfView({ lat: 18, lng: 5, altitude: 2.15 }, 0);
  const selectedFeature = globalApi.featureByCode.get(globalApi.countryCode);
  if (selectedFeature) {
    const props = selectedFeature.properties;
    globalApi.globe.pointOfView({ lat: props.LABEL_Y || 0, lng: props.LABEL_X || 0, altitude: 1.5 }, 0);
  }
  updateGlobeColors();
  globalApi.globeState = 'ready';
  renderGlobeStatus();

  const metricSelector = document.querySelector('#map-metric');
  metricSelector.addEventListener('change', () => {
    globalApi.metric = metricSelector.value;
    renderCountryRanking();
    updateGlobeColors();
    updateSelectedCountryRank();
  });
  const resizeObserver = new ResizeObserver(() => {
    globalApi.globe.width(container.clientWidth).height(container.clientHeight);
  });
  resizeObserver.observe(container);
}

function renderGlobalCertificates() {
  const latest = globalApi.latest;
  const counts = latest.certificates || {};
  const badges = latest.certificate_badges || {};
  const certs = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const grid = document.querySelector('#global-cert-grid');
  grid.replaceChildren();
  document.querySelector('#global-cert-section-count').textContent = globalNumber.format(certs.length);
  certs.forEach((cert, index) => {
    const card = document.createElement('article');
    card.className = 'cert-card';
    const badgeFrame = document.createElement('div');
    badgeFrame.className = 'badge-frame';
    const image = document.createElement('img');
    image.src = badges[cert] || `https://static.offsec.com/media/lms/credentials/${encodeURIComponent(cert)}_Acclaim_Badge.svg`;
    image.alt = `${cert} Badge`;
    image.loading = 'lazy';
    const fallback = document.createElement('span');
    fallback.className = 'badge-fallback';
    fallback.textContent = cert.slice(0, 1);
    image.addEventListener('error', () => {
      image.hidden = true;
      fallback.style.display = 'grid';
    }, { once: true });
    badgeFrame.append(image, fallback);

    const info = document.createElement('div');
    info.className = 'cert-info';
    const kicker = document.createElement('span');
    kicker.className = 'cert-kicker';
    kicker.textContent = `${currentLanguage === 'zh-Hant' ? '全球證照' : currentLanguage === 'ja' ? 'グローバル資格' : 'GLOBAL CERTIFICATE'} ${String(index + 1).padStart(2, '0')}`;
    const title = document.createElement('h3');
    title.textContent = cert;
    const count = document.createElement('div');
    count.className = 'cert-count';
    const value = document.createElement('strong');
    value.textContent = globalNumber.format(counts[cert]);
    const unit = document.createElement('span');
    unit.textContent = currentLanguage === 'zh-Hant' ? '人' : currentLanguage === 'ja' ? '人' : 'holders';
    count.append(value, unit);
    info.append(kicker, title, count);
    card.append(badgeFrame, info);
    grid.append(card);
  });
}

initGlobal();
