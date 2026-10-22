import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchListingsTool from "./tools/search-listings";
import listFavoritesTool from "./tools/list-favorites";
import listBookingsTool from "./tools/list-bookings";

// Vite inlines the stable ref; the published SUPABASE_URL may be a proxy.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "stayinko-connect",
  title: "StayInKo Connect",
  version: "0.1.0",
  instructions:
    "Tools for StayInKo Connect, a Korea housing platform for international students and business travelers. " +
    "Use `search_listings` to find housing. Signed-in users can use `list_favorites` and `list_bookings` for their own data.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
    requireOAuthClientClaim: true,
  }),
  tools: [searchListingsTool, listFavoritesTool, listBookingsTool],
});
