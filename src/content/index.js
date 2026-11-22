// Every section's words, in page order. Each module is { en, zh } with the same shape in both.
import { background } from './background.js';
import { platform } from './platform.js';
import { site } from './site.js';
import { questions } from './questions.js';
import { architecture } from './architecture.js';
import { sources } from './sources.js';
import { faq } from './faq.js';
import { closing } from './closing.js';
import { output } from './output.js';

// site and questions are parts of the output section; they keep their own files
export const content = { background, platform, sources, architecture, output, site, questions, faq, closing };
