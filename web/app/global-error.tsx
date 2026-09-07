"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconAlert } from "@/components/ui/icons";

export default function GlobalError({
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
    <html>
      <body className="grid min-h-dvh place-items-center bg-zinc-50 text-zinc-900 antialiased">
        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-100 text-red-700">
            <IconAlert size={20} />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-1 text-sm text-zinc-500">
            An error occurred. Please try again.
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
      </body>
    </html>
  );
}
