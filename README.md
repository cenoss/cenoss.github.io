# W10 pitch page: ETtoday platform strategy (Group 4)

One scrolling page for the W10 pitch, built from `G4_ETtoday_TP_Proposal.md`, in English and Traditional Chinese (`?lang=zh`). A Vue 3 single-page app built with Vite. Type: Newsreader, Geist and Geist Mono; palette: paper, ink, vermilion, with a validated blue as the second data colour.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (Chinese: http://localhost:5173/?lang=zh)
npm test           # both languages stay in step; links land; figures carry sources; icons exist
npm run build      # dist/, works from any folder (base './'), so GitHub Pages is fine
npm run preview    # serves dist/ at http://localhost:4173
npm run shots      # with preview running: screenshots of a section, see below
```

`npm run shots -- <section-id>` writes `shots/<section-id>/<lang>-<width>.png` at 1440, 1024, 820 and 390 in both languages (`WIDTHS=1440,390` and `LANGS=en` narrow it), using the installed Google Chrome with reduced motion on, so every animation shows its end state.

## What is on the page

| Section | Proposal | What it shows |
| --- | --- | --- |
| `#background` | §1 | Opens the page (the h1). The double position; the ledger (38% use, 46% trust against four years of losses, 561 to 385 staff); where Taiwan reads news; the research question lit word by word; the scope as rings around ETtoday, what is out of scope, the study window; the five objectives |
| `#platform` | §2 | Chosen platform and strategic rationale: the company's dates and the 東森 group; scale in 2025 (self-reported figures flagged); the four sides of the platform; the two kinds of rival as bar charts; four reasons (market position, business-model shift, network effects with the 2017–2025 traffic-mix chart, the rule change with a live count of months in party negotiation); the focal event |
| `#sources` | §3 | Data sources, with the acquisition channels of stage 1 in `G4_Agent_Workflow.svg`: secondary channels (official records; research and market reports) and primary ones (APIs, sitemaps and exports; the news corpus), each source with what it gives, what it is for and its status; indicative cross-checks; the weekly collection run into the staging tab and what a row looks like; the eleven dashboard series on one year axis (years planned, years in hand); collection status as of 8 Nov 2026 and the twelve files behind the data sheet |
| `#architecture` | §4 | Tech architecture (the page's dark band). The data flow in the proposal's seven steps, with Clawd, Claude Code’s 8-bit terminal mascot, at the controls of the data machine (`ClawdMachine.vue`, the sprite decoded from the welcome-screen logo: a 256×112 canvas scaled up in whole pixels; a document drops in, becomes a row, is stamped by a member and lands as JSON that rebuilds the site; the step strip follows it; a pause button; still with reduced motion; idle off-screen). Agent purpose and scope (five verbs, the seven-type codebook, the rules); the six tool layers by their real marks and what a visit touches; the weekly run, the repository layout and the three feedback loops. Part ids `#pipeline` and `#stack` keep the old links |
| `#output` | §5 | Expected deployed output, titled "The Dashboard". The page top to bottom (a miniature whose blocks light with the list of nine sections; what visitors can and cannot do; how it gets built, W12–W16; the checks before W16). The maps: the Value Net game board (click a player for its role, flows, draft verdict and log rows; the platforms flip between complementor and competitor) and the competitor map, which places no rival until it is scored. Timeline and dashboard: the action log (part id `#site`) and the eight charts, drawn only where the figures are in hand, the rest shown as awaiting data. Business insights: six AQ cards with the full question and the views each answer rests on, five PARTS slots, then the six questions' working cards and the rules slider (part id `#questions`). The pitch video: set `videoId` in `src/content/output.js` to embed it; until then the storyboard plays as a two-minute animatic with chapters and EN / 中文 subtitles |
| `#faq` | | Scope, unverified figures, roles, AI use |
| `#contact` | App. A | The close, the weeks W9 to W16 with this week marked, the footer |

The sections follow the proposal's order, §1 to §5. Every figure comes from the proposal and links its source. Figures the proposal marks as self-reported (19 M peak daily visits, 6.73 M app downloads) are labelled as not yet verified. The two live markers (months since the bargaining bill went to party negotiation, and this week on the W9–W16 track) are computed from today's date; W9 is taken as the week of 8 Nov 2026, starting Monday 2 Nov.

## How it is built

| Where | What |
| --- | --- |
| `index.html` | The head: fonts and the **design tokens** (`--rv-*`, colour and type in one place) |
| `src/App.vue` | The sections in page order |
| `src/content/<section>.js` | Each section's words and figures, `{ en, zh }`, the same shape in both; `index.js` lists them |
| `src/components/<section>/` | One folder per section |
| `src/components/shared/` | Section head, part head, bar chart, icons, tool marks |
| `src/composables/motion.js` | In-view, scroll progress, count-up, element width; all respect reduced motion |
| `src/styles/revamp.css` | Base reset and shared classes (`.rv` section, `.rv--night` dark band, labels, sources, tags) |
| `src/i18n.js` | The language (`?lang=zh`), document title, date locale, money format |
| `public/icons/` | The tools' real marks (credits in `icons-credits.json`) |
| `archive/` | The static page before the revamp, the taste-skill kit it used, and the older slide deck |

Charts follow one rule set: one series in ink with the focal entity in vermilion; two series in blue and vermilion (checked with the dataviz validator against the paper colour); values written in ink, never in the series colour; a legend or direct labels so identity is never colour alone; hover and focus tooltips on the line chart, with a hidden table for screen readers.

To change a sentence, change it in both languages in `src/content/<section>.js`; `npm test` fails if the two drift in shape or figures.

## Still to come

- The contact link is a stand-in (`group4@ettoday-study.example`): replace it in `src/content/faq.js` and `src/content/closing.js`.
- Member names: add them to the FAQ's "How Is the Work Divided?" answer in both languages when they are known.
- `share.jpg` is still the old page's hero; retake it from the Background opener. The canonical URL is a comment in `index.html` until the GitHub Pages address exists.
