import { cn } from "@/lib/utils";
import type { CaseStatus, Priority } from "@/lib/workmind-data";

const statusStyles: Record<CaseStatus, string> = {
  Open: "bg-sand text-sand-foreground border-sand",
  "Under Review": "bg-olive/20 text-foreground border-olive/40",
  "Action Required": "bg-wine text-wine-foreground border-wine",
  Resolved: "bg-primary/15 text-primary border-primary/30",
  Closed: "bg-muted text-muted-foreground border-border",
};

const statusMark: Record<CaseStatus, string> = {
  Open: "●",
  "Under Review": "◐",
  "Action Required": "▲",
  Resolved: "✓",
  Closed: "■",
};

export function StatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      <span aria-hidden="true">{statusMark[status]}</span>
      {status}
    </span>
  );
}

const priorityStyles: Record<Priority, string> = {
  Low: "border-border text-muted-foreground",
  Medium: "border-olive/50 text-foreground",
  High: "border-primary/50 text-primary",
  Critical: "border-wine text-wine",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        priorityStyles[priority],
      )}
    >
      {priority}
    </span>
  );
}
