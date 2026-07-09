CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    listing_id WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  )
  WHERE (status IN ('pending', 'confirmed'));

ALTER TABLE public.bookings
  ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid'
  CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded'));

ALTER TABLE public.bookings ADD COLUMN payment_provider TEXT;
ALTER TABLE public.bookings ADD COLUMN payment_reference TEXT;