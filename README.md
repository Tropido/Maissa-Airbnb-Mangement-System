# Premium Airbnb Host Platform

A single Next.js app with two faces:

- **Marketing site** (`src/app/(marketing)`) — a public showcase of the host's property portfolio, built to be sent to a prospective client as a working preview.
- **Operator dashboard** (`src/app/(dashboard)`) — an internal control layer for listings, bookings and calendar availability. Booking still happens on Airbnb; this manages what sits on top of it.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

Nothing else is required. With no environment variables set, the app runs on the bundled seed dataset in `src/lib/data/seed.ts` and every page is fully populated.

```bash
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
npm run gen:art      # regenerate placeholder imagery
npm run gen:seed     # regenerate supabase/seed.sql from the TypeScript seed
```

## Environment

Copy `.env.example` to `.env.local`. Every variable is optional, and the app degrades honestly without each one.

| Variable | Without it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Reads fall back to the bundled seed data. Enquiries validate and confirm but are not stored, and say so. The dashboard is open rather than gated, and the login page says so. |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | The map renders a coordinate-accurate schematic plot instead of Mapbox. `mapbox-gl` is never downloaded. |
| `NEXT_PUBLIC_SITE_URL` | Magic-link redirects fall back to the request host. |

## Design system

**Brutalist minimalism.** Brutalism owns the accents — hard 2px borders, hard offset shadows with no blur, heavy display type. Minimalism owns the structure — whitespace, grid discipline, two or three focal elements per viewport.

All colour lives in `tailwind.config.ts`. Components carry no raw hex. The one exception is `src/lib/tokens.ts`, which mirrors the palette for the three places a class cannot reach: a `<canvas>` fill, a Mapbox paint property, and a multi-stop gradient built in a style object.

Foreground pairings in the config are not stylistic choices. Each is the pairing that clears WCAG AA against its block colour, and the measured ratios are recorded in a comment there. Notably `white` on `primary` measures 3.30:1 and is never used; `ink` on `primary` measures 5.28:1 and is.

`muted` (`#B5B5B5`) is 1.71:1 against the light background. It is a divider colour only. Secondary text on light surfaces uses `muted-fg` (`#5A5A5A`, 5.73:1). On the dark `ink` surface, `muted` is the correct secondary text colour.

The marketing site uses five colours: `primary`, `primary-hover`, the three neutrals, and `accent`. The four status colours are reserved for the dashboard's functional UI.

Two additional scales were added for the dashboard and validated as categorical palettes (lightness band, chroma floor, colour-vision separation, normal-vision separation, surface contrast):

- `channel.*` — booking source on the calendar bars.
- `chart.*` — the three series on the overview chart.

Status is never carried by colour alone. Every status chip ships an icon and a label, and the overview chart has a legend plus a table view.

## Data

`src/lib/data/types.ts` mirrors `supabase/migrations/0001_init.sql` one to one. Change one, change the other in the same commit.

`src/lib/data/queries.ts` is the read layer. Each function tries Supabase and falls back to seed data when no project is configured or a query fails, so a preview link is never empty.

Bookings are seeded relative to the current date, so the calendar always opens populated regardless of when it is loaded. `supabase/seed.sql` is generated from the TypeScript seed by `npm run gen:seed` rather than written by hand, so the two cannot drift.

### Setting up Supabase

1. Create a project and run `supabase/migrations/0001_init.sql`.
2. Run `supabase/seed.sql`.
3. Put the project URL and anon key in `.env.local`.
4. Enable email magic links in Auth, and add `<site>/auth/callback` as a redirect URL.

Row level security is on for every table. Hosts and live listings are publicly readable; bookings and guest names are readable only by authenticated operators; anyone may insert an enquiry but only operators may read them back. Overlapping stays on one listing are rejected by an exclusion constraint rather than left to the UI.

## Imagery

`public/images/` currently holds generated placeholder art, not photography. It is a real perspective render of each property — a Djerba courtyard house, a cubic poolside villa, a Sidi Bou Said terrace loft, a Tabarka forest cabin — swept through 24 azimuths so the 360 viewer genuinely rotates. It is drawn strictly in the marketing palette so it reads as art direction rather than filler.

To replace it with real photography, drop files at the same paths:

```
public/images/listings/<slug>/hero.(jpg|webp)
public/images/listings/<slug>/g1..g6.(jpg|webp)
public/images/spin/<slug>/00..23.(jpg|webp)
```

then update `hero_photo_url`, `gallery_urls` and `spin_photo_urls` in `src/lib/data/seed.ts` (or the `listings` table), and remove the `dangerouslyAllowSVG` block from `next.config.mjs` — it exists only because the placeholders are SVG.

The spin sequence wants 24 to 36 frames shot in a circle around the property at a constant distance and height.

## Motion

`framer-motion` is the core dependency and is in the main bundle. Everything else is code-split:

- **GSAP** (51 kB) loads only for the hero particle trail, only on pointer devices, and only when reduced motion is not requested. On touch it is never downloaded.
- **mapbox-gl** (1.8 MB) loads only when a Mapbox token is present.

Reduced motion is handled once, at the provider (`src/components/motion/motion-provider.tsx`), using framer's `reducedMotion="user"`. Branching per component was tried and reverted: the server has no media query to read, so a component that renders differently on each side produces a hydration mismatch.

Lenis smooth scrolling is mounted on the marketing shell only. The dashboard needs native scrolling for the calendar grid, and Lenis is disabled outright under reduced motion.

## Phase 2

The 360 viewer is the photo-sequence spinner described in the brief. Swapping it for a Spline walkthrough needs a real `.splinecode` model, commissioned or captured by photogrammetry. That is a different asset pipeline, not a code change, and the Phase 1 assets cannot stand in for it. `SpinViewer`'s props are frame-agnostic so the swap is contained.

## Not in this build

`/dashboard/channels`, `/dashboard/analytics` and `/dashboard/tasks` are in the nav because the reference design has them. Each renders what the section will do and links back to what works today, rather than 404ing. Messaging is real but read-only — replies still go out on the channel the guest wrote from.
