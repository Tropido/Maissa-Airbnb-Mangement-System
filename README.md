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
npm run lint         # ESLint CLI (Next.js 16 removed `next lint`)
npm run test:logic   # node --test regression checks for the dashboard filters
npm run gen:art      # regenerate placeholder imagery
npm run gen:seed     # regenerate supabase/seed.sql from the TypeScript seed
```

## Environment

Copy `.env.example` to `.env.local`. Every variable is optional, and the app degrades honestly without each one.

| Variable | Without it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Reads fall back to the bundled seed data. Enquiries validate and confirm but are not stored, and say so. The dashboard is open rather than gated, and the login page says so. |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | The map renders the Natural Earth outline of Tunisia with coordinate-accurate pins instead of Mapbox. `mapbox-gl` is never downloaded. |
| `NEXT_PUBLIC_SITE_URL` | Magic-link redirects fall back to the request host. |

## Design system

**Burgundy and blush, set in Archivo.** The visual source of truth is the seven reference pages in `Maissa Redesign/*.dc.html`; the app translates them into components. Light and regular display weights with tight tracking, pill controls, 20–30px radii, hairline borders and broad soft shadows. Marketing sections sit in a 1240px column, the calendar in 1400px, the inbox in 1000px, the sign-in panel in 920px.

All colour lives in `tailwind.config.ts`. `src/lib/tokens.ts` mirrors it for the places a class cannot reach (inline SVG fills, Mapbox paint, gradients built in a style object, GSAP targets). The measured contrast ratios, and the one adjustment made to the reference palette for AA (`muted.soft`), are recorded in a comment in the config. `muted` and `muted.faint` are decoration colours only.

Two categorical scales serve the dashboard:

- `channel.*` — booking source on the calendar bars.
- `chart.*` — the three series on the overview chart.

Status is never carried by colour alone: every status chip leads with its own glyph and label, and channel chips are labelled.

`docs/redesign-qa/` records how the references were reconciled with the app, the accessibility adaptations, and before/after screenshots at 1440, 1280, 768 and 390px.

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

`public/images/` currently holds generated placeholder art, not photography: a perspective render of each home — the Djerba courtyard house and the Ezzahra terrace loft — swept through 24 azimuths so the spin viewer genuinely rotates. Every SVG render on the site carries an "Architectural study · photos to come" label, which disappears automatically once a listing points at a non-SVG file.

To replace it with real photography, drop files at the same paths:

```
public/images/listings/<slug>/hero.(jpg|webp)
public/images/listings/<slug>/g1..g6.(jpg|webp)
public/images/spin/<slug>/00..23.(jpg|webp)
```

then update `hero_photo_url`, `gallery_urls` and `spin_photo_urls` in `src/lib/data/seed.ts` (or the `listings` table), and remove the `dangerouslyAllowSVG` block from `next.config.mjs` — it exists only because the placeholders are SVG.

The spin sequence wants 24 to 36 frames shot in a circle around the property at a constant distance and height.

## Motion

GSAP (with the formerly-paid plugins, free since 3.13) drives all motion; there is no second animation engine. Plugins are registered once in `src/components/motion/gsap.ts`.

- `PageMotion` wires reveals, SplitText headings, ScrambleText labels, DrawSVG/MotionPath on the Tunisia map, the MorphSVG divider, the Observer header retreat and ScrollTo anchors from data attributes, scoped to its own subtree. It lives inside each page (or the dashboard's `template.tsx`) so it only ever touches hydrated markup, and its gsap.context reverts exactly what it created.
- ScrollSmoother runs on the home page only — listings and detail have sticky elements that a transformed wrapper would break; the dashboard keeps native scroll for the calendar.
- The branded intro curtain plays once per browser session, never under reduced motion, and can be skipped with any key or click. A CSS fail-safe removes it if the animation never runs, and it is hidden without JavaScript.
- `prefers-reduced-motion` disables every GSAP animation (via `gsap.matchMedia`), CSS animation, idle spinner rotation, drag inertia and pointer tilt. Content is fully visible in the server HTML either way.
- **mapbox-gl** (1.8 MB) is code-split and loads only when a Mapbox token is present.

## Phase 2

The 360 viewer is the photo-sequence spinner described in the brief. Swapping it for a Spline walkthrough needs a real `.splinecode` model, commissioned or captured by photogrammetry. That is a different asset pipeline, not a code change, and the Phase 1 assets cannot stand in for it. `SpinViewer`'s props are frame-agnostic so the swap is contained.

## Not in this build

`/dashboard/channels`, `/dashboard/analytics` and `/dashboard/tasks` are in the nav because the reference design has them. Each renders what the section will do and links back to what works today, rather than 404ing. Messaging is real but read-only — replies still go out on the channel the guest wrote from.
