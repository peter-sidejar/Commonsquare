import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getServiceRoleClient } from "@/lib/supabase-server";
import { isAdminEmail, isValidIngestToken } from "@/lib/admin";
import type { Database } from "@/lib/database.types";

export const runtime = "nodejs";

const SourceSchema = z.object({
  outlet: z.string().min(1).max(120),
  title: z.string().min(1).max(400),
  url: z.string().url(),
  bias_label: z.enum(["Left", "Lean Left", "Center", "Lean Right", "Right"]),
  excerpt: z.string().max(800).optional(),
});

const TopicBodySchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens."),
  title: z.string().min(3).max(280),
  debate_question: z.string().min(3).max(280),
  background: z.string().min(20).max(4000),
  left_summary: z.string().min(20).max(2000),
  right_summary: z.string().min(20).max(2000),
  left_sources: z.array(SourceSchema).max(20).default([]),
  right_sources: z.array(SourceSchema).max(20).default([]),
  center_sources: z.array(SourceSchema).max(20).default([]),
  tags: z.array(z.string().min(1).max(40)).max(10).default([]),
  primary_axis: z.enum(["e", "s", "g", "none"]).default("none"),
  og_image_url: z.string().url().optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  published_at: z.string().datetime().optional(),
});

async function authorize(req: Request): Promise<
  | { ok: true; via: "ingest-token" | "admin"; userId?: string }
  | { ok: false; status: number; message: string }
> {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return { ok: false, status: 401, message: "Missing Authorization header." };
  }
  const [scheme, token] = auth.split(" ");
  if ((scheme ?? "").toLowerCase() !== "bearer" || !token) {
    return { ok: false, status: 401, message: "Expected Bearer token." };
  }

  // Path 1: shared ingest token (used by n8n).
  if (isValidIngestToken(token)) {
    return { ok: true, via: "ingest-token" };
  }

  // Path 2: Supabase JWT from an admin user.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return {
      ok: false,
      status: 500,
      message: "Supabase env vars missing on the server.",
    };
  }
  const sb = createClient<Database>(url, anon);
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, status: 401, message: "Invalid session token." };
  }
  if (!isAdminEmail(data.user.email)) {
    return {
      ok: false,
      status: 403,
      message: "This account is not on the admin allowlist.",
    };
  }
  return { ok: true, via: "admin", userId: data.user.id };
}

export async function POST(req: Request) {
  const auth = await authorize(req);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = TopicBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const admin = getServiceRoleClient();
  const { data, error } = await admin
    .from("topics")
    .insert({
      slug: parsed.data.slug,
      title: parsed.data.title,
      debate_question: parsed.data.debate_question,
      background: parsed.data.background,
      left_summary: parsed.data.left_summary,
      right_summary: parsed.data.right_summary,
      left_sources: parsed.data.left_sources,
      right_sources: parsed.data.right_sources,
      center_sources: parsed.data.center_sources,
      tags: parsed.data.tags,
      primary_axis: parsed.data.primary_axis,
      og_image_url: parsed.data.og_image_url ?? null,
      status: parsed.data.status,
      ...(parsed.data.published_at
        ? { published_at: parsed.data.published_at }
        : {}),
    })
    .select()
    .single();

  if (error) {
    // Slug conflict surfaces as a unique-constraint error (code 23505).
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json(
      {
        error:
          error.code === "23505"
            ? `A topic with slug "${parsed.data.slug}" already exists.`
            : error.message,
      },
      { status },
    );
  }

  return NextResponse.json({ topic: data }, { status: 201 });
}
