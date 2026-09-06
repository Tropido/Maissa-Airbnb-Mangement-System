-- Premium Airbnb Host Platform — initial schema.
--
-- Mirrors src/lib/data/types.ts one-to-one. If you change a column here, change
-- the TypeScript type in the same commit.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type listing_status as enum ('active', 'pending', 'featured', 'inactive');

create type booking_status as enum (
  'confirmed',
  'awaiting_payment',
  'not_confirmed',
  'early_check_in',
  'cancelled',
  'blocked'
);

create type booking_channel as enum ('airbnb', 'booking_com', 'direct', 'owner_block');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table hosts (
  id             text primary key,
  display_name   text        not null,
  tagline        text        not null,
  bio            text        not null,
  avatar_url     text,
  response_time  text        not null default 'within an hour',
  hosting_since  int         not null default 0,
  average_rating numeric(2,1) not null default 5.0,
  -- Links a host row to the Supabase auth user who operates it.
  auth_user_id   uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now()
);

create table listings (
  id              text primary key,
  host_id         text        not null references hosts (id) on delete cascade,
  slug            text        not null unique,
  title           text        not null,
  location        text        not null,
  region          text        not null,
  style_tag       text        not null,
  status          listing_status not null default 'active',
  price_per_night numeric(10,2)  not null check (price_per_night >= 0),
  currency        text        not null default 'TND',
  hero_photo_url  text        not null,
  gallery_urls    text[]      not null default '{}',
  spin_photo_urls text[]      not null default '{}',
  video_tour_url  text,
  lat             double precision not null,
  lng             double precision not null,
  summary         text        not null,
  description     text[]      not null default '{}',
  bedrooms        int         not null default 1,
  beds            int         not null default 1,
  bathrooms       int         not null default 1,
  max_guests      int         not null default 2,
  amenities       jsonb       not null default '[]'::jsonb,
  rating          numeric(3,2) not null default 5.00,
  review_count    int         not null default 0,
  created_at      timestamptz not null default now()
);

create table bookings (
  id             text primary key,
  listing_id     text        not null references listings (id) on delete cascade,
  guest_name     text        not null,
  guest_avatar_url text,
  guest_count    int         not null default 1,
  check_in       date        not null,
  check_out      date        not null,
  check_in_time  text        not null default '15:00',
  check_out_time text        not null default '11:00',
  status         booking_status  not null default 'confirmed',
  channel        booking_channel not null default 'airbnb',
  nightly_price  numeric(10,2)   not null default 0,
  created_at     timestamptz not null default now(),
  constraint booking_dates_ordered check (check_out > check_in)
);

create table enquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  message      text not null,
  listing_slug text references listings (slug) on delete set null,
  guest_count  int,
  arriving     date,
  handled      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index listings_host_idx    on listings (host_id);
create index listings_status_idx  on listings (status);
create index bookings_listing_idx on bookings (listing_id);
-- The calendar always queries a date window, so index the range end points.
create index bookings_dates_idx   on bookings (check_in, check_out);
create index enquiries_open_idx   on enquiries (created_at desc) where not handled;

-- Overlapping stays on one listing are a data bug, not a UI problem. Reject
-- them at the database, ignoring cancelled rows.
create extension if not exists btree_gist;

alter table bookings
  add constraint bookings_no_overlap
  exclude using gist (
    listing_id with =,
    daterange(check_in, check_out, '[)') with &&
  )
  where (status <> 'cancelled');

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table hosts     enable row level security;
alter table listings  enable row level security;
alter table bookings  enable row level security;
alter table enquiries enable row level security;

-- The marketing site is public and unauthenticated.
create policy "hosts are publicly readable"
  on hosts for select using (true);

create policy "live listings are publicly readable"
  on listings for select using (status <> 'inactive');

-- Bookings and guest names are operator-only. Nothing here reaches the
-- marketing site.
create policy "bookings readable by authenticated operators"
  on bookings for select to authenticated using (true);

create policy "bookings writable by authenticated operators"
  on bookings for all to authenticated using (true) with check (true);

create policy "listings writable by authenticated operators"
  on listings for all to authenticated using (true) with check (true);

create policy "hosts writable by authenticated operators"
  on hosts for all to authenticated using (true) with check (true);

-- Anyone may leave an enquiry; only operators may read them back.
create policy "anyone may submit an enquiry"
  on enquiries for insert to anon, authenticated with check (true);

create policy "enquiries readable by authenticated operators"
  on enquiries for select to authenticated using (true);

create policy "enquiries updatable by authenticated operators"
  on enquiries for update to authenticated using (true) with check (true);
