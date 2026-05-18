/**
 * GoFix design-system tokens.
 *
 *   `gfx`           ← atomic class strings. Composable. Theme-aware (no `dark:`).
 *   `goFixClasses`  ← legacy alias kept for backwards compatibility.
 *   `goFixColors`   ← raw hex values, only for the autofill workaround in
 *                     formStyle.js. Components should use Tailwind class names.
 *
 * The single source of truth for hex values is index.css (CSS variables).
 * tailwind.config.js mirrors those vars under semantic Tailwind tokens.
 */

/* ─ Atomic class strings ─────────────────────────────────────────────────────
   Static so Tailwind JIT can scan them. Tokens (bg-surface, text-ink, …)
   read from CSS variables, so these strings work in both light and dark mode
   without any `dark:` prefix.
*/
export const gfx = {
  /* Surfaces & containers ── */
  page:        'bg-page text-ink',
  card:        'bg-surface border border-line rounded-2xl shadow-card',
  cardLg:      'bg-surface border border-line rounded-3xl shadow-card-lg',
  cardFlat:    'bg-surface border border-line rounded-2xl',
  panel:       'bg-surface-2 border border-line rounded-xl',
  divider:     'border-line',
  hairline:    'h-px bg-line',

  /* Text ── */
  heading:     'text-ink font-extrabold tracking-tight2',
  title:       'text-ink font-bold tracking-tight2',
  body:        'text-ink-soft',
  muted:       'text-muted',
  faint:       'text-faint',
  link:        'text-ink hover:text-brand-strong transition-colors',
  caps:        'text-[11px] font-bold uppercase tracking-caps text-muted',

  /* Pills, chips, badges ── */
  pill:        'inline-flex items-center gap-2 bg-surface border border-line rounded-full px-4 py-1.5 text-sm text-ink',
  chip:        'inline-flex items-center gap-2 bg-chip text-chip-fg rounded-full px-3 py-1 text-sm font-medium',
  chipBrand:   'inline-flex items-center gap-2 bg-brand-tint text-brand-strong rounded-full px-3 py-1 text-sm font-medium',
  tag:         'inline-flex items-center font-mono text-[13px] font-bold text-ink bg-chip rounded-lg px-2.5 py-1.5',

  /* Buttons ── */
  btnPrimary:    'bg-accent hover:bg-accent-hover text-on-accent font-semibold rounded-full transition-colors',
  btnSecondary:  'bg-surface border border-line hover:border-line-2 text-ink font-medium rounded-full transition-colors',
  btnGhost:      'text-muted hover:text-ink transition-colors',
  btnDanger:     'bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors',

  /* Form inputs ── */
  inputBase:     'w-full text-sm rounded-xl border border-line bg-surface text-ink placeholder:text-faint focus:border-brand focus:ring-2 focus:ring-focus outline-none transition-all',
  inputError:    'border-red-400 focus:border-red-400 focus:ring-red-200',
  label:         'block text-sm font-medium text-ink mb-1.5',

  /* Card hover (interactive cards) ── */
  cardHover:     'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-md hover:border-line-2',
};

/* ─ Legacy alias (back-compat) ───────────────────────────────────────────── */
export const goFixClasses = {
  primaryButton:   gfx.btnPrimary,
  secondaryButton: gfx.btnSecondary,
  dangerButton:    gfx.btnDanger,
  badge:           gfx.chip,
};

/* ─ Feed / activity card tones (HeroSection) ─────────────────────────────────
   Each tone is a soft tint + a deeper ink for the icon. Hex values are used
   directly (rather than going through Tailwind tokens) so all three render
   identically regardless of which theme tokens happen to resolve. */
export const TONE_CLASSES = {
  sand:  'bg-[#FDF3E4] text-[#C9701F] dark:bg-[#3E2B16] dark:text-[#F3A258]',
  green: 'bg-[#E4F0E8] text-[#1D7A5B] dark:bg-[#172E26] dark:text-[#5BB591]',
  blue:  'bg-[#E4ECF6] text-[#2A4366] dark:bg-[#1A2C42] dark:text-[#A8BBD3]',
};

export const AVATAR_TONE = {
  sand:  'bg-[#FBE4C9] text-[#C9701F] dark:bg-[#4A331A] dark:text-[#F3A258]',
  green: 'bg-[#CFE3D6] text-[#1D7A5B] dark:bg-[#1F3B30] dark:text-[#5BB591]',
  blue:  'bg-[#D8E2EE] text-[#2A4366] dark:bg-[#22354F] dark:text-[#B8C7DD]',
};

/* ─ Pro card avatar palette (BrowseServices results grid) ─────────────────────
   Cycled by index to give a neighbourhood of pros varied avatar colors. Static
   strings so Tailwind JIT picks them up. */
export const PRO_AVATAR_TONES = [
  'bg-green-100  text-green-800  dark:bg-green-900/30  dark:text-green-300',
  'bg-amber-100  text-amber-800  dark:bg-amber-900/30  dark:text-amber-300',
  'bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-300',
  'bg-rose-100   text-rose-800   dark:bg-rose-900/30   dark:text-rose-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
];

/** Pick a deterministic tone for a given index. */
export const proAvatarTone = (index) =>
  PRO_AVATAR_TONES[((index % PRO_AVATAR_TONES.length) + PRO_AVATAR_TONES.length) % PRO_AVATAR_TONES.length];

/* ─ Raw hex (only for autofill CSS hacks in formStyle.js) ────────────────── */
export const goFixColors = {
  /* Light */
  ink:        '#0E1A2B',
  page:       '#F7F3EA',
  surface:    '#FFFFFF',
  inputBg:    '#FFFFFF',
  inputBgAr:  '#FAF7F0',
  /* Dark */
  inkDark:        '#EAF1F8',
  surfaceDark:    '#122236',
  inputBgDark:    '#0F1E32',
  /* Brand */
  brand:        '#ED8936',
  brandStrong:  '#C9701F',
  /* Legacy aliases used elsewhere in the codebase */
  navy800:    '#0E1A2B',
  brand400:   '#ED8936',
  cream:      '#F7F3EA',
  ok:         '#1D7A5B',
};