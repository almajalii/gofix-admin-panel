/**
 * Tailwind config — semantic theme tokens read from CSS variables.
 *
 *   bg-page        bg-surface     bg-surface-2   bg-elev
 *   text-ink       text-ink-soft  text-muted     text-faint
 *   border-line    border-line-2
 *   bg-chip        text-chip-fg
 *   bg-brand       text-brand     bg-brand-soft  bg-brand-tint
 *   bg-accent      text-on-accent
 *
 * Light/dark switching is automatic — both themes redefine the same vars in
 * index.css. Components don't need `dark:` color prefixes anymore.
 *
 * Legacy palette names (navy-*, brand-*, gray-*, cream, surface, dark.*) are
 * retained so unmodified code keeps working — their hex values are retuned to
 * match the new ink/cream/orange tone.
 */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Semantic tokens (preferred) ───────────────────────────── */
        page:        'var(--gf-page)',
        'page-2':    'var(--gf-page-2)',
        surface:     'var(--gf-surface)',
        'surface-2': 'var(--gf-surface-2)',
        elev:        'var(--gf-elev)',

        ink:         'var(--gf-ink)',
        'ink-soft':  'var(--gf-ink-soft)',
        muted:       'var(--gf-muted)',
        faint:       'var(--gf-faint)',

        line:        'var(--gf-border)',
        'line-2':    'var(--gf-border-strong)',

        brand:        'var(--gf-brand)',
        'brand-strong':'var(--gf-brand-strong)',
        'brand-soft': 'var(--gf-brand-soft)',
        'brand-tint': 'var(--gf-brand-tint)',

        accent:        'var(--gf-accent)',
        'accent-hover':'var(--gf-accent-hover)',
        'on-accent':   'var(--gf-on-accent)',

        chip:         'var(--gf-chip)',
        'chip-fg':    'var(--gf-chip-text)',

        /* ── Legacy palette (retuned hex, kept for back-compat) ────── */
        navy: {
          900: '#001327',
          800: '#0E1A2B',  /* was #012249 — deeper, sharper ink         */
          700: '#1B2A42',
          600: '#2A4060',
          100: '#C8D2E0',
          50:  '#EEF1F4',  /* warm-neutral pale, no blue cast           */
        },
        brand: {
          500: '#C9701F',
          400: '#ED8936',  /* softened from #F3800D                     */
          200: '#FBE4C9',
          50:  '#FDF3E4',
        },
        gray: {
          900: '#0E1A2B',
          700: '#3A4658',
          500: '#5C6675',  /* warmer than #627d98                       */
          300: '#B7BDC7',
          200: '#E7E2D5',  /* warm border to match cream                */
          100: '#F1ECDF',  /* warm input bg                             */
          50:  '#FAF7F0',
        },
        cream:   '#F7F3EA',
        surface: '#FFFFFF',
        dark: {
          bg:     '#0B1726',
          card:   '#122236',
          border: '#1F3450',
          hover:  '#16263C',
        },
        ok: '#1D7A5B',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3.5xl': '1.75rem',
      },
      boxShadow: {
        /* Warmer, softer shadows. Drive from CSS vars so dark mode adapts. */
        'card':      'var(--gf-shadow-sm)',
        'card-md':   'var(--gf-shadow-md)',
        'card-lg':   'var(--gf-shadow-lg)',
        'card-dark': '0 2px 12px 0 rgba(0,0,0,0.4)', /* legacy */
      },
      letterSpacing: {
        caps:   '0.15em',
        tight2: '-0.035em',
      },
      ringColor: {
        focus: 'var(--gf-focus-ring)',
      },
    },
  },
  plugins: [],
};