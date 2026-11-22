// One page, two languages. English by default; ?lang=zh gives Traditional Chinese.
// Switching language is a page load (the legacy sections' kit scripts start once per load).
export const lang = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';

const documentMeta = {
  en: {
    htmlLang: 'en',
    title: "Group 4: Platform Strategy Analysis of ETtoday, Taiwan's Leading News Site",
    description: "A CDPS-EMI 1151 term project assessing whether ETtoday's platform strategy explains its July 2025 return to profit, using public data verified row by row.",
  },
  zh: {
    htmlLang: 'zh-Hant-TW',
    title: '第四組：東森新聞雲 ETtoday 平台策略分析',
    description: 'CDPS-EMI 1151 期末專題：以逐列查核的公開資料，檢驗 ETtoday 的平台策略能否解釋其 2025 年 7 月轉虧為盈。',
  },
};

export function applyDocumentLocale() {
  const m = documentMeta[lang];
  document.documentElement.lang = m.htmlLang;
  document.title = m.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
}

export const dateLocale = { en: 'en-GB', zh: 'zh-TW' }[lang];

// the link to the page in the other language (the footer has one too)
export const otherLang = lang === 'zh'
  ? { label: 'English', href: './', hreflang: 'en' }
  : { label: '中文', href: '?lang=zh', hreflang: 'zh-Hant' };

// an amount given in NT$ millions, written the way each language writes money: NT$300 M, 3 億元
export const formatMillions = (millions, digits = 1) =>
  lang === 'zh'
    ? `${Number((millions / 100).toFixed(digits + 1))} 億元`
    : `NT$${Number(millions.toFixed(digits))}\u00a0M`;
