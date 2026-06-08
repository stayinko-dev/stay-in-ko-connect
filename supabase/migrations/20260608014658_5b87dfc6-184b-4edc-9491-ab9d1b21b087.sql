-- Remove bookings/messages from realtime publication (app doesn't use realtime subscriptions)
ALTER PUBLICATION supabase_realtime DROP TABLE public.bookings;
ALTER PUBLICATION supabase_realtime DROP TABLE public.messages;

-- Tighten SECURITY DEFINER trigger function: triggers run as owner regardless of EXECUTE grants
REVOKE EXECUTE ON FUNCTION public.validate_booking_host() FROM PUBLIC, anon, authenticated;