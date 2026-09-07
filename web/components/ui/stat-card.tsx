import * as React from "react";
import { cn } from "@/lib/utils";

/** Decorative animated counters. */
export function StatCard({
  label,
  value,
  trend,
  icon,
  className,
}: {
  label: string;
  value: string | number;
  trend?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-md",
        "transition-colors hover:bg-card/80",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-semibold tabular-nums tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="pb-1.5 text-xs text-muted-foreground">{trend}</span>
        )}
      </div>
    </div>
  );
}
