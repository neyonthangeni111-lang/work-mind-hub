import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  FileText,
  Gavel,
  Handshake,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import heroImage from "@/assets/workmind-hero.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMind — AI support for employee & labour relations" },
      {
        name: "description",
        content:
          "WorkMind helps HR, labour relations and workplace psychology professionals manage cases, draft correspondence and see patterns. People first. Evidence second. AI third.",
      },
      { property: "og:title", content: "WorkMind — AI support for employee & labour relations" },
      {
        property: "og:description",
        content: "Case management, workplace psychology insight and AI drafting for people professionals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Users, title: "Employee relations", body: "Grievances, disciplinary matters and workplace disputes tracked end to end." },
  { icon: Gavel, title: "Labour cases", body: "Case files, statuses and timelines built for procedural fairness." },
  { icon: Brain, title: "Workplace psychology", body: "Wellbeing and engagement signals read as patterns, never as diagnoses." },
  { icon: Handshake, title: "Conflict analysis", body: "Structured perspective mapping and de-escalation options." },
  { icon: Mail, title: "Professional drafting", body: "Emails, minutes and summaries you edit and own." },
  { icon: FileText, title: "Reports & insights", body: "Case reporting and trend analytics for leadership." },
  { icon: CalendarDays, title: "Case calendar", body: "Hearings, mediation, deadlines and milestones in one view." },
  { icon: ShieldCheck, title: "Responsible AI", body: "Assistive by design, with human decision-making throughout." },
];

function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl tracking-tight">WorkMind</span>
        <Button asChild size="sm">
          <Link to="/app">Open workspace</Link>
        </Button>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            For HR, labour relations & workplace psychology
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Difficult workplace situations, handled with care.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            WorkMind brings your cases, correspondence and workplace patterns together, with AI that drafts and
            structures — while judgement stays with you.
          </p>
          <p className="mt-6 font-display text-lg text-primary">People first. Evidence second. AI third.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/app">
                Open workspace <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app/responsible-ai">How we use AI</Link>
            </Button>
          </div>
        </div>
        <img
          src={heroImage}
          alt="A quiet mediation room with two chairs facing each other and a notebook on a small table"
          width={1600}
          height={1104}
          className="rounded-3xl shadow-lift"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl tracking-tight">Everything a people professional carries</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="border-border shadow-soft">
              <CardHeader>
                <f.icon className="size-6 text-primary" aria-hidden="true" />
                <CardTitle className="mt-3 text-lg">{f.title}</CardTitle>
                <CardDescription>{f.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-sand/40">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl tracking-tight">AI that respects the stakes</h2>
          <p className="mt-4 text-muted-foreground">
            Nothing WorkMind produces is a decision. Every draft, summary and insight is a starting point for a
            qualified professional to verify, edit and own.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/app">Start working</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        WorkMind — assistive support for employee and labour relations practice.
      </footer>
    </main>
  );
}
