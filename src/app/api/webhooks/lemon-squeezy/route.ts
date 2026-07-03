import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// node:crypto (HMAC + timingSafeEqual) requires the Node runtime, not Edge.
export const runtime = "nodejs";

/**
 * Lemon Squeezy webhook → subscriptions table.
 *
 * This is the ONLY writer of subscriptions.plan/status: RLS
 * (0005_secure_subscriptions.sql) makes the table read-only for clients, so
 * paid access can only be granted here, after a cryptographically verified
 * event from Lemon Squeezy.
 *
 * Security model:
 *  - X-Signature = hex HMAC-SHA256 of the RAW request body, keyed with
 *    LEMON_SQUEEZY_WEBHOOK_SECRET. Verified with timingSafeEqual before the
 *    body is even parsed; mismatch → 401. The raw text must be used — parsing
 *    and re-stringifying JSON would change byte order/whitespace and break
 *    the digest.
 *  - user_id comes from meta.custom_data.user_id, which our checkout action
 *    (src/lib/payments/lemonsqueezy.ts) sets server-side to the AUTHENTICATED
 *    user's id — a client cannot spoof someone else's id into a checkout.
 *    It is still validated as a UUID here before touching the database.
 *  - Writes use the service-role key (bypasses RLS by design). That key must
 *    only ever live in server env — never NEXT_PUBLIC_*.
 */

const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Subscription events we act on; anything else is acknowledged and ignored. */
const SUBSCRIPTION_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_resumed",
  "subscription_unpaused",
  "subscription_paused",
  "subscription_cancelled",
  "subscription_expired",
  "subscription_payment_failed",
  "subscription_payment_success",
]);

/** Lemon Squeezy subscription status → our subscriptions.status vocabulary. */
function mapStatus(ls: string | undefined): "inactive" | "trialing" | "active" | "past_due" | "canceled" {
  switch (ls) {
    case "on_trial":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "cancelled":
    case "expired":
      return "canceled";
    case "paused":
    default:
      return "inactive";
  }
}

/** Variant id → plan tier. Unknown/missing variants default to "pro". */
function mapPlan(variantId: unknown): "pro" | "max" {
  const v = String(variantId ?? "");
  if (v && v === process.env.LEMON_SQUEEZY_VARIANT_ID_MAX) return "max";
  return "pro";
}

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const digest = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody, "utf8").digest("hex");
  const expected = Buffer.from(digest, "utf8");
  const received = Buffer.from(signatureHeader, "utf8");
  // timingSafeEqual throws on length mismatch — treat that as a failed check.
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  if (!WEBHOOK_SECRET || !SERVICE_ROLE_KEY || !SUPABASE_URL) {
    // Misconfiguration must never silently ACK a payment event: a 500 makes
    // Lemon Squeezy retry, and the boolean flags say which var is missing
    // without ever logging a secret value.
    console.error("[ls-webhook] missing configuration", {
      webhookSecretConfigured: Boolean(WEBHOOK_SECRET),
      serviceRoleConfigured: Boolean(SERVICE_ROLE_KEY),
      supabaseUrlConfigured: Boolean(SUPABASE_URL),
    });
    return NextResponse.json({ error: "webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get("x-signature"))) {
    console.error("[ls-webhook] signature verification failed");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: {
    meta?: { event_name?: string; custom_data?: { user_id?: unknown } };
    data?: { attributes?: Record<string, unknown> };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name ?? "";
  if (!SUBSCRIPTION_EVENTS.has(eventName)) {
    // Not ours to handle (e.g. order_created, license events) — ACK so Lemon
    // Squeezy doesn't retry.
    return NextResponse.json({ received: true, ignored: eventName });
  }

  const userId = String(payload.meta?.custom_data?.user_id ?? "");
  if (!UUID_RE.test(userId)) {
    // Signed event but no usable attribution — likely a checkout created
    // outside our flow. 200 (retrying won't fix it), but log loudly.
    console.error("[ls-webhook] missing/invalid custom_data.user_id", { eventName });
    return NextResponse.json({ received: true, warning: "no user_id attribution" });
  }

  const attrs = payload.data?.attributes ?? {};
  const status = mapStatus(attrs.status as string | undefined);
  const plan = mapPlan(attrs.variant_id);
  const periodEnd = (attrs.renews_at as string | null) ?? (attrs.ends_at as string | null) ?? null;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status,
      provider: "lemonsqueezy",
      current_period_end: periodEnd,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    // 500 → Lemon Squeezy retries with backoff, so a transient DB failure
    // can't permanently strand a paid user on the free tier.
    console.error("[ls-webhook] subscriptions upsert failed", { eventName, message: error.message });
    return NextResponse.json({ error: "db write failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true, event: eventName, status, plan });
}
