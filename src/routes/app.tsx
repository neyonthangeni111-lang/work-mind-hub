import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Handshake,
  LayoutDashboard,
  ListChecks,
  Mail,
  Menu,
  MessagesSquare,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "WorkMind Workspace — Employee & Labour Relations" },
      {
        name: "description",
        content:
          "The WorkMind workspace for employee relations, labour relations cases, workplace psychology insights and AI-assisted professional productivity.",
      },
      { property: "og:title", content: "WorkMind Workspace" },
      {
        property: "og:description",
        content: "Manage cases, analyse workplace conflict and turn meetings into action.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/employee-relations", label: "Employee Relations", icon: Users, exact: false },
  { to: "/app/labour-cases", label: "Labour Relations Cases", icon: Scale, exact: false },
  { to: "/app/psychology", label: "Workplace Psychology", icon: Brain, exact: false },
  { to: "/app/conflict", label: "Conflict Management", icon: Handshake, exact: false },
  { to: "/app/email", label: "Smart Email", icon: Mail, exact: false },
  { to: "/app/meetings", label: "Meeting Intelligence", icon: MessagesSquare, exact: false },
  { to: "/app/tasks", label: "Task Planner", icon: ListChecks, exact: false },
  { to: "/app/reports", label: "Reports & Insights", icon: BarChart3, exact: false },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays, exact: false },
  { to: "/app/saved", label: "Saved AI Outputs", icon: Sparkles, exact: false },
  { to: "/app/settings", label: "Settings", icon: Settings, exact: false },
] as const;

const mobileNav = nav.slice(0, 5);

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <BriefcaseBusiness className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-lg font-semibold leading-none">WorkMind</p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">Workplace intelligence</p>
        </div>
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active
                  ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/85",
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/app/responsible-ai"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent",
            pathname === "/app/responsible-ai" && "bg-sidebar-accent font-semibold",
          )}
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          Responsible AI
        </Link>
      </div>
    </div>
  );
}

function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-cocoa/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-lift">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setOpen(true)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <span className="font-display text-lg font-semibold">WorkMind</span>
          <Link to="/app/saved" aria-label="Saved AI outputs">
            <Sparkles className="size-5 text-primary" />
          </Link>
        </div>

        <main className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-28 pt-6 sm:px-6 lg:pb-12 lg:pt-10">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Quick navigation"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden"
      >
        {mobileNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] text-muted-foreground [&.active]:text-primary"
            activeOptions={{ exact: item.to === "/app" }}
          >
            <item.icon className="size-5" aria-hidden="true" />
            <span className="text-center leading-tight">{item.label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
