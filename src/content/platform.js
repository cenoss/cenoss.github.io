// Section: Chosen Firm / Platform & Strategic Rationale, proposal §2 (the traffic series from §3.3).
// The same shape in both languages; tests/content.test.js fails if the two drift.
// Every figure comes from the proposal and carries its source; self-reported figures say so.

const src = {
  moea: 'https://findbiz.nat.gov.tw/fts/company/04964250',
  annual: 'https://mops.twse.com.tw/mops/#/web/t146sb05?companyId=2614',
  dnr: 'https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/taiwan',
  dnrEt: 'https://www.ettoday.net/news/20260617/3184999.htm',
  finance: 'https://finance.ettoday.net/news/3063136',
  cm: 'https://www.cmmedia.com.tw/home/articles/54765',
  bill: 'https://www.taiwannews.com.tw/zh/news/6172747',
  ftc: 'https://www.ftc.gov.tw/',
  moda: 'https://www-api.moda.gov.tw/File/Get/moda/zh-tw/SfKAZKA5HKHkSg9',
  ltn: 'https://ec.ltn.com.tw/article/breakingnews/5476116',
};

// figures shared by both languages
const traffic = {
  social: [{ year: 2017, value: 55 }, { year: 2023, value: 37 }, { year: 2024, value: 24.7 }],
  direct: [{ year: 2017, value: 27 }, { year: 2023, value: 40 }, { year: 2024, value: 30.1 }, { year: 2025, value: 47.5 }],
};
const billSince = '2025-08-06';

export const platform = {
  en: {
    id: 'platform',
    kicker: 'Chosen platform',
    track: 'ETtoday 東森新聞雲 · ettoday.net and app',
    title: 'Whatever happens to ETtoday happens to the market leader.',
    intro: 'We study ETtoday because it leads Taiwan’s online news, has just changed how it makes money, and depends on platforms whose rules are being rewritten. Four reasons, each one a test of platform strategy.',

    profile: {
      id: 'pf-profile',
      label: 'The platform',
      title: 'A news site launched in 2011, inside a listed media group.',
      lineage: [
        { date: '2009', text: 'Registered as 東森新聞雲股份有限公司' },
        { date: 'Nov 2011', text: 'The news site launches' },
        { date: '2019', text: 'Renamed 東森新媒體控股股份有限公司 (Eastern New Media Holdings)' },
        { date: 'Jul 2025', text: 'Back to profit after four years of losses', mark: true },
      ],
      group: {
        label: 'The 東森 group',
        parent: { name: '東森國際', note: 'Listed parent · TWSE 2614' },
        operator: { name: '東森新媒體控股', note: 'Operating company · paid-in capital NT$600 M' },
        focal: { name: 'ETtoday', note: 'ettoday.net and the ETtoday app' },
        siblings: [
          { name: '東森新聞網', note: 'Separate news brand' },
          { name: '東森購物', note: 'Commerce' },
          { name: '東森寵物雲', note: 'Commerce' },
        ],
        source: 'MOEA company registry', href: src.moea,
      },
      scaleLabel: 'Scale in 2025',
      scale: [
        { value: '38%', caption: 'weekly use, DNR 2026', source: 'Digital News Report 2026', href: src.dnr },
        { value: '28.88 M', caption: 'Facebook followers', source: '東森國際 114年度年報', href: src.annual },
        { value: '47.5%', caption: 'of visits come direct', source: '東森國際 114年度年報', href: src.annual },
        { value: '36.3%', caption: 'of visits through the ETtoday app', source: '東森國際 114年度年報', href: src.annual },
      ],
      selfLabel: 'Self-reported, not yet verified',
      self: [
        { value: '19 M', caption: 'peak daily visits' },
        { value: '6.73 M', caption: 'app downloads' },
      ],
    },

    sides: {
      id: 'pf-sides',
      label: 'The sides of the platform',
      title: 'Four sides meet on ettoday.net.',
      hub: 'ETtoday',
      items: [
        { key: 'readers', name: 'Readers', flow: 'Attention', text: 'Get free, fast news on web and mobile, and give attention and browsing data in return.' },
        { key: 'producers', name: 'Content producers', flow: 'Content', text: 'The in-house newsroom plus syndicated partners and columnists, supplying text, video and vertical reports.' },
        { key: 'advertisers', name: 'Advertisers', flow: 'Ad spend', text: 'Buy display, native, video and sponsored social placements, and out-of-home space on the Taipei Metro through the group’s transit media business.' },
        { key: 'commerce', name: 'Group tie-ins', flow: 'Sales', text: '東森購物 and 東森寵物雲 turn attention into commerce, which reduces dependence on ad revenue that platforms skim.' },
      ],
    },

    rivals: {
      id: 'pf-rivals',
      label: 'Competitors in Taiwan',
      title: 'Two kinds of rival: other newsrooms, and the gateways to them.',
      brands: {
        label: 'Same-side news brands',
        unit: 'weekly use',
        rows: [
          { name: 'ETtoday', value: 38, focal: true },
          { name: 'TVBS新聞網', value: 31 },
          { name: '東森新聞網', value: 23, note: 'Same group, separate brand' },
          { name: '三立新聞網', value: 20 },
        ],
        also: 'Also compared, no share in the survey: UDN, LTN, NOWnews, Yahoo奇摩新聞',
      },
      platforms: {
        label: 'Distribution platforms, complementors and competitors at once',
        unit: 'use it for news',
        rows: [
          { name: 'LINE (LINE TODAY)', value: 49, note: 'The top news gateway' },
          { name: 'YouTube', value: 48 },
          { name: 'Facebook (Meta)', value: 47 },
        ],
        also: 'Google enters through search; the survey gives it no share.',
      },
      both: 'Friend and foe',
      source: 'Digital News Report 2026',
      href: src.dnr,
    },

    why: {
      id: 'pf-why',
      label: 'Why ETtoday',
      title: 'Four reasons it is the right case.',
      pillars: [
        {
          key: 'position',
          name: 'Market position',
          text: 'Nine consecutive years as Taiwan’s most-used online news brand in the Reuters Institute survey, with trust well above the national average, so whatever is happening to it is happening to the market leader.',
          streak: { count: 9, label: 'years in a row as the most-used brand' },
          trust: { label: 'Trust', rows: [{ name: 'ETtoday', value: 46, focal: true }, { name: 'News in Taiwan, average', value: 25 }] },
          source: 'Digital News Report 2026', href: src.dnrEt,
        },
        {
          key: 'model',
          name: 'A visible business-model shift',
          text: 'Four years of losses ended in July 2025. The group attributes this to AI-driven restructuring (561 to 385 staff) together with a move beyond programmatic ads into transit media and content commerce. Parent-level financials are on MOPS; ETtoday-level figures are only partly disclosed.',
          years: { loss: 'Year of losses', profit: 'Profit from Jul 2025', lossCount: 4 },
          staff: { from: 561, to: 385, label: 'Staff', change: 'fewer' },
          revenue: { label: 'Where the money comes from', from: 'Programmatic ads', to: ['Transit media', 'Content commerce'] },
          source: 'ETtoday 財經雲, 6 Nov 2025', href: src.finance,
        },
        {
          key: 'network',
          name: 'Network effects and multi-homing',
          text: 'Readers multi-home across news apps and LINE TODAY; advertisers multi-home across news brands and the platforms. The shift to 47.5% direct traffic is a live test of whether a news platform can pull its sides back onto its own property.',
          chart: {
            label: 'Share of ETtoday’s visits, by where they come from',
            series: [
              { key: 'direct', name: 'Direct', points: traffic.direct },
              { key: 'social', name: 'Social platforms', points: traffic.social },
            ],
            note: 'As each annual report states them; 2018 to 2022 not yet collected, so the line is dashed across the gap.',
            gap: 'Not yet collected',
          },
          source: '信傳媒 on the 2024 report; 東森國際 114年度年報', href: src.cm,
        },
        {
          key: 'rules',
          name: 'A rule change in progress',
          text: 'The 媒體議價法 drafts were sent to party negotiation on 6 August 2025, the 數發部 is designing a shared subscription and revenue-sharing platform, Google has pledged a NT$300 million news fund, and the 公平會 has set out its position in the 數位經濟競爭政策白皮書.',
          events: [
            { date: '2022-12-01', label: 'Dec 2022', actor: '公平會', text: 'Sets out its position in the 數位經濟競爭政策白皮書', href: src.ftc },
            { date: '2025-05-01', label: '1 May 2025', actor: '立法院', text: '媒體議價法 committee review', href: src.bill },
            { date: billSince, label: '6 Aug 2025', actor: '立法院', text: 'Drafts sent to party negotiation', href: src.bill, mark: true },
          ],
          open: [
            { actor: '數發部', text: 'Designing a shared subscription and revenue-sharing platform', href: src.moda },
            { actor: 'Google', text: 'NT$300 million news fund pledged', href: src.moda },
          ],
          openLabel: 'In progress, no date yet',
          stalled: { since: billSince, label: 'months in party negotiation', asOf: 'as of today' },
          source: 'Taiwan News; 公平會; 數發部 report to the Legislative Yuan', href: src.bill,
        },
      ],
    },

    event: {
      id: 'pf-event',
      label: 'Focal event, 2025 to 2026',
      title: 'A turnaround, set against a stalled law and a rival’s losses.',
      text: 'ETtoday’s turnaround from four years of losses to AI-driven profit, set against a stalled bargaining law and widening losses at digital rivals such as NOWnews, which lost NT$140 million in 2025.',
      cards: [
        { key: 'et', who: 'ETtoday', value: 'Profit', caption: 'from July 2025, after four years of losses', source: 'ETtoday 財經雲', href: src.finance, tone: 'up' },
        { key: 'law', who: '媒體議價法', value: 'Stalled', caption: 'in party negotiation since 6 August 2025', source: 'Taiwan News', href: src.bill, tone: 'flat' },
        { key: 'now', who: 'NOWnews', value: '−NT$140 M', caption: 'lost in 2025, a digital rival', source: 'LTN', href: src.ltn, tone: 'down' },
      ],
    },
  },

  zh: {
    id: 'platform',
    kicker: '研究對象',
    track: 'ETtoday 東森新聞雲 · 網站與 App',
    title: 'ETtoday 發生的事，就是市場龍頭發生的事。',
    intro: '我們選擇 ETtoday，因為它是台灣網路新聞的領導者，剛改變了獲利方式，又仰賴規則正在改寫的平台。以下四個理由，每一個都是對平台策略的檢驗。',

    profile: {
      id: 'pf-profile',
      label: '平台概況',
      title: '2011 年上線的新聞網站，隸屬上市媒體集團。',
      lineage: [
        { date: '2009', text: '登記為東森新聞雲股份有限公司' },
        { date: '2011 年 11 月', text: '新聞網站上線' },
        { date: '2019', text: '更名為東森新媒體控股股份有限公司' },
        { date: '2025 年 7 月', text: '連續虧損四年後轉虧為盈', mark: true },
      ],
      group: {
        label: '東森集團',
        parent: { name: '東森國際', note: '上市母公司 · 證交所 2614' },
        operator: { name: '東森新媒體控股', note: '營運公司 · 實收資本額 6 億元' },
        focal: { name: 'ETtoday', note: 'ettoday.net 與 ETtoday App' },
        siblings: [
          { name: '東森新聞網', note: '另一個新聞品牌' },
          { name: '東森購物', note: '電商' },
          { name: '東森寵物雲', note: '電商' },
        ],
        source: '經濟部商工登記', href: src.moea,
      },
      scaleLabel: '2025 年規模',
      scale: [
        { value: '38%', caption: '每週使用率，DNR 2026', source: '數位新聞報告 2026', href: src.dnr },
        { value: '2,888 萬', caption: 'Facebook 追蹤數', source: '東森國際 114年度年報', href: src.annual },
        { value: '47.5%', caption: '的造訪為直接流量', source: '東森國際 114年度年報', href: src.annual },
        { value: '36.3%', caption: '的造訪來自 ETtoday App', source: '東森國際 114年度年報', href: src.annual },
      ],
      selfLabel: '公司自行公布，尚待驗證',
      self: [
        { value: '1,900 萬', caption: '單日造訪高峰' },
        { value: '673 萬', caption: 'App 下載數' },
      ],
    },

    sides: {
      id: 'pf-sides',
      label: '平台的各方',
      title: '四方在 ettoday.net 上交會。',
      hub: 'ETtoday',
      items: [
        { key: 'readers', name: '讀者', flow: '注意力', text: '在網頁與行動裝置上取得免費、即時的新聞，並以注意力與瀏覽資料作為交換。' },
        { key: 'producers', name: '內容供應者', flow: '內容', text: '自家編輯台加上合作媒體與專欄作者，供應文字、影音與垂直報導。' },
        { key: 'advertisers', name: '廣告主', flow: '廣告預算', text: '購買展示、原生、影音與社群贊助版位，並透過集團交通媒體事業購買台北捷運戶外版位。' },
        { key: 'commerce', name: '集團綜效', flow: '銷售', text: '東森購物與東森寵物雲把注意力轉為消費，降低對被平台抽成的廣告收入的依賴。' },
      ],
    },

    rivals: {
      id: 'pf-rivals',
      label: '台灣的競爭者',
      title: '兩種對手：其他新聞編輯台，以及通往它們的入口。',
      brands: {
        label: '同一邊的新聞品牌',
        unit: '每週使用率',
        rows: [
          { name: 'ETtoday', value: 38, focal: true },
          { name: 'TVBS新聞網', value: 31 },
          { name: '東森新聞網', value: 23, note: '同集團、不同品牌' },
          { name: '三立新聞網', value: 20 },
        ],
        also: '一併比較、調查未列使用率：聯合新聞網、自由時報電子報、NOWnews、Yahoo奇摩新聞',
      },
      platforms: {
        label: '分發平台，同時是互補者與競爭者',
        unit: '用來看新聞',
        rows: [
          { name: 'LINE（LINE TODAY）', value: 49, note: '最主要的新聞入口' },
          { name: 'YouTube', value: 48 },
          { name: 'Facebook（Meta）', value: 47 },
        ],
        also: 'Google 透過搜尋進入；調查未列其使用率。',
      },
      both: '亦敵亦友',
      source: '數位新聞報告 2026',
      href: src.dnr,
    },

    why: {
      id: 'pf-why',
      label: '為什麼是 ETtoday',
      title: '它是合適個案的四個理由。',
      pillars: [
        {
          key: 'position',
          name: '市場地位',
          text: '在路透新聞學研究所的調查中，連續九年蟬聯台灣最多人使用的網路新聞品牌，信任度遠高於全國平均；因此發生在它身上的事，就是發生在市場龍頭身上的事。',
          streak: { count: 9, label: '年蟬聯最多人使用' },
          trust: { label: '信任度', rows: [{ name: 'ETtoday', value: 46, focal: true }, { name: '台灣新聞平均', value: 25 }] },
          source: '數位新聞報告 2026', href: src.dnrEt,
        },
        {
          key: 'model',
          name: '看得見的商業模式轉變',
          text: '四年的虧損在 2025 年 7 月畫下句點。集團將此歸功於 AI 驅動的組織調整（人力由 561 降至 385），以及從程式化廣告延伸至交通媒體與內容電商。母公司財務揭露於公開資訊觀測站；ETtoday 本身的數字僅部分揭露。',
          years: { loss: '虧損年度', profit: '2025 年 7 月起獲利', lossCount: 4 },
          staff: { from: 561, to: 385, label: '人力', change: '減少' },
          revenue: { label: '營收來源', from: '程式化廣告', to: ['交通媒體', '內容電商'] },
          source: 'ETtoday 財經雲，2025 年 11 月 6 日', href: src.finance,
        },
        {
          key: 'network',
          name: '網路效應與多棲',
          text: '讀者同時使用多個新聞 App 與 LINE TODAY；廣告主同時在多個新聞品牌與平台下單。直接流量升至 47.5%，正好檢驗新聞平台能否把各方拉回自己的地盤。',
          chart: {
            label: 'ETtoday 造訪來源占比',
            series: [
              { key: 'direct', name: '直接流量', points: traffic.direct },
              { key: 'social', name: '社群平台', points: traffic.social },
            ],
            note: '數字依各年度年報所載；2018 至 2022 年尚未蒐集，該段以虛線表示。',
            gap: '尚未蒐集',
          },
          source: '信傳媒報導 2024 年報；東森國際 114年度年報', href: src.cm,
        },
        {
          key: 'rules',
          name: '進行中的規則改變',
          text: '媒體議價法草案於 2025 年 8 月 6 日送交黨團協商；數發部正在規劃共享訂閱與分潤平台；Google 承諾提供 3 億元新聞基金；公平會則在數位經濟競爭政策白皮書中表明立場。',
          events: [
            { date: '2022-12-01', label: '2022 年 12 月', actor: '公平會', text: '於數位經濟競爭政策白皮書表明立場', href: src.ftc },
            { date: '2025-05-01', label: '2025 年 5 月 1 日', actor: '立法院', text: '媒體議價法委員會審查', href: src.bill },
            { date: billSince, label: '2025 年 8 月 6 日', actor: '立法院', text: '草案送交黨團協商', href: src.bill, mark: true },
          ],
          open: [
            { actor: '數發部', text: '規劃共享訂閱與分潤平台', href: src.moda },
            { actor: 'Google', text: '承諾 3 億元新聞基金', href: src.moda },
          ],
          openLabel: '進行中，尚無日期',
          stalled: { since: billSince, label: '個月仍在黨團協商', asOf: '截至今天' },
          source: 'Taiwan News；公平會；數發部立法院報告', href: src.bill,
        },
      ],
    },

    event: {
      id: 'pf-event',
      label: '焦點事件，2025 至 2026',
      title: '轉虧為盈，對照停滯的法案與對手的虧損。',
      text: 'ETtoday 從連續四年虧損轉為 AI 驅動的獲利，對照的是停滯的議價法案，以及 NOWnews 等數位對手擴大的虧損：NOWnews 2025 年虧損 1.4 億元。',
      cards: [
        { key: 'et', who: 'ETtoday', value: '獲利', caption: '2025 年 7 月起，此前連續虧損四年', source: 'ETtoday 財經雲', href: src.finance, tone: 'up' },
        { key: 'law', who: '媒體議價法', value: '停滯', caption: '自 2025 年 8 月 6 日起仍在黨團協商', source: 'Taiwan News', href: src.bill, tone: 'flat' },
        { key: 'now', who: 'NOWnews', value: '−1.4 億元', caption: '2025 年虧損，數位對手', source: '自由時報', href: src.ltn, tone: 'down' },
      ],
    },
  },
};
