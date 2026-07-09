-- ============ PREVENT DOUBLE BOOKING ============
-- Enable btree_gist so we can use an exclusion constraint that mixes
-- an equality check (listing_id) with a range-overlap check (dates).
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Guarantees at the database level that no two active (pending/confirmed)
-- bookings for the same listing can have overlapping [check_in, check_out) ranges.
-- This protects against race conditions (two guests booking at the same instant),
-- which a frontend-only check cannot fully prevent.
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    listing_id WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  )
  WHERE (status IN ('pending', 'confirmed'));

-- ============ PAYMENT STATUS SCAFFOLD ============
-- No payment gateway is integrated yet. This column lets the app track
-- payment state once a provider (PortOne, Toss, etc.) is wired in later,
-- without another schema migration at that time.
ALTER TABLE public.bookings
  ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid'
  CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded'));

ALTER TABLE public.bookings
  ADD COLUMN payment_provider TEXT;

ALTER TABLE public.bookings
  ADD COLUMN payment_reference TEXT;
