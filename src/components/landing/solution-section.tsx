import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    time: "30 seconds",
    detail:
      "Choose your username and claim your spot on CommonSquare. Your profile is your identity in the arena — lock it in before someone else does.",
  },
  {
    number: "02",
    title: "Discover Your Compass",
    time: "2 minutes",
    detail:
      "Answer 30 questions to see where you land on the political spectrum. You'll get your personal compass and debate archetype — from Bridge Builder to Civil Libertarian.",
  },
  {
    number: "03",
    title: "Enter the Arena",
    time: "Coming soon",
    detail:
      "When the platform launches, you're first in line. Watch debates, vote on the best arguments, or jump in and compete yourself.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-t px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-medium text-primary">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps to claim your spot
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Create your profile, discover where you stand, and be first in line
            when the arena opens.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="transition-colors hover:border-primary/30"
            >
              <CardContent className="flex h-full flex-col justify-between pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground/50">
                    Step {step.number}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {step.time}
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
