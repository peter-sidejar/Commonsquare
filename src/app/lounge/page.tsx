import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { LoungeProfile } from "@/components/lounge-profile";
import type { WaitlistProfile } from "@/types/waitlist";

export const metadata = {
  title: "The Lounge | CommonSquare",
};

export default async function LoungePage() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("cs_session")?.value;

  if (!sessionId) {
    redirect("/");
  }

  const supabase = createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("waitlist")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!profile) {
    redirect("/");
  }

  return <LoungeProfile profile={profile as WaitlistProfile} />;
}
