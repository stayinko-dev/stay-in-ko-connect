import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_bookings",
  title: "List my bookings",
  description:
    "List the signed-in user's bookings, either as a guest (stays they booked) or as a host (bookings on their listings). Includes dates, status, and payment status.",
  inputSchema: {
    role: z.enum(["guest", "host"]).optional().describe("Bookings where you are the guest (default) or the host."),
    status: z
      .enum(["pending", "confirmed", "completed", "cancelled"])
      .optional()
      .describe("Filter by booking status."),
    limit: z.number().int().min(1).max(50).optional().describe("Maximum number of results (default 20)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (args, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const userId = ctx.getUserId();
    if (!userId) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };

    const role = args.role ?? "guest";
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("bookings")
      .select("id, check_in, check_out, status, payment_status, total_amount, created_at, listing_id, listings(title, city)")
      .eq(role === "host" ? "host_id" : "guest_id", userId)
      .order("check_in", { ascending: false })
      .limit(args.limit ?? 20);

    if (args.status) query = query.eq("status", args.status);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const bookings = (data ?? []).map((b) => {
      const listing = Array.isArray(b.listings) ? b.listings[0] : b.listings;
      return {
        booking_id: b.id,
        listing_id: b.listing_id,
        listing_title: listing?.title ?? null,
        city: listing?.city ?? null,
        check_in: b.check_in,
        check_out: b.check_out,
        status: b.status,
        payment_status: b.payment_status,
        total_amount_krw: b.total_amount,
        created_at: b.created_at,
      };
    });

    return {
      content: [
        {
          type: "text",
          text: bookings.length
            ? `Found ${bookings.length} booking(s) as ${role}:\n` +
              bookings
                .map(
                  (b) =>
                    `- ${b.listing_title ?? b.listing_id}: ${b.check_in} → ${b.check_out} (${b.status ?? "unknown"}, payment: ${b.payment_status})`,
                )
                .join("\n")
            : `No bookings found as ${role}.`,
        },
      ],
      structuredContent: { bookings },
    };
  },
});
