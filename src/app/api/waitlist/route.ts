import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase";
import { profanity } from "@/lib/profanity";

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .optional(),
  state: z.string().max(100).optional(),
  interest: z.enum(["debate", "watch"]),
  economicScore: z.number().min(0).max(100),
  socialScore: z.number().min(0).max(100),
  governanceScore: z.number().min(0).max(100),
  archetype: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, username, state, interest, economicScore, socialScore, governanceScore, archetype } =
      parsed.data;

    if (username && profanity.exists(username.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Username contains inappropriate language." },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Check for duplicate email
    const { data: existing } = await supabase
      .from("waitlist")
      .select("position")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is already on the waitlist.",
        },
        { status: 409 }
      );
    }

    // Insert new entry
    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        email,
        username: username?.toLowerCase() || null,
        state: state || null,
        interest,
        economic_score: economicScore,
        social_score: socialScore,
        governance_score: governanceScore,
        archetype,
      })
      .select("id, position")
      .single();

    if (error) {
      // Handle username unique constraint violation (race condition)
      if (error.code === "23505" && error.message?.includes("username")) {
        return NextResponse.json(
          { success: false, error: "This handle was just claimed. Please pick another." },
          { status: 409 }
        );
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      position: data.position,
      id: data.id,
    });

    response.cookies.set("cs_session", String(data.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}

const retakeSchema = z.object({
  economicScore: z.number().min(0).max(100),
  socialScore: z.number().min(0).max(100),
  governanceScore: z.number().min(0).max(100),
  archetype: z.string().min(1),
});

export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("cs_session")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = retakeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { economicScore, socialScore, governanceScore, archetype } = parsed.data;
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("waitlist")
      .update({
        economic_score: economicScore,
        social_score: socialScore,
        governance_score: governanceScore,
        archetype,
      })
      .eq("id", sessionId)
      .select("id")
      .single();

    if (error || !data) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
