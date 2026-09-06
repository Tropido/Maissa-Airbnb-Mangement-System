import type { Config } from 'tailwindcss';

/**
 * Design tokens — Quiet Coastal Editorial (v3, supersedes Brutalist Minimalism).
 *
 * Every colour used anywhere in the product is declared here. Components must
 * never contain a raw hex value.
 *
 * Foreground pairings below are not stylistic choices; they are the pairings
 * that clear WCAG AA (4.5:1) against their block colour. Measured contrast:
 *
 *   white on primary (clay)      5.87:1     ink on primary           2.96:1  (fails)
 *   clay  on bg (as text/link)   5.21:1
 *   white on accent (sage)       5.20:1     ink on accent            3.34:1  (fails)
 *   ink   on success             6.26:1     white on success         2.78:1  (fails)
 *   ink   on warning              6.73:1
 *   white on danger               5.42:1     ink on danger           3.21:1  (fails)
 *   white on featured             5.87:1     ink on featured         2.97:1  (fails)
 *   ink   on bg                  15.42:1
 *   white on channel-airbnb       5.87:1     white on channel-booking 4.56:1
 *   white on channel-direct       5.20:1
 *
 * `muted` (#8C8577) is 3.25:1 on `bg` — it is a divider/decoration colour only
 * and must never carry text on a light surface. Secondary text on light uses
 * `muted-fg` (#756B5C, 4.65:1).
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9C4F32',
          hover: '#B5613F',
          foreground: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#1C1A17',
          foreground: '#F5F1EA',
        },
        bg: {
          DEFAULT: '#F5F1EA',
          raised: '#FBF8F2',
          sunken: '#EDE6D8',
        },
        muted: {
          DEFAULT: '#8C8577',
          fg: '#756B5C',
        },
        accent: {
          DEFAULT: '#66714F',
          foreground: '#FFFFFF',
        },
        success: { DEFAULT: '#4CAF50', foreground: '#1A1A1A' },
        warning: { DEFAULT: '#C79A45', foreground: '#1C1A17' },
        danger: { DEFAULT: '#D50032', foreground: '#FFFFFF' },
        featured: { DEFAULT: '#8E44AD', foreground: '#FFFFFF' },

        /**
         * Booking-channel identity for the calendar bars. A separate scale from
         * the status colours above on purpose: status answers "what state is this
         * booking in", channel answers "where did it come from". Reusing one for
         * the other makes both unreadable.
         *
         * Validated as a categorical set against the #F5F5F5 card surface —
         * lightness band, chroma floor, CVD separation, normal-vision separation
         * and 3:1 surface contrast all pass. Foregrounds are the AA-clearing pair.
         */
        channel: {
          airbnb: '#9C4F32', // = primary (clay)
          'airbnb-foreground': '#FFFFFF', // 5.87:1
          booking: '#5B7A8C', // muted denim
          'booking-foreground': '#FFFFFF', // 4.56:1
          direct: '#66714F', // = accent (sage)
          'direct-foreground': '#FFFFFF', // 5.20:1
          block: '#1C1A17', // = ink, unchanged look
          'block-foreground': '#F5F1EA', // 15.42:1
        },

        /**
         * Overview bar-chart series. Same validation run, on the same surface.
         * Bars carry no inline text — values are direct-labelled in ink above the
         * plot — so only the 3:1 mark-vs-surface floor applies.
         */
        chart: {
          checkin: '#0095B8',
          checkout: '#FF4F00',
          turnover: '#8E44AD',
          grid: '#DEDEDE',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.1rem, 10.5vw, 8.5rem)', { lineHeight: '0.88', letterSpacing: '-0.045em', fontWeight: '800' }],
        'display-lg': ['clamp(1.9rem, 7vw, 5rem)', { lineHeight: '0.92', letterSpacing: '-0.04em', fontWeight: '800' }],
        'display-md': ['clamp(1.6rem, 4.2vw, 3rem)', { lineHeight: '0.98', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-sm': ['clamp(1.375rem, 2.6vw, 1.875rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      boxShadow: {
        // Hard-edged offsets — dashboard only now, marketing dropped these. No blur, ever.
        brutal: '4px 4px 0 0 #1C1A17',
        'brutal-lg': '8px 8px 0 0 #1C1A17',
        'brutal-sm': '2px 2px 0 0 #1C1A17',
        'brutal-primary': '4px 4px 0 0 #9C4F32',
        'brutal-accent': '4px 4px 0 0 #66714F',
        'brutal-inverse': '4px 4px 0 0 #F5F1EA',
      },
      borderRadius: {
        none: '0',
        card: '0',
      },
      spacing: {
        section: 'clamp(4rem, 10vw, 9rem)',
      },
      maxWidth: {
        shell: '96rem',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        drift1: {
          '0%, 100%': { transform: 'translate(-10%, -8%) scale(1)' },
          '50%': { transform: 'translate(6%, 4%) scale(1.12)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate(8%, 6%) scale(1.08)' },
          '50%': { transform: 'translate(-6%, -10%) scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        drift1: 'drift1 26s ease-in-out infinite',
        drift2: 'drift2 32s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
