// PortOne (V2) webhook receiver.
//
// PortOne calls this endpoint when a payment changes state (card approved,
// virtual account deposited, cancelled...). We never trust the payload's own
// status: we re-fetch the payment from PortOne's API and update the booking.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, webhook-id, webhook-signature, webhook-timestamp",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const verifySignature = async (secret: string, raw: string, req: Request) => {
  const id = req.headers.get("webhook-id");
  const timestamp = req.headers.get("webhook-timestamp");
  const signature = req.headers.get("webhook-signature");
  if (!id || !timestamp || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(secret.replace(/^whsec_/, "")), (c) => c.charCodeAt(0)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${timestamp}.${raw}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
  return signature.split(" ").some((part) => part.split(",")[1] === expected);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const API_SECRET = Deno.env.get("PORTONE_API_SECRET") ?? "";
  const WEBHOOK_SECRET = Deno.env.get("PORTONE_WEBHOOK_SECRET") ?? "";
  if (!API_SECRET) return json({ error: "PortOne is not configured yet" }, 503);

  const raw = await req.text();

  if (WEBHOOK_SECRET) {
    const ok = await verifySignature(WEBHOOK_SECRET, raw, req).catch(() => false);
    if (!ok) return json({ error: "Invalid signature" }, 401);
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const data = (payload.data ?? {}) as Record<string, unknown>;
  const paymentId = String(data.paymentId ?? payload.paymentId ?? "");
  if (!paymentId) return json({ error: "Missing paymentId" }, 400);

  const res = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `PortOne ${API_SECRET}` },
  });
  if (!res.ok) {
    console.error("PortOne lookup failed", res.status, await res.text());
    return json({ error: "Lookup failed" }, 502);
  }
  const payment = await res.json();

  // paymentId is generated as `booking_<uuid>_<timestamp>` by the client.
  const bookingId = String(payment?.customData ? JSON.parse(payment.customData)?.bookingId ?? "" : "")
    || paymentId.split("_")[1] || "";
  if (!bookingId) return json({ error: "No booking reference" }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: booking } = await admin
    .from("bookings")
    .select("id, total_amount")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking) return json({ error: "Booking not found" }, 404);

  const paidAmount = Number(payment?.amount?.total ?? 0);
  const portoneStatus = String(payment?.status ?? "");

  let status: "paid" | "pending" | "failed" | "unpaid";
  if (portoneStatus === "PAID") status = paidAmount === Number(booking.total_amount ?? 0) ? "paid" : "failed";
  else if (portoneStatus === "VIRTUAL_ACCOUNT_ISSUED" || portoneStatus === "READY") status = "pending";
  else if (portoneStatus === "CANCELLED" || portoneStatus === "PARTIAL_CANCELLED") status = "unpaid";
  else status = "failed";

  const { error } = await admin
    .from("bookings")
    .update({
      payment_status: status,
      payment_provider: "portone",
      payment_reference: paymentId,
      status: status === "paid" ? "confirmed" : status === "unpaid" ? "cancelled" : undefined,
    })
    .eq("id", bookingId);

  if (error) {
    console.error("Booking update failed", error.message);
    return json({ error: error.message }, 500);
  }

  return json({ ok: true, status });
});
