-- 1. favorites 테이블 생성 (즐겨찾기)
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON public.favorites(listing_id);

-- 2. listings 테이블에 누락 컬럼 추가 (host_name, host_response, location_label 등을 metadata 외에 native 컬럼으로)
-- 이미 host_id는 있으니 OK. 화면에서 쓰는 location/university 표시용 컬럼 추가
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS location_label TEXT,
  ADD COLUMN IF NOT EXISTS host_name TEXT,
  ADD COLUMN IF NOT EXISTS host_response TEXT,
  ADD COLUMN IF NOT EXISTS price_display TEXT,
  ADD COLUMN IF NOT EXISTS deposit_display TEXT,
  ADD COLUMN IF NOT EXISTS latitude NUMERIC,
  ADD COLUMN IF NOT EXISTS longitude NUMERIC,
  ADD COLUMN IF NOT EXISTS nearby_subway TEXT,
  ADD COLUMN IF NOT EXISTS nearby_university TEXT;

-- 3. listings 테이블 updated_at 트리거
DROP TRIGGER IF EXISTS update_listings_updated_at ON public.listings;
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4. bookings/profiles/messages/reviews/settlements 트리거도 동일하게
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_settlements_updated_at ON public.settlements;
CREATE TRIGGER update_settlements_updated_at
  BEFORE UPDATE ON public.settlements FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. handle_new_user 트리거 (회원가입시 profile 자동 생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Realtime 활성화 (메시지/예약용)
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;