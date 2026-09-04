import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/workmind/page-header";
import { PriorityBadge } from "@/components/workmind/status";
import { AiOutput } from "@/components/workmind/ai-output";
import { useAi } from "@/components/workmind/use-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { priorities, seedTasks, taskCategories, type Priority, type WorkTask } from "@/lib/workmind-data";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkMind" },
      {
        name: "description",
        content:
          "Plan your workday across employee relations, labour relations, investigations and reporting with AI prioritisation and clear reasoning.",
      },
      { property: "og:title", content: "AI Task Planner — WorkMind" },
      { property: "og:description", content: "Build a defensible, deadline-aware workday." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Planner,
});

const SYSTEM = `You are a productivity planner for HR and labour relations professionals.
Given a task list, produce:
TODAY — an ordered plan with suggested time blocks
THIS WEEK — the remaining work grouped by day
WHY THIS ORDER — one short reason per prioritised item, referencing urgency, deadline, case severity, dependencies, scheduled meetings or estimated effort (e.g. "This case was prioritized because its response deadline is tomorrow and a follow-up meeting is already scheduled.")
Keep it concise and practical. Do not recommend employment or disciplinary outcomes.`;

function Planner() {
  const { loading, output, setOutput, generate } = useAi();
  const [tasks, setTasks] = useState<WorkTask[]>(seedTasks);

  function addTask(form: FormData) {
    const t: WorkTask = {
      id: `T-${Date.now()}`,
      title: String(form.get("title") ?? ""),
      caseRef: String(form.get("caseRef") ?? ""),
      deadline: String(form.get("deadline") ?? ""),
      duration: String(form.get("duration") ?? ""),
      priority: String(form.get("priority") ?? "Medium") as Priority,
      category: String(form.get("category") ?? "Employee Relations"),
      done: false,
    };
    setTasks((p) => [t, ...p]);
    toast.success("Task added");
  }

  function build() {
    void generate(
      SYSTEM,
      `Today's date: ${new Date().toISOString().slice(0, 10)}
Tasks:
${tasks
  .filter((t) => !t.done)
  .map(
    (t) =>
      `- ${t.title} | case ${t.caseRef} | deadline ${t.deadline} | ~${t.duration} | priority ${t.priority} | category ${t.category}`,
  )
  .join("\n")}`,
    );
  }

  const open = tasks.filter((t) => !t.done);
  const today = open.filter((t) => t.priority === "Critical" || t.priority === "High");

  const list = (items: WorkTask[]) => (
    <ol className="relative space-y-3 border-l border-border pl-6">
      {items.map((t) => (
        <li key={t.id} className="relative rounded-xl border border-border bg-card p-4 shadow-soft">
          <span className="absolute -left-[31px] top-6 size-2.5 rounded-full bg-primary" aria-hidden="true" />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id={t.id}
                checked={t.done}
                onCheckedChange={(v) =>
                  setTasks((p) => p.map((x) => (x.id === t.id ? { ...x, done: Boolean(v) } : x)))
                }
                aria-label={`Mark ${t.title} complete`}
              />
              <div>
                <Label htmlFor={t.id} className="text-base font-medium">
                  {t.title}
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.category} · {t.caseRef} · due {t.deadline} · ~{t.duration}
                </p>
              </div>
            </div>
            <PriorityBadge priority={t.priority} />
          </div>
        </li>
      ))}
      {items.length === 0 ? <li className="text-sm text-muted-foreground">Nothing scheduled.</li> : null}
    </ol>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Task Planner"
        title="Plan a defensible workday"
        description="Prioritisation considers urgency, deadlines, case severity, dependencies, meetings and effort."
        actions={
          <Button onClick={build} disabled={loading}>
            {loading ? "Planning…" : "Build My Workday"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle>Add a task</CardTitle>
            <CardDescription>Link work to the matter it belongs to.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                addTask(new FormData(e.currentTarget));
                e.currentTarget.reset();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="title">Task</Label>
                <Input id="title" name="title" required placeholder="e.g. Draft investigation plan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseRef">Case</Label>
                <Input id="caseRef" name="caseRef" placeholder="e.g. DIS-084" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated duration</Label>
                  <Input id="duration" name="duration" placeholder="e.g. 45 min" />
                </div>
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
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue="Employee Relations">
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" variant="secondary" className="w-full">
                Add task
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="today">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="mt-6">
              {list(today)}
            </TabsContent>
            <TabsContent value="week" className="mt-6">
              {list(open)}
            </TabsContent>
          </Tabs>

          <AiOutput
            value={output}
            onChange={setOutput}
            onRegenerate={build}
            loading={loading}
            category="Task plans"
            title="Workday plan"
            emptyHint="Select Build My Workday to generate a prioritised plan with reasoning for each item."
          />
        </div>
      </div>
    </div>
  );
}
