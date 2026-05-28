
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT id, user_id, display_name, avatar_url, bio, role, created_at
FROM public.profiles;

-- public_profiles is a view exposing only non-sensitive fields; allow public read
CREATE POLICY "Public profile fields readable"
ON public.profiles FOR SELECT
TO anon, authenticated
USING (true);

-- Re-restrict: drop the broad policy idea — we want phone hidden.
-- Instead we keep the authenticated own-row policy and rely on the VIEW to expose only safe columns.
DROP POLICY IF EXISTS "Public profile fields readable" ON public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;
