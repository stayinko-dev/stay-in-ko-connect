// PortOne (V2) payment verification.
//
// The browser only *starts* the payment. This function is the single source of
// truth: it asks PortOne's API what really happened, compares the paid amount
// with the booking amount, and only then marks the booking as paid.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  const STORE_ID = Deno.env.get("PORTONE_STORE_ID") ?? "";
  const CHANNEL_KEY = Deno.env.get("PORTONE_CHANNEL_KEY") ?? "";
  const API_SECRET = Deno.env.get("PORTONE_API_SECRET") ?? "";

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const action = typeof body.action === "string" ? body.action : "verify";

  // Public config for the browser SDK (store id / channel key are publishable).
  if (action === "config") {
    return json({
      configured: Boolean(STORE_ID && CHANNEL_KEY && API_SECRET),
      storeId: STORE_ID,
      channelKey: CHANNEL_KEY,
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Missing authorization" }, 401);

  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) return json({ error: "Invalid session" }, 401);

  const bookingId = typeof body.bookingId === "string" ? body.bookingId : "";
  const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
  if (!bookingId || !paymentId) return json({ error: "bookingId and paymentId are required" }, 400);
  if (!API_SECRET) return json({ error: "PortOne is not configured yet" }, 503);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: booking, error: bookingErr } = await admin
    .from("bookings")
    .select("id, guest_id, total_amount, payment_status")
    .eq("id", bookingId)
    .maybeSingle();

  if (bookingErr) return json({ error: bookingErr.message }, 500);
  if (!booking) return json({ error: "Booking not found" }, 404);
  if (booking.guest_id !== user.id) return json({ error: "Not your booking" }, 403);
  if (booking.payment_status === "paid") {
    return json({ ok: true, status: "paid", alreadyPaid: true });
  }

  // Ask PortOne what actually happened.
  const res = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `PortOne ${API_SECRET}` },
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error("PortOne lookup failed", res.status, detail);
    return json({ error: "Could not verify the payment with PortOne" }, 502);
  }
  const payment = await res.json();

  const paidAmount = Number(payment?.amount?.total ?? 0);
  const expected = Number(booking.total_amount ?? 0);
  const portoneStatus = String(payment?.status ?? "");

  let status: "paid" | "pending" | "failed";
  if (portoneStatus === "PAID") status = paidAmount === expected ? "paid" : "failed";
  else if (portoneStatus === "VIRTUAL_ACCOUNT_ISSUED" || portoneStatus === "READY") status = "pending";
  else status = "failed";

  if (status === "failed" && portoneStatus === "PAID") {
    console.error("Amount mismatch", { bookingId, paidAmount, expected });
  }

  const { error: updateErr } = await admin
    .from("bookings")
    .update({
      payment_status: status,
      payment_provider: "portone",
      payment_reference: paymentId,
      status: status === "paid" ? "confirmed" : undefined,
    })
    .eq("id", bookingId);

  if (updateErr) return json({ error: updateErr.message }, 500);

  return json({ ok: status !== "failed", status, portoneStatus, amount: paidAmount });
});
