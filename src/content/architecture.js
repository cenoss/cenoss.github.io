// Section: Tech Architecture, Data-to-Web Specifications & Agent Design (proposal §4).
// Replaces the earlier pipeline and stack sections; their step texts are kept where the proposal's
// seven-step data flow has the same step. Part ids #pipeline and #stack keep the old links landing.

// the seven steps of the data flow (§4), each with the tool behind it
const stepMarks = ['globe', 'google-sheets', 'claude', 'check', 'json', 'claude-code', 'githubpages'];
// the six layers (§4.1), each tool by its real mark (null: no permitted mark, named in type)
const layerMarks = [
  ['claude'],
  ['claude-code'],
  ['google-sheets', 'json'],
  ['javascript', 'html', 'file-css', 'vitejs', 'vue'],
  ['github', 'githubpages', 'github-actions'],
  [null, 'fishaudio', 'ffmpeg-icon', null],
];
const layerKeys = ['ai', 'harness', 'data', 'front', 'hosting', 'video'];
// feedback loops (§4.4): from which step back to which
const loops = [{ key: 'L1', from: 4, to: 3 }, { key: 'L2', from: 5, to: 3 }, { key: 'L3', from: 7, to: 6 }];

const zip = (base, texts) => base.map((b, i) => ({ ...b, ...texts[i] }));
const build = (t) => ({
  ...t,
  flow: { ...t.flow, steps: zip(stepMarks.map((icon, i) => ({ n: i + 1, icon })), t.flow.steps) },
  tools: { ...t.tools, layers: zip(layerKeys.map((key) => ({ key })), t.tools.layers).map((l, i) => ({ ...l, tools: l.tools.map((name, j) => ({ name, icon: layerMarks[i][j] })) })) },
  deploy: { ...t.deploy, loops: zip(loops, t.deploy.loops) },
});

export const architecture = {
  en: build({
    id: 'architecture',
    kicker: 'Tech architecture',
    track: 'Proposal §4 · Data-to-web specifications and agent design',
    title: 'From public sources to a static site, with a member’s name on every row.',
    intro: 'Public sources go into a Google Sheet, the Work/Task Agent tags and summarises them, a member verifies each row, the computed tables are exported as JSON, and the Coding Agent builds the site that GitHub Pages serves.',

    flow: {
      id: 'pipeline',
      label: 'The data flow',
      title: 'From Public Data to the Page in Seven Steps.',
      titleAfter: 'A Member Signs Off Every Row.',
      sceneLabel: 'Clawd, Claude Code’s 8-bit terminal mascot, at the controls of the data machine: documents drop in from the sources, the machine turns each into a row, a member stamps it, and the row lands as JSON that rebuilds the site.',
      sceneCaption: 'The Work/Task Agent at the controls. Documents go in; checked, sourced rows come out.',
      pause: 'Pause',
      play: 'Play',
      steps: [
        { name: 'Public sources', sub: 'MOPS, DNR, DMA, open data, the news' },
        { name: 'Staging tab', sub: 'Google Sheets' },
        { name: 'Work/Task Agent', sub: 'Tags and summarises each row' },
        { name: 'Member verification', sub: 'Verified tab', text: 'A member verifies each tagged row; a failed check returns to the source, and the counts are rerun.' },
        { name: 'JSON export', sub: 'Computed tables' },
        { name: 'Coding Agent', sub: 'Claude Code', text: 'Claude Code builds the Vue site from the verified tables, exported as JSON.' },
        { name: 'GitHub Pages', sub: 'Static hosting', text: 'GitHub Actions deploys the site to GitHub Pages, and two members then review both languages and the mobile view.' },
      ],
    },

    agent: {
      id: 'arch-agent',
      label: 'Agent purpose and scope',
      title: 'The agent’s job is to turn public text and documents into checkable tables.',
      verbs: [
        { name: 'Collects', text: 'Articles from January 2025 onward about ETtoday, the named rivals and LINE TODAY, Google, Meta and YouTube, from the outlets’ public pages and RSS feeds, and official documents from the data sources.' },
        { name: 'Tags', text: 'Each article as one row: date, actor, action type, target, source URL, Chinese and English summary.' },
        { name: 'Extracts', text: 'KPIs from the DNR, TWNIC, DMA and MOPS documents into a tidy table (brand, year, metric, value, source), and the series that have an API or a sitemap.' },
        { name: 'Computes', text: 'Action counts by actor and quarter, response lag in days, KPI trends across years, and a first-pass score of each rival on market commonality and resource similarity.' },
        { name: 'Drafts', text: 'The PARTS table, the AMC reading of each action–response pair, and bilingual text for the site, all for members to edit.' },
      ],
      codebookLabel: 'The fixed codebook in KB.md: seven action types',
      codebook: ['Pricing', 'Promotion', 'New product or format', 'Partnership or licensing', 'Acquisition or investment', 'Regulatory or legal', 'Staffing or AI restructuring'],
      rulesLabel: 'Two rules bound it',
      rules: ['Nothing reaches the site without a member’s name in the checked_by column.', 'No figure appears without a source URL.'],
      version: 'Every change to the prompts or KB.md gets a dated version line.',
    },

    tools: {
      id: 'stack',
      label: 'AI tools and environment',
      title: 'Six layers, and the site runs without a server.',
      columns: ['Layer', 'Tools', 'Role'],
      layers: [
        { name: 'Generative AI', tools: ['Claude (Opus 5.5 / Fable 5.1)'], note: 'One paid plan in the group', role: 'Work/Task Agent inside a Claude Project holding KB.md and the data sheet' },
        { name: 'AI harness', tools: ['Claude Code'], role: 'Coding Agent that builds and fixes the site' },
        { name: 'Data sheet', tools: ['Google Sheets', 'JSON'], role: 'Shared staging and verified tabs; exported to JSON' },
        { name: 'Front end', tools: ['JavaScript', 'HTML', 'CSS', 'Vite', 'Vue'], role: 'Single-page application' },
        { name: 'Hosting', tools: ['GitHub', 'GitHub Pages', 'GitHub Actions'], role: 'Repository, static hosting, build on push' },
        { name: 'Video', tools: ['HyperFrames', 'Fish.Audio', 'ffmpeg', 'Epidemic Sound'], role: 'Web animation, English narration, subtitle burn-in, licensed music' },
      ],
      privacy: 'No API keys, passwords or personal data go into the repository or onto the page.',
      visit: {
        label: 'What a visit touches',
        browser: 'Your browser',
        host: 'GitHub Pages',
        files: 'Static HTML, JavaScript and JSON',
        none: ['No server', 'No database'],
      },
    },

    deploy: {
      id: 'arch-deploy',
      label: 'Updates and deployment',
      title: 'A weekly run, and a rebuild on every push.',
      text: 'Target: a weekly run of the collection step that appends candidate rows to the staging tab for review, and a site rebuild on every push once rows are verified.',
      tbd: 'Whether the weekly run is a scheduled task or started by hand stays TBD until the first full pipeline test in W11.',
      repoLabel: 'One public repository',
      repoName: 'repository name TBD',
      tree: [
        { path: 'data/', note: 'The exported JSON' },
        { path: 'src/', note: 'The Vue app, with zh-TW and en content files' },
        { path: 'KB.md', note: 'Prompts, codebook and version log' },
        { path: '.github/workflows/', note: 'Runs vite build and publishes dist/ to the gh-pages branch' },
      ],
      static: 'The site is static: charts and the timeline read the JSON files at load time, so a new export is a new site.',
      loopsLabel: 'Three feedback loops',
      loops: [
        { text: 'Verification fails: fix the row and re-tag it.' },
        { text: 'Measures fall short: revise the prompts and KB.md, and record the version.' },
        { text: 'After each deploy, two members check both languages, every chart and the phone view, then ask the Coding Agent for fixes.' },
      ],
    },
  }),

  zh: build({
    id: 'architecture',
    kicker: '技術架構',
    track: '提案 §4 · 資料到網頁的規格與代理人設計',
    title: '從公開來源到靜態網站，每一列都有組員署名。',
    intro: '公開來源寫入 Google 試算表，工作代理人加以標記與摘要，組員逐列查核，計算後的資料表匯出為 JSON，再由程式代理人建置網站，由 GitHub Pages 提供。',

    flow: {
      id: 'pipeline',
      label: '資料流程',
      title: '從公開資料到網頁的七個步驟。',
      titleAfter: '每一列皆經組員簽核。',
      sceneLabel: 'Claude Code 的 8 位元終端機吉祥物 Clawd 操控資料機器：文件從來源落入，機器把每份文件轉成一列，組員蓋章查核，資料列化為 JSON，網站隨之重建。',
      sceneCaption: '工作代理人坐鎮操控台。文件進去，查核過、附來源的資料列出來。',
      pause: '暫停',
      play: '播放',
      steps: [
        { name: '公開來源', sub: 'MOPS、DNR、DMA、開放資料、新聞' },
        { name: '暫存分頁', sub: 'Google Sheets' },
        { name: '工作代理人', sub: '逐列標記與摘要' },
        { name: '組員查核', sub: '已查核分頁', text: '組員逐一查核已標記的資料列；未通過者退回來源修正，並重新計算。' },
        { name: '匯出 JSON', sub: '計算後的資料表' },
        { name: '程式代理人', sub: 'Claude Code', text: 'Claude Code 以查核後匯出為 JSON 的資料表建置 Vue 網站。' },
        { name: 'GitHub Pages', sub: '靜態託管', text: 'GitHub Actions 將網站部署至 GitHub Pages，再由兩位組員檢查中英文版本與行動裝置畫面。' },
      ],
    },

    agent: {
      id: 'arch-agent',
      label: '代理人的目的與範圍',
      title: '代理人的工作，是把公開文字與文件變成可查核的資料表。',
      verbs: [
        { name: '蒐集', text: '自 2025 年 1 月起，關於 ETtoday、指定對手，以及 LINE TODAY、Google、Meta 與 YouTube 的文章，取自各媒體公開網頁與 RSS；另蒐集資料來源中的官方文件。' },
        { name: '標記', text: '每篇文章一列：日期、行動者、行動類型、對象、來源網址、中英文摘要。' },
        { name: '擷取', text: '從 DNR、TWNIC、DMA 與公開資訊觀測站文件擷取指標，整理成整齊的資料表（品牌、年度、指標、數值、來源），並拉取有 API 或 Sitemap 的序列。' },
        { name: '計算', text: '各行動者每季的行動次數、以天計的回應時間差、跨年度的指標趨勢，以及每個對手在市場共同性與資源相似性上的初步評分。' },
        { name: '草擬', text: 'PARTS 表、每組行動與回應的 AMC 解讀，以及網站的中英文文字，全部交由組員修訂。' },
      ],
      codebookLabel: 'KB.md 中固定的編碼表：七種行動類型',
      codebook: ['定價', '促銷', '新產品或新形式', '合作或授權', '併購或投資', '法規或法律', '人力或 AI 組織調整'],
      rulesLabel: '兩條規則約束它',
      rules: ['checked_by 欄位沒有組員署名，就不會上網站。', '沒有來源網址的數字不會出現。'],
      version: '提示詞或 KB.md 每次修改，都留下一行有日期的版本紀錄。',
    },

    tools: {
      id: 'stack',
      label: 'AI 工具與環境',
      title: '六層架構，網站無需伺服器即可運作。',
      columns: ['層級', '工具', '角色'],
      layers: [
        { name: '生成式 AI', tools: ['Claude（Opus 5.5 / Fable 5.1）'], note: '全組一個付費方案', role: '在 Claude Project 中擔任工作代理人，內含 KB.md 與資料表' },
        { name: 'AI 執行環境', tools: ['Claude Code'], role: '建置與修正網站的程式代理人' },
        { name: '資料表', tools: ['Google Sheets', 'JSON'], role: '共用的暫存與已查核分頁；匯出為 JSON' },
        { name: '前端', tools: ['JavaScript', 'HTML', 'CSS', 'Vite', 'Vue'], role: '單頁應用程式' },
        { name: '託管', tools: ['GitHub', 'GitHub Pages', 'GitHub Actions'], role: '版本庫、靜態託管、推送即建置' },
        { name: '影片', tools: ['HyperFrames', 'Fish.Audio', 'ffmpeg', 'Epidemic Sound'], role: '網頁動畫、英文旁白、字幕燒錄、授權音樂' },
      ],
      privacy: '版本庫與網頁中不放任何 API 金鑰、密碼或個人資料。',
      visit: {
        label: '一次造訪會用到什麼',
        browser: '你的瀏覽器',
        host: 'GitHub Pages',
        files: '靜態 HTML、JavaScript 與 JSON',
        none: ['無伺服器', '無資料庫'],
      },
    },

    deploy: {
      id: 'arch-deploy',
      label: '更新與部署',
      title: '每週蒐集一次，每次推送都重建。',
      text: '目標：每週執行一次蒐集步驟，將候選資料列附加到暫存分頁待審；資料列查核後，每次推送都重建網站。',
      tbd: '每週執行採排程或手動啟動，待第 11 週首次完整流程測試後確定。',
      repoLabel: '一個公開版本庫',
      repoName: '版本庫名稱待確定',
      tree: [
        { path: 'data/', note: '匯出的 JSON' },
        { path: 'src/', note: 'Vue 應用程式，含 zh-TW 與 en 內容檔' },
        { path: 'KB.md', note: '提示詞、編碼表與版本紀錄' },
        { path: '.github/workflows/', note: '執行 vite build，將 dist/ 發布到 gh-pages 分支' },
      ],
      static: '網站是靜態的：圖表與時間軸在載入時讀取 JSON 檔，所以每次匯出就是一個新網站。',
      loopsLabel: '三個回饋迴圈',
      loops: [
        { text: '查核未通過：修正資料列並重新標記。' },
        { text: '指標不足：修訂提示詞與 KB.md，並記錄版本。' },
        { text: '每次部署後，兩位組員檢查中英文版本、每張圖表與手機畫面，再請程式代理人修正。' },
      ],
    },
  }),
};
