// The close and the footer. Text kept from the earlier page; the milestones are the proposal's (Appendix A).
const email = 'mailto:group4@ettoday-study.example';
// W9 is the week of the proposal, 8 Nov 2026 (weeks start on Monday)
const weeks = { w9Monday: '2026-11-02', first: 9, last: 16 };
const marks = [9, 10, 12, 14, 15, 16];
const milestones = (texts) => marks.map((w, i) => ({ week: w, ...texts[i] }));

export const closing = {
  en: {
    id: 'contact',
    title: 'The ETtoday Turnaround, Examined',
    text: 'Data ready by Week 12; the site goes live the weekend before the Week 16 contest.',
    cta: { label: 'See the Six Questions', href: '#questions' },
    weeks,
    week: 'W{n}',
    thisWeek: 'This week',
    milestones: milestones([
      { label: 'Proposal', note: '8 Nov' },
      { label: 'Pitch' },
      { label: 'TP-Data', note: 'Data ready' },
      { label: 'TP-Web' },
      { label: 'TP Final' },
      { label: 'Web contest and peer review', note: 'Site live the weekend before', mark: true },
    ]),
    wordmark: 'Group 4',
    lede: 'ETtoday Platform Strategy Analysis, CDPS-EMI 1151.',
    columns: [
      { title: 'Project', links: [{ label: 'Background', href: '#background' }, { label: 'Platform', href: '#platform' }, { label: 'Deployed Output', href: '#output' }, { label: 'Pitch Video', href: '#out-video' }] },
      { title: 'Method', links: [{ label: 'Data Sources', href: '#sources' }, { label: 'Tech Architecture', href: '#architecture' }, { label: 'Data Flow', href: '#pipeline' }, { label: 'Six Questions', href: '#questions' }] },
      { title: 'More', links: [{ label: 'FAQ', href: '#faq' }, { label: '中文版', lang: true }] },
      { title: 'Contact', links: [{ label: 'Email Group 4', href: email }] },
    ],
    legal: '© 2026 Group 4, CDPS-EMI 1151. Product names and logos are trademarks of their owners.',
  },
  zh: {
    id: 'contact',
    title: '逐項檢驗 ETtoday 的轉虧為盈',
    text: '第 12 週完成資料蒐集，第 16 週網頁競賽前的週末正式上線。',
    cta: { label: '閱讀六個問題', href: '#questions' },
    weeks,
    week: '第 {n} 週',
    thisWeek: '本週',
    milestones: milestones([
      { label: '提案', note: '11/8' },
      { label: '提案簡報' },
      { label: 'TP-Data', note: '資料完成' },
      { label: 'TP-Web' },
      { label: 'TP Final' },
      { label: '網頁競賽與互評', note: '前一個週末上線', mark: true },
    ]),
    wordmark: 'Group 4',
    lede: 'ETtoday 平台策略分析，CDPS-EMI 1151。',
    columns: [
      { title: '專題', links: [{ label: '研究背景', href: '#background' }, { label: '研究對象', href: '#platform' }, { label: '部署成果', href: '#output' }, { label: '簡報影片', href: '#out-video' }] },
      { title: '方法', links: [{ label: '資料來源', href: '#sources' }, { label: '技術架構', href: '#architecture' }, { label: '資料流程', href: '#pipeline' }, { label: '六個問題', href: '#questions' }] },
      { title: '更多', links: [{ label: '常見問題', href: '#faq' }, { label: 'English', lang: true }] },
      { title: '聯絡', links: [{ label: '寫信給第四組', href: email }] },
    ],
    legal: '© 2026 Group 4，CDPS-EMI 1151。產品名稱與標誌為各所有者之商標。',
  },
};
