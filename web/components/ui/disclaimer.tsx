import * as React from "react";
import { cn } from "@/lib/utils";

export function Disclaimer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      role="note"
      className={cn(
        "rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900",
        className,
      )}
    >
      {children}
    </p>
  );
}
