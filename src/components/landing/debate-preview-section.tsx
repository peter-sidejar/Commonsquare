import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DebatePreviewSection() {
  return (
    <section className="border-t px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-primary">The Arena</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Where ideas compete — not people
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Structured video debates with Elo rankings and audience voting. May
            the best argument win.
          </p>
        </div>

        {/* Debate card */}
        <Card className="mx-auto max-w-2xl">
          <CardContent className="pt-6">
            {/* Topic + status */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold">
                Should the federal minimum wage be increased?
              </h3>
              <Badge className="shrink-0 bg-red-500/10 text-red-600 hover:bg-red-500/10">
                Live
              </Badge>
            </div>

            {/* Debaters */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold">@MarcusK</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Elo 1,347 · Modern Moderate
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold">@SarahR</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Elo 1,412 · Classical Liberal
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Round 2 of 4 · Rebuttals</span>
              <span>2,847 watching</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
