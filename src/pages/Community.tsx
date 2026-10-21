import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HandHelping, LifeBuoy, Loader2, MessageCircle, MessagesSquare, Lightbulb, Sparkles, Star, Trash2, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "need_help", label: "Need Help", icon: LifeBuoy, hint: "Ask the community for a hand" },
  { id: "can_help", label: "Can Help", icon: HandHelping, hint: "Offer your skills or time" },
  { id: "info", label: "Info Exchange", icon: Lightbulb, hint: "Share tips & local know-how" },
  { id: "question", label: "Question", icon: HelpCircle, hint: "Anything about life in Korea" },
  { id: "review", label: "Review", icon: Star, hint: "Share your experience" },
] as const;

type Post = {
  id: string; user_id: string; author_name: string | null; category: string; area: string | null;
  title: string; body: string; comments_count: number; created_at: string;
};
type Comment = { id: string; user_id: string; author_name: string | null; body: string; created_at: string };

const catOf = (id: string) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[2];
const ago = (d: string) => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}d`;
};

const authorName = (user: { email?: string; user_metadata?: Record<string, unknown> }) =>
  (user.user_metadata?.display_name as string) || user.email?.split("@")[0] || "Member";

const Community = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [form, setForm] = useState({ category: "need_help", area: "", title: "", body: "" });
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("community_posts").select("*").order("created_at", { ascending: false }).limit(50);
    if (filter !== "all") q = q.eq("category", filter);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async () => {
    if (!user) return;
    if (form.title.trim().length < 2 || !form.body.trim()) { toast.error("Please add a title and some details."); return; }
    setSaving(true);
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id, author_name: authorName(user), category: form.category,
      area: form.area.trim() || null, title: form.title.trim(), body: form.body.trim(),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Posted!");
    setForm({ category: form.category, area: "", title: "", body: "" });
    setWriting(false);
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) toast.error(error.message); else setPosts((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto max-w-3xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Community</p>
            <h1 className="mt-1 text-3xl font-bold">Help each other in Korea</h1>
            <p className="mt-1 text-muted-foreground">Ask for help, offer help, and swap local tips.</p>
          </div>
          {user ? (
            <Button onClick={() => setWriting((w) => !w)}>{writing ? "Close" : "Write a post"}</Button>
          ) : (
            <Button asChild variant="outline"><Link to="/login">Log in to post</Link></Button>
          )}
        </div>

        <AskAI onOpenPost={setOpenId} />

        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          {[{ id: "all", label: "All", icon: MessagesSquare }, ...CATEGORIES].map((c) => (
            <button key={c.id} onClick={() => setFilter(c.id)}
              className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-base",
                filter === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary")}>
              <c.icon className="h-4 w-4" />{c.label}
            </button>
          ))}
        </div>

        {writing && user && (
          <Card className="mb-6">
            <CardContent className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {CATEGORIES.map((c) => (
                  <button key={c.id} type="button" onClick={() => setForm({ ...form, category: c.id })}
                    className={cn("flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition-base",
                      form.category === c.id ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-secondary")}>
                    <c.icon className="h-5 w-5" />{c.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{catOf(form.category).hint}</p>
              <Input placeholder="Title" maxLength={150} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Area (optional, e.g. Gangnam)" maxLength={60} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              <textarea placeholder="Write freely — what do you need, or what can you share?" maxLength={5000} value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <Button className="w-full" onClick={submit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}Post
              </Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : posts.length === 0 ? (
          <Card><CardContent className="py-16 text-center text-muted-foreground">No posts yet. Be the first to start the conversation!</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => {
              const c = catOf(p.category);
              return (
                <Card key={p.id}>
                  <CardContent className="p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="gap-1"><c.icon className="h-3 w-3" />{c.label}</Badge>
                      <span className="font-medium text-foreground">{p.author_name || "Member"}</span>
                      {p.area && <span>· {p.area}</span>}
                      <span>· {ago(p.created_at)}</span>
                      {user?.id === p.user_id && (
                        <button onClick={() => remove(p.id)} className="ml-auto text-muted-foreground hover:text-destructive" aria-label="Delete post">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <p className="mt-1 whitespace-pre-line text-sm text-foreground/80">{p.body}</p>
                    <button onClick={() => setOpenId(openId === p.id ? null : p.id)}
                      className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
                      <MessageCircle className="h-4 w-4" />{p.comments_count} {p.comments_count === 1 ? "reply" : "replies"}
                    </button>
                    {openId === p.id && <Comments postId={p.id} onChange={(d) => setPosts((all) => all.map((x) => x.id === p.id ? { ...x, comments_count: x.comments_count + d } : x))} />}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

type AiSource = { id: string; title: string; category: string };

const AskAI = ({ onOpenPost }: { onOpenPost: (id: string) => void }) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<AiSource[]>([]);

  const ask = async () => {
    const q = question.trim();
    if (q.length < 4) { toast.error("Please enter a question."); return; }
    setAsking(true);
    setAnswer(null);
    setSources([]);
    const { data, error } = await supabase.functions.invoke("community-ask", { body: { question: q } });
    setAsking(false);
    if (error) { toast.error(error.message); return; }
    if (data?.error) { toast.error(data.error); return; }
    setAnswer(data.answer);
    setSources((data.sources ?? []) as AiSource[]);
  };

  return (
    <Card className="mb-6 border-primary/30 bg-primary-soft/40">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Ask the community AI</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Ask anything about life in Korea — the AI finds answers from existing community posts.
        </p>
        {user ? (
          <div className="flex gap-2">
            <Input
              placeholder="e.g. How do I open a bank account in Seoul?"
              maxLength={500}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !asking && ask()}
            />
            <Button onClick={ask} disabled={asking || question.trim().length < 4}>
              {asking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="text-primary underline">Log in</Link> to ask the AI.
          </p>
        )}
        {asking && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />Searching community posts…
          </p>
        )}
        {answer && (
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="whitespace-pre-line text-sm">{answer}</p>
            {sources.length > 0 && (
              <div className="mt-3 border-t border-border pt-3">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Based on these posts</p>
                <div className="flex flex-wrap gap-1.5">
                  {sources.map((s) => (
                    <button key={s.id} onClick={() => onOpenPost(s.id)}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/70">
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Comments = ({ postId, onChange }: { postId: string; onChange: (delta: number) => void }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("community_comments").select("id, user_id, author_name, body, created_at")
      .eq("post_id", postId).order("created_at").then(({ data }) => setItems((data ?? []) as Comment[]));
  }, [postId]);

  const send = async () => {
    if (!user || !text.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.from("community_comments")
      .insert({ post_id: postId, user_id: user.id, author_name: authorName(user), body: text.trim() })
      .select("id, user_id, author_name, body, created_at").single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setItems((i) => [...i, data as Comment]); setText(""); onChange(1);
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("community_comments").delete().eq("id", id);
    if (!error) { setItems((i) => i.filter((x) => x.id !== id)); onChange(-1); }
  };

  return (
    <div className="mt-3 space-y-2 border-t border-border pt-3">
      {items.map((c) => (
        <div key={c.id} className="rounded-lg bg-secondary/50 px-3 py-2 text-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{c.author_name || "Member"}</span>· {ago(c.created_at)}
            {user?.id === c.user_id && (
              <button onClick={() => del(c.id)} className="ml-auto hover:text-destructive" aria-label="Delete reply"><Trash2 className="h-3.5 w-3.5" /></button>
            )}
          </div>
          <p className="mt-0.5 whitespace-pre-line">{c.body}</p>
        </div>
      ))}
      {user ? (
        <div className="flex gap-2">
          <Input placeholder="Write a reply…" maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
          <Button onClick={send} disabled={busy || !text.trim()}>Reply</Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground"><Link to="/login" className="text-primary underline">Log in</Link> to reply.</p>
      )}
    </div>
  );
};

export default Community;
