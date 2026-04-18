import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type ListingRow = Tables<"listings">;

/** Asset path resolver — DB stores '/src/assets/listing-1.jpg' style paths.
 * Convert to vite-built asset URLs at runtime. */
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";

const assetMap: Record<string, string> = {
  "/src/assets/listing-1.jpg": listing1,
  "/src/assets/listing-2.jpg": listing2,
  "/src/assets/listing-3.jpg": listing3,
};

export const resolveImage = (path: string) => assetMap[path] || path;

export const useListings = () => {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchListings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) setError(error.message);
      else setListings(data || []);
      setLoading(false);
    };
    fetchListings();
    return () => {
      cancelled = true;
    };
  }, []);

  return { listings, loading, error };
};
