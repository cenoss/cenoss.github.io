// Section: Data Sources (proposal §3), with the acquisition channels of stage 1 in G4_Agent_Workflow.svg.
// Title, intro, the four one-line descriptions and the file shelf are kept from the earlier sources section.
// Facts shared by both languages (status, years, links, icons) are defined once here; words are zipped in.

const url = {
  mops: 'https://mops.twse.com.tw/mops/#/web/t146sb05?companyId=2614',
  moea: 'https://findbiz.nat.gov.tw/fts/company/04964250',
  ncc: 'https://data.gov.tw/en/datasets/165202',
  ly: 'https://data.ly.gov.tw/',
  ftc: 'https://www.ftc.gov.tw/',
  dnr: 'https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/taiwan',
  twnic: 'https://report.twnic.tw/2025/',
  ecpro: 'https://ecpro.tw/reports/tw-traffic-halfyear-2026',
};

// status as of the proposal (8 Nov 2026): opened, partial (partly collected), todo (to collect), context (background reading)
const channels = [
  { key: 'records', side: 'secondary', icon: 'file', items: [
    { status: 'opened', href: url.mops }, { status: 'todo', href: url.mops }, { status: 'opened', href: url.moea },
    { status: 'todo', href: url.ncc }, { status: 'todo', href: url.ly }, { status: 'opened', href: url.ftc },
  ] },
  { key: 'reports', side: 'secondary', icon: 'file', items: [
    { status: 'partial', href: url.dnr }, { status: 'opened', href: url.twnic }, { status: 'partial' }, { status: 'context' },
  ] },
  { key: 'apis', side: 'primary', icon: 'code', items: [
    { status: 'todo' }, { status: 'todo' }, { status: 'todo' }, { status: 'todo' }, { status: 'todo' },
  ] },
  { key: 'news', side: 'primary', icon: 'globe', status: 'partial', items: [{}, {}, {}] },
];

// the dashboard series (§3.3), in priority order: the years planned, and the years already in hand
const series = [
  { key: 'traffic', from: 2017, to: 2025, have: [2017, 2023, 2024, 2025], status: 'partial' },
  { key: 'finance', from: 2021, to: 2025, have: [2023, 2024, 2025], status: 'partial' },
  { key: 'use', from: 2017, to: 2026, have: [2023, 2025, 2026], status: 'partial' },
  { key: 'search', from: 2021, to: 2026, have: [], status: 'todo' },
  { key: 'articles', from: 2025, to: 2026, have: [], status: 'todo' },
  { key: 'adspend', from: 2016, to: 2025, have: [2024, 2025], status: 'partial' },
  { key: 'monthly', from: 2015, to: 2026, have: [], status: 'todo' },
  { key: 'youtube', from: 2023, to: 2026, have: [], status: 'todo' },
  { key: 'reviews', from: 2023, to: 2026, have: [], status: 'todo' },
  { key: 'jobs', from: 2023, to: 2026, have: [], status: 'todo' },
  { key: 'map', from: 2026, to: 2026, have: [], status: 'todo' },
];

// the files read so far (kept from the earlier section)
const fileIcons = ['google-sheets', 'pdf', 'pdf', 'youtube', 'pdf', 'pdf', 'json', 'xlsx', 'xlsx', 'xml', 'pdf', 'json'];

const zip = (base, texts) => base.map((b, i) => ({ ...b, ...texts[i] }));
const build = (t) => ({
  ...t,
  channels: {
    ...t.channels,
    list: channels.map((c, i) => ({ ...c, ...t.channels.list[i], items: zip(c.items, t.channels.list[i].items) })),
  },
  series: { ...t.series, rows: zip(series, t.series.rows) },
  status: { ...t.status, files: zip(fileIcons.map((icon) => ({ icon })), t.status.files) },
});

export const sources = {
  en: build({
    id: 'sources',
    kicker: 'Data sources',
    track: 'Proposal §3 · Collection mode: automatic',
    title: 'ETtoday Data From Four Types of Public Source',
    intro: 'No single database covers ETtoday, so each figure comes from a public record, a report, a time series or the news itself.',
    statusNames: { opened: 'Opened', partial: 'Partly collected', todo: 'To collect', context: 'Background reading' },

    channels: {
      id: 'src-channels',
      label: 'Acquisition channels',
      title: 'Two channels we read, two we collect ourselves.',
      sides: {
        secondary: { name: 'Secondary', text: 'Published by someone else. The agent reads the filings and extracts the tables.' },
        primary: { name: 'Primary', text: 'Collected and coded by the group, through the agent, from APIs, sitemaps and the news itself.' },
      },
      how: 'How the agent retrieves it',
      usedFor: 'Used for',
      list: [
        {
          name: 'Official records',
          line: 'MOPS filings for 東森國際 (2614), the MOEA registry, 立法院 open data',
          method: 'Read filings and open-data tables',
          items: [
            { name: 'MOPS: 東森國際 (2614)', what: 'Annual reports, monthly revenue, segment notes; the 114年度年報 already gives the traffic mix and 28.88 M Facebook followers', used: 'AQ1, AQ4, dashboard' },
            { name: 'MOPS: 遊戲橘子 (6180)', what: 'NOWnews (今日傳媒) losses, the comparison firm', used: 'AQ4, AQ6' },
            { name: 'MOEA company registry', what: '東森新媒體控股: registration (2009), rename (2019), paid-in capital, directors', used: 'Chosen platform' },
            { name: 'data.gov.tw: NCC datasets', what: 'Media advertising monthly report, complaints by media category, NCC announcements; fields to confirm', used: 'AQ5, AQ6' },
            { name: '立法院 open data', what: 'The 媒體議價法 drafts and committee reviews as dated rule events', used: 'AQ5, timeline' },
            { name: '公平會 and 數發部 reports', what: 'Competition-policy stance on news bargaining; Google’s NT$300 M fund; the shared revenue platform plan', used: 'AQ5' },
          ],
        },
        {
          name: 'Research and market reports',
          line: 'Reuters Digital News Report 2024–2026, TWNIC 2025, DMA ad spend',
          method: 'Extract tables from report PDFs',
          items: [
            { name: 'Reuters Digital News Report 2024–2026', what: 'Weekly use and trust by brand, platforms used for news, share paying for news; 2026 opened, 2024 and 2025 tables to extract', used: 'AQ2, AQ6, dashboard' },
            { name: 'TWNIC 2025 台灣網路報告', what: 'TV as main news source fell from 39.57% (2024) to 32.02% (2025)', used: 'AQ2, AQ6' },
            { name: 'DMA digital ad spend 2023–2025', what: 'Market size and split; 2025 total NT$661.77 億. Press summary opened, PDF to obtain', used: 'AQ4, dashboard' },
            { name: 'LY Corp (LINE), Alphabet and Meta annual reports', what: 'Platform-side revenue and news policy', used: 'AQ2, AQ5' },
          ],
        },
        {
          name: 'APIs, sitemaps and exports',
          line: 'YouTube uploads, articles per month, app reviews, search interest and job listings',
          method: 'API calls, sitemap crawl, CSV export',
          items: [
            { name: 'YouTube Data API v3', what: 'Uploads per month, Shorts share, subscribers and median views for six news channels; the API key stays out of the repo', used: 'Dashboard' },
            { name: 'Outlet news sitemaps', what: 'Articles per month by outlet, the publish date read from the URL: did AI keep volume up with fewer staff?', used: 'Dashboard' },
            { name: 'Google Play and App Store reviews', what: 'Rating by month; each review tagged by theme (ads, speed, push, content)', used: 'Dashboard' },
            { name: 'Google Trends CSV', what: 'Weekly search interest for ETtoday, TVBS新聞, 三立新聞, 聯合新聞網, 自由時報 and LINE TODAY', used: 'Dashboard' },
            { name: '104 job listings and Wayback snapshots', what: 'Role mix over time (AI engineer, video editor, reporter) as a capability signal', used: 'AQ3' },
          ],
        },
        {
          name: 'News corpus, January 2025 onward',
          line: 'One row per news article since January 2025, each with its source link',
          method: 'RSS polling, public page fetch',
          items: [
            { name: 'Eight outlets', what: 'ETtoday, UDN, LTN, CNA, TVBS, Bnext, iThome, 工商時報' },
            { name: 'The actors', what: 'Stories on ETtoday, six rival brands and LINE TODAY, Google, Meta, YouTube' },
            { name: 'One row per article', what: 'Date, actor, action type, target, source URL, a short summary in Chinese and English, and the member who checked it', used: 'Timeline, AQ3; its events mark every series' },
          ],
        },
      ],
      indicative: {
        label: 'Cross-checks only, labelled indicative',
        text: 'Not open-licensed, so never a figure on their own.',
        items: [
          { name: 'SimilarWeb', what: 'Traffic-source split for each rival: the one cross-check on the annual-report traffic mix' },
          { name: 'App rankings', what: 'App Store and Google Play rankings' },
          { name: 'Ahrefs-based ranking', what: 'Suggests ETtoday’s search traffic fell sharply from H2 2025 to H1 2026: a lead for AQ2 we will try to reproduce', href: url.ecpro },
        ],
      },
    },

    run: {
      id: 'src-run',
      label: 'The weekly collection run',
      title: 'Once a week, the agent fills the staging tab.',
      text: 'The Work/Task Agent appends candidate rows to the staging tab once a week.',
      tbd: 'Scheduled task or manual start stays TBD until the first full pipeline test in W11.',
      agent: { name: 'Work/Task Agent', sub: 'A Claude Project, guided by KB.md' },
      staging: { name: 'Staging tab', sub: 'Google Sheets' },
      flowLabel: 'candidate rows',
      next: { label: 'Next: a member checks every row', href: '#pipeline' },
      rows: [
        { name: 'News row, one per article', fields: ['date', 'actor', 'action_type', 'target', 'source_url', 'summary_zh', 'summary_en'], example: ['2025-08-06', '立法院', 'regulatory or legal', '媒體議價法', 'taiwannews.com.tw/…', '草案送交黨團協商', 'Drafts sent to party negotiation'] },
        { name: 'KPI row, one per figure', fields: ['brand', 'year', 'metric', 'value', 'source'], example: ['ETtoday', '2026', 'weekly_use', '38%', 'DNR 2026'] },
      ],
      rulesLabel: 'Rules the agent cannot skip',
      rules: ['No figure appears without a source URL.', 'No API keys in the repo.', 'Nothing reaches the site without a member’s name in checked_by.'],
    },

    series: {
      id: 'src-series',
      label: 'Time series for the dashboard',
      title: 'A single number per source is a sentence, not a chart.',
      text: 'The dashboard needs series that run over years and compare brands. These are the series we will build, in priority order.',
      legend: { span: 'Years planned', have: 'Figure already in hand' },
      rows: [
        { name: 'ETtoday traffic mix', source: '東森國際 annual reports', chart: 'Stacked area, timeline events overlaid' },
        { name: 'Revenue, profit or loss, headcount', source: 'Annual reports', chart: 'Bars for revenue, lines for profit and staff' },
        { name: 'Weekly use and trust by brand', source: 'Reuters DNR', chart: 'Multi-line, toggle brands' },
        { name: 'Search interest by brand', source: 'Google Trends', chart: 'Multi-line with event markers' },
        { name: 'Articles per month by outlet', source: 'News sitemaps', chart: 'Output against headcount' },
        { name: 'Digital ad spend by format', source: 'DMA reports', chart: 'Stacked bars' },
        { name: '東森國際 monthly revenue, 新媒體 segment', source: 'MOPS', chart: 'Long line plus segment bars' },
        { name: 'YouTube channel activity', source: 'YouTube Data API', chart: 'Small multiples per channel' },
        { name: 'App rating and review themes', source: 'App stores', chart: 'Rating line plus theme bars' },
        { name: 'Job postings by role', source: '104 and Wayback', chart: 'Role mix over time' },
        { name: 'Competitor map inputs', source: 'DNR and public indicators', chart: '2×2 scatter, Chen (1996)' },
      ],
    },

    status: {
      id: 'src-status',
      label: 'Where collection stands',
      title: 'What we have opened, and what is still to come.',
      asOf: 'Status of each source as of the proposal, 8 Nov 2026',
      sourcesLabel: 'sources',
      verify: 'Every tagged news row is checked against the original article and every KPI against the original PDF or filing. We keep the URL and access date for each item and reproduce the licence line for data.gov.tw datasets in the site footer. Reports are summarised, never copied.',
      link: { label: 'See What Remains Unverified', href: '#faq' },
      filesLabel: 'The twelve files behind the data sheet',
      files: [
        { name: 'Data sheet', by: 'Google Sheets' },
        { name: '東森國際 114年度年報', by: 'MOPS' },
        { name: 'Digital News Report 2026', by: 'Reuters Institute' },
        { name: 'Channel uploads', by: 'YouTube Data API' },
        { name: '數位廣告量統計 2025', by: 'DMA' },
        { name: '台灣網路報告 2025', by: 'TWNIC' },
        { name: '媒體議價法 reviews', by: '立法院 open data' },
        { name: 'NCC datasets', by: 'data.gov.tw' },
        { name: 'Search interest by brand', by: 'Google Trends' },
        { name: 'Articles per month', by: 'Sitemaps' },
        { name: '數位經濟競爭政策白皮書', by: '公平會' },
        { name: 'verified.json', by: 'GitHub' },
      ],
    },
  }),

  zh: build({
    id: 'sources',
    kicker: '資料來源',
    track: '提案 §3 · 蒐集方式：自動',
    title: 'ETtoday 資料的四種公開來源',
    intro: '沒有單一資料庫能完整涵蓋 ETtoday，因此每筆數據皆來自公開紀錄、調查報告、時間序列或新聞本身。',
    statusNames: { opened: '已開啟', partial: '部分蒐集', todo: '待蒐集', context: '背景參考' },

    channels: {
      id: 'src-channels',
      label: '資料取得管道',
      title: '兩個管道靠閱讀，兩個管道自行蒐集。',
      sides: {
        secondary: { name: '次級資料', text: '由他人發布。代理人閱讀申報文件並擷取表格。' },
        primary: { name: '初級資料', text: '由本組透過代理人，從 API、Sitemap 與新聞本身自行蒐集並編碼。' },
      },
      how: '代理人如何取得',
      usedFor: '用於',
      list: [
        {
          name: '官方紀錄',
          line: '東森國際（2614）的公開資訊觀測站申報、經濟部商工登記、立法院開放資料',
          method: '閱讀申報文件與開放資料表',
          items: [
            { name: '公開資訊觀測站：東森國際（2614）', what: '年報、月營收、部門資訊；114年度年報已提供流量結構與 2,888 萬 Facebook 追蹤數', used: 'AQ1、AQ4、儀表板' },
            { name: '公開資訊觀測站：遊戲橘子（6180）', what: 'NOWnews（今日傳媒）的虧損，作為比較對象', used: 'AQ4、AQ6' },
            { name: '經濟部商工登記', what: '東森新媒體控股：登記（2009）、更名（2019）、實收資本額、董監事', used: '研究對象' },
            { name: '政府資料開放平臺：NCC 資料集', what: '媒體廣告月報、各類媒體申訴、NCC 公告；欄位待確認', used: 'AQ5、AQ6' },
            { name: '立法院開放資料', what: '媒體議價法草案與委員會審查，作為有日期的規則事件', used: 'AQ5、時間軸' },
            { name: '公平會與數發部報告', what: '對新聞議價的競爭政策立場；Google 3 億元基金；共享分潤平台規劃', used: 'AQ5' },
          ],
        },
        {
          name: '研究與市場報告',
          line: '路透新聞學研究所 2024–2026 數位新聞報告、TWNIC 2025、DMA 廣告量',
          method: '從報告 PDF 擷取表格',
          items: [
            { name: '路透數位新聞報告 2024–2026', what: '各品牌每週使用率與信任度、看新聞的平台、付費比例；2026 已開啟，2024 與 2025 表格待擷取', used: 'AQ2、AQ6、儀表板' },
            { name: 'TWNIC 2025 台灣網路報告', what: '以電視為主要新聞來源者，由 39.57%（2024）降至 32.02%（2025）', used: 'AQ2、AQ6' },
            { name: 'DMA 數位廣告量 2023–2025', what: '市場規模與結構；2025 年總額 661.77 億元。已讀新聞稿摘要，PDF 待取得', used: 'AQ4、儀表板' },
            { name: 'LY Corp（LINE）、Alphabet 與 Meta 年報', what: '平台端營收與新聞政策', used: 'AQ2、AQ5' },
          ],
        },
        {
          name: 'API、Sitemap 與匯出檔',
          line: 'YouTube 上傳、每月文章數、App 評論、搜尋熱度與職缺',
          method: 'API 呼叫、Sitemap 爬取、CSV 匯出',
          items: [
            { name: 'YouTube Data API v3', what: '六個新聞頻道的每月上傳數、Shorts 比例、訂閱數與觀看中位數；API 金鑰不進版本庫', used: '儀表板' },
            { name: '各媒體新聞 Sitemap', what: '各媒體每月文章數，發布日期取自網址：AI 是否讓人力減少時產量不減？', used: '儀表板' },
            { name: 'Google Play 與 App Store 評論', what: '每月評分；每則評論依主題標記（廣告、速度、推播、內容）', used: '儀表板' },
            { name: 'Google 搜尋趨勢 CSV', what: 'ETtoday、TVBS新聞、三立新聞、聯合新聞網、自由時報與 LINE TODAY 的每週搜尋熱度', used: '儀表板' },
            { name: '104 職缺與 Wayback 快照', what: '職務組成隨時間的變化（AI 工程師、影音剪輯、記者），作為能力訊號', used: 'AQ3' },
          ],
        },
        {
          name: '新聞語料，2025 年 1 月起',
          line: '自 2025 年 1 月起每則新聞一列，均附原文連結',
          method: 'RSS 輪詢、公開網頁擷取',
          items: [
            { name: '八家媒體', what: 'ETtoday、聯合新聞網、自由時報、中央社、TVBS、數位時代、iThome、工商時報' },
            { name: '涵蓋對象', what: '關於 ETtoday、六個對手品牌，以及 LINE TODAY、Google、Meta、YouTube 的報導' },
            { name: '每則新聞一列', what: '日期、行動者、行動類型、對象、來源網址、中英文摘要，以及查核的組員', used: '時間軸、AQ3；其事件標示於每條時間序列' },
          ],
        },
      ],
      indicative: {
        label: '僅供交叉比對，標示為參考',
        text: '非開放授權，絕不單獨作為數據。',
        items: [
          { name: 'SimilarWeb', what: '各對手的流量來源結構：年報流量結構唯一的交叉比對' },
          { name: 'App 排名', what: 'App Store 與 Google Play 排名' },
          { name: 'Ahrefs 排名', what: '顯示 ETtoday 搜尋流量自 2025 下半年至 2026 上半年大幅下滑：AQ2 的線索，我們將嘗試重現', href: url.ecpro },
        ],
      },
    },

    run: {
      id: 'src-run',
      label: '每週蒐集',
      title: '每週一次，代理人把資料寫入暫存分頁。',
      text: '工作代理人每週一次，將候選資料列附加到暫存分頁。',
      tbd: '採排程或手動啟動，待第 11 週首次完整流程測試後確定。',
      agent: { name: '工作代理人', sub: 'Claude Project，依 KB.md 運作' },
      staging: { name: '暫存分頁', sub: 'Google Sheets' },
      flowLabel: '候選資料列',
      next: { label: '下一步：組員逐列查核', href: '#pipeline' },
      rows: [
        { name: '新聞列，每則新聞一列', fields: ['date', 'actor', 'action_type', 'target', 'source_url', 'summary_zh', 'summary_en'], example: ['2025-08-06', '立法院', '法規或法律', '媒體議價法', 'taiwannews.com.tw/…', '草案送交黨團協商', 'Drafts sent to party negotiation'] },
        { name: '指標列，每個數字一列', fields: ['brand', 'year', 'metric', 'value', 'source'], example: ['ETtoday', '2026', 'weekly_use', '38%', 'DNR 2026'] },
      ],
      rulesLabel: '代理人不能略過的規則',
      rules: ['沒有來源網址的數字不會出現。', '版本庫中沒有 API 金鑰。', 'checked_by 欄位沒有組員署名，就不會上網站。'],
    },

    series: {
      id: 'src-series',
      label: '儀表板的時間序列',
      title: '每個來源只有一個數字，那是一句話，不是一張圖。',
      text: '儀表板需要跨年度、可比較品牌的序列。以下是我們將建立的序列，依優先順序排列。',
      legend: { span: '預計涵蓋年度', have: '已取得的數字' },
      rows: [
        { name: 'ETtoday 流量結構', source: '東森國際年報', chart: '堆疊面積圖，疊加時間軸事件' },
        { name: '營收、損益、人力', source: '年報', chart: '營收用長條，損益與人力用折線' },
        { name: '各品牌每週使用率與信任度', source: '路透 DNR', chart: '多線圖，可切換品牌' },
        { name: '各品牌搜尋熱度', source: 'Google 搜尋趨勢', chart: '多線圖，標示事件' },
        { name: '各媒體每月文章數', source: '新聞 Sitemap', chart: '產量對照人力' },
        { name: '各格式數位廣告量', source: 'DMA 報告', chart: '堆疊長條圖' },
        { name: '東森國際月營收、新媒體部門', source: '公開資訊觀測站', chart: '長期折線加部門長條' },
        { name: 'YouTube 頻道動態', source: 'YouTube Data API', chart: '各頻道小倍數圖' },
        { name: 'App 評分與評論主題', source: 'App 商店', chart: '評分折線加主題長條' },
        { name: '各職務職缺', source: '104 與 Wayback', chart: '職務組成隨時間變化' },
        { name: '競爭者地圖數據', source: 'DNR 與公開指標', chart: '2×2 散布圖，Chen（1996）' },
      ],
    },

    status: {
      id: 'src-status',
      label: '蒐集進度',
      title: '已開啟的來源，以及尚待蒐集的部分。',
      asOf: '各來源狀態，截至提案日 2026 年 11 月 8 日',
      sourcesLabel: '個來源',
      verify: '每一筆已標記的新聞列皆對照原文查核，每個指標皆對照原始 PDF 或申報文件。每筆資料都保留網址與存取日期，政府資料開放平臺資料集的授權聲明則列於網站頁尾。報告只摘要，絕不複製。',
      link: { label: '查看仍待驗證的項目', href: '#faq' },
      filesLabel: '資料表背後的十二個檔案',
      files: [
        { name: '資料表', by: 'Google Sheets' },
        { name: '東森國際 114年度年報', by: 'MOPS' },
        { name: '數位新聞報告 2026', by: '路透新聞學研究所' },
        { name: '頻道上傳', by: 'YouTube Data API' },
        { name: '數位廣告量統計 2025', by: 'DMA' },
        { name: '台灣網路報告 2025', by: 'TWNIC' },
        { name: '媒體議價法審查', by: '立法院開放資料' },
        { name: 'NCC 資料集', by: '政府資料開放平臺' },
        { name: '品牌搜尋熱度', by: 'Google 搜尋趨勢' },
        { name: '每月文章數', by: 'Sitemap' },
        { name: '數位經濟競爭政策白皮書', by: '公平會' },
        { name: 'verified.json', by: 'GitHub' },
      ],
    },
  }),
};
