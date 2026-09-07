import * as React from "react";
import { cn } from "@/lib/utils";

/** Classification badge — facts and allegations must be visually distinct (§48). */
const colors: Record<string, string> = {
  user_fact: "bg-emerald-100 text-emerald-900",
  user_allegation: "bg-amber-100 text-amber-900",
  document_observation: "bg-sky-100 text-sky-900",
  system_extraction: "bg-zinc-100 text-zinc-900",
  ai_observation: "bg-violet-100 text-violet-900",
  professional_opinion: "bg-blue-100 text-blue-900",
};

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone && colors[tone] ? colors[tone] : "bg-zinc-100 text-zinc-900",
        className,
      )}
      {...props}
    />
  );
}
