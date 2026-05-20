import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

type Body = { text?: string; target?: string };

const LANG_NAMES: Record<string, string> = {
  en: "English",
  ko: "Korean",
  ja: "Japanese",
  zh: "Chinese",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  vi: "Vietnamese",
  th: "Thai",
  id: "Indonesian",
  ar: "Arabic",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, target = "en" }: Body = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (text.length > 4000) {
      return new Response(JSON.stringify({ error: "text too long (max 4000 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetName = LANG_NAMES[target] || target;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a translation engine. Detect the source language of the user's text and translate it to the requested target language. Respond ONLY with a compact JSON object of the form {\"detected\":\"<iso-639-1 code>\",\"translation\":\"<translated text>\"}. No markdown, no commentary.",
          },
          {
            role: "user",
            content: `Target language: ${targetName} (${target}).\n\nText:\n${text}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit. Please try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (res.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: "Upstream error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    let parsed: { detected?: string; translation?: string } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { translation: raw };
    }

    return new Response(
      JSON.stringify({
        detected: (parsed.detected || "auto").toLowerCase(),
        translation: parsed.translation || "",
        target,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});