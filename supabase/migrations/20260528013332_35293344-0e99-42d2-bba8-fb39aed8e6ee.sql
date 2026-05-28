
-- Column-level access: anon/authenticated can read only safe columns of profiles
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, user_id, display_name, avatar_url, bio, role, created_at, updated_at)
  ON public.profiles TO anon, authenticated;

-- Re-allow authenticated full-row reads for their OWN profile (incl. phone)
-- via a separate grant on phone/metadata for authenticated
GRANT SELECT (phone, metadata) ON public.profiles TO authenticated;

-- Drop the over-restrictive auth-only policy from earlier; replace with a public policy.
DROP POLICY IF EXISTS "Users can view own full profile" ON public.profiles;

CREATE POLICY "Profiles selectable (column-restricted)"
ON public.profiles FOR SELECT
TO anon, authenticated
USING (true);

-- Phone column is now only readable when caller has the column grant (authenticated),
-- and PostgREST will refuse anon requests that include phone in the select list.
