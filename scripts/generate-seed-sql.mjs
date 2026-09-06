/**
 * Emits supabase/seed.sql from the canonical TypeScript dataset.
 *
 * src/lib/data/seed.ts is the single source of truth for seed content. Writing
 * the SQL by hand would let the two drift the first time someone edits one of
 * them, so it is generated instead.
 *
 * Run: node scripts/generate-seed-sql.mjs
 * (Node 24 strips the TypeScript annotations natively — no build step.)
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const { HOST, LISTINGS, getSeedBookings } = await import(
  new URL('../src/lib/data/seed.ts', import.meta.url).href
);

/** Single-quote escaping for SQL string literals. */
const q = (value) => (value === null || value === undefined ? 'null' : `'${String(value).replace(/'/g, "''")}'`);

const textArray = (values) =>
  values.length === 0
    ? `'{}'::text[]`
    : `ARRAY[${values.map((v) => q(v)).join(', ')}]::text[]`;

const jsonb = (value) => `${q(JSON.stringify(value))}::jsonb`;

const lines = [];

lines.push('-- GENERATED FILE — do not edit by hand.');
lines.push('-- Source: src/lib/data/seed.ts');
lines.push('-- Regenerate: node scripts/generate-seed-sql.mjs');
lines.push('');
lines.push('begin;');
lines.push('');
lines.push('-- Idempotent: re-running replaces the seed rows rather than duplicating them.');
lines.push("delete from bookings where id like 'b\\_%';");
lines.push("delete from listings where host_id = " + q(HOST.id) + ';');
lines.push('delete from hosts where id = ' + q(HOST.id) + ';');
lines.push('');

lines.push('insert into hosts (id, display_name, tagline, bio, avatar_url, response_time, hosting_since, average_rating) values');
lines.push(
  `  (${[
    q(HOST.id),
    q(HOST.display_name),
    q(HOST.tagline),
    q(HOST.bio),
    q(HOST.avatar_url),
    q(HOST.response_time),
    HOST.hosting_since,
    HOST.average_rating,
  ].join(', ')});`,
);
lines.push('');

lines.push(
  'insert into listings (id, host_id, slug, title, location, region, style_tag, status, price_per_night, currency, hero_photo_url, gallery_urls, spin_photo_urls, video_tour_url, lat, lng, summary, description, bedrooms, beds, bathrooms, max_guests, amenities, rating, review_count) values',
);
lines.push(
  LISTINGS.map(
    (l) =>
      `  (${[
        q(l.id),
        q(l.host_id),
        q(l.slug),
        q(l.title),
        q(l.location),
        q(l.region),
        q(l.style_tag),
        `${q(l.status)}::listing_status`,
        l.price_per_night,
        q(l.currency),
        q(l.hero_photo_url),
        textArray(l.gallery_urls),
        textArray(l.spin_photo_urls),
        q(l.video_tour_url),
        l.lat,
        l.lng,
        q(l.summary),
        textArray(l.description),
        l.bedrooms,
        l.beds,
        l.bathrooms,
        l.max_guests,
        jsonb(l.amenities),
        l.rating,
        l.review_count,
      ].join(', ')})`,
  ).join(',\n') + ';',
);
lines.push('');

// Bookings are stored relative to CURRENT_DATE so a freshly seeded project
// always opens on a populated calendar, exactly like the TypeScript fallback.
const anchor = new Date(Date.UTC(2000, 0, 1));
const bookings = getSeedBookings(anchor);
const offset = (isoDate) =>
  Math.round((Date.parse(`${isoDate}T00:00:00Z`) - anchor.getTime()) / 86_400_000);

/** `current_date + 5` / `current_date - 3` — never `current_date + -3`, which is a syntax error. */
const relativeDate = (isoDate) => {
  const days = offset(isoDate);
  return days < 0 ? `current_date - ${Math.abs(days)}` : `current_date + ${days}`;
};

lines.push(
  'insert into bookings (id, listing_id, guest_name, guest_avatar_url, guest_count, check_in, check_out, check_in_time, check_out_time, status, channel, nightly_price) values',
);
lines.push(
  bookings
    .map(
      (b) =>
        `  (${[
          q(b.id),
          q(b.listing_id),
          q(b.guest_name),
          q(b.guest_avatar_url),
          b.guest_count,
          relativeDate(b.check_in),
          relativeDate(b.check_out),
          q(b.check_in_time),
          q(b.check_out_time),
          `${q(b.status)}::booking_status`,
          `${q(b.channel)}::booking_channel`,
          b.nightly_price,
        ].join(', ')})`,
    )
    .join(',\n') + ';',
);
lines.push('');
lines.push('commit;');
lines.push('');

const out = join(ROOT, 'supabase', 'seed.sql');
writeFileSync(out, lines.join('\n'), 'utf8');
console.log(
  `Wrote supabase/seed.sql — 1 host, ${LISTINGS.length} listings, ${bookings.length} bookings.`,
);
