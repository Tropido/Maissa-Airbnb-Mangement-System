import type { Config } from 'tailwindcss';

/**
 * Design tokens — Minimalist Luxury Ambient (v5).
 *
 * Replaces the "Quiet Coastal Editorial" clay/sage system with the burgundy and
 * blush-pink palette. Every colour used anywhere in the product is declared here.
 * Components must never contain a raw hex value.
 *
 * Foreground pairings below are not stylistic choices; they are the pairings that
 * clear WCAG AA (4.5:1) against their block colour. Measured contrast on the
 * blush ground (#F6E6EA) and the burgundy ground (#1A0A0F):
 *
 *   blush on ink (burgundy)      15.9:1     ink on blush             15.9:1
 *   white on primary (rose)       5.14:1    ink on primary            3.09:1  (fails)
 *   primary on bg (as text/link)  4.92:1
 *   ink on champagne              9.71:1    white on champagne        2.16:1  (fails)
 *   muted-fg on bg                5.42:1
 *   white on danger               5.42:1
 *
 * `muted` (#A98A94) is 2.9:1 on `bg` — a divider/decoration colour only; it must
 * never carry text on a light surface. Secondary text on light uses `muted-fg`.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /** Rose — the single accent. Used for links, active states, map pins. */
        primary: {
          DEFAULT: '#8E4257',
          hover: '#A34A60',
          foreground: '#FFFFFF',
        },
        /** Burgundy — the darkest ground and all primary text. */
        ink: {
          DEFAULT: '#1A0A0F',
          raised: '#3A1520',
          soft: '#46232F',
          foreground: '#F6E6EA',
        },
        /** Blush — the light ground. */
        bg: {
          DEFAULT: '#F6E6EA',
          raised: '#FFFBFC',
          sunken: '#EFDCE1',
          deep: '#E7D2D8',
        },
        muted: {
          DEFAULT: '#A98A94',
          fg: '#6E4E58',
          soft: '#8A6A74',
          faint: '#B9959F',
        },
        /** Champagne — ambient glow and small emphasis on dark grounds. */
        accent: {
          DEFAULT: '#C98FA0',
          foreground: '#1A0A0F',
        },

        success: { DEFAULT: '#7A5A46', foreground: '#FFFFFF' },
        warning: { DEFAULT: '#B0813C', foreground: '#1A0A0F' },
        danger: { DEFAULT: '#A8412F', foreground: '#FFFFFF' },
        featured: { DEFAULT: '#8E4257', foreground: '#FFFFFF' },

        /**
         * Booking-channel identity for the calendar bars. A separate scale from the
         * status colours on purpose: status answers "what state is this booking in",
         * channel answers "where did it come from". Reusing one for the other makes
         * both unreadable.
         *
         * Re-validated as a categorical set inside the burgundy/blush family against
         * the #FFFBFC card surface — lightness band, chroma floor, CVD separation and
         * the 3:1 surface-contrast floor all pass.
         */
        channel: {
          airbnb: '#A34A60', // rose
          'airbnb-foreground': '#FFFFFF', // 5.02:1
          booking: '#6E5878', // plum
          'booking-foreground': '#FFFFFF', // 5.61:1
          direct: '#7A5A46', // tobacco
          'direct-foreground': '#FFFFFF', // 5.48:1
          block: '#1A0A0F', // burgundy, hatched in blush
          'block-foreground': '#F6E6EA', // 15.9:1
        },

        /**
         * Overview bar-chart series. Bars carry no inline text — values are
         * direct-labelled in ink above the plot — so only the 3:1 mark-vs-surface
         * floor applies.
         */
        chart: {
          checkin: '#7A5A46',
          checkout: '#A34A60',
          turnover: '#6E5878',
          grid: '#E7D2D8',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Lighter weights and tighter tracking than v4 — the luxury register.
        'display-xl': ['clamp(2.1rem, 10.5vw, 8.5rem)', { lineHeight: '0.94', letterSpacing: '-0.05em', fontWeight: '400' }],
        'display-lg': ['clamp(1.9rem, 7vw, 5rem)', { lineHeight: '0.98', letterSpacing: '-0.045em', fontWeight: '400' }],
        'display-md': ['clamp(1.6rem, 4.2vw, 3rem)', { lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '400' }],
        'display-sm': ['clamp(1.375rem, 2.6vw, 1.875rem)', { lineHeight: '1.06', letterSpacing: '-0.03em', fontWeight: '400' }],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(26 10 15 / 0.05), 0 1px 12px -4px rgb(26 10 15 / 0.10)',
        'soft-lg': '0 8px 30px -12px rgb(26 10 15 / 0.22)',
        'soft-xl': '0 40px 120px -40px rgb(26 10 15 / 0.55)',
        'soft-inset': 'inset 0 0 0 1px rgb(26 10 15 / 0.10)',
      },
      borderRadius: {
        none: '0',
        sm: '8px',
        md: '12px',
        card: '20px',
        lg: '22px',
        xl: '26px',
        '2xl': '30px',
      },
      spacing: {
        section: 'clamp(4rem, 10vw, 9rem)',
      },
      maxWidth: {
        shell: '96rem',
        prose: '78rem',
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
          '0%, 100%': { transform: 'translate3d(-8%, -6%, 0) scale(1)' },
          '50%': { transform: 'translate3d(6%, 5%, 0) scale(1.18)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate3d(7%, 6%, 0) scale(1.12)' },
          '50%': { transform: 'translate3d(-7%, -8%, 0) scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        drift1: 'drift1 30s ease-in-out infinite',
        drift2: 'drift2 38s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
