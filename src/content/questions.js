// Section: Six Questions Through Three Lenses. Text kept from the earlier page (cards and the AQ menu).
const lenses = ['coop', 'dyn', 'plat'];
const aq = [
  // code, primary lens, other lens (proposal §1: AQ3 is Tactics, a PARTS lever, read through AMC)
  { code: 'AQ1', lens: 'coop' }, { code: 'AQ2', lens: 'coop' }, { code: 'AQ3', lens: 'dyn', also: 'coop' },
  { code: 'AQ4', lens: 'plat' }, { code: 'AQ5', lens: 'coop' }, { code: 'AQ6', lens: 'plat' },
];
// the brands with a weekly-use share in DNR 2026, besides ETtoday: the scenario splits the fund among them
const scenario = { fundRange: { min: 100, max: 600, step: 50, value: 300 }, useRange: { min: 10, max: 60, step: 1, value: 38 }, others: [31, 23, 20], names: ['TVBS新聞網', '東森新聞網', '三立新聞網'] };

export const questions = {
  en: {
    id: 'questions',
    kicker: 'Six questions',
    track: 'AQ1 to AQ6',
    title: 'Six Questions Through Three Lenses',
    lenses: lenses.map((key, i) => ({ key, ...[
      { name: 'Co-opetition', by: 'Brandenburger & Nalebuff' },
      { name: 'Competitive dynamics', by: 'Chen 1996' },
      { name: 'Platform Revolution', by: 'Parker, Van Alstyne & Choudary' },
    ][i] })),
    aqs: aq.map((a, i) => ({ ...a, ...[
      { name: 'Value Net', sub: 'Who the players are' },
      { name: 'Friend or Foe', sub: 'What the platforms give and take' },
      { name: 'Moves', sub: 'Who responds, and how fast' },
      { name: 'Turnaround', sub: 'Cost cuts or new revenue' },
      { name: 'Rules', sub: 'The news bargaining bill' },
      { name: 'Tipping', sub: 'One winner or many' },
    ][i] })),
    matrixLabel: 'Which lens answers which question',
    cards: {
      sort: {
        title: 'Sorts Each Platform as Friend or Foe',
        text: 'AQ1 and AQ2 (co-opetition): who belongs in the Value Net, and do the platforms bring readers or take advertisers?',
        widget: 'Value Net: Platforms',
        sorted: 'sorted',
        options: [{ key: 'friend', label: 'Friend' }, { key: 'both', label: 'Both' }, { key: 'foe', label: 'Foe' }],
        items: [
          { name: 'YouTube', sub: 'News source for 48%' },
          { name: 'Facebook', sub: 'News source for 47%' },
          { name: 'Google', sub: 'NT$300 M news fund' },
        ],
      },
      moves: {
        title: 'Times ETtoday’s Moves and Responses',
        text: 'AQ3 (competitive dynamics): how quickly ETtoday responds to a rival’s move, and who moves first.',
        items: [
          { badge: '立', title: '立法院 moved the bargaining bill', date: '6 Aug', sub: 'Drafts sent to party negotiation' },
          { badge: 'ET', title: 'ETtoday cut staff to 385', date: '2025', sub: 'From 561, as AI tools arrived' },
          { badge: 'NW', title: 'NOWnews lost NT$140 M', date: '2025', sub: 'A digital rival’s loss for the year' },
        ],
      },
      scenario: {
        title: 'Tests the Platform Rules in a Scenario',
        text: 'AQ4 to AQ6: cost cuts or new revenue, what the bargaining bill changes, and whether the market tips.',
        widget: 'Revenue-Sharing Scenario',
        meta: 'A scenario, not a forecast',
        reset: 'Reset',
        fund: 'Fund shared by usage',
        use: 'ETtoday weekly use',
        result: 'ETtoday’s share',
        assumption: 'Split by weekly use among the four brands with a share in DNR 2026: ETtoday, TVBS新聞網 31%, 東森新聞網 23%, 三立新聞網 20%.',
        ...scenario,
      },
    },
  },
  zh: {
    id: 'questions',
    kicker: '六個問題',
    track: 'AQ1 至 AQ6',
    title: '以三個視角看六個問題',
    lenses: lenses.map((key, i) => ({ key, ...[
      { name: '競合', by: 'Brandenburger & Nalebuff' },
      { name: '競爭動態', by: 'Chen 1996' },
      { name: '平台革命', by: 'Parker、Van Alstyne & Choudary' },
    ][i] })),
    aqs: aq.map((a, i) => ({ ...a, ...[
      { name: '價值網', sub: '有哪些參與者' },
      { name: '是敵是友', sub: '平台給什麼、拿什麼' },
      { name: '行動', sub: '誰回應、多快回應' },
      { name: '轉虧為盈', sub: '靠成本還是營收' },
      { name: '規則', sub: '媒體議價法' },
      { name: '傾斜', sub: '贏者全拿或多家並存' },
    ][i] })),
    matrixLabel: '哪個視角回答哪個問題',
    cards: {
      sort: {
        title: '判斷每個平台是敵是友',
        text: 'AQ1 與 AQ2（競合）：價值網中有哪些參與者？平台帶來讀者，還是搶走廣告主？',
        widget: '價值網：平台',
        sorted: '已分類',
        options: [{ key: 'friend', label: '友' }, { key: 'both', label: '兩者皆是' }, { key: 'foe', label: '敵' }],
        items: [
          { name: 'YouTube', sub: '48% 用來看新聞' },
          { name: 'Facebook', sub: '47% 用來看新聞' },
          { name: 'Google', sub: '3 億元新聞基金' },
        ],
      },
      moves: {
        title: '記錄 ETtoday 的行動與回應',
        text: 'AQ3（競爭動態）：ETtoday 回應對手行動的速度有多快？誰率先出手？',
        items: [
          { badge: '立', title: '立法院推進議價法', date: '8/6', sub: '草案送交黨團協商' },
          { badge: 'ET', title: 'ETtoday 人力減至 385', date: '2025', sub: '原為 561，隨 AI 工具導入' },
          { badge: 'NW', title: 'NOWnews 虧損 1.4 億元', date: '2025', sub: '數位對手的全年虧損' },
        ],
      },
      scenario: {
        title: '用情境檢驗平台規則',
        text: 'AQ4 至 AQ6：靠削減成本還是新營收？議價法會改變什麼？市場會不會傾向單一贏家？',
        widget: '分潤情境',
        meta: '情境推估，並非預測',
        reset: '重設',
        fund: '按使用量分配的基金',
        use: 'ETtoday 每週使用率',
        result: 'ETtoday 分得',
        assumption: '依每週使用率，分配給數位新聞報告 2026 列有使用率的四個品牌：ETtoday、TVBS新聞網 31%、東森新聞網 23%、三立新聞網 20%。',
        ...scenario,
      },
    },
  },
};
