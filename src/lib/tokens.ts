/**
 * Palette values for the handful of places a Tailwind class cannot reach:
 * inline SVG fills, a Mapbox paint property, a multi-stop gradient built in a
 * style object, a GSAP tween target.
 *
 * `tailwind.config.ts` remains the source of truth for the design system —
 * this file mirrors it so those contexts do not each grow their own literal.
 * If a colour changes there, change it here in the same commit.
 *
 * If you can express it as a class, use the class. This is the exception list,
 * not a second palette.
 */
export const BRAND = {
  primary: '#8E4257',
  primaryHover: '#A34A60',
  ink: '#1A0A0F',
  inkRaised: '#3A1520',
  inkNight: '#12070A',
  bg: '#F6E6EA',
  bgRaised: '#FFFBFC',
  bgSunken: '#EFDCE1',
  bgDeep: '#E7D2D8',
  muted: '#A98A94',
  mutedFg: '#6E4E58',
  mutedSoft: '#775B64',
  accent: '#C98FA0',
} as const;

/** Calendar bar fills, mirrored from `theme.colors.channel`. */
export const CHANNEL_FILL = {
  airbnb: '#A34A60',
  booking_com: '#6E5878',
  direct: '#7A5A46',
  owner_block: '#1A0A0F',
} as const;

/**
 * Ambient glow stops per time of day. The marketing hero shifts between these
 * so the page reads differently morning and evening without a theme switch.
 */
export const AMBIENT_PHASES = {
  dawn: { label: 'Dawn light', a: 'rgba(201,143,160,.34)', b: 'rgba(120,96,130,.24)' },
  day: { label: 'Midday', a: 'rgba(246,230,234,.24)', b: 'rgba(180,120,140,.18)' },
  dusk: { label: 'Golden hour', a: 'rgba(198,96,110,.34)', b: 'rgba(90,40,60,.30)' },
  night: { label: 'After dark', a: 'rgba(120,80,110,.28)', b: 'rgba(50,24,40,.34)' },
} as const;

export type AmbientPhase = keyof typeof AMBIENT_PHASES;

/**
 * Which phase the visitor's local clock falls into. Client-only: the server's
 * clock is not the visitor's, so the hero renders a fixed default first and
 * switches after mount.
 */
export function currentPhase(now: Date = new Date()): AmbientPhase {
  const h = now.getHours();
  if (h < 8) return 'dawn';
  if (h < 16) return 'day';
  if (h < 20) return 'dusk';
  return 'night';
}
