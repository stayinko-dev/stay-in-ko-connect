import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Validate user via anon client with the JWT
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const action: "request" | "cancel" = body.action ?? "request";
    const reason: string | null = typeof body.reason === "string" ? body.reason.slice(0, 1000) : null;

    // RPCs are restricted to service_role; we validated the JWT above and pass user.id explicitly.
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE);

    if (action === "cancel") {
      const { error } = await adminClient.rpc("cancel_account_deletion", { _user_id: user.id });
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, cancelled: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await adminClient.rpc("request_account_deletion", { _reason: reason, _user_id: user.id });
    if (error) throw error;

    // Best-effort: enqueue confirmation email if email infra exists.
    const purgeAt = (data as any)?.scheduled_purge_at;
    const purgeDateStr = purgeAt ? new Date(purgeAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "30 days from now";

    try {
      await adminClient.rpc("enqueue_email", {
        queue_name: "transactional_emails",
        to_address: user.email,
        subject: "Your StayInKo account deletion request",
        html_body: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
            <h1 style="font-size:22px;margin:0 0 12px">Account deletion confirmed</h1>
            <p>Hi${(data as any)?.display_name ? ` ${(data as any).display_name}` : ""},</p>
            <p>We've received your request to delete your StayInKo account.</p>
            <ul>
              <li>Your profile is now hidden from other users.</li>
              <li>All your listings have been archived.</li>
              <li>Your account will be permanently deleted on <strong>${purgeDateStr}</strong>.</li>
              <li>You can cancel anytime within 30 days by logging back in.</li>
            </ul>
            <p>If you did not request this, please contact us immediately.</p>
            <p style="color:#888;font-size:12px;margin-top:24px">© StayInKo</p>
          </div>`,
      });
    } catch (mailErr) {
      console.warn("Email enqueue skipped:", (mailErr as Error).message);
    }

    // Sign the user out server-side (revoke refresh tokens)
    try { await adminClient.auth.admin.signOut(user.id); } catch (_) {}

    return new Response(JSON.stringify({ ok: true, scheduled_purge_at: purgeAt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("account-delete error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});