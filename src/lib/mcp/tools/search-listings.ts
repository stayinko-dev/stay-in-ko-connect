import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

const toListingJson = (l: {
  id: string;
  title: string;
  type: string;
  city: string | null;
  district: string | null;
  location_label: string | null;
  price: number;
  price_display: string | null;
  deposit: number | null;
  no_deposit: boolean | null;
  period: string | null;
  beds: number | null;
  baths: number | null;
  guests: number | null;
  area_sqm: number | null;
  rating: number | null;
  reviews_count: number;
  amenities: string[] | null;
  nearby_subway: string | null;
  nearby_university: string | null;
  university_area: string | null;
}) => ({
  id: l.id,
  title: l.title,
  type: l.type,
  city: l.city,
  district: l.district,
  location: l.location_label,
  monthly_price_krw: l.price,
  price_display: l.price_display,
  deposit_krw: l.deposit,
  no_deposit: l.no_deposit,
  period: l.period,
  beds: l.beds,
  baths: l.baths,
  max_guests: l.guests,
  area_sqm: l.area_sqm,
  rating: l.rating,
  reviews_count: l.reviews_count,
  amenities: l.amenities,
  nearby_subway: l.nearby_subway,
  nearby_university: l.nearby_university,
  university_area: l.university_area,
});

export default defineTool({
  name: "search_listings",
  title: "Search listings",
  description:
    "Search StayInKo housing listings in Korea (Seoul, Busan, Daejeon, Gwangju). Filter by city, keyword, property type, price, or nearby university. Returns public listing details.",
  inputSchema: {
    keyword: z.string().max(100).optional().describe("Free-text keyword matched against title, location, and description."),
    city: z.enum(["Seoul", "Busan", "Daejeon", "Gwangju"]).optional().describe("City to filter by."),
    property_type: z
      .enum(["studio", "apartment", "guesthouse", "officeTel", "share", "coliving", "private", "women_only"])
      .optional()
      .describe("Property type filter."),
    max_price: z.number().int().positive().optional().describe("Maximum monthly price in KRW."),
    no_deposit_only: z.boolean().optional().describe("When true, only return listings with no deposit."),
    university: z.string().max(100).optional().describe("Nearby university name, e.g. 'Hanyang' or 'Yonsei'."),
    limit: z.number().int().min(1).max(50).optional().describe("Maximum number of results (default 20)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (args) => {
    const supabase = supabaseAnon();
    let query = supabase
      .from("listings")
      .select(
        "id, title, type, city, district, location_label, price, price_display, deposit, no_deposit, period, beds, baths, guests, area_sqm, rating, reviews_count, amenities, nearby_subway, nearby_university, university_area",
      )
      .order("rating", { ascending: false })
      .limit(args.limit ?? 20);

    if (args.city) query = query.ilike("city", args.city);
    if (args.property_type) query = query.eq("type", args.property_type);
    if (args.max_price) query = query.lte("price", args.max_price);
    if (args.no_deposit_only) query = query.eq("no_deposit", true);
    if (args.university) query = query.ilike("university_area", `%${args.university}%`);
    if (args.keyword) {
      const kw = args.keyword.replace(/[%,()]/g, " ").trim();
      if (kw) {
        query = query.or(
          `title.ilike.%${kw}%,location_label.ilike.%${kw}%,description.ilike.%${kw}%,university_area.ilike.%${kw}%`,
        );
      }
    }

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const listings = (data ?? []).map(toListingJson);
    return {
      content: [
        {
          type: "text",
          text: listings.length
            ? `Found ${listings.length} listing(s):\n` +
              listings
                .map(
                  (l) =>
                    `- ${l.title} (${l.type}, ${l.city}${l.district ? ` ${l.district}` : ""}) — ${l.price_display ?? `${l.monthly_price_krw} KRW/mo`}, rating ${l.rating ?? "n/a"} (${l.reviews_count} reviews)${l.nearby_university ? `, near ${l.nearby_university}` : ""}`,
                )
                .join("\n")
            : "No listings matched the filters.",
        },
      ],
      structuredContent: { listings },
    };
  },
});
