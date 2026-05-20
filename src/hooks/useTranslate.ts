import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type CacheEntry = { detected: string; translation: string };
const cache = new Map<string, CacheEntry>();
const cacheKey = (text: string, target: string) => `${target}::${text}`;

export const SUPPORTED_TARGETS = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
] as const;

export type TargetLang = (typeof SUPPORTED_TARGETS)[number]["code"];

export const useTranslate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (text: string, target: TargetLang): Promise<CacheEntry | null> => {
    const key = cacheKey(text, target);
    const cached = cache.get(key);
    if (cached) return cached;

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { text, target },
      });
      if (error) throw new Error(error.message);
      if (!data || data.error) throw new Error(data?.error || "Translation failed");

      const entry: CacheEntry = {
        detected: data.detected || "auto",
        translation: data.translation || "",
      };
      cache.set(key, entry);
      return entry;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { translate, loading, error };
};