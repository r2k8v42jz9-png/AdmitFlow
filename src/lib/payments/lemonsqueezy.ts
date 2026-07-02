"use server";

import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { createClient } from "@/lib/supabase/server";

lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY });

/**
 * Creates a Lemon Squeezy checkout for the signed-in user.
 *
 * `userId` is written into `checkout_data.custom.user_id` so the (future)
 * webhook can attribute the resulting order/subscription to the right
 * account. That makes it a payment-attribution-critical field — a client
 * could otherwise pass an arbitrary id, misattributing a purchase — so we
 * cross-check it against the authenticated session's own id (same
 * createClient()/auth.getUser() pattern as src/lib/supabase/match.ts) and
 * refuse to build a checkout if they don't match.
 */
export async function createCheckoutSession(userId: string, variantId?: string): Promise<{ url: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    throw new Error("createCheckoutSession: userId does not match the authenticated session");
  }

  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  const resolvedVariantId = variantId ?? process.env.LEMON_SQUEEZY_VARIANT_ID;
  if (!storeId || !resolvedVariantId) {
    throw new Error("createCheckoutSession: LEMON_SQUEEZY_STORE_ID / variant id is not configured");
  }

  const { statusCode, data: checkout, error } = await createCheckout(storeId, resolvedVariantId, {
    checkoutData: { custom: { user_id: userId } },
  });

  if (error || !checkout) {
    console.error("[lemonsqueezy] createCheckout failed", { statusCode, message: error?.message });
    throw new Error("Failed to create Lemon Squeezy checkout session");
  }

  return { url: checkout.data.attributes.url };
}
