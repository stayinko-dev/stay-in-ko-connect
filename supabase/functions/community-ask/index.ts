import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";
import { z } from "npm:zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
} from "../_shared/run-id.ts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

const BodySchema = z.object({
  question: z.string().trim().min(4).max(500),
});

type PostRow = {
  id: string;
  title: string;
  body: string;
  category: string;
  area: string | null;
  created_at: string;
};
type CommentRow = { post_id: string; body: string };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Rank posts by simple keyword overlap with the question.
function rankPosts(posts: PostRow[], question: string): PostRow[] {
  const tokens = question
    .toLowerCase()
    .split(/[^a-z0-9가-힣]+/)
    .filter((t) => t.length >= 2);
  const scored = posts.map((p, idx) => {
    const hay = `${p.title} ${p.body} ${p.area ?? ""}`.toLowerCase();
    let score = 0;
    for (const t of tokens) if (hay.includes(t)) score += 1;
    // Slight recency boost so ties favour newer posts.
    return { p, score: score * 1000 - idx };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 12).map((s) => s.p);
  // Always include a few most recent posts for broad questions.
  for (const p of posts.slice(0, 5)) {
    if (!top.includes(p)) top.push(p);
  }
  return top;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured yet." }, 500);

    // Require a signed-in user to prevent anonymous abuse.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Please log in to ask the AI." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ error: "Please log in to ask the AI." }, 401);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: "Please enter a question (4–500 characters)." }, 400);
    }
    const { question } = parsed.data;

    // Load community knowledge with the service role (bypasses RLS safely server-side).
    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: posts, error: postsError } = await serviceClient
      .from("community_posts")
      .select("id, title, body, category, area, created_at")
      .order("created_at", { ascending: false })
      .limit(60);
    if (postsError) return json({ error: "Could not load community posts." }, 500);

    const allPosts = (posts ?? []) as PostRow[];
    if (allPosts.length === 0) {
      return json({
        answer:
          "There are no community posts yet, so I have nothing to draw from. Be the first to share a tip or question!",
        sources: [],
      });
    }

    const relevant = rankPosts(allPosts, question);
    const { data: comments } = await serviceClient
      .from("community_comments")
      .select("post_id, body")
      .in("post_id", relevant.map((p) => p.id))
      .limit(120);
    const commentsByPost = new Map<string, string[]>();
    for (const c of (comments ?? []) as CommentRow[]) {
      const list = commentsByPost.get(c.post_id) ?? [];
      if (list.length < 6) list.push(c.body);
      commentsByPost.set(c.post_id, list);
    }

    const context = relevant
      .map((p, i) => {
        const replies = (commentsByPost.get(p.id) ?? [])
          .map((b) => `  - Reply: ${b.slice(0, 300)}`)
          .join("\n");
        return `[Post ${i + 1}] (${p.category}${p.area ? `, ${p.area}` : ""}) ${p.title}\n${p.body.slice(0, 600)}${replies ? `\n${replies}` : ""}`;
      })
      .join("\n\n");

    const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
    const provider = createOpenAI({
      baseURL: GATEWAY_URL,
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: provider.responses(MODEL),
      instructions:
        "You are the StayInKo community assistant for international students and business travelers in Korea. " +
        "Answer the user's question using ONLY the community posts provided below. " +
        "If the posts contain relevant information, summarize it helpfully in 2-5 sentences and mention which posts it came from (by title). " +
        "If the posts do not cover the question, say so honestly and suggest posting the question to the community. " +
        "Reply in the same language as the user's question. Never invent facts that are not in the posts. " +
        "Write in plain text only — no markdown, no asterisks, no bullet symbols.",
      messages: [
        {
          role: "user",
          content: `Community posts:\n${context}\n\n---\nQuestion: ${question}`,
        },
      ],
      abortSignal: req.signal,
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    let answer = "";
    try {
      answer = (await result.text).trim();
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 402) return json({ error: "AI credits are exhausted. Please add credits in workspace settings." }, 402);
      if (status === 429) return json({ error: "The AI is busy right now. Please try again shortly." }, 429);
      if (status === 403) return json({ error: "AI access is currently unavailable for this workspace." }, 403);
      throw e;
    }

    if (!answer) {
      return json({ error: "The AI could not produce an answer. Please try rephrasing your question." }, 502);
    }

    return json({
      answer,
      sources: relevant.slice(0, 5).map((p) => ({ id: p.id, title: p.title, category: p.category })),
    });
  } catch (e) {
    return json({ error: (e as Error).message || "Unexpected error" }, 500);
  }
});
