import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/workmind/page-header";
import { AiNotice } from "@/components/workmind/ai-notice";
import { AiOutput } from "@/components/workmind/ai-output";
import { useAi } from "@/components/workmind/use-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/app/conflict")({
  head: () => ({
    meta: [
      { title: "Workplace Conflict Analyser — WorkMind" },
      {
        name: "description",
        content:
          "Turn a complex workplace situation into a neutral summary, contributing factors, stakeholder perspectives, escalation risk and practical next steps.",
      },
      { property: "og:title", content: "Workplace Conflict Analyser" },
      { property: "og:description", content: "Structured, neutral analysis that supports professional judgement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConflictAnalyser,
});

const SYSTEM = `You are an organisational psychology and labour relations analyst supporting a qualified professional.
Produce a neutral, non-judgemental structured analysis using exactly these headings:
1. Situation Summary
2. Possible Contributing Factors
3. Communication Issues
4. Stakeholder Perspectives
5. Conflict Escalation Risk (state Low, Moderate or High and explain why)
6. Recommended Next Steps (practical options such as clarification meeting, mediation, facilitated discussion, policy review, manager intervention, further information gathering)
Rules: do not assign blame, do not make employment decisions, do not diagnose psychological conditions, avoid speculation presented as fact, use plain professional language. End with a one-line reminder that this analysis is not a substitute for professional judgement or formal investigation.`;

function ConflictAnalyser() {
  const { loading, output, setOutput, generate } = useAi();
  const [form, setForm] = useState({
    situation: "",
    people: "",
    context: "",
    concern: "",
    attempts: "",
    outcome: "",
  });

  const prompt = `Workplace situation: ${form.situation}
People involved (roles only): ${form.people}
Context: ${form.context}
Main concern: ${form.concern}
Previous attempts to resolve: ${form.attempts}
Desired outcome: ${form.outcome}`;

  function run() {
    if (!form.situation.trim()) return;
    void generate(SYSTEM, prompt);
  }

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    rows?: number,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      {rows ? (
        <Textarea
          id={key}
          rows={rows}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <Input
          id={key}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Conflict Management"
        title="Workplace conflict analyser"
        description="Describe the situation in neutral terms. WorkMind structures it into factors, perspectives, escalation risk and practical options."
      />

      <AiNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Situation details</CardTitle>
            <CardDescription>Use roles rather than names where possible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {field("situation", "Describe the workplace situation…", "What is happening, when did it start, how is it affecting work?", 6)}
            {field("people", "People involved", "e.g. Two team leads and one supervisor")}
            {field("context", "Context", "e.g. Restructure completed three months ago")}
            {field("concern", "Main concern", "e.g. Handover breakdowns affecting service")}
            {field("attempts", "Previous attempts to resolve it", "e.g. Informal discussion in July", 3)}
            {field("outcome", "Desired outcome", "e.g. Workable handover agreement")}
            <Button onClick={run} disabled={loading || !form.situation.trim()} className="w-full">
              {loading ? "Analysing…" : "Analyse Situation"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <AiOutput
            value={output}
            onChange={setOutput}
            onRegenerate={run}
            loading={loading}
            category="Conflict analyses"
            title={form.concern || "Workplace conflict analysis"}
            emptyHint="Your structured analysis will appear here — summary, contributing factors, communication issues, perspectives, escalation risk and next steps."
          />
          <p className="text-xs text-muted-foreground">
            AI analysis is not a substitute for professional judgement or formal investigation.
          </p>
        </div>
      </div>
    </div>
  );
}
