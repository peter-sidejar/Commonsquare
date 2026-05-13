"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Single browser-side Supabase client. Session lives in localStorage by
// default — fine for the waitlist MVP. When we add SSR-aware pages
// later, we'll layer @supabase/ssr on top.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  // Throwing here makes the failure mode loud + obvious if env vars are
  // missing. Better than silent auth failures at click time.
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local (local dev) or " +
      "in the Vercel project settings (preview / prod).",
  );
}

let _client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (_client) return _client;
  _client = createClient<Database>(url!, key!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
  return _client;
}
