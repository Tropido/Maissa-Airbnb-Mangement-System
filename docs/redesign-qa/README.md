# Maissa reference redesign — implementation and QA record

The seven pages in `Maissa Redesign/*.dc.html` are the visual source of truth; the
existing app is the source of truth for data, auth and business logic. This file
records how the two were reconciled and what was checked.

| Reference | Route |
| --- | --- |
| `Maissa Home.dc.html` | `/` |
| `Maissa Listings.dc.html` | `/listings` |
| `Maissa Listing Detail.dc.html` | `/listings/[slug]` (one template for both homes) |
| `Maissa Login.dc.html` | `/login` |
| `Maissa Dashboard.dc.html` | `/dashboard` |
| `Maissa Calendar.dc.html` | `/dashboard/calendar` |
| `Maissa Messaging.dc.html` | `/dashboard/messaging` |

`/dashboard/analytics`, `/channels`, `/tasks`, the 404 and the route error
boundary use the same system and stay clearly labelled as planned.

## Screenshots

`screenshots/app/<route>-<width>.jpg` — every route above at 1440, 1280, 768 and
390px, full page, production build, motion settled (reduced motion, intro
already seen). `screenshots/reference/<page>-<width>.jpg` — the reference pages
at the same widths. Both are downscaled to 720px wide JPEGs to keep the repo
light.

The reference runtime could not load as exported: `support.js` fetches React
and Babel from unpkg and the pages load GSAP from jsDelivr (both blocked where
this was built), and the `_ds/…` design-system bundle is not in the package. The
references were rendered with those exact URLs served from local copies (React
18.3.1 UMD and Babel standalone from npm, GSAP from `node_modules`), the missing
`_ds` files stubbed empty. Their image slots are empty placeholders by design.

## Where the exported aids and the pages disagreed

- **Type.** The export's Tailwind config keeps a serif `display` family; every
  page specifies Archivo only. Archivo (next/font) is the only family now.
- **Chart series.** The export's `chart.checkout` is rose (#A34A60); the
  dashboard page uses #A8693A. The page wins.
- **Tokens added from the pages:** ink-soft #46232F (body copy on detail),
  ink-night #12070A (sign-in backdrop), bg-tint #FDF4F6 (unread / selected
  rows), white card surface, status tints, the attention tile, channel chip
  tints.
- **Seed and inbox.** The export's two-home `seed.ts` / `inbox.ts` were adopted
  into the existing contracts (same exports, same `MessageThread` shape with
  `received_minutes_ago`). Its guest avatar paths pointed at files that do not
  exist, so guests fall back to initials; its local-time date maths was dropped
  in favour of the existing UTC helpers. Bookings mirror the calendar
  reference, offset from today.
- **Motion.** The prototype's global lifecycle (kill every ScrollTrigger on
  unmount, watchdogs, retries) was not ported. See "Motion" below.

## Accessibility adaptations (measured, smallest change)

- Label colour #8A6A74 measured 3.97:1 on blush and 3.64:1 on the sunken
  surface. `muted.soft` is #775B64 (5.0:1 / 4.6:1). It also replaces the nav's
  visually identical #7A5A63.
- #A98A94 and #B9959F (2.6:1, 2.2:1) carry no text. The prototype set read
  thread metadata and past calendar dates in them; those use `muted.soft`.
  Planned nav items keep a hollow marker and a spoken "(planned)" instead of a
  too-faint colour.
- Hero scrims and chip/Operator backings are ~65% ink, not the prototype's
  14–40%: blush text only clears 4.5:1 over a near-white image at that level.
  The sign-in backdrop is dimmed the same way.
- Decorative ScrambleText runs on an `aria-hidden` copy; screen readers get the
  plain text. SplitText headings keep their accessible name.
- Lightbox, sheets: Radix focus trap, Escape, focus returned to the opener.
  Inbox filter changes are announced as a count, not the whole list.

## Deliberate departures from the prototypes

- **Honest copy.** Sign-in does not promise delivery time or link expiry beyond
  what the action reports. The FAQ no longer claims "dates held for 24 hours"
  or that the current images are photographs. The host card says "Hosting since
  2022", not "Superhost since 2022". Simulated form results are gone; the real
  server actions answer.
- **Placeholder art is labelled** "Architectural study · photos to come"
  wherever an SVG render stands in for a photograph.
- **Tour card ▶** opens the home's photo spinner (`#walk-around`); no tour video
  exists. The card drags within the hero; the link itself is not a drag handle.
- **Enquiry context.** Detail-page CTAs go to `/?home=<slug>#contact`, which
  preselects that home in the form.
- **Navigation.** The phone hero gains a menu button (the prototype had no
  route to the other sections on phones). Dashboard links move to their own
  scrollable row under 1024px. The listings header gains a menu sheet under
  640px. `#map` is kept as an alias inside `#where` for older links.
- **Footer** appears on the home page only, as in the references.
- **Dashboard.** The overview opens on 7 days, as in the reference. Same-day
  check-out + check-in on one home is shown as a turnover row. The trial pill
  and the resource carousel (neither in the reference) are removed. Calendar
  bars are inspect-only; nothing is draggable.

## Motion

GSAP only (Framer Motion and Lenis were removed). `PageMotion` lives inside each
page or the dashboard `template.tsx` and owns one gsap.context, so unmounting
reverts exactly its own tweens, ScrollTriggers, SplitTexts and Observers.
ScrollSmoother is home-only (listings/detail have sticky elements). Reveals
start from visible server HTML, and content already on screen at load is not
re-hidden. The intro curtain runs once per session, ~2.3s including hydration,
skippable, with a CSS fail-safe and a `<noscript>` rule. Reduced motion turns
off all GSAP motion via `gsap.matchMedia`, CSS animation, idle spinner
rotation, drag inertia and the sign-in tilt.

## Checks run on the final build

- `npm run typecheck`, `npm run lint` (ESLint 9 flat config, `eslint-config-next`
  16.3.4), `npm run test:logic`, `npm run build` — all pass.
- Browser QA against `next start` (Playwright, Chromium): 58 interaction checks
  and 12 motion checks, all passing. They cover the intro curtain, anchors under
  ScrollSmoother, layout toggle, FAQ, sound toggle, bounded drag, focus scrolling
  under the smoother, slug links, enquiry validation (values kept, aria-invalid,
  preview "nothing was sent"), `?home=` preselect, lightbox keys and focus
  return, spinner keys and drag, client navigation and back/forward (smoother
  torn down and re-mounted, no leaked split wrappers), mobile menus, sign-in
  validation / unconfigured / callback errors, range pills, calendar filter,
  week movement and selection, inbox filters, reduced motion, and no-JS content
  on every page.
- Data edge cases (temporary seed variants, not committed): no listings, one
  listing, and a third home with a very long title and missing images — no
  errors, no broken-image glyphs, no page overflow.
- No horizontal page overflow at any of the four widths; the calendar scrolls
  inside its own surface.
- No console errors, hydration warnings or failed asset requests on any route.
  One dev-server-only React warning appears when a 404 re-renders the root
  layout's inline intro gate on the client; it does not occur in production.

## Still needed

- **Photography** (replace the SVG studies at the same paths, or update the
  listing URLs): per home a hero, six gallery images, and 24–36 spin frames
  shot in a circle; a portrait of Maissa (`/images/hosts/maissa.svg`). Guest
  portraits are optional — initials are used without them.
- `Images/Hero Desktop.png` and `Images/Hero Mobile.png` are third-party UI
  mockups (other brands' layouts), not photographs of either home, and are not
  used. `Images/villa image.jpg`, mentioned in the brief, is not in this
  repository.
- Not exercised here: a configured Supabase project (magic link send, enquiry
  insert) and a Mapbox token (the Mapbox path is unchanged apart from colour).
