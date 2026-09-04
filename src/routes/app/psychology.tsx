import { createFileRoute } from "@tanstack/react-router";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/workmind/page-header";
import { AiNotice } from "@/components/workmind/ai-notice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { conflictTrend, safetyThemes, workplaceIndicators, type Indicator } from "@/lib/workmind-data";

export const Route = createFileRoute("/app/psychology")({
  head: () => ({
    meta: [
      { title: "Workplace Psychology Insights — WorkMind" },
      {
        name: "description",
        content:
          "Aggregated, non-identifying workplace indicators for wellbeing, team climate, psychological safety, communication, conflict and workload.",
      },
      { property: "og:title", content: "Workplace Psychology Insights" },
      { property: "og:description", content: "Workplace indicators, never employee diagnoses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Psychology,
});

function DirectionIcon({ direction }: { direction: Indicator["direction"] }) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const label = direction === "up" ? "Improving" : direction === "down" ? "Declining" : "Stable";
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function IndicatorGrid({ items }: { items: Indicator[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((i) => (
        <Card key={i.label} className="border-border shadow-soft">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wide">Workplace indicator</CardDescription>
            <CardTitle className="text-base">{i.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-semibold">{i.value}</span>
              <DirectionIcon direction={i.direction} />
            </div>
            <Progress value={i.value} aria-label={`${i.label} indicator: ${i.value} out of 100`} />
            <p className="text-sm text-muted-foreground">{i.note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Psychology() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Organisational Psychology"
        title="Workplace indicators"
        description="Aggregated, non-identifying signals that describe workplace themes. These are workplace indicators — not employee diagnoses."
      />

      <Tabs defaultValue="climate">
        <TabsList>
          <TabsTrigger value="climate">Organisational climate</TabsTrigger>
          <TabsTrigger value="safety">Psychological safety</TabsTrigger>
        </TabsList>

        <TabsContent value="climate" className="mt-6 space-y-6">
          <IndicatorGrid items={workplaceIndicators} />

          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Conflict and grievance patterns</CardTitle>
              <CardDescription>Six-month view of recorded workplace matters.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conflictTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar dataKey="conflicts" name="Conflicts" fill="var(--color-chart-1)" radius={6} />
                  <Bar dataKey="grievances" name="Grievances" fill="var(--color-chart-2)" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-6 space-y-6">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Psychological safety themes</CardTitle>
              <CardDescription>
                Based on aggregated, anonymised responses. Individual employees are never identified.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safetyThemes.map((t) => ({ name: t.label, value: t.value }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} interval={0} angle={-18} height={60} textAnchor="end" />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <IndicatorGrid items={safetyThemes} />
        </TabsContent>
      </Tabs>

      <AiNotice />
    </div>
  );
}
