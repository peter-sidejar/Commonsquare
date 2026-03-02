import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                CS
              </div>
              <span className="text-sm font-semibold">CommonSquare</span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Debate ideas. Not political parties.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <span className="text-border">·</span>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <span className="text-border">·</span>
            <a
              href="https://x.com/commonsquare"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Twitter/X
            </a>
            <span className="text-border">·</span>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-6 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} CommonSquare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
