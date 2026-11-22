// Section: Background (Project Track & Topic Statement), proposal §1.
// The same shape in both languages; tests/content.test.js fails if the two drift.
// Every figure comes from the proposal; each carries its source.

const src = {
  dnr: 'https://www.ettoday.net/news/20260617/3184999.htm',
  finance: 'https://finance.ettoday.net/news/3063136',
  dma: 'https://www.bnext.com.tw/podcast/2168/fs-cmtcsw21g0wdf01vrbdcvfozf',
};

// Window of study, shared by both languages
const studyWindow = { start: '2025-01-01', end: '2026-12-31', turnaround: '2025-07-01' };

export const background = {
  en: {
    id: 'background',
    kicker: 'Background',
    track: 'Track 2 · Platform Strategy Analysis',
    title: 'ETtoday sits on both sides of Taiwan’s news business.',
    intro: 'Taiwan’s news has split into two layers: newsrooms that produce it, and platforms that decide who sees it. ETtoday runs a platform of its own, with readers on one side and advertisers on the other, and it also supplies the much larger platforms that now deliver most of Taiwan’s news.',

    problem: {
      id: 'bg-problem',
      label: 'Focal problem',
      title: 'Readers trust it. For four years, it lost money.',
      seam: 'yet',
      columns: [
        {
          tone: 'yes',
          heading: 'What readers say',
          stats: [
            { value: 38, unit: '%', caption: 'weekly use: the most-used online news brand in Taiwan (Yahoo portal excluded)', source: 'Digital News Report 2026', href: src.dnr },
            { value: 46, unit: '%', caption: 'trust ETtoday, against 25% for news in general', source: 'Digital News Report 2026', href: src.dnr },
          ],
        },
        {
          tone: 'no',
          heading: 'What the accounts said',
          stats: [
            { value: 4, unit: 'years', caption: 'of losses in a row, until profit returned in July 2025', source: 'ETtoday 財經雲, 6 Nov 2025', href: src.finance },
            { value: 385, from: 561, unit: 'staff', caption: 'after AI tools came into the newsroom, down from 561', source: 'ETtoday 財經雲, 6 Nov 2025', href: src.finance },
          ],
        },
      ],
      meanwhile: {
        label: 'Meanwhile, where Taiwan goes for news',
        unit: 'use it for news',
        source: 'Digital News Report 2026',
        href: src.dnr,
        bars: [
          { name: 'LINE', value: 49 },
          { name: 'YouTube', value: 48 },
          { name: 'Facebook', value: 47 },
        ],
        market: {
          value: 'NT$66.2B',
          caption: 'digital ad market in 2025. Its growth goes to international platforms while local media’s share shrinks.',
          source: 'DMA 2025, via Bnext',
          href: src.dma,
        },
      },
      question: {
        label: 'Research question',
        segments: [
          { text: 'Does ETtoday’s platform strategy, meaning its network effects, how it makes money, and how it deals with LINE, Google, Meta and YouTube, explain the ' },
          { text: '2025 turnaround', mark: true },
          { text: ', and is that turnaround ' },
          { text: 'sustainable', mark: true },
          { text: '?' },
        ],
      },
    },

    scope: {
      id: 'bg-scope',
      label: 'Research scope',
      title: 'Taiwan only, January 2025 to December 2026.',
      body: 'The unit of analysis is ETtoday’s website and app, read against the rivals that compete for the same readers and the platforms it depends on for reach.',
      mapLabel: 'Taiwan',
      core: { name: 'ETtoday', sub: 'Website + app', role: 'Unit of analysis' },
      rings: [
        { key: 'brands', label: 'News brands', role: 'Compared with', items: ['TVBS新聞網', '東森新聞網', '三立新聞網', 'UDN', 'LTN', 'NOWnews'] },
        { key: 'platforms', label: 'Distribution platforms', role: 'Compared with', items: ['LINE TODAY', 'Google', 'Meta', 'YouTube'] },
        { key: 'regulators', label: 'Rule-setters', role: 'Enter as', items: ['Legislative Yuan', 'MODA', 'Fair Trade Commission'], short: ['Legislature', 'MODA', 'FTC'] },
      ],
      out: { label: 'Out of scope', items: ['TV ratings', 'Print circulation', 'Editorial quality'] },
      timeline: {
        ...studyWindow,
        label: 'Window of study',
        startLabel: 'Jan 2025',
        endLabel: 'Dec 2026',
        turnaroundLabel: 'Back to profit',
        todayLabel: 'Today',
      },
    },

    objectives: {
      id: 'bg-objectives',
      label: 'Project objectives',
      title: 'Five objectives, each with something to show for it.',
      columns: ['Objective', 'Course lens', 'What it produces'],
      items: [
        {
          title: 'Map the Value Net',
          body: 'The customers, suppliers, competitors and complementors around ETtoday, read through the five PARTS levers: Players, Added value, Rules, Tactics, Scope.',
          lens: 'Co-opetition', lensBy: 'Brandenburger & Nalebuff',
          output: 'A Value Net map', href: '#questions',
        },
        {
          title: 'Time every move and answer',
          body: 'A dated action–response timeline for ETtoday, its rivals and the platforms, each pair read through AMC: Awareness, Motivation, Capability.',
          lens: 'Competitive dynamics', lensBy: 'Chen 1996',
          output: 'An action–response log', href: '#site',
        },
        {
          title: 'Track the platform’s vital signs',
          body: 'Weekly use, trust, traffic mix, the ad market and the parent company’s financials, over time.',
          lens: 'Platform Revolution', lensBy: 'Parker, Van Alstyne & Choudary',
          output: 'A dashboard of eight charts at most', href: '#sources',
        },
        {
          title: 'Answer six questions',
          body: 'AQ1 to AQ6, from who the players are to where ETtoday should place its next bets, ending in concrete advice.',
          lens: 'All three lenses', lensBy: 'AQ1 to AQ6',
          output: 'Recommendations for ETtoday', href: '#questions',
        },
        {
          title: 'Publish it',
          body: 'Everything above, as a bilingual interactive web page with a two-minute video.',
          lens: 'Deliverable', lensBy: 'Week 16',
          output: 'This site and a two-minute video', href: '#stack',
        },
      ],
    },
  },

  zh: {
    id: 'background',
    kicker: '研究背景',
    track: '第二軌 · 平台策略分析',
    title: 'ETtoday 同時站在台灣新聞產業的兩端。',
    intro: '台灣的新聞產業已分成兩層：一層產製新聞，另一層決定誰看得到。ETtoday 經營自有平台，一邊是讀者，一邊是廣告主；同時，它也為如今傳遞多數台灣新聞的大型平台供應內容。',

    problem: {
      id: 'bg-problem',
      label: '核心問題',
      title: '讀者信任它，它卻連續虧損四年。',
      seam: '卻',
      columns: [
        {
          tone: 'yes',
          heading: '讀者怎麼說',
          stats: [
            { value: 38, unit: '%', caption: '每週使用率，台灣最多人使用的網路新聞品牌（不含 Yahoo 入口網站）', source: '數位新聞報告 2026', href: src.dnr },
            { value: 46, unit: '%', caption: '信任 ETtoday，台灣新聞整體信任度僅 25%', source: '數位新聞報告 2026', href: src.dnr },
          ],
        },
        {
          tone: 'no',
          heading: '帳面怎麼說',
          stats: [
            { value: 4, unit: '年', caption: '連續虧損，直到 2025 年 7 月轉虧為盈', source: 'ETtoday 財經雲，2025 年 11 月 6 日', href: src.finance },
            { value: 385, from: 561, unit: '人', caption: '導入 AI 工具後的員工人數，原為 561 人', source: 'ETtoday 財經雲，2025 年 11 月 6 日', href: src.finance },
          ],
        },
      ],
      meanwhile: {
        label: '同一時間，台灣人在這些地方看新聞',
        unit: '用來看新聞',
        source: '數位新聞報告 2026',
        href: src.dnr,
        bars: [
          { name: 'LINE', value: 49 },
          { name: 'YouTube', value: 48 },
          { name: 'Facebook', value: 47 },
        ],
        market: {
          value: 'NT$662 億',
          caption: '2025 年數位廣告市場。成長集中在國際平台，本土媒體的占比持續縮小。',
          source: 'DMA 2025，數位時代報導',
          href: src.dma,
        },
      },
      question: {
        label: '研究問題',
        segments: [
          { text: 'ETtoday 的平台策略，包括網路效應、營收模式，以及與 LINE、Google、Meta 和 YouTube 的競合，能否解釋' },
          { text: '2025 年的轉虧為盈', mark: true },
          { text: '？這樣的轉變能否' },
          { text: '持續', mark: true },
          { text: '？' },
        ],
      },
    },

    scope: {
      id: 'bg-scope',
      label: '研究範圍',
      title: '只看台灣，2025 年 1 月至 2026 年 12 月。',
      body: '分析單位是 ETtoday 的網站與 App，並與爭取同一批讀者的對手、以及它賴以觸及讀者的平台相互比較。',
      mapLabel: '台灣',
      core: { name: 'ETtoday', sub: '網站 + App', role: '分析單位' },
      rings: [
        { key: 'brands', label: '新聞品牌', role: '比較對象', items: ['TVBS新聞網', '東森新聞網', '三立新聞網', '聯合新聞網', '自由時報電子報', 'NOWnews'] },
        { key: 'platforms', label: '分發平台', role: '比較對象', items: ['LINE TODAY', 'Google', 'Meta', 'YouTube'] },
        { key: 'regulators', label: '規則制定者', role: '角色', items: ['立法院', '數位發展部', '公平交易委員會'], short: ['立法院', '數發部', '公平會'] },
      ],
      out: { label: '不在範圍內', items: ['電視收視率', '紙本發行量', '新聞品質'] },
      timeline: {
        ...studyWindow,
        label: '研究期間',
        startLabel: '2025 年 1 月',
        endLabel: '2026 年 12 月',
        turnaroundLabel: '轉虧為盈',
        todayLabel: '今天',
      },
    },

    objectives: {
      id: 'bg-objectives',
      label: '專題目標',
      title: '五個目標，各有具體產出。',
      columns: ['目標', '課程視角', '產出'],
      items: [
        {
          title: '繪製價值網',
          body: '盤點 ETtoday 周圍的顧客、供應者、競爭者與互補者，並以 PARTS 五個槓桿解讀：參與者、附加價值、規則、戰術、範疇。',
          lens: '競合', lensBy: 'Brandenburger & Nalebuff',
          output: '價值網圖', href: '#questions',
        },
        {
          title: '記錄每一次出手與回應',
          body: '為 ETtoday、對手與平台建立有日期的行動與回應時間軸，每一組以 AMC 解讀：察覺、動機、能力。',
          lens: '競爭動態', lensBy: 'Chen 1996',
          output: '行動與回應紀錄', href: '#site',
        },
        {
          title: '追蹤平台的關鍵指標',
          body: '每週使用率、信任度、流量組成、廣告市場與母公司財務，隨時間的變化。',
          lens: '平台革命', lensBy: 'Parker、Van Alstyne & Choudary',
          output: '最多八張圖表的儀表板', href: '#sources',
        },
        {
          title: '回答六個分析問題',
          body: 'AQ1 至 AQ6，從誰是參與者，到 ETtoday 下一步該押注何處，最後提出具體建議。',
          lens: '三個視角並用', lensBy: 'AQ1 至 AQ6',
          output: '給 ETtoday 的建議', href: '#questions',
        },
        {
          title: '公開成果',
          body: '以上所有內容，做成雙語互動網頁與兩分鐘影片。',
          lens: '交付成果', lensBy: '第 16 週',
          output: '本網站與兩分鐘影片', href: '#stack',
        },
      ],
    },
  },
};
