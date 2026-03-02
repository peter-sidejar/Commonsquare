import { Card, CardContent } from "@/components/ui/card";

const reasons = [
  {
    title: "Ideas Over Identity",
    detail:
      "No party badges. No team jerseys. Just people making their best case on the issues that matter — and letting the audience decide.",
  },
  {
    title: "Watch, Vote, or Debate",
    detail:
      "You don't have to debate to be part of it. Watch real people go head-to-head on video, vote on who made the stronger case, or step in yourself when you're ready.",
  },
  {
    title: "The Best Ideas Rise",
    detail:
      "Elo rankings, audience voting, and structured rounds mean the strongest arguments win — regardless of who's making them.",
  },
];

export function WhySection() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-medium text-primary">Why CommonSquare</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Ideas deserve a fair fight
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Right now, ideas are judged by who says them — not whether
            they&apos;re good. We think that should change.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <Card
              key={reason.title}
              className="transition-colors hover:border-primary/30"
            >
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {reason.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
