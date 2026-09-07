import * as React from "react";
import { cn } from "@/lib/utils";

/** Tone names map to --flag-* tokens defined in globals.css. */
const TONES: Record<string, string> = {
  user_fact: "bg-[hsl(var(--flag-verified)/0.18)] text-[hsl(var(--flag-verified))] ring-[hsl(var(--flag-verified)/0.35)]",
  user_allegation: "bg-[hsl(var(--flag-allegation)/0.18)] text-[hsl(var(--flag-allegation))] ring-[hsl(var(--flag-allegation)/0.35)]",
  document_observation: "bg-[hsl(var(--flag-observation)/0.18)] text-[hsl(var(--flag-observation))] ring-[hsl(var(--flag-observation)/0.35)]",
  system_extraction: "bg-muted text-foreground ring-border",
  ai_observation: "bg-[hsl(var(--flag-ai)/0.18)] text-[hsl(var(--flag-ai))] ring-[hsl(var(--flag-ai)/0.35)]",
  professional_opinion: "bg-[hsl(var(--flag-professional)/0.18)] text-[hsl(var(--flag-professional))] ring-[hsl(var(--flag-professional)/0.35)]",
  conflict: "bg-[hsl(var(--flag-conflict)/0.18)] text-[hsl(var(--flag-conflict))] ring-[hsl(var(--flag-conflict)/0.35)]",
  verified: "bg-[hsl(var(--flag-verified)/0.18)] text-[hsl(var(--flag-verified))] ring-[hsl(var(--flag-verified)/0.35)]",
  warning: "bg-[hsl(var(--flag-allegation)/0.18)] text-[hsl(var(--flag-allegation))] ring-[hsl(var(--flag-allegation)/0.35)]",
  neutral: "bg-muted text-muted-foreground ring-border",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof TONES }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        TONES[tone] ?? TONES.neutral,
        className,
      )}
      {...props}
    />
  );
}
