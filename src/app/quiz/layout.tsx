"use client";

import Link from "next/link";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              CS
            </div>
            CommonSquare
          </Link>
          <span className="text-sm text-muted-foreground">
            Political Compass Quiz
          </span>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-8 sm:py-12">{children}</div>
      </main>

      <footer className="border-t py-4">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs text-muted-foreground">
            Your answers are never stored. Only your compass position is saved if you join the waitlist.
          </p>
        </div>
      </footer>
    </div>
  );
}
