import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Design tokens — Maissa reference redesign (burgundy / blush, Archivo).
 *
 * Values are lifted from the seven `Maissa Redesign/*.dc.html` reference pages.
 * Where the exported `tokens.ts` / `tailwind.config.ts` aids disagree with a
 * page, the page wins (e.g. the check-out chart series is #A8693A on the
 * dashboard reference, not the export's rose).
 *
 * `src/lib/tokens.ts` mirrors these for the places classes cannot reach
 * (inline SVG fills, canvas, Mapbox paint, GSAP tween targets). Change both in
 * the same commit.
 *
 * Measured WCAG contrast (normal text needs 4.5:1):
 *
 *   ink on bg                      15.9:1     bg on ink                 15.9:1
 *   muted-fg (#6E4E58) on bg        6.0:1     on sunken                  5.5:1
 *   muted-soft (#775B64) on bg      5.0:1     on sunken                  4.6:1
 *   primary (#8E4257) on bg         5.7:1     white on primary           6.9:1
 *   white on channel airbnb         5.7:1     booking 6.3:1   direct     6.2:1
 *   white on danger                 6.1:1
 *   bg at 55% on ink                5.3:1     (secondary text on dark)
 *
 * Accessibility adjustment: the references set small labels in #8A6A74, which
 * measures 3.97:1 on blush and 3.64:1 on the sunken surface. `muted.soft` is the
 * smallest darkening that clears AA on both (#775B64). It also stands in for
 * the nav's #7A5A63, which is visually identical.
 *
 * `muted.DEFAULT` (#A98A94, 2.6:1) and `muted.faint` (#B9959F, 2.2:1) are
 * decoration colours only — dots, rules, hatching — never text.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /** Rose — links, eyebrows on light grounds, map pins. */
        primary: {
          DEFAULT: '#8E4257',
          hover: '#A34A60',
          foreground: '#FFFFFF',
        },
        /** Deep burgundy — primary ink and the dark grounds. */
        ink: {
          DEFAULT: '#1A0A0F',
          raised: '#3A1520',
          soft: '#46232F',
          night: '#12070A',
          foreground: '#F6E6EA',
        },
        /** Blush — the light grounds. `card` is the dashboard's white surface. */
        bg: {
          DEFAULT: '#F6E6EA',
          raised: '#FFFBFC',
          sunken: '#EFDCE1',
          deep: '#E7D2D8',
          tint: '#FDF4F6',
          card: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#A98A94',
          fg: '#6E4E58',
          soft: '#775B64',
          faint: '#B9959F',
        },
        /** Ambient rose glow. Decorative on light grounds; text-safe on ink. */
        accent: {
          DEFAULT: '#C98FA0',
          foreground: '#1A0A0F',
        },

        danger: { DEFAULT: '#A8412F', foreground: '#FFFFFF' },

        /** Operational states, from the dashboard and calendar references. */
        status: {
          confirmed: '#6B4A38',
          'confirmed-bg': 'rgb(122 90 70 / 0.16)',
          awaiting: '#7A5528',
          'awaiting-bg': 'rgb(176 129 60 / 0.22)',
          unconfirmed: '#8A3F2C',
          'unconfirmed-bg': 'rgb(168 65 47 / 0.16)',
          early: '#5E4869',
          'early-bg': 'rgb(110 88 120 / 0.18)',
          blocked: '#46232F',
          'blocked-bg': 'rgb(26 10 15 / 0.08)',
        },

        /** The "needs attention" tile. */
        attention: {
          DEFAULT: '#F7E2E6',
          border: 'rgb(168 65 47 / 0.24)',
          label: '#8A5A3C',
          value: '#8A3F2C',
          fg: '#6B4A38',
        },

        /**
         * Booking channel identity. Separate from status on purpose: channel
         * answers "where did it come from", status "what state is it in".
         */
        channel: {
          airbnb: '#A34A60',
          'airbnb-foreground': '#FFFFFF',
          'airbnb-tint': 'rgb(163 74 96 / 0.16)',
          'airbnb-ink': '#8E4257',
          booking: '#6E5878',
          'booking-foreground': '#FFFFFF',
          'booking-tint': 'rgb(110 88 120 / 0.18)',
          'booking-ink': '#5E4869',
          direct: '#7A5A46',
          'direct-foreground': '#FFFFFF',
          'direct-tint': 'rgb(122 90 70 / 0.18)',
          'direct-ink': '#6B4A38',
          block: '#1A0A0F',
          'block-foreground': '#F6E6EA',
        },

        /** Overview chart series (bars carry no text, so 3:1 vs surface applies). */
        chart: {
          checkin: '#7A5A46',
          checkout: '#A8693A',
          turnover: '#6E5878',
        },
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        hero: '0 40px 120px -40px rgb(0 0 0 / 0.7)',
        'hero-mobile': '0 30px 80px -34px rgb(0 0 0 / 0.7)',
        float: '0 24px 60px -28px rgb(0 0 0 / 0.5)',
        pill: '0 10px 30px -14px rgb(0 0 0 / 0.5)',
        form: '0 30px 70px -46px rgb(26 10 15 / 0.5)',
        panel: '0 50px 120px -50px rgb(0 0 0 / 0.8)',
        lift: '0 24px 50px -34px rgb(26 10 15 / 0.35)',
        bar: '0 4px 10px -8px rgb(26 10 15 / 0.5)',
        'bar-selected': '0 0 0 2px #1A0A0F, 0 12px 24px -14px rgb(26 10 15 / 0.6)',
      },
      maxWidth: {
        site: '1240px',
        console: '1400px',
        inbox: '1000px',
        login: '920px',
      },
      spacing: {
        gutter: 'clamp(20px, 4vw, 56px)',
        'gutter-console': 'clamp(16px, 3vw, 36px)',
      },
      keyframes: {
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
        drift1: 'drift1 34s ease-in-out infinite',
        drift2: 'drift2 42s ease-in-out infinite',
      },
      transitionTimingFunction: {
        quiet: 'cubic-bezier(.16, 1, .3, 1)',
      },
    },
  },
  plugins: [animate],
};

export default config;
