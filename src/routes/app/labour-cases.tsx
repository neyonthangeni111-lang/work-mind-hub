import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/workmind/page-header";
import { StatusBadge } from "@/components/workmind/status";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  disputeTimeline,
  seedDisciplinaries,
  seedDisputes,
  seedGrievances,
} from "@/lib/workmind-data";

export const Route = createFileRoute("/app/labour-cases")({
  head: () => ({
    meta: [
      { title: "Labour Relations Cases — WorkMind" },
      {
        name: "description",
        content:
          "Track grievances, disciplinary matters and workplace disputes with stages, hearing dates, agreed actions and a visual case timeline.",
      },
      { property: "og:title", content: "Labour Relations Case Management" },
      { property: "og:description", content: "Grievances, disciplinary matters and disputes in one register." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LabourCases,
});

function CaseTimeline({ stage }: { stage: number }) {
  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {disputeTimeline.map((step, i) => {
        const done = i <= stage;
        return (
          <li key={step} className="flex items-center gap-3 sm:flex-1">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                done ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <span className={cn("text-xs", done ? "font-medium text-foreground" : "text-muted-foreground")}>
              {step}
            </span>
            {i < disputeTimeline.length - 1 ? (
              <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function LabourCases() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Labour Relations"
        title="Case management register"
        description="Grievances, disciplinary matters and workplace disputes — tracked with procedural stages, required actions and outcomes."
      />

      <Tabs defaultValue="grievances">
        <TabsList className="flex w-full flex-wrap justify-start">
          <TabsTrigger value="grievances">Grievances</TabsTrigger>
          <TabsTrigger value="disciplinary">Disciplinary matters</TabsTrigger>
          <TabsTrigger value="disputes">Workplace disputes</TabsTrigger>
        </TabsList>

        <TabsContent value="grievances" className="mt-6">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Grievance register</CardTitle>
              <CardDescription>Formal grievances raised and their current procedural position.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grievance</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Raised</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions taken</TableHead>
                    <TableHead>Next step</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seedGrievances.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell className="font-medium">
                        {g.title}
                        <span className="block font-mono text-xs text-muted-foreground">{g.id}</span>
                      </TableCell>
                      <TableCell>{g.party}</TableCell>
                      <TableCell className="max-w-56 text-muted-foreground">{g.issue}</TableCell>
                      <TableCell>{g.raised}</TableCell>
                      <TableCell>
                        <StatusBadge status={g.status} />
                      </TableCell>
                      <TableCell className="max-w-48 text-muted-foreground">{g.actions}</TableCell>
                      <TableCell className="max-w-48">{g.nextStep}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplinary" className="mt-6 space-y-4">
          {seedDisciplinaries.map((d) => (
            <Card key={d.id} className="border-border shadow-soft">
              <CardHeader>
                <CardDescription className="font-mono text-xs">{d.id}</CardDescription>
                <CardTitle className="text-lg">{d.matter}</CardTitle>
                <CardDescription>
                  {d.employee} · {d.policy}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 text-sm sm:grid-cols-3">
                  {[
                    ["Date", d.date],
                    ["Stage", d.stage],
                    ["Hearing date", d.hearing],
                    ["Required action", d.requiredAction],
                    ["Outcome", d.outcome],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-muted p-3">
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                      <dd className="mt-1 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="disputes" className="mt-6 space-y-4">
          {seedDisputes.map((d) => (
            <Card key={d.id} className="border-border shadow-soft">
              <CardHeader>
                <CardDescription className="font-mono text-xs">{d.id}</CardDescription>
                <CardTitle className="text-lg">{d.nature}</CardTitle>
                <CardDescription>{d.parties}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Key issues</p>
                  <ul className="flex flex-wrap gap-2">
                    {d.keyIssues.map((i) => (
                      <li key={i} className="rounded-full bg-olive/20 px-3 py-1 text-xs">
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Case timeline</p>
                  <CaseTimeline stage={d.timelineStage} />
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Outstanding actions</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {d.outstanding.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
