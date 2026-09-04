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

export const Route = createFileRoute("/app/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Intelligence — WorkMind" },
      {
        name: "description",
        content:
          "Turn HR and labour relations meeting notes into an executive summary, key issues, decisions, agreements, action items and follow-up dates.",
      },
      { property: "og:title", content: "Meeting Intelligence — WorkMind" },
      { property: "og:description", content: "From meeting notes to decisions and accountable actions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Meetings,
});

const meetingTypes = [
  "Grievance meeting",
  "Disciplinary hearing",
  "Consultation",
  "Mediation session",
  "Investigation interview",
  "Team debrief",
  "Management meeting",
];

const confidentiality = ["Internal", "Confidential", "Strictly confidential"];

const SYSTEM = `You summarise HR and labour relations meeting notes for a professional record.
Use exactly these headings:
Executive Summary
Key Issues
Decisions
Agreements
Action Items (a list where each line is: Task — Responsible person — Deadline — Status)
Outstanding Issues
Follow-Up Date (extract important dates mentioned in the notes; if none, write "Not specified")
Stay factual and neutral. Never infer outcomes, blame or psychological conditions that are not in the notes.`;

function Meetings() {
  const { loading, output, setOutput, generate } = useAi();
  const [form, setForm] = useState({
    title: "",
    date: "",
    participants: "",
    type: meetingTypes[0]!,
    confidentiality: "Confidential",
    notes: "",
  });

  function run() {
    if (!form.notes.trim()) return;
    void generate(
      SYSTEM,
      `Meeting title: ${form.title}
Date: ${form.date}
Participants (roles): ${form.participants}
Meeting type: ${form.type}
Confidentiality level: ${form.confidentiality}

Notes:
${form.notes}`,
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Meeting Intelligence"
        title="Turn meetings into decisions and actions"
        description="Built for grievance meetings, hearings, consultations and mediation sessions."
      />

      <AiNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Meeting record</CardTitle>
            <CardDescription>Use roles instead of names where the record allows it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Consultation — overtime arrangement"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                value={form.participants}
                onChange={(e) => setForm({ ...form, participants: e.target.value })}
                placeholder="e.g. HR practitioner, line manager, employee representative"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Meeting type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conf">Confidentiality level</Label>
                <Select
                  value={form.confidentiality}
                  onValueChange={(v) => setForm({ ...form, confidentiality: v })}
                >
                  <SelectTrigger id="conf">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {confidentiality.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting notes</Label>
              <Textarea
                id="notes"
                rows={10}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Paste meeting notes here…"
              />
            </div>
            <Button className="w-full" onClick={run} disabled={loading || !form.notes.trim()}>
              {loading ? "Summarising…" : "Summarize"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          value={output}
          onChange={setOutput}
          onRegenerate={run}
          loading={loading}
          category="Meeting summaries"
          title={form.title || "Meeting summary"}
          emptyHint="Your executive summary, decisions, agreements, action items and follow-up date will appear here."
        />
      </div>
    </div>
  );
}
