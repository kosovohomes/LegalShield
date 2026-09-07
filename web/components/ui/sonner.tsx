"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/components/theme-provider";

export function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  const { theme } = useTheme();
  return (
    <SonnerToaster
      theme={theme}
      className="rounded-xl"
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border bg-card text-card-foreground shadow-[var(--shadow-soft)] backdrop-blur",
          title: "font-medium",
        },
      }}
      {...props}
    />
  );
}
