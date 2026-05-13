"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { getSupabase } from "@/lib/supabase";
import { fetchMyProfile } from "@/lib/profile";
import { loadState } from "@/lib/onboarding-state";

// Magic-link landing page. Supabase's PKCE flow + `detectSessionInUrl`
// handles the actual token exchange automatically when the client boots.
// This page just waits for a session to materialize, then routes the
// user to the right step based on whether they already have a profile.

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    let cancelled = false;

    async function route(userId: string) {
      try {
        const profile = await fetchMyProfile(userId);
        if (cancelled) return;
        if (profile) {
          // Returning user — straight to the lounge.
          router.replace("/lounge");
          return;
        }
        // Quiz-first flow: if they finished the quiz before signing up,
        // their answers are in localStorage. Send them to /username to
        // claim a handle (which writes the profile row). Otherwise the
        // quiz hasn't been taken yet, so route them there.
        const state = loadState();
        const allAnswered =
          state && state.answers.every((a) => a !== null);
        router.replace(allAnswered ? "/username" : "/quiz");
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setErrorMessage("Couldn't load your profile. Please try again.");
      }
    }

    // Resolve immediately if a session already exists.
    sb.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session?.user?.id) route(data.session.user.id);
    });

    // Catch the session that the SDK is about to detect from the URL.
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "SIGNED_IN" && session?.user?.id) {
        route(session.user.id);
      }
    });

    // Fallback: if nothing happens within a few seconds, the magic link
    // probably expired or the URL was stripped. Tell the user.
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        sb.auth.getSession().then(({ data }) => {
          if (cancelled) return;
          if (!data.session) {
            setErrorMessage(
              "We couldn't verify the link. It may have expired or already been used. Try signing in again.",
            );
          }
        });
      }
    }, 6000);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: CS.paper }}
    >
      <div className="flex flex-col items-center text-center">
        <CSMark size={36} />
        {errorMessage ? (
          <>
            <h1
              className="font-sans"
              style={{
                margin: "24px 0 10px",
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                color: CS.ink,
              }}
            >
              That link didn&rsquo;t work.
            </h1>
            <p
              className="font-sans"
              style={{
                margin: "0 0 24px",
                maxWidth: 400,
                fontSize: 15,
                lineHeight: 1.55,
                color: CS.mute,
              }}
            >
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => router.replace("/signup")}
              className="font-sans"
              style={{
                padding: "12px 18px",
                borderRadius: 999,
                background: CS.violet,
                color: CS.paper,
                border: `1px solid ${CS.violet}`,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Back to sign in →
            </button>
          </>
        ) : (
          <>
            <p
              className="font-mono mt-6"
              style={{
                fontSize: 11,
                color: CS.mute,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Verifying your link…
            </p>
            <p
              className="font-sans"
              style={{
                margin: "10px 0 0",
                fontSize: 14,
                color: CS.mute,
              }}
            >
              One second. We&rsquo;re signing you in.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
