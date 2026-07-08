
-- Re-grant column SELECT; RLS still restricts rows to owner
GRANT SELECT (phone) ON public.profiles TO authenticated;

-- Convert get_my_phone from SECURITY DEFINER to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_my_phone()
RETURNS text
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT phone FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
$function$;

REVOKE EXECUTE ON FUNCTION public.get_my_phone() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_phone() TO authenticated;
