// Section: Frequently Asked Questions. Text kept from the earlier page.
const email = 'mailto:group4@ettoday-study.example';
const icons = ['claude', 'google-sheets', 'vue', 'github'];
const tools = (texts) => texts.map((t, i) => ({ icon: icons[i], ...t }));

export const faq = {
  en: {
    id: 'faq',
    kicker: 'Questions',
    track: 'Scope and responsibilities',
    title: 'Frequently Asked Questions',
    intro: 'Scope, limitations and responsibilities.',
    email: { label: 'Email Group 4', href: email },
    toolsLabel: 'Tools the group uses',
    tools: tools([
      { name: 'Claude', note: 'Tags and drafts' },
      { name: 'Google Sheets', note: 'The data sheet' },
      { name: 'Vue.js', note: 'The site' },
      { name: 'GitHub', note: 'Pages and Actions' },
    ]),
    items: [
      { q: 'What Does the Project Leave Out?', a: 'TV ratings, print circulation and editorial quality. The project covers ETtoday’s website and app in Taiwan from January 2025 to December 2026.' },
      { q: 'Is Every ETtoday Figure Verified?', a: 'Not yet. ETtoday’s 19 M peak daily visits and 6.73 M app downloads are self-reported, and the site labels both accordingly.' },
      { q: 'How Is the Work Divided?', a: 'Among three pairs: Data (sources and verification), Strategy Analysis (financials, PARTS and the Value Net), and Web and Video (the site, the video and GitHub Pages).' },
      { q: 'How Does Group 4 Use AI?', a: 'Claude helped draft and edit parts of the proposal and this page. Group members checked every fact against its source, and the final text is the group’s own.' },
    ],
  },
  zh: {
    id: 'faq',
    kicker: '問與答',
    track: '範圍與分工',
    title: '常見問題',
    intro: '專題範圍、限制與分工。',
    email: { label: '寫信給第四組', href: email },
    toolsLabel: '本組使用的工具',
    tools: tools([
      { name: 'Claude', note: '標記與草擬' },
      { name: 'Google Sheets', note: '資料表' },
      { name: 'Vue.js', note: '網站' },
      { name: 'GitHub', note: 'Pages 與 Actions' },
    ]),
    items: [
      { q: '本專題不涵蓋哪些內容？', a: '電視收視率、紙本發行量與新聞品質。本專題涵蓋 ETtoday 在台灣的網站與 App，期間為 2025 年 1 月至 2026 年 12 月。' },
      { q: 'ETtoday 的每筆數據都驗證過了嗎？', a: '尚未全部驗證。單日造訪高峰 1,900 萬與 App 下載 673 萬為 ETtoday 自行公布的數字，網站會清楚標示。' },
      { q: '第四組如何分工？', a: '共分三組、每組兩人：資料（來源與查核）、策略分析（財務、PARTS 與價值網），以及網站與影片（網站、影片與 GitHub Pages）。' },
      { q: '第四組如何使用 AI？', a: 'Claude 協助草擬並修訂部分提案與本頁內容。所有事實皆由組員對照來源查核，最終文字由本組負責。' },
    ],
  },
};
