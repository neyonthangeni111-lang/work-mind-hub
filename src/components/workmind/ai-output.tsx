import { Copy, RefreshCw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveOutput, type SavedCategory } from "@/lib/saved-outputs";

export function AiOutput({
  value,
  onChange,
  onRegenerate,
  category,
  title,
  caseRef = "",
  emptyHint,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  category: SavedCategory;
  title: string;
  caseRef?: string;
  emptyHint: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-soft">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="size-4 animate-pulse text-primary" aria-hidden="true" />
          Working through the information…
        </span>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
        {emptyHint}
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          <Sparkles className="size-3" aria-hidden="true" /> AI Generated
        </span>
        <span className="text-xs text-muted-foreground">Editable — review before use</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={16}
        aria-label={`${title} output`}
        className="font-sans text-sm leading-relaxed"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            void navigator.clipboard.writeText(value);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="size-4" aria-hidden="true" /> Copy
        </Button>
        {onRegenerate ? (
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            <RefreshCw className="size-4" aria-hidden="true" /> Regenerate
          </Button>
        ) : null}
        <Button
          size="sm"
          onClick={() => {
            saveOutput({ title, category, caseRef, content: value });
            toast.success("Saved to your AI library");
          }}
        >
          <Save className="size-4" aria-hidden="true" /> Save
        </Button>
      </div>
    </div>
  );
}
