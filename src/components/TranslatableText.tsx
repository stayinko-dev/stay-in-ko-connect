import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslate, type TargetLang } from "@/hooks/useTranslate";

type Props = {
  text: string;
  target: TargetLang;
  className?: string;
  /** Optional pre-known source language hint (display only). */
  sourceHint?: string;
};

/** Inline text block with a Translate toggle.
 * Shows original by default; toggling translates via Lovable AI and switches
 * the visible text. Toggle again to return to the original. Results are cached. */
const TranslatableText = ({ text, target, className, sourceHint }: Props) => {
  const { translate, loading } = useTranslate();
  const [translation, setTranslation] = useState<string | null>(null);
  const [detected, setDetected] = useState<string | null>(sourceHint ?? null);
  const [showing, setShowing] = useState<"original" | "translated">("original");

  const sameLang = detected && detected === target;

  const handleToggle = async () => {
    if (showing === "translated") {
      setShowing("original");
      return;
    }
    if (translation) {
      setShowing("translated");
      return;
    }
    const result = await translate(text, target);
    if (!result) {
      toast.error("Couldn't translate right now. Please try again.");
      return;
    }
    setTranslation(result.translation);
    setDetected(result.detected);
    if (result.detected === target) {
      toast.info("Already in the target language.");
      return;
    }
    setShowing("translated");
  };

  const visible = showing === "translated" && translation ? translation : text;

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{visible}</p>
      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="inline-flex items-center gap-1 font-medium text-primary transition-base hover:underline disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Languages className="h-3 w-3" />
          )}
          {showing === "translated"
            ? "Show original"
            : sameLang
              ? `Already ${target.toUpperCase()}`
              : `Translate to ${target.toUpperCase()}`}
        </button>
        {detected && (
          <span className="rounded-full bg-secondary px-1.5 py-0.5 uppercase">
            {showing === "translated" ? `${detected} → ${target}` : detected}
          </span>
        )}
      </div>
    </div>
  );
};

export default TranslatableText;