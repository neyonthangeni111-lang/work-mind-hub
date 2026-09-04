import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/workmind/page-header";
import { AiNotice } from "@/components/workmind/ai-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkMind" },
      {
        name: "description",
        content:
          "Set your professional profile, preferred AI tone, notification preferences and data handling choices for WorkMind.",
      },
      { property: "og:title", content: "Settings — WorkMind" },
      { property: "og:description", content: "Tune WorkMind to your practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

const KEY = "workmind.settings.v1";

type SettingsState = {
  name: string;
  role: string;
  organisation: string;
  tone: string;
  signature: string;
  deadlineAlerts: boolean;
  weeklyDigest: boolean;
  aiReminders: boolean;
};

const defaults: SettingsState = {
  name: "",
  role: "Employee Relations Practitioner",
  organisation: "",
  tone: "Professional",
  signature: "",
  deadlineAlerts: true,
  weeklyDigest: true,
  aiReminders: true,
};

function Settings() {
  const [s, setS] = useState<SettingsState>(defaults);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setS({ ...defaults, ...(JSON.parse(raw) as SettingsState) });
      } catch {
        /* ignore malformed stored settings */
      }
    }
  }, []);

  function save() {
    localStorage.setItem(KEY, JSON.stringify(s));
    toast.success("Settings saved on this device");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Your practice preferences"
        description="WorkMind adapts to how you work. Nothing here changes the professional judgement that stays with you."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Professional profile</CardTitle>
            <CardDescription>Used to personalise drafts and reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={s.role} onValueChange={(v) => setS({ ...s, role: v })}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Employee Relations Practitioner",
                    "Labour Relations Specialist",
                    "HR Business Partner",
                    "Workplace Mediator",
                    "Organisational Psychologist",
                  ].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="org">Organisation</Label>
              <Input id="org" value={s.organisation} onChange={(e) => setS({ ...s, organisation: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>AI preferences</CardTitle>
            <CardDescription>Set the default voice for generated drafts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Preferred tone</Label>
              <Select value={s.tone} onValueChange={(v) => setS({ ...s, tone: v })}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Professional", "Firm", "Empathetic", "Neutral", "Conciliatory"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature">Default email signature</Label>
              <Textarea
                id="signature"
                rows={4}
                value={s.signature}
                onChange={(e) => setS({ ...s, signature: e.target.value })}
                placeholder={"Kind regards,\nName\nRole, Organisation"}
              />
            </div>
            <AiNotice compact />
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Reminders that keep cases moving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(
              [
                ["deadlineAlerts", "Case deadline alerts", "Alert me before grievance and hearing deadlines"],
                ["weeklyDigest", "Weekly summary", "A Monday digest of open cases and upcoming events"],
                ["aiReminders", "AI review reminders", "Remind me to review AI drafts before sending"],
              ] as const
            ).map(([key, title, hint]) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div>
                  <Label htmlFor={key}>{title}</Label>
                  <p className="text-sm text-muted-foreground">{hint}</p>
                </div>
                <Switch id={key} checked={s[key]} onCheckedChange={(v) => setS({ ...s, [key]: v })} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle>Data handling</CardTitle>
            <CardDescription>How WorkMind treats sensitive workplace information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Saved outputs and settings are stored locally on this device, not in a shared database.</p>
            <p>Text you submit to an AI tool is sent for processing only while generating that response.</p>
            <p>Anonymise names and identifying details before entering case information wherever possible.</p>
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.removeItem("workmind.saved-outputs.v1");
                toast.success("All saved AI outputs cleared from this device");
              }}
            >
              Clear all saved AI outputs
            </Button>
          </CardContent>
        </Card>
      </div>

      <Button onClick={save}>Save settings</Button>
    </div>
  );
}
