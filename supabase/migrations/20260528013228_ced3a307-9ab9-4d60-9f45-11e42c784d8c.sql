
-- 1. profiles: phone 공개 차단 + 공개 view 분리
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own full profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, user_id, display_name, avatar_url, bio, role, created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 2. bookings: host_id 위조 방지 트리거
CREATE OR REPLACE FUNCTION public.validate_booking_host()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  real_host uuid;
BEGIN
  SELECT host_id INTO real_host FROM public.listings WHERE id = NEW.listing_id;
  IF real_host IS NULL THEN
    RAISE EXCEPTION 'Listing % not found', NEW.listing_id;
  END IF;
  IF NEW.host_id <> real_host THEN
    RAISE EXCEPTION 'host_id does not match listing host';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.validate_booking_host() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS bookings_validate_host ON public.bookings;
CREATE TRIGGER bookings_validate_host
BEFORE INSERT OR UPDATE OF host_id, listing_id ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.validate_booking_host();

-- 3. SECURITY DEFINER 함수들 EXECUTE 권한 회수
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 4. help_requests 테이블 (concierge 요청 영속화)
CREATE TABLE public.help_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  helper_id text,
  service text NOT NULL,
  area text NOT NULL,
  details text,
  urgent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'open',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.help_requests TO authenticated;
GRANT ALL ON public.help_requests TO service_role;

ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own requests" ON public.help_requests
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users create own requests" ON public.help_requests
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own requests" ON public.help_requests
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER help_requests_updated_at
BEFORE UPDATE ON public.help_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_help_requests_user ON public.help_requests(user_id, created_at DESC);
