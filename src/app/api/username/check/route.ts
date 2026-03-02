import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase";
import { profanity } from "@/lib/profanity";

const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "support",
  "help",
  "commonsquare",
  "mod",
  "moderator",
  "system",
  "official",
  "team",
  "api",
  "www",
  "app",
  "mail",
  "email",
  "root",
  "null",
  "undefined",
  "test",
]);

const usernameSchema = z
  .string()
  .min(3, "Must be at least 3 characters")
  .max(20, "Must be 20 characters or fewer")
  .regex(
    /^[a-zA-Z][a-zA-Z0-9_]*$/,
    "Must start with a letter and contain only letters, numbers, and underscores"
  );

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { available: false, error: "Username required" },
      { status: 400 }
    );
  }

  const parsed = usernameSchema.safeParse(username);
  if (!parsed.success) {
    return NextResponse.json(
      { available: false, error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const normalized = username.toLowerCase();

  if (RESERVED_USERNAMES.has(normalized)) {
    return NextResponse.json(
      { available: false, error: "This handle is reserved" },
      { status: 200 }
    );
  }

  if (profanity.exists(normalized)) {
    return NextResponse.json(
      { available: false, error: "This handle contains inappropriate language" },
      { status: 200 }
    );
  }

  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("waitlist")
    .select("id")
    .ilike("username", normalized)
    .single();

  return NextResponse.json({ available: !existing });
}
