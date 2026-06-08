
-- 1. profiles 탈퇴 컬럼 추가
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deletion_scheduled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at);

-- 2. account_deletions 아카이브 테이블
CREATE TABLE IF NOT EXISTS public.account_deletions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT,
  display_name TEXT,
  reason TEXT,
  profile_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  stats_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_purge_at TIMESTAMPTZ NOT NULL,
  cancelled_at TIMESTAMPTZ,
  purged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.account_deletions TO authenticated;
GRANT ALL ON public.account_deletions TO service_role;

ALTER TABLE public.account_deletions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own deletion record"
  ON public.account_deletions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. 공개 프로필 조회에서 탈퇴 회원 제외 (기존 정책 교체)
DROP POLICY IF EXISTS "Profiles selectable (column-restricted)" ON public.profiles;

CREATE POLICY "Profiles selectable excluding deleted"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL OR auth.uid() = user_id);

-- 4. 탈퇴 요청 함수 (본인만)
CREATE OR REPLACE FUNCTION public.request_account_deletion(_reason TEXT DEFAULT NULL)
RETURNS public.account_deletions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _email TEXT;
  _profile public.profiles%ROWTYPE;
  _listings_count INT;
  _bookings_count INT;
  _record public.account_deletions;
  _purge_at TIMESTAMPTZ := now() + interval '30 days';
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _uid;
  SELECT * INTO _profile FROM public.profiles WHERE user_id = _uid;

  IF _profile.deleted_at IS NOT NULL THEN
    RAISE EXCEPTION 'Account already pending deletion';
  END IF;

  SELECT COUNT(*) INTO _listings_count FROM public.listings WHERE host_id = _uid;
  SELECT COUNT(*) INTO _bookings_count FROM public.bookings WHERE guest_id = _uid OR host_id = _uid;

  INSERT INTO public.account_deletions
    (user_id, email, display_name, reason, profile_snapshot, stats_snapshot, scheduled_purge_at)
  VALUES (
    _uid,
    _email,
    _profile.display_name,
    _reason,
    to_jsonb(_profile),
    jsonb_build_object('listings', _listings_count, 'bookings', _bookings_count),
    _purge_at
  )
  RETURNING * INTO _record;

  -- 프로필 소프트 삭제
  UPDATE public.profiles
    SET deleted_at = now(),
        deletion_scheduled_at = _purge_at,
        display_name = 'Deleted User',
        bio = NULL,
        phone = NULL,
        avatar_url = NULL
    WHERE user_id = _uid;

  -- 호스트 숙소 자동 보관
  UPDATE public.listings SET status = 'archived' WHERE host_id = _uid;

  RETURN _record;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.request_account_deletion(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_account_deletion(TEXT) TO authenticated;

-- 5. 탈퇴 취소 함수 (30일 내)
CREATE OR REPLACE FUNCTION public.cancel_account_deletion()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _record public.account_deletions;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO _record FROM public.account_deletions
    WHERE user_id = _uid AND cancelled_at IS NULL AND purged_at IS NULL
    ORDER BY requested_at DESC LIMIT 1;

  IF _record IS NULL THEN
    RAISE EXCEPTION 'No pending deletion found';
  END IF;

  IF _record.scheduled_purge_at < now() THEN
    RAISE EXCEPTION 'Grace period expired';
  END IF;

  -- 프로필 복원 (스냅샷에서)
  UPDATE public.profiles SET
    deleted_at = NULL,
    deletion_scheduled_at = NULL,
    display_name = _record.profile_snapshot->>'display_name',
    bio = _record.profile_snapshot->>'bio',
    phone = _record.profile_snapshot->>'phone',
    avatar_url = _record.profile_snapshot->>'avatar_url'
  WHERE user_id = _uid;

  -- 숙소 활성화 복원
  UPDATE public.listings SET status = 'available' WHERE host_id = _uid AND status = 'archived';

  UPDATE public.account_deletions SET cancelled_at = now() WHERE id = _record.id;

  RETURN TRUE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cancel_account_deletion() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_account_deletion() TO authenticated;
