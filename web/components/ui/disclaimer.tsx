import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "info" | "warning" | "critical";

const tones: Record<Tone, string> = {
  info: "border-[hsl(var(--flag-observation)/0.45)] bg-[hsl(var(--flag-observation)/0.08)] text-foreground",
  warning: "border-[hsl(var(--flag-allegation)/0.45)] bg-[hsl(var(--flag-allegation)/0.08)] text-foreground",
  critical: "border-destructive/50 bg-destructive/10 text-foreground",
};

export function Disclaimer({
  tone = "info",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-xl border p-3 text-sm leading-relaxed",
        tones[tone],
        className,
      )}
    >
      <div className="mt-0.5 size-4 shrink-0 rounded-full bg-current opacity-60" />
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
