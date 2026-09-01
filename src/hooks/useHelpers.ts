import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DbHelper = {
  id: string;
  slug: string;
  name: string;
  avatar_url: string | null;
  district: string;
  city: string;
  languages: string[];
  services: string[];
  rating: number;
  reviews_count: number;
  jobs_done: number;
  id_verified: boolean;
  background_checked: boolean;
  hourly_rate: number;
  response_min: number;
  bio: string | null;
};

/** Verified helper pool, loaded from the database. */
export const useHelpers = () => {
  const [helpers, setHelpers] = useState<DbHelper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: err } = await supabase
        .from("helpers")
        .select(
          "id, slug, name, avatar_url, district, city, languages, services, rating, reviews_count, jobs_done, id_verified, background_checked, hourly_rate, response_min, bio",
        )
        .eq("active", true)
        .order("rating", { ascending: false });

      if (!active) return;
      if (err) setError(err.message);
      else setHelpers((data ?? []) as DbHelper[]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { helpers, loading, error };
};
