import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/workmind/page-header";
import { AiNotice } from "@/components/workmind/ai-notice";
import { AiOutput } from "@/components/workmind/ai-output";
import { useAi } from "@/components/workmind/use-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { conflictTrend, resolutionTrend, seedCases } from "@/lib/workmind-data";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Insights — WorkMind" },
      {
        name: "description",
        content:
          "Case overview, workplace trends and productivity analytics, plus a structured AI report generator for professional case reporting.",
      },
      { property: "og:title", content: "Reports & Insights — WorkMind" },
      { property: "og:description", content: "Evidence-based reporting for employee and labour relations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reports,
});

const SYSTEM = `You write structured professional case reports for HR and labour relations practitioners.
Use exactly these headings: Case Summary, Background, Key Issues, Relevant Events, Actions Taken, Current Status, Recommended Next Steps, Executive Summary.
Be factual, neutral and procedurally careful. Do not determine disciplinary outcomes or make employment decisions; frame recommendations as options for the responsible professional to consider.`;

function Reports() {
  const { loading, output, setOutput, generate } = useAi();
  const [form, setForm] = useState({ caseInfo: "", events: "", findings: "", actions: "", outcome: "" });

  const resolved = seedCases.filter((c) => c.status === "Resolved" || c.status === "Closed").length;
  const openCount = seedCases.length - resolved;
  const actionRequired = seedCases.filter((c) => c.status === "Action Required").length;

  const pie = [
    { name: "Open", value: openCount, fill: "var(--color-chart-1)" },
    { name: "Resolved", value: resolved, fill: "var(--color-chart-2)" },
    { name: "Action required", value: actionRequired, fill: "var(--color-chart-3)" },
  ];

  function run() {
    void generate(
      SYSTEM,
      `Case information: ${form.caseInfo}
Key events: ${form.events}
Findings: ${form.findings}
Actions: ${form.actions}
Outcome: ${form.outcome}`,
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reports & Insights"
        title="Workplace analytics"
        description="A focused view of caseload, trends and delivery — designed for professional reporting rather than dashboard clutter."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Open cases", openCount, "Active matters"],
          ["Resolved cases", resolved, "Last 90 days"],
          ["Cases requiring action", actionRequired, "Immediate attention"],
          ["Average resolution time", "14 days", "Improving month on month"],
        ].map(([label, value, hint]) => (
          <Card key={String(label)} className="border-border shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wide">{label}</CardDescription>
              <CardTitle className="text-3xl">{value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">{hint}</CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Workplace trends</CardTitle>
            <CardDescription>Conflict, grievance and absence patterns.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conflictTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                  }}
                />
                <Area type="monotone" dataKey="absence" name="Absence" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.25} />
                <Area type="monotone" dataKey="grievances" name="Grievances" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Case overview</CardTitle>
            <CardDescription>Distribution of the current caseload.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {pie.map((p) => (
                    <Cell key={p.name} fill={p.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle>Average resolution time</CardTitle>
          <CardDescription>Days from case opening to resolution.</CardDescription>
        </CardHeader>
        <CardContent className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={resolutionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                }}
              />
              <Area type="monotone" dataKey="days" stroke="var(--color-chart-1)" fill="var(--color-chart-4)" fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>AI report generator</CardTitle>
            <CardDescription>Generate → edit → save → export a structured case report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(
              [
                ["caseInfo", "Case information", "Case reference, category, parties (roles)"],
                ["events", "Key events", "Chronology of what happened"],
                ["findings", "Findings", "What the information shows"],
                ["actions", "Actions", "Steps already taken"],
                ["outcome", "Outcome", "Current position or agreed outcome"],
              ] as const
            ).map(([key, label, placeholder]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Textarea
                  id={key}
                  rows={3}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <Button className="w-full" onClick={run} disabled={loading || !form.caseInfo.trim()}>
              {loading ? "Generating…" : "Generate report"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <AiOutput
            value={output}
            onChange={setOutput}
            onRegenerate={run}
            loading={loading}
            category="Reports"
            title="Case report"
            emptyHint="Your structured case report will appear here for review, editing and saving."
          />
          {output ? (
            <div className="space-y-2">
              <Label htmlFor="export-name">Export file name</Label>
              <div className="flex gap-2">
                <Input id="export-name" defaultValue="workmind-case-report.txt" readOnly />
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([output], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "workmind-case-report.txt";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export
                </Button>
              </div>
            </div>
          ) : null}
          <AiNotice compact />
        </div>
      </section>
    </div>
  );
}
