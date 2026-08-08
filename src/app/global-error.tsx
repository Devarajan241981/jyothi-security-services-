"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F8FAFC] px-4 text-center font-sans">
        <h1 className="text-2xl font-bold text-[#0F1A2B]">Something went wrong</h1>
        <p className="max-w-md text-[#5B6B82]">
          Please try refreshing the page. If the problem continues, call us directly.
        </p>
      </body>
    </html>
  );
}
