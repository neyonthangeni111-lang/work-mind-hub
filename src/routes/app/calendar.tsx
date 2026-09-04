import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/workmind/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { seedEvents, type CalendarEvent } from "@/lib/workmind-data";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({
    meta: [
      { title: "Workplace Case Calendar — WorkMind" },
      {
        name: "description",
        content:
          "Meetings, hearings, mediation sessions, grievance deadlines, investigation milestones and reports due in day, week and month views.",
      },
      { property: "og:title", content: "Workplace Case Calendar" },
      { property: "og:description", content: "Every hearing, deadline and follow-up in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

const typeStyles: Record<CalendarEvent["type"], string> = {
  Meeting: "border-l-4 border-l-primary",
  Hearing: "border-l-4 border-l-wine",
  Mediation: "border-l-4 border-l-olive",
  Deadline: "border-l-4 border-l-wine",
  Milestone: "border-l-4 border-l-olive",
  "Follow-up": "border-l-4 border-l-primary",
  Report: "border-l-4 border-l-sand",
};

function EventCard({ e }: { e: CalendarEvent }) {
  return (
    <div className={cn("rounded-xl bg-card p-4 shadow-soft", typeStyles[e.type])}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {e.type} · {e.time}
      </p>
      <p className="mt-1 font-medium">{e.title}</p>
      <p className="text-xs text-muted-foreground">{e.date}</p>
    </div>
  );
}

function CalendarPage() {
  const [selected] = useState(seedEvents[0]!.date);
  const dayEvents = seedEvents.filter((e) => e.date === selected);
  const monthDays = Array.from({ length: 30 }, (_, i) => `2026-09-${String(i + 1).padStart(2, "0")}`);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Calendar"
        title="Workplace case calendar"
        description="Hearings, mediation sessions, grievance deadlines, investigation milestones and reporting dates."
      />

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">{selected}</p>
          {dayEvents.map((e) => (
            <EventCard key={e.title} e={e} />
          ))}
        </TabsContent>

        <TabsContent value="week" className="mt-6 grid gap-3 md:grid-cols-2">
          {seedEvents.map((e) => (
            <EventCard key={e.title} e={e} />
          ))}
        </TabsContent>

        <TabsContent value="month" className="mt-6">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>September 2026</CardTitle>
              <CardDescription>Days with scheduled workplace activity are highlighted.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((d) => {
                  const events = seedEvents.filter((e) => e.date === d);
                  return (
                    <div
                      key={d}
                      className={cn(
                        "min-h-20 rounded-lg border border-border p-2 text-xs",
                        events.length ? "bg-sand" : "bg-card",
                      )}
                    >
                      <span className="font-semibold">{Number(d.slice(-2))}</span>
                      <ul className="mt-1 space-y-1">
                        {events.map((e) => (
                          <li key={e.title} className="truncate text-[10px] text-foreground/80" title={e.title}>
                            {e.type}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
