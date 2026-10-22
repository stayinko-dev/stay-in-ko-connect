import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_favorites",
  title: "List my favorite listings",
  description: "List the signed-in user's saved (favorite) housing listings with basic listing details.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("favorites")
      .select("id, created_at, listing_id, listings(id, title, city, district, price_display, rating)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const favorites = (data ?? []).map((f) => {
      const listing = Array.isArray(f.listings) ? f.listings[0] : f.listings;
      return {
        favorite_id: f.id,
        saved_at: f.created_at,
        listing_id: f.listing_id,
        title: listing?.title ?? null,
        city: listing?.city ?? null,
        district: listing?.district ?? null,
        price_display: listing?.price_display ?? null,
        rating: listing?.rating ?? null,
      };
    });

    return {
      content: [
        {
          type: "text",
          text: favorites.length
            ? `You have ${favorites.length} favorite listing(s):\n` +
              favorites.map((f) => `- ${f.title ?? f.listing_id} (${f.city ?? "unknown city"})`).join("\n")
            : "You have no favorite listings yet.",
        },
      ],
      structuredContent: { favorites },
    };
  },
});
