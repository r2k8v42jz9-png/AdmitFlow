import { NextResponse } from "next/server";
import { isOpenAIConfigured, OPENAI_API_KEY, OPENAI_MODEL, OPENAI_BASE_URL } from "@/lib/ai/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import type { MentorProfile } from "@/lib/mentor-engine";

export const runtime = "nodejs";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

/** Reads the signed-in user's admissions profile from Supabase (server-side). */
async function loadProfile(): Promise<MentorProfile> {
  const fallback: MentorProfile = {
    name: "there",
    gpa: null,
    gpaScale: 4,
    ielts: null,
    sat: null,
    major: "your field",
    intake: "your intake",
    degreeLevel: "",
    budget: null,
    countries: [],
    dreamUniversities: [],
  };
  if (!isSupabaseConfigured()) return fallback;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fallback;

  const [{ data: profile }, { data: onboarding }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase.from("onboarding_data").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return {
    name: profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? "there",
    gpa: onboarding?.gpa ?? null,
    gpaScale: onboarding?.gpa_scale ?? 4,
    ielts: onboarding?.ielts ?? null,
    sat: onboarding?.sat ?? null,
    major: onboarding?.intended_major ?? "your field",
    intake: onboarding?.target_intake ?? "your intake",
    degreeLevel: onboarding?.degree_level ?? "",
    budget: onboarding?.budget ?? null,
    countries: onboarding?.countries ?? [],
    dreamUniversities: onboarding?.dream_universities ?? [],
  };
}

export async function POST(request: Request) {
  // When no key is configured, tell the client to use the built-in engine.
  // This is explicit (not a fake success) — the demo stays functional.
  if (!isOpenAIConfigured()) {
    return NextResponse.json({ fallback: true, reason: "openai_not_configured" }, { status: 200 });
  }

  let body: { messages?: IncomingMessage[]; locale?: "en" | "ru" | "uz" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const locale = body.locale ?? "en";
  if (messages.length === 0) {
    return NextResponse.json({ error: "no_messages" }, { status: 400 });
  }

  const profile = await loadProfile();
  const system = buildSystemPrompt(profile, locale);

  try {
    const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { fallback: true, reason: "openai_error", status: res.status, detail: detail.slice(0, 300) },
        { status: 200 },
      );
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    if (!content) {
      return NextResponse.json({ fallback: true, reason: "empty_completion" }, { status: 200 });
    }
    return NextResponse.json({ content });
  } catch {
    // Network/provider failure → graceful fallback to the local engine.
    return NextResponse.json({ fallback: true, reason: "request_failed" }, { status: 200 });
  }
}
