import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Lock, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/workmind/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSavedOutputs, type SavedCategory } from "@/lib/saved-outputs";

export const Route = createFileRoute("/app/saved")({
  head: () => ({
    meta: [
      { title: "Saved AI Outputs — WorkMind" },
      {
        name: "description",
        content:
          "A searchable library of saved emails, meeting summaries, case summaries, reports, psychology insights, conflict analyses and task plans.",
      },
      { property: "og:title", content: "Saved AI Outputs — WorkMind" },
      { property: "og:description", content: "Your professional AI knowledge library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Saved,
});

const categories: SavedCategory[] = [
  "Emails",
  "Meeting summaries",
  "Case summaries",
  "Reports",
  "Psychology insights",
  "Conflict analyses",
  "Task plans",
];

function Saved() {
  const { items, remove, rename } = useSavedOutputs();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const list = items.filter(
      (i) =>
        (category === "all" || i.category === category) &&
        (i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.caseRef.toLowerCase().includes(query.toLowerCase())),
    );
    return list.sort((a, b) =>
      sort === "newest"
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt),
    );
  }, [items, query, category, sort]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Saved AI Outputs"
        title="Your knowledge library"
        description="Saved records stay on this device. Treat every entry as workplace-sensitive information."
      />

      <div className="flex items-center gap-2 rounded-xl border border-olive/40 bg-olive/10 p-3 text-sm">
        <Lock className="size-4 text-primary" aria-hidden="true" />
        Handle saved records in line with your organisation's confidentiality and retention policy.
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="search"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title or case reference"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="cat">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort">Sort by date</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((i) => (
          <Card key={i.id} className="border-border shadow-soft">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">
                {i.category} {i.caseRef ? `· ${i.caseRef}` : ""} · {new Date(i.createdAt).toLocaleString()}
              </CardDescription>
              <CardTitle className="text-lg">{i.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="line-clamp-4 whitespace-pre-wrap text-sm text-muted-foreground">{i.content}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const next = window.prompt("Rename record", i.title);
                    if (next) {
                      rename(i.id, next);
                      toast.success("Record renamed");
                    }
                  }}
                >
                  Rename
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    void navigator.clipboard.writeText(i.content);
                    toast.success("Copied to clipboard");
                  }}
                >
                  Copy
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                      <AlertDialogDescription>
                        “{i.title}” will be permanently removed. Workplace records may be needed for future
                        reference or procedural fairness.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          remove(i.id);
                          toast.success("Record deleted");
                        }}
                      >
                        Delete permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nothing saved yet. Generate an analysis, email, summary or report and choose Save.
          </p>
        ) : null}
      </div>
    </div>
  );
}
