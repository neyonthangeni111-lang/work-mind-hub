import { ShieldAlert } from "lucide-react";

export function AiNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex gap-3 rounded-xl border border-olive/40 bg-olive/10 p-4 text-sm text-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <div className="space-y-1">
        <p>
          AI-generated content may contain errors or bias. Review and verify all outputs before using them in
          professional, employment, disciplinary, psychological or legal contexts.
        </p>
        {!compact ? (
          <p className="text-muted-foreground">
            Do not enter unnecessary confidential employee information, sensitive personal data, medical
            information, or other protected information.
          </p>
        ) : null}
      </div>
    </div>
  );
}
