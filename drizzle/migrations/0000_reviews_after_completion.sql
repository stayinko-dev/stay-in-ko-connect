ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS reviews_booking_unique ON public.reviews(booking_id) WHERE booking_id IS NOT NULL;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS reviews_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.validate_listing_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b public.bookings%ROWTYPE;
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN RAISE EXCEPTION 'Rating must be 1-5'; END IF;
  IF NEW.comment IS NOT NULL AND length(NEW.comment) > 2000 THEN RAISE EXCEPTION 'Comment too long'; END IF;
  IF NEW.booking_id IS NULL THEN RAISE EXCEPTION 'A completed booking is required to review'; END IF;
  SELECT * INTO b FROM public.bookings WHERE id = NEW.booking_id;
  IF b.id IS NULL OR b.guest_id <> NEW.reviewer_id THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF NOT (b.status IN ('confirmed','completed') OR b.payment_status = 'paid') THEN
    RAISE EXCEPTION 'Booking is not completed yet';
  END IF;
  NEW.listing_id := b.listing_id;
  NEW.host_id := b.host_id;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.refresh_listing_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.listings l SET
    rating = COALESCE((SELECT round(avg(r.rating)::numeric, 2) FROM public.reviews r WHERE r.listing_id = l.id), l.rating),
    reviews_count = (SELECT count(*) FROM public.reviews r WHERE r.listing_id = l.id)
  WHERE l.id = NEW.listing_id;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS reviews_validate ON public.reviews;
CREATE TRIGGER reviews_validate BEFORE INSERT OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.validate_listing_review();
DROP TRIGGER IF EXISTS reviews_refresh_rating ON public.reviews;
CREATE TRIGGER reviews_refresh_rating AFTER INSERT OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.refresh_listing_rating();
REVOKE EXECUTE ON FUNCTION public.validate_listing_review() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_listing_rating() FROM PUBLIC, anon, authenticated;

CREATE TABLE public.helper_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL UNIQUE REFERENCES public.help_requests(id) ON DELETE CASCADE,
  helper_id uuid NOT NULL REFERENCES public.helpers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.helper_reviews TO anon;
GRANT SELECT, INSERT ON public.helper_reviews TO authenticated;
GRANT ALL ON public.helper_reviews TO service_role;
ALTER TABLE public.helper_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Helper reviews are public" ON public.helper_reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users review own completed requests" ON public.helper_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.validate_helper_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.help_requests%ROWTYPE;
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN RAISE EXCEPTION 'Rating must be 1-5'; END IF;
  IF NEW.comment IS NOT NULL AND length(NEW.comment) > 2000 THEN RAISE EXCEPTION 'Comment too long'; END IF;
  SELECT * INTO r FROM public.help_requests WHERE id = NEW.request_id;
  IF r.id IS NULL OR r.user_id <> NEW.user_id THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF r.helper_ref IS NULL THEN RAISE EXCEPTION 'No helper on this request'; END IF;
  IF r.status <> 'completed' THEN RAISE EXCEPTION 'Request is not completed yet'; END IF;
  NEW.helper_id := r.helper_ref;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.apply_helper_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.helpers SET
    rating = round(((rating * reviews_count) + NEW.rating)::numeric / (reviews_count + 1), 2),
    reviews_count = reviews_count + 1,
    jobs_done = jobs_done + 1
  WHERE id = NEW.helper_id;
  RETURN NEW;
END $$;

CREATE TRIGGER helper_reviews_validate BEFORE INSERT ON public.helper_reviews FOR EACH ROW EXECUTE FUNCTION public.validate_helper_review();
CREATE TRIGGER helper_reviews_apply AFTER INSERT ON public.helper_reviews FOR EACH ROW EXECUTE FUNCTION public.apply_helper_review();
REVOKE EXECUTE ON FUNCTION public.validate_helper_review() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_helper_review() FROM PUBLIC, anon, authenticated;