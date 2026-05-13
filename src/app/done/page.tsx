"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSButton } from "@/components/cs/cs-button";
import { CSBadge } from "@/components/cs/cs-badge";
import { CSProcAvatar } from "@/components/cs/cs-proc-avatar";
import { BadgePill } from "@/components/badges/badge-pill";
import { OnboardingTopRow } from "@/components/onboarding/top-row";
import { useSession } from "@/lib/use-session";
import { fetchMyProfile, type ProfileRow } from "@/lib/profile";
import { CSArchetypes, type ArchetypeId } from "@/lib/archetypes";

function StatTile({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        padding: "20px 22px",
        borderRadius: 14,
        background: CS.paper2,
        border: `1px solid ${CS.rule}`,
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          color: CS.mute,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        className="font-mono"
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: CS.ink,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      {caption ? (
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: CS.mute,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}

export default function DonePage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/signup");
      return;
    }
    let cancelled = false;
    fetchMyProfile(session.user.id)
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          // No profile yet — they need to finish the funnel.
          router.replace("/results");
          return;
        }
        setProfile(p);
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setLoadingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loading, session, router]);

  const archetype = useMemo(() => {
    if (!profile) return null;
    return (
      CSArchetypes.find((a) => a.id === (profile.archetype_id as ArchetypeId)) ??
      CSArchetypes[0]
    );
  }, [profile]);

  if (loading || loadingProfile || !session || !profile || !archetype)
    return null;

  return (
    <main className="min-h-screen" style={{ background: CS.paper }}>
      <OnboardingTopRow step="Step 4 of 4 · Locked in" />

      <section className="mx-auto w-full max-w-[640px] px-6 pb-16 pt-10 md:px-0 md:pt-16 md:text-center">
        <CSBadge dot>Profile · Locked in</CSBadge>

        <div className="mt-8 flex flex-col items-start gap-5 md:items-center">
          <CSProcAvatar
            seed={profile.handle}
            size={84}
            accent={archetype.tint}
          />
          <div className="flex flex-col items-start gap-2 md:items-center">
            <span
              className="font-sans"
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                color: CS.ink,
              }}
            >
              @{profile.handle}
            </span>
            {profile.show_on_profile ? (
              <BadgePill arch={archetype} />
            ) : (
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: CS.mute,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Archetype hidden · only you can see it
              </span>
            )}
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                color: CS.mute,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Joined just now
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 md:gap-4">
          <StatTile
            label="ELO"
            value={profile.elo.toLocaleString()}
            caption="Starting"
          />
          <StatTile
            label="W–L"
            value={`${profile.wins}–${profile.losses}`}
            caption="No debates yet"
          />
          <StatTile label="Rank" value="—" caption="Unranked" />
        </div>

        <div
          className="mt-10 flex flex-col gap-3 px-6 py-6 text-left md:px-7"
          style={{
            background: CS.violetT,
            border: `1px solid ${CS.violet}33`,
            borderRadius: 14,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: CS.violetD,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            You&rsquo;re on the waitlist
          </span>
          <p
            className="font-sans"
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: CS.ink,
              letterSpacing: "-0.005em",
            }}
          >
            We&rsquo;ll email{" "}
            <span style={{ color: CS.violetD, fontWeight: 500 }}>
              {session.user.email ?? profile.email}
            </span>{" "}
            the moment the square opens for matchmaking. Until then, hang
            out in your Lounge — watch debates as they go live, vote on the
            ones the audience is closest on, and tune your compass when you
            feel like it.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 md:items-center">
          <CSButton
            variant="primary"
            size="lg"
            onClick={() => router.push("/lounge")}
          >
            Enter the Lounge →
          </CSButton>
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: CS.mute,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            You can change privacy + display name from your Lounge.
          </span>
        </div>
      </section>
    </main>
  );
}
