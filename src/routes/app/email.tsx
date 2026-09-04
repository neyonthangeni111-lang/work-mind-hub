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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkMind" },
      {
        name: "description",
        content:
          "Draft clear, diplomatic workplace communication: grievance responses, meeting invitations, mediation invitations, HR announcements and follow-ups.",
      },
      { property: "og:title", content: "Smart Email — WorkMind" },
      { property: "og:description", content: "Professional workplace communication, drafted in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartEmail,
});

const types = [
  "Employee communication",
  "Manager communication",
  "Grievance response",
  "Meeting invitation",
  "Conflict-resolution communication",
  "HR announcement",
  "Follow-up email",
  "Professional warning",
  "Mediation invitation",
  "Workplace policy communication",
];

const tones = ["Formal", "Neutral", "Empathetic", "Diplomatic", "Firm", "Persuasive"];
const lengths = ["Short", "Medium", "Detailed"];

const SYSTEM = `You draft professional workplace communication for HR and labour relations practitioners.
Return only:
Subject: <subject line>

<email body>

Keep it procedurally fair, factual and free of accusatory or diagnostic language. Never state a disciplinary outcome or employment decision. Do not invent facts, dates or policy clauses — use [square brackets] as placeholders where information is missing.`;

function SmartEmail() {
  const { loading, output, setOutput, generate } = useAi();
  const [form, setForm] = useState({
    type: types[0]!,
    recipient: "",
    situation: "",
    outcome: "",
    context: "",
    tone: "Diplomatic",
    length: "Medium",
  });

  function run() {
    if (!form.situation.trim()) return;
    void generate(
      SYSTEM,
      `Communication type: ${form.type}
Recipient: ${form.recipient}
Situation: ${form.situation}
Desired outcome: ${form.outcome}
Important context: ${form.context}
Tone: ${form.tone}
Length: ${form.length}`,
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Smart Email"
        title="Draft professional communication"
        description="Clear, diplomatic workplace communication that respects procedural fairness."
      />

      <AiNotice compact />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Communication brief</CardTitle>
            <CardDescription>Share only the context needed to draft the message.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Communication type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={form.recipient}
                onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                placeholder="e.g. Warehouse team lead"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="situation">Situation</Label>
              <Textarea
                id="situation"
                rows={4}
                value={form.situation}
                onChange={(e) => setForm({ ...form, situation: e.target.value })}
                placeholder="What has happened and what needs to be communicated?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome">Desired outcome</Label>
              <Input
                id="outcome"
                value={form.outcome}
                onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                placeholder="e.g. Agree a meeting date this week"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Important context</Label>
              <Textarea
                id="context"
                rows={3}
                value={form.context}
                onChange={(e) => setForm({ ...form, context: e.target.value })}
                placeholder="Policy references, timeframes, prior steps"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={form.tone} onValueChange={(v) => setForm({ ...form, tone: v })}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Select value={form.length} onValueChange={(v) => setForm({ ...form, length: v })}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full" onClick={run} disabled={loading || !form.situation.trim()}>
              {loading ? "Drafting…" : "Generate Communication"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          value={output}
          onChange={setOutput}
          onRegenerate={run}
          loading={loading}
          category="Emails"
          title={form.type}
          emptyHint="Your subject line and email body will appear here, ready to copy, edit or save."
        />
      </div>
    </div>
  );
}
