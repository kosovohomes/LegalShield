"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconAlert } from "@/components/ui/icons";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/30">
          <IconAlert size={20} />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We logged the error. You can try again, or return home.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
          <Button asChild>
            <Link href="/ar">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
