/**
 * Supabase configuration.
 *
 * Real auth + database activate automatically once these env vars are set:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * When they are absent, the app falls back to a local (browser-only) session
 * layer so it remains runnable in development without a backend. The fallback
 * is clearly labeled and never fakes a verified/paid account.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
