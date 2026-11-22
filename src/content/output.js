// Section: Expected Deployed Output (proposal §5). Previews the deployed app's interactive features.
// The action log (site.js) and the six questions (questions.js) are parts of this section; their text is kept.
// Figures come from the proposal; anything not collected yet is marked as pending, never drawn as data.
import { platform } from './platform.js';

const trafficSeries = platform.en.why.pillars.find((p) => p.key === 'network').chart.series;
const pick = (key) => trafficSeries.find((s) => s.key === key).points;

// the dashboard (§5.1.5): eight charts and no more. `data` only where the figures are already in hand (§3.3).
const tiles = [
  { key: 'a', status: 'partial', kind: 'lines', data: { direct: pick('direct'), social: pick('social') } },
  { key: 'b', status: 'partial', kind: 'staff', data: { staff: [{ year: 2023, value: 561 }, { year: 2025, value: 385 }], profitFrom: '2025-07' } },
  { key: 'c', status: 'partial', kind: 'dots', data: { use: [{ year: 2023, value: 34 }, { year: 2025, value: 34 }, { year: 2026, value: 38 }], trust: 46 } },
  { key: 'd', status: 'todo', kind: 'ghost' },
  { key: 'e', status: 'todo', kind: 'ghost' },
  { key: 'f', status: 'todo', kind: 'ghost' },
  { key: 'g', status: 'partial', kind: 'bars', data: [{ year: 2024, value: 636.83 }, { year: 2025, value: 661.77 }] },
  { key: 'h', status: 'todo', kind: 'ghost' },
];

// the Value Net game board (§5.1.2): six players in the four roles, and the log rows behind each
const players = [
  { key: 'readers', role: 'customer', rows: [] },
  { key: 'advertisers', role: 'customer', rows: ['r4'] },
  { key: 'partners', role: 'supplier', rows: [] },
  { key: 'rivals', role: 'competitor', rows: ['r9'] },
  { key: 'platforms', role: 'complementor', both: true, rows: ['r6'] },
  { key: 'regulators', role: 'rules', rows: ['r1', 'r2', 'r7', 'r8'] },
];

// the competitor map's actors (§5.1.3), placed only once scored
const actors = ['TVBS新聞網', '東森新聞網', '三立新聞網', 'UDN', 'LTN', 'NOWnews', 'LINE TODAY', 'Google', 'Meta', 'YouTube'];

// the six insight cards (§5.1.7): which views each answer rests on (part ids)
const insights = [
  { code: 'AQ1', views: ['out-maps', 'site'] },
  { code: 'AQ2', views: ['out-maps', 'site'] },
  { code: 'AQ3', views: ['out-maps', 'site'] },
  { code: 'AQ4', views: ['site'] },
  { code: 'AQ5', views: ['questions'] },
  { code: 'AQ6', views: ['site'], forces: true },
];

// the video (§5.2): beats in seconds; narration in both languages, so either subtitle track works on either page
const beats = [
  { key: 'puzzle', from: 0, to: 15, en: 'Most-used, most-trusted, and loss-making for four years. How?', zh: '最多人用、最受信任，卻連續虧損四年。為什麼？' },
  { key: 'board', from: 15, to: 35, en: 'ETtoday is a platform that also supplies bigger platforms: friend and foe at once.', zh: 'ETtoday 本身是平台，也為更大的平台供稿：亦敵亦友。' },
  { key: 'moves', from: 35, to: 60, en: 'Rivals that share ETtoday’s audience and resources answer fastest: awareness, motivation, capability.', zh: '與 ETtoday 共享受眾與資源的對手回應最快：察覺、動機、能力。' },
  { key: 'numbers', from: 60, to: 85, en: 'Traffic pulled back home; cost cut; ad market concentrating.', zh: '流量拉回自家；成本降低；廣告市場集中。' },
  { key: 'verdict', from: 85, to: 110, en: 'Our answer to the research question.', zh: '我們對研究問題的回答。' },
  { key: 'credits', from: 110, to: 120, en: null, zh: null },   // no narration over the credits
];
// set to the YouTube video id once the video is up (unlisted); until then the storyboard plays
const videoId = null;

const zip = (base, texts) => base.map((b, i) => ({ ...b, ...texts[i] }));
const build = (t) => ({
  ...t,
  maps: { ...t.maps, players: zip(players, t.maps.players), actors },
  dash: { ...t.dash, tiles: zip(tiles, t.dash.tiles) },
  insights: { ...t.insights, cards: zip(insights, t.insights.cards) },
  video: { ...t.video, videoId, beats: zip(beats, t.video.beats) },
});

export const output = {
  en: build({
    id: 'output',
    kicker: 'Deployed output',
    track: 'Proposal §5 · https://<org>.github.io/<repo>/, address TBD',
    title: 'The Dashboard',
    intro: 'A Vue single-page application, bilingual, responsive for phone and desktop, reading all data from JSON files in the repository. Each section is built around one framework from the course, so a visitor who knows the frameworks can read the page as an argument, and one who does not can read it as a story.',
    statusNames: { opened: 'Opened', partial: 'Partly collected', todo: 'To collect', context: 'Background reading' },

    page: {
      id: 'out-page',
      label: 'The page, top to bottom',
      title: 'Nine sections, each built around one framework.',
      mockLabel: 'The deployed page',
      sections: [
        { name: 'Opening', text: 'The research question and five headline numbers, each linked to its source', href: '#background' },
        { name: 'The game board: Value Net', tags: 'AQ1 · AQ2 · Co-opetition', text: 'Click a player for its role, its flows and our friend-or-foe verdict', href: '#out-maps' },
        { name: 'Competitor map', tags: 'AQ3 · Chen (1996)', text: 'Market commonality × resource similarity; hover a rival for its AMC prediction', href: '#out-maps' },
        { name: 'Action–response timeline', tags: 'AQ3 · AMC', text: 'One lane per actor, the lag in days on each link; filter, click, drag a date window', href: '#site' },
        { name: 'Platform dashboard', tags: 'AQ1 · AQ4 · AQ6', text: 'Eight charts and no more: hover, toggle series, brush a window', href: '#out-dash' },
        { name: 'Rules panel', tags: 'AQ5', text: 'The dated rule events and the fund scenario slider', href: '#questions' },
        { name: 'Insights', tags: 'AQ1–AQ6 · PARTS', text: 'Six cards, one per AQ, then five PARTS recommendations', href: '#out-insights' },
        { name: 'Video', text: 'The two-minute bilingual pitch, embedded from YouTube', href: '#out-video' },
        { name: 'Footer', text: 'AI-use disclosure, sources with licences and access dates, team, course materials, repository', href: '#contact' },
      ],
      canLabel: 'What visitors can do',
      can: ['Switch language', 'Filter, brush and click the timeline', 'Move the scenario slider', 'Inspect any value', 'Open any source'],
      cannotLabel: 'What they cannot do',
      cannot: ['Log in', 'Submit data', 'Trigger a live scrape'],
      staticNote: 'The page is deliberately static, so it stays up with no server and no keys.',
      buildLabel: 'How we get there',
      build: [
        { week: 'W12', text: 'Data frozen and verified (TP-Data)' },
        { week: 'W13', text: 'SPA skeleton, language toggle and the timeline wired to real rows' },
        { week: 'W14', text: 'Dashboard, Value Net panel and insight cards; first draft submitted as TP-Web' },
        { week: 'W15', text: 'Video recorded and embedded, mobile fixes, TP Final' },
        { week: 'W16', text: 'Live the weekend before, for the class and professors to evaluate' },
      ],
      buildNote: 'The video is cut from the same animations as the site, so the two are built together rather than one after the other.',
      checkLabel: 'Quality check before W16',
      check: ['Both languages read by a native speaker of each', 'Every chart compared with its source table', 'Every link opened', 'Phone and desktop views checked', 'The video plays inside the page'],
    },

    maps: {
      id: 'out-maps',
      label: 'The maps',
      title: 'A game board to click, and a map of who answers whom.',
      boardLabel: 'The game board: Value Net (AQ1, AQ2)',
      boardHint: 'Click a player',
      roles: { customer: 'Customers', supplier: 'Suppliers', competitor: 'Competitors', complementor: 'Complementors', rules: 'Rule-setters' },
      flip: ['Complementor', 'Competitor'],
      panel: { role: 'Role', gives: 'Gives ETtoday', gets: 'Gets from ETtoday', verdict: 'Verdict', rows: 'Rows in the log', none: 'None logged yet' },
      draftNote: 'Verdicts are drafts; the final ones arrive with the verified rows in W14.',
      players: [
        { name: 'Readers', gives: 'Attention and browsing data', gets: 'Free, fast news on web and mobile', verdict: 'Customer' },
        { name: 'Advertisers', gives: 'Spend on display, native, video and sponsored social placements, and Taipei Metro out-of-home space', gets: 'Readers’ attention', verdict: 'Customer' },
        { name: 'Content partners', gives: 'Text, video and vertical reports from syndicated partners and columnists', gets: 'A place on ettoday.net and in the app', verdict: 'Supplier' },
        { name: 'Rival brands', gives: 'Nothing directly: they compete for the same readers and advertisers', gets: '–', verdict: 'Competitor', members: 'TVBS新聞網, 東森新聞網, 三立新聞網, UDN, LTN, NOWnews' },
        { name: 'Distribution platforms', gives: 'Readers referred to ETtoday', gets: 'Stories to carry; and they compete for the same advertisers', verdict: 'Both: complementor and competitor', members: 'LINE TODAY, Google, Meta, YouTube' },
        { name: 'Regulators', gives: 'The rules of the game', gets: '–', verdict: 'Rule-setter: the Rules lever in PARTS', members: '立法院, 數發部, 公平會' },
      ],
      mapLabel: 'Competitor map: market commonality × resource similarity (AQ3)',
      axes: { x: 'Market commonality', xNote: 'Audience and platform space shared with ETtoday', y: 'Resource similarity', yNote: 'Newsroom size, TV parent, video capability, app' },
      quadrants: [
        { key: 'hh', name: 'Most likely to notice and answer', text: 'Shares the market and the resources: high awareness, motivation and capability' },
        { key: 'lh', name: 'Able, less motivated', text: 'Similar resources, little shared market' },
        { key: 'hl', name: 'Motivated, less able', text: 'Shared market, different resources' },
        { key: 'll', name: 'Least likely to answer', text: 'Little in common on either axis' },
      ],
      trayLabel: 'To be placed once scored',
      trayNote: 'The agent computes a first-pass score for each rival; the Strategy pair adjusts it (W12). Until then no rival is placed, so the map shows no guesses.',
    },

    dash: {
      id: 'out-dash',
      label: 'Timeline and dashboard',
      title: 'Eight charts and no more.',
      text: 'Following Chapter 9 of Platform Revolution, the dashboard is capped at eight charts. Hover for values, toggle series, brush a window; dragging across the timeline sets the date window for every chart below it. Every chart carries its source and licence.',
      inHand: 'Figures in hand',
      awaiting: 'Awaiting data',
      tiles: [
        { name: 'ETtoday’s traffic mix, 2017–2025', chart: 'Stacked area', source: '東森國際 annual reports', series: ['Direct', 'Social'] },
        { name: 'Revenue, profit and headcount by year', chart: 'Bars and lines', source: 'Annual reports', labels: ['Staff', 'Profit from Jul 2025'] },
        { name: 'Weekly use and trust by brand, 2017–2026', chart: 'Multi-line', source: 'Reuters DNR', labels: ['ETtoday weekly use', 'Trust 46% (2026)'] },
        { name: 'Google Trends attention by brand', chart: 'Multi-line, events marked', source: 'Google Trends' },
        { name: 'Articles per month per outlet, against headcount', chart: 'Lines', source: 'News sitemaps' },
        { name: 'YouTube uploads and Shorts share per channel', chart: 'Small multiples', source: 'YouTube Data API' },
        { name: 'Digital ad spend by format', chart: 'Stacked bars', source: 'DMA reports', labels: ['NT$ 億'] },
        { name: 'App rating and review themes by month', chart: 'Line and bars', source: 'App stores' },
      ],
    },

    insights: {
      id: 'out-insights',
      label: 'Business insights',
      title: 'Six cards, one answer per question.',
      text: 'Each card carries a two-paragraph answer, the chart or timeline view it rests on, and a link to the verified rows. The section closes with recommendations to ETtoday arranged by the PARTS checklist.',
      restsOn: 'Rests on',
      answer: 'Answer',
      pending: 'Written after the data freeze, W12–W14',
      viewNames: { 'out-maps': 'The maps', site: 'The timeline', 'out-dash': 'The dashboard', questions: 'The rules panel' },
      forcesLabel: 'The four winner-take-all forces (Platform Revolution, Ch. 10)',
      forces: ['Supply-side economies of scale', 'Strong network effects', 'High multi-homing and switching costs', 'Little niche specialisation'],
      cards: [
        { lens: 'Players, Added value', q: 'Who are the players in ETtoday’s Value Net, and where does its added value come from now that direct traffic (47.5%) and app traffic (36.3%) outweigh platform referrals?' },
        { lens: 'Scope, co-opetition', q: 'Are LINE TODAY, Google, Meta and YouTube complementors or competitors to ETtoday? Do they bring it readers or take its advertisers, and how has that balance moved since 2025?' },
        { lens: 'Tactics, AMC', q: 'When a rival or a platform makes a move, whether a new format, a promotion, a partnership or an AI product, how fast does ETtoday answer, and who usually moves first? Does the pairing of market commonality and resource similarity (Chen 1996) predict which rivals respond?' },
        { lens: 'Monetisation', q: 'How much of the 2025 turnaround came from cost (AI restructuring) and how much from revenue (digital ads, transit out-of-home media, commerce tie-ins), and what did each side of the platform give up or gain?' },
        { lens: 'Rules', q: 'How would the 媒體議價法 drafts, the 數發部 shared revenue platform and Google’s NT$300 million news fund change the rules of the game for ETtoday?' },
        { lens: 'Network effects', q: 'Do cross-side network effects push Taiwan’s online news market toward a single winner, or do falling trust and social-first habits fragment it, and where should ETtoday place its next bets?' },
      ],
      partsLabel: 'Recommendations to ETtoday, by the PARTS checklist (Co-opetition, Ch. 9)',
      parts: [
        { name: 'Players', text: 'Who to bring into the game' },
        { name: 'Added value', text: 'What ETtoday adds that others cannot' },
        { name: 'Rules', text: 'Which rules to shape, and how' },
        { name: 'Tactics', text: 'How to change what others believe' },
        { name: 'Scope', text: 'Which games to link, and which to keep apart' },
      ],
      partsPending: 'One recommendation each, written with the insight cards',
    },

    video: {
      id: 'out-video',
      label: 'The pitch video',
      title: 'Two minutes, in two languages, inside the page.',
      specs: ['English narration', 'Chinese and English subtitles', '1080p', 'YouTube, unlisted, embedded'],
      preview: 'Storyboard preview: the video is recorded in W15 and replaces this player.',
      play: 'Play', pause: 'Pause', subtitles: 'Subtitles', off: 'Off',
      chapters: 'Chapters',
      onScreen: 'On screen',
      beats: [
        { name: 'The puzzle', screen: 'Headline numbers animate in' },
        { name: 'The game board', screen: 'The Value Net builds; LINE, Google and Meta flip between complementor and competitor' },
        { name: 'Who moved, who answered', screen: 'The competitor map, then two or three action–response pairs zoom in on the timeline' },
        { name: 'The numbers', screen: 'The traffic-mix area, profit and headcount, Trends with event markers' },
        { name: 'Verdict and advice', screen: 'The AQ6 winner-take-all test, then five PARTS recommendations' },
        { name: 'Credits', screen: 'Team, course materials, AI-use disclosure, sources' },
      ],
      stage: {
        numbers: [{ v: '38%', l: 'weekly use' }, { v: '46%', l: 'trust' }, { v: '47.5%', l: 'direct traffic' }, { v: '36.3%', l: 'app traffic' }, { v: 'Jul 2025', l: 'back to profit' }],
        board: ['Readers', 'Advertisers', 'Partners', 'Rivals', 'Platforms', 'Regulators'],
        credits: ['Group 4 · CDPS-EMI 1151', 'Course materials: Co-opetition, Chen (1996), Platform Revolution', 'AI use: Claude drafted, members checked every fact', 'Sources with licences and access dates'],
      },
      productionLabel: 'How it is made',
      production: [
        { name: 'HyperFrames', icon: null, text: 'Animates the same Vue components as the site' },
        { name: 'Fish.Audio', icon: 'fishaudio', text: 'English narration from a script of about 280 words' },
        { name: 'ffmpeg', icon: 'ffmpeg-icon', text: 'Burns in the subtitles in both languages' },
        { name: 'Epidemic Sound', icon: null, text: 'Music under a group member’s licence' },
      ],
    },
  }),

  zh: build({
    id: 'output',
    kicker: '部署成果',
    track: '提案 §5 · https://<org>.github.io/<repo>/，網址待確定',
    title: '儀表板',
    intro: '一個 Vue 單頁應用程式，中英雙語，手機與桌機皆適用，所有資料讀取自版本庫中的 JSON 檔。每個段落都圍繞一個課程框架，熟悉框架的訪客可以把頁面當成論證來讀，不熟悉的訪客則可以當成故事來讀。',
    statusNames: { opened: '已開啟', partial: '部分蒐集', todo: '待蒐集', context: '背景參考' },

    page: {
      id: 'out-page',
      label: '頁面由上而下',
      title: '九個段落，各自圍繞一個框架。',
      mockLabel: '部署後的頁面',
      sections: [
        { name: '開場', text: '研究問題與五個主要數字，每個數字都連結到來源', href: '#background' },
        { name: '賽局棋盤：價值網', tags: 'AQ1 · AQ2 · 競合', text: '點選參與者，查看其角色、往來流動與我們的敵友判斷', href: '#out-maps' },
        { name: '競爭者地圖', tags: 'AQ3 · Chen（1996）', text: '市場共同性 × 資源相似性；滑過對手可看其 AMC 預測', href: '#out-maps' },
        { name: '行動與回應時間軸', tags: 'AQ3 · AMC', text: '每個行動者一條軌道，連線標示相隔天數；可篩選、點選、拖曳日期區間', href: '#site' },
        { name: '平台儀表板', tags: 'AQ1 · AQ4 · AQ6', text: '最多八張圖表：滑過看數值、切換序列、框選區間', href: '#out-dash' },
        { name: '規則面板', tags: 'AQ5', text: '有日期的規則事件與基金情境滑桿', href: '#questions' },
        { name: '洞察', tags: 'AQ1–AQ6 · PARTS', text: '六張卡片，每個 AQ 一張，最後是五項 PARTS 建議', href: '#out-insights' },
        { name: '影片', text: '兩分鐘雙語簡報影片，嵌入自 YouTube', href: '#out-video' },
        { name: '頁尾', text: 'AI 使用聲明、附授權與存取日期的來源、團隊、課程教材、版本庫', href: '#contact' },
      ],
      canLabel: '訪客可以做的事',
      can: ['切換語言', '篩選、框選並點選時間軸', '拖動情境滑桿', '查看任何數值', '開啟任何來源'],
      cannotLabel: '訪客不能做的事',
      cannot: ['登入', '提交資料', '觸發即時爬取'],
      staticNote: '頁面刻意保持靜態，因此不需伺服器與金鑰也能持續運作。',
      buildLabel: '如何完成',
      build: [
        { week: 'W12', text: '資料凍結並完成查核（TP-Data）' },
        { week: 'W13', text: '單頁應用骨架、語言切換，時間軸接上真實資料列' },
        { week: 'W14', text: '儀表板、價值網面板與洞察卡片；初稿以 TP-Web 繳交' },
        { week: 'W15', text: '錄製並嵌入影片、修正行動版、TP Final' },
        { week: 'W16', text: '前一個週末上線，供同學與教授評分' },
      ],
      buildNote: '影片取材自網站的同一組動畫，因此兩者同步製作，而非先後完成。',
      checkLabel: '第 16 週前的品質檢查',
      check: ['兩種語言各由一位母語者閱讀', '每張圖表都與來源資料表比對', '每個連結都實際開啟', '檢查手機與桌機畫面', '影片可在頁面內播放'],
    },

    maps: {
      id: 'out-maps',
      label: '地圖',
      title: '一張可以點選的賽局棋盤，一張誰回應誰的地圖。',
      boardLabel: '賽局棋盤：價值網（AQ1、AQ2）',
      boardHint: '點選參與者',
      roles: { customer: '顧客', supplier: '供應者', competitor: '競爭者', complementor: '互補者', rules: '規則制定者' },
      flip: ['互補者', '競爭者'],
      panel: { role: '角色', gives: '給 ETtoday', gets: '從 ETtoday 得到', verdict: '判斷', rows: '紀錄中的資料列', none: '尚無紀錄' },
      draftNote: '判斷仍是草稿；最終判斷將與查核後的資料列一起在第 14 週完成。',
      players: [
        { name: '讀者', gives: '注意力與瀏覽資料', gets: '網頁與行動裝置上免費、即時的新聞', verdict: '顧客' },
        { name: '廣告主', gives: '展示、原生、影音與社群贊助版位的預算，以及台北捷運戶外版位', gets: '讀者的注意力', verdict: '顧客' },
        { name: '內容夥伴', gives: '合作媒體與專欄作者供應的文字、影音與垂直報導', gets: '在 ettoday.net 與 App 上的版面', verdict: '供應者' },
        { name: '對手品牌', gives: '沒有直接給予：爭取同一批讀者與廣告主', gets: '–', verdict: '競爭者', members: 'TVBS新聞網、東森新聞網、三立新聞網、聯合新聞網、自由時報電子報、NOWnews' },
        { name: '分發平台', gives: '導流到 ETtoday 的讀者', gets: '可轉載的新聞；同時爭取同一批廣告主', verdict: '兩者皆是：互補者也是競爭者', members: 'LINE TODAY、Google、Meta、YouTube' },
        { name: '主管機關', gives: '賽局規則', gets: '–', verdict: '規則制定者：PARTS 的規則槓桿', members: '立法院、數發部、公平會' },
      ],
      mapLabel: '競爭者地圖：市場共同性 × 資源相似性（AQ3）',
      axes: { x: '市場共同性', xNote: '與 ETtoday 共享的受眾與平台空間', y: '資源相似性', yNote: '編輯台規模、電視母公司、影音能力、App' },
      quadrants: [
        { key: 'hh', name: '最可能察覺並回應', text: '市場與資源皆相近：察覺、動機與能力都高' },
        { key: 'lh', name: '有能力，動機較低', text: '資源相近，共享市場少' },
        { key: 'hl', name: '有動機，能力較低', text: '共享市場，資源不同' },
        { key: 'll', name: '最不可能回應', text: '兩個面向都少有共同點' },
      ],
      trayLabel: '評分後才放上地圖',
      trayNote: '代理人為每個對手計算初步分數，再由策略分析組調整（第 12 週）。在此之前不放任何對手，地圖上沒有猜測。',
    },

    dash: {
      id: 'out-dash',
      label: '時間軸與儀表板',
      title: '最多八張圖表。',
      text: '依《平台革命》第 9 章，儀表板以八張圖表為上限。滑過看數值、切換序列、框選區間；在時間軸上拖曳，可設定下方所有圖表的日期區間。每張圖表都標示來源與授權。',
      inHand: '已取得的數字',
      awaiting: '等待資料',
      tiles: [
        { name: 'ETtoday 流量結構，2017–2025', chart: '堆疊面積圖', source: '東森國際年報', series: ['直接流量', '社群'] },
        { name: '各年度營收、損益與人力', chart: '長條與折線', source: '年報', labels: ['人力', '2025 年 7 月起獲利'] },
        { name: '各品牌每週使用率與信任度，2017–2026', chart: '多線圖', source: '路透 DNR', labels: ['ETtoday 每週使用率', '信任度 46%（2026）'] },
        { name: '各品牌 Google 搜尋熱度', chart: '多線圖，標示事件', source: 'Google 搜尋趨勢' },
        { name: '各媒體每月文章數，對照人力', chart: '折線', source: '新聞 Sitemap' },
        { name: '各頻道 YouTube 上傳數與 Shorts 比例', chart: '小倍數圖', source: 'YouTube Data API' },
        { name: '各格式數位廣告量', chart: '堆疊長條圖', source: 'DMA 報告', labels: ['億元'] },
        { name: '每月 App 評分與評論主題', chart: '折線與長條', source: 'App 商店' },
      ],
    },

    insights: {
      id: 'out-insights',
      label: '商業洞察',
      title: '六張卡片，每個問題一個答案。',
      text: '每張卡片包含兩段答案、所依據的圖表或時間軸畫面，以及查核後資料列的連結。本段最後依 PARTS 檢核表，向 ETtoday 提出建議。',
      restsOn: '依據',
      answer: '答案',
      pending: '資料凍結後撰寫，第 12–14 週',
      viewNames: { 'out-maps': '地圖', site: '時間軸', 'out-dash': '儀表板', questions: '規則面板' },
      forcesLabel: '贏者全拿的四股力量（《平台革命》第 10 章）',
      forces: ['供給端規模經濟', '強烈的網路效應', '多棲成本與轉換成本高', '利基專業化不足'],
      cards: [
        { lens: '參與者、附加價值', q: 'ETtoday 價值網中有哪些參與者？在直接流量（47.5%）與 App 流量（36.3%）已超過平台導流的情況下，它的附加價值從何而來？' },
        { lens: '範疇、競合', q: 'LINE TODAY、Google、Meta 與 YouTube 對 ETtoday 而言是互補者還是競爭者？它們帶來讀者，還是搶走廣告主？自 2025 年以來這個平衡如何變化？' },
        { lens: '戰術、AMC', q: '當對手或平台出手時，無論是新形式、促銷、合作或 AI 產品，ETtoday 回應得多快？通常誰先出手？市場共同性與資源相似性的組合（Chen 1996），能否預測哪些對手會回應？' },
        { lens: '營收模式', q: '2025 年的轉虧為盈，有多少來自成本（AI 組織調整），多少來自營收（數位廣告、交通戶外媒體、電商合作）？平台各方各自失去或得到了什麼？' },
        { lens: '規則', q: '媒體議價法草案、數發部共享分潤平台與 Google 3 億元新聞基金，會如何改變 ETtoday 的賽局規則？' },
        { lens: '網路效應', q: '跨邊網路效應會把台灣網路新聞市場推向單一贏家，還是信任下降與社群優先的習慣會使它分散？ETtoday 下一步該押注何處？' },
      ],
      partsLabel: '依 PARTS 檢核表給 ETtoday 的建議（《競合》第 9 章）',
      parts: [
        { name: '參與者', text: '該把誰帶進賽局' },
        { name: '附加價值', text: 'ETtoday 有哪些別人無法提供的價值' },
        { name: '規則', text: '要形塑哪些規則、如何形塑' },
        { name: '戰術', text: '如何改變他人的認知' },
        { name: '範疇', text: '哪些賽局該連結，哪些該分開' },
      ],
      partsPending: '每項一個建議，與洞察卡片一起撰寫',
    },

    video: {
      id: 'out-video',
      label: '簡報影片',
      title: '兩分鐘、兩種語言，就在頁面裡。',
      specs: ['英文旁白', '中英文字幕', '1080p', 'YouTube 不公開影片，嵌入頁面'],
      preview: '分鏡預覽：影片將於第 15 週錄製，屆時取代這個播放器。',
      play: '播放', pause: '暫停', subtitles: '字幕', off: '關閉',
      chapters: '章節',
      onScreen: '畫面',
      beats: [
        { name: '謎題', screen: '主要數字逐一出現' },
        { name: '賽局棋盤', screen: '價值網成形；LINE、Google 與 Meta 在互補者與競爭者之間翻轉' },
        { name: '誰出手、誰回應', screen: '競爭者地圖，接著在時間軸上放大兩三組行動與回應' },
        { name: '數字', screen: '流量結構面積圖、損益與人力、標示事件的搜尋趨勢' },
        { name: '結論與建議', screen: 'AQ6 贏者全拿檢驗，接著是五項 PARTS 建議' },
        { name: '片尾', screen: '團隊、課程教材、AI 使用聲明、資料來源' },
      ],
      stage: {
        numbers: [{ v: '38%', l: '每週使用率' }, { v: '46%', l: '信任度' }, { v: '47.5%', l: '直接流量' }, { v: '36.3%', l: 'App 流量' }, { v: '2025/7', l: '轉虧為盈' }],
        board: ['讀者', '廣告主', '夥伴', '對手', '平台', '主管機關'],
        credits: ['第四組 · CDPS-EMI 1151', '課程教材：《競合》、Chen（1996）、《平台革命》', 'AI 使用：Claude 草擬，組員逐一查核', '附授權與存取日期的資料來源'],
      },
      productionLabel: '製作方式',
      production: [
        { name: 'HyperFrames', icon: null, text: '以網站的同一組 Vue 元件製作動畫' },
        { name: 'Fish.Audio', icon: 'fishaudio', text: '依約 280 字的講稿生成英文旁白' },
        { name: 'ffmpeg', icon: 'ffmpeg-icon', text: '燒錄中英文字幕' },
        { name: 'Epidemic Sound', icon: null, text: '使用組員授權的音樂' },
      ],
    },
  }),
};
