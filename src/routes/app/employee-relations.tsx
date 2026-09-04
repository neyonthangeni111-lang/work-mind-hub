import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/workmind/page-header";
import { PriorityBadge, StatusBadge } from "@/components/workmind/status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  caseCategories,
  caseStatuses,
  priorities,
  seedCases,
  type CaseStatus,
  type Priority,
  type WorkCase,
} from "@/lib/workmind-data";

export const Route = createFileRoute("/app/employee-relations")({
  head: () => ({
    meta: [
      { title: "Employee Relations Cases — WorkMind" },
      {
        name: "description",
        content:
          "Create and track grievances, workplace conflict, performance concerns and wellbeing matters with clear status, owners and deadlines.",
      },
      { property: "og:title", content: "Employee Relations — WorkMind" },
      { property: "og:description", content: "A central workspace for workplace relationship matters." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmployeeRelations,
});

function EmployeeRelations() {
  const [cases, setCases] = useState<WorkCase[]>(seedCases);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      cases.filter(
        (c) =>
          (status === "all" || c.status === status) &&
          (c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.id.toLowerCase().includes(query.toLowerCase())),
      ),
    [cases, query, status],
  );

  function addCase(form: FormData) {
    const next: WorkCase = {
      id: `ER-${2050 + cases.length}`,
      title: String(form.get("title") ?? "Untitled matter"),
      category: String(form.get("category") ?? caseCategories[0]),
      priority: String(form.get("priority") ?? "Medium") as Priority,
      status: "Open",
      owner: String(form.get("owner") ?? "Unassigned"),
      opened: new Date().toISOString().slice(0, 10),
      nextAction: String(form.get("nextAction") ?? ""),
      deadline: String(form.get("deadline") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };
    setCases((prev) => [next, ...prev]);
    setOpen(false);
    toast.success(`Case ${next.id} created`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Employee Relations"
        title="Workplace relationship matters"
        description="One workspace for grievances, conflict, performance, absence and wellbeing matters — with ownership and next steps always visible."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>New case</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create employee relations case</DialogTitle>
                <DialogDescription>
                  Record only the information needed to manage the matter fairly.
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  addCase(new FormData(e.currentTarget));
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Case title</Label>
                  <Input id="title" name="title" required placeholder="Grievance regarding…" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="Employee grievance">
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {caseCategories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="Medium">
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner">Assigned professional</Label>
                    <Input id="owner" name="owner" placeholder="e.g. N. Nthangeni" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" name="deadline" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextAction">Next action</Label>
                  <Input id="nextAction" name="nextAction" placeholder="e.g. Schedule initial meeting" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" rows={3} placeholder="Factual summary of the matter" />
                </div>
                <Button type="submit" className="w-full">
                  Create case
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Search cases</Label>
          <Input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by case ID or title"
          />
        </div>
        <div className="space-y-2 sm:w-56">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {caseStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="border-border shadow-soft">
            <CardHeader className="gap-2 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                <StatusBadge status={c.status as CaseStatus} />
                <PriorityBadge priority={c.priority} />
              </div>
              <CardTitle className="text-lg">{c.title}</CardTitle>
              <CardDescription>
                {c.category} · Opened {c.opened} · {c.owner}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{c.notes}</p>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-3">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Next action</dt>
                  <dd className="mt-1 font-medium">{c.nextAction || "—"}</dd>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Deadline</dt>
                  <dd className="mt-1 font-medium">{c.deadline || "—"}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Move status:</span>
                {caseStatuses.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={s === c.status ? "default" : "outline"}
                    onClick={() =>
                      setCases((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: s } : x)))
                    }
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No cases match your filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
