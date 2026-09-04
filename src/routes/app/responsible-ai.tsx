import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Users, FileSearch, Scale, EyeOff, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/workmind/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/app/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI Use — WorkMind" },
      {
        name: "description",
        content:
          "How WorkMind uses AI in employee and labour relations: assistive only, human decision-making, confidentiality, bias awareness and record-keeping.",
      },
      { property: "og:title", content: "Responsible AI Use — WorkMind" },
      {
        property: "og:description",
        content: "People first. Evidence second. AI third.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResponsibleAi,
});

const principles = [
  {
    icon: Users,
    title: "People first",
    body: "Every case involves people whose livelihood and dignity are at stake. Talk to them before you draft anything.",
  },
  {
    icon: FileSearch,
    title: "Evidence second",
    body: "Decisions rest on documented facts, procedure and policy — not on plausible-sounding text.",
  },
  {
    icon: ShieldCheck,
    title: "AI third",
    body: "AI helps you structure thinking, draft faster and see patterns. It never decides.",
  },
];

const guidelines = [
  {
    icon: Scale,
    q: "AI is assistive, not decisive",
    a: "WorkMind's tools produce drafts, structured summaries and observations. Disciplinary outcomes, dismissals, findings of misconduct and settlement decisions must be made by an accountable human professional following your organisation's procedure.",
  },
  {
    icon: EyeOff,
    q: "Confidentiality and data minimisation",
    a: "Anonymise names, ID numbers and identifying details before entering case content. Share only what the tool needs to help you. Saved outputs are stored on your device and are subject to your organisation's retention and confidentiality policy.",
  },
  {
    icon: AlertTriangle,
    q: "Bias awareness",
    a: "AI models reflect patterns in their training data and can carry cultural, gender, language and seniority bias. Read every output for assumptions about the parties, and correct language that characterises a person rather than describing behaviour.",
  },
  {
    icon: FileSearch,
    q: "Verification before use",
    a: "Check names, dates, references to policy or legislation and quoted statements against the case file. AI can produce confident, incorrect detail. Nothing should be sent, filed or relied on until you have verified it.",
  },
  {
    icon: ShieldCheck,
    q: "Record-keeping",
    a: "Note where AI assisted in producing a document if your procedure requires it, keep the final human-edited version as the record of decision, and preserve the underlying evidence separately.",
  },
  {
    icon: Users,
    q: "Psychological safety",
    a: "Psychology-related outputs describe workplace dynamics and wellbeing signals. They are not clinical assessments or diagnoses, and must never be used to label an individual. Refer people to qualified support where wellbeing concerns arise.",
  },
];

function ResponsibleAi() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Responsible AI"
        title="People first. Evidence second. AI third."
        description="The standard WorkMind holds itself to, and the standard we ask you to hold your practice to."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {principles.map((p) => (
          <Card key={p.title} className="border-border shadow-soft">
            <CardHeader>
              <p.icon className="size-6 text-primary" aria-hidden="true" />
              <CardTitle className="mt-3">{p.title}</CardTitle>
              <CardDescription>{p.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="font-display text-2xl">Guidelines for use</h2>
        <Accordion type="single" collapsible className="mt-4">
          {guidelines.map((g) => (
            <AccordionItem key={g.q} value={g.q}>
              <AccordionTrigger className="text-left">
                <span className="flex items-center gap-3">
                  <g.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {g.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{g.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Card className="border-wine/40 bg-wine/5 shadow-soft">
        <CardHeader>
          <CardTitle>Where AI must not be used</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Deciding whether an employee is guilty of misconduct.</li>
            <li>Determining a sanction, dismissal or retrenchment selection.</li>
            <li>Assessing an individual's mental health or fitness for work.</li>
            <li>Replacing consultation, representation or a fair hearing.</li>
            <li>Generating evidence, statements or minutes that were not actually observed.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
