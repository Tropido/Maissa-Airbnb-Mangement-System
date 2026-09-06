/**
 * Palette values for the handful of places a Tailwind class cannot reach:
 * a `<canvas>` fill, a Mapbox paint property, a multi-stop gradient built in a
 * style object.
 *
 * `tailwind.config.ts` remains the source of truth for the design system —
 * this file mirrors it so those contexts do not each grow their own literal.
 * If a colour changes there, change it here in the same commit.
 *
 * If you can express it as a class, use the class. This is the exception list,
 * not a second palette.
 */
export const BRAND = {
  primary: '#9C4F32',
  primaryHover: '#B5613F',
  ink: '#1C1A17',
  bg: '#F5F1EA',
  bgRaised: '#FBF8F2',
  muted: '#8C8577',
  mutedFg: '#756B5C',
  accent: '#66714F',
} as const;

/** Particle trail colours — brand accents only, on a transparent canvas. */
export const PARTICLE_COLORS = [BRAND.primary, BRAND.accent, BRAND.ink] as const;
