import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlarmClock,
  CalendarCheck,
  FilePlus2,
  FileText,
  Gauge,
  Handshake,
  Mail,
  MessagesSquare,
} from "lucide-react";
import { PageHeader } from "@/components/workmind/page-header";
import { PriorityBadge, StatusBadge } from "@/components/workmind/status";
import { AiNotice } from "@/components/workmind/ai-notice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { seedCases, seedEvents, seedTasks, workplaceIndicators } from "@/lib/workmind-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkMind Workspace" },
      {
        name: "description",
        content:
          "Today's open cases, upcoming meetings, pending actions, deadlines and workplace wellbeing indicators in one professional view.",
      },
      { property: "og:title", content: "WorkMind Dashboard" },
      {
        property: "og:description",
        content: "Understand your people. Manage today's priorities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  {
    title: "New Labour Case",
    body: "Create and track a workplace relations matter.",
    cta: "Create Case",
    to: "/app/labour-cases",
    icon: FilePlus2,
  },
  {
    title: "Analyse Workplace Conflict",
    body: "Turn a complex workplace situation into structured insights.",
    cta: "Analyse Situation",
    to: "/app/conflict",
    icon: Handshake,
  },
  {
    title: "Draft Professional Communication",
    body: "Create clear, diplomatic workplace communication.",
    cta: "Generate Email",
    to: "/app/email",
    icon: Mail,
  },
  {
    title: "Summarize Meeting",
    body: "Turn meeting notes into decisions and actions.",
    cta: "Summarize",
    to: "/app/meetings",
    icon: MessagesSquare,
  },
] as const;

function Dashboard() {
  const today = new Date().toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const openCases = seedCases.filter((c) => c.status !== "Closed" && c.status !== "Resolved");
  const actionRequired = seedCases.filter((c) => c.status === "Action Required");
  const pendingTasks = seedTasks.filter((t) => !t.done);
  const wellbeing = workplaceIndicators[0]!;

  const stats = [
    { label: "Open cases", value: openCases.length, hint: `${actionRequired.length} need action now`, icon: FileText },
    { label: "Upcoming meetings", value: 4, hint: "Next: team climate debrief", icon: CalendarCheck },
    { label: "Pending actions", value: pendingTasks.length, hint: "Across all active matters", icon: AlarmClock },
    { label: "Deadlines this week", value: 3, hint: "1 grievance response due", icon: Gauge },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={today}
        title="Good morning 👋"
        description="Understand your people. Manage today's priorities."
        actions={
          <Link to="/app/tasks">
            <Button>Build my workday</Button>
          </Link>
        }
      />

      <section aria-label="Today at a glance" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wide">
                <s.icon className="size-4 text-primary" aria-hidden="true" />
                {s.label}
              </CardDescription>
              <CardTitle className="text-3xl">{s.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">{s.hint}</CardContent>
          </Card>
        ))}
      </section>

      <section aria-label="Quick actions" className="grid gap-4 md:grid-cols-2">
        {quickActions.map((a) => (
          <Card key={a.title} className="surface-warm border-border shadow-soft transition-shadow hover:shadow-lift">
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <a.icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="mt-3 text-lg">{a.title}</CardTitle>
              <CardDescription>{a.body}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={a.to}>
                <Button variant="secondary">{a.cta}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border shadow-soft">
          <CardHeader>
            <CardTitle>Priority matters</CardTitle>
            <CardDescription>Cases requiring attention or a next step this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {openCases.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-xs font-mono text-muted-foreground">{c.id}</p>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Next: {c.nextAction} · Due {c.deadline}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
            <Link to="/app/employee-relations" className="inline-block text-sm font-medium text-primary underline">
              View all employee relations cases
            </Link>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Workplace wellbeing indicator</CardTitle>
              <CardDescription>Aggregated, non-identifying workplace signal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-display text-4xl font-semibold">{wellbeing.value}</p>
              <Progress value={wellbeing.value} aria-label="Workplace wellbeing indicator" />
              <p className="text-sm text-muted-foreground">{wellbeing.note}</p>
              <Link to="/app/psychology" className="inline-block text-sm font-medium text-primary underline">
                Open psychology insights
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Important deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {seedEvents.slice(0, 4).map((e) => (
                <div key={e.title} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.type} · {e.date} at {e.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AiNotice />
    </div>
  );
}
