
-- Recreate request_account_deletion accepting explicit user id (default = auth.uid())
CREATE OR REPLACE FUNCTION public.request_account_deletion(_reason text DEFAULT NULL, _user_id uuid DEFAULT auth.uid())
RETURNS public.account_deletions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _uid UUID := _user_id;
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
  VALUES (_uid, _email, _profile.display_name, _reason, to_jsonb(_profile),
          jsonb_build_object('listings', _listings_count, 'bookings', _bookings_count), _purge_at)
  RETURNING * INTO _record;

  UPDATE public.profiles
    SET deleted_at = now(), deletion_scheduled_at = _purge_at,
        display_name = 'Deleted User', bio = NULL, phone = NULL, avatar_url = NULL
    WHERE user_id = _uid;

  UPDATE public.listings SET status = 'archived' WHERE host_id = _uid;

  RETURN _record;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cancel_account_deletion(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _uid UUID := _user_id;
  _record public.account_deletions;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT * INTO _record FROM public.account_deletions
    WHERE user_id = _uid AND cancelled_at IS NULL AND purged_at IS NULL
    ORDER BY requested_at DESC LIMIT 1;

  IF _record IS NULL THEN RAISE EXCEPTION 'No pending deletion found'; END IF;
  IF _record.scheduled_purge_at < now() THEN RAISE EXCEPTION 'Grace period expired'; END IF;

  UPDATE public.profiles SET
    deleted_at = NULL, deletion_scheduled_at = NULL,
    display_name = _record.profile_snapshot->>'display_name',
    bio = _record.profile_snapshot->>'bio',
    phone = _record.profile_snapshot->>'phone',
    avatar_url = _record.profile_snapshot->>'avatar_url'
  WHERE user_id = _uid;

  UPDATE public.listings SET status = 'available' WHERE host_id = _uid AND status = 'archived';
  UPDATE public.account_deletions SET cancelled_at = now() WHERE id = _record.id;
  RETURN TRUE;
END;
$function$;

-- Restrict EXECUTE to service_role only (edge function uses service role after JWT verify)
REVOKE EXECUTE ON FUNCTION public.request_account_deletion(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.request_account_deletion(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cancel_account_deletion() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cancel_account_deletion(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.request_account_deletion(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_account_deletion(uuid) TO service_role;
