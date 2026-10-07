# Maissa — v5 "Minimalist Luxury Ambient" handoff

Everything in `code/` mirrors your repo's own paths. Copy each file to the same
path in `Maissa Airbnb/` and restart `next dev`.

I can only read your local folder, not write to it — that's why this is a copy-in
package rather than a commit.

---

## 1. Drop-in replacements

| Copy this | Over this | What changes |
|---|---|---|
| `code/tailwind.config.ts` | `tailwind.config.ts` | Whole palette → burgundy/blush. Lighter display weights, larger radii, new shadow scale. |
| `code/src/lib/tokens.ts` | `src/lib/tokens.ts` | Mirrored hexes + `AMBIENT_PHASES` / `currentPhase()` for the time-of-day glow. |
| `code/src/app/globals.css` | `src/app/globals.css` | Lenis block → ScrollSmoother's `#smooth-wrapper` / `#smooth-content`; adds the `motion-ready` guard. |
| `code/src/lib/data/seed.ts` | `src/lib/data/seed.ts` | **Two listings only.** Same exports (`HOST`, `LISTINGS`, `getListingBySlug`, `getSeedBookings`). 14 bookings, no double-bookings, one owner block each. |
| `code/src/lib/data/inbox.ts` | `src/lib/data/inbox.ts` | Threads repointed at the two homes. Same exports (`MESSAGE_THREADS`, `unreadCount`). |

## 2. New files

| File | Purpose |
|---|---|
| `code/src/components/motion/gsap-provider.tsx` | Registers all 12 GSAP plugins once and wires every scroll/text/UI/SVG behaviour off `data-*` attributes. |
| `code/src/components/motion/page-loader.tsx` | The loading screen. |
| `code/src/components/motion/reveal.tsx` | Replaces the framer-motion `Reveal`; adds `SplitHeading`. |

Because these are all free in GSAP 3.13+ (`gsap@^3.15.0` is already in your
`package.json`), there is **no Club install step and no auth token in CI**.

## 3. Wire the provider — `src/app/(marketing)/layout.tsx`

```tsx
import { GsapProvider } from '@/components/motion/gsap-provider';
import { PageLoader } from '@/components/motion/page-loader';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <GsapProvider smooth>{children}</GsapProvider>
    </>
  );
}
```

Dashboard layout: same but `<GsapProvider>` with **no** `smooth` prop —
ScrollSmoother fights sticky table headers.

Then delete `src/components/motion/smooth-scroll.tsx` and drop `lenis` from
`package.json`. `MotionProvider` (framer) can stay for the components that still
use framer, or go once they're all on `Reveal`.

## 4. Motion vocabulary

Add these attributes to markup; the provider does the rest.

| Attribute | Behaviour |
|---|---|
| `data-reveal` | Fade + rise on entry (or use `<Reveal>`) |
| `data-split` | SplitText line reveal (or `<SplitHeading>`) |
| `data-intro` | Part of the post-loader intro stagger |
| `data-scramble` | ScrambleText settle |
| `data-scroll-link` | ScrollTo glide on an `href="#id"` |
| `data-hide-on-scroll` | Header retreats on scroll-down (Observer) |
| `data-draw` | DrawSVG stroke-in |
| `data-path` + `data-mote` | MotionPath loop |
| `data-morph-from` / `data-morph-to` | MorphSVG, scrubbed |
| `data-drag` (+ `data-drag-bounds`) | Draggable + Inertia |

Flip is registered for layout toggles — call `Flip.getState()` before the state
change, `Flip.from()` after.

## 5. Copy still naming the removed homes

These have the old text hardcoded, so tokens and seed won't fix them. Each is a
one-line edit:

- `src/app/layout.tsx:27` — metadata description
- `src/app/(marketing)/page.tsx:38` — `eyebrow="Djerba / Hammamet / Sidi Bou Said / Tabarka"` → `"Djerba / Ezzahra"`
- `src/app/(marketing)/listings/page.tsx:13` — "Four design-forward homes across…"
- `src/components/marketing/site-footer.tsx:14` — same sentence
- `src/components/marketing/map-section.tsx:22` — "Tabarka to the whitewashed lanes of Djerba"
- `src/app/(dashboard)/login/page.tsx:39-40` — the `Hammamet` / `Sidi Bou Said` decorative labels

## 6. One bug to fix while you're in there

`src/app/(marketing)/listings/page.tsx:56` uses `listings[0]` and
`mapbox-map.tsx:38` uses `listings[0].lng` — both fine at two listings, but
they'll throw on an empty array. `page.tsx:32` already guards correctly with
`?? listings[0]`. Worth a `if (!listings.length) return null` at the top of each.

## 7. The map

The homepage "Where" map uses the real Natural Earth Tunisia boundary
(public domain), projected equirectangular with x scaled by cos 34°. The path
data and both pin positions are in `Maissa Home.dc.html` — lift the `<svg>` from
the `#where` section into `schematic-map.tsx`. Pins: Djerba 33.876/10.858,
Ezzahra 36.742/10.310.

---

**Not included:** photography. Every image slot is still a placeholder — the repo
only ships procedural SVG art under `public/images/`. The new seed points at
`/images/listings/djerba-villa/…` and `/images/listings/ezzahra-apartment-loft/…`,
so either rerun `npm run gen:art` for those two slugs or drop real photos there.
