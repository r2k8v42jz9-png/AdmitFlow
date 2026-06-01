/**
 * AI Mentor provider configuration (server-only).
 *
 * Real ChatGPT responses activate when OPENAI_API_KEY is set. Until then the
 * mentor uses the built-in, admissions-specialized rule-based engine so the
 * product is always functional (never a broken/empty chat).
 *
 * Model: defaults to GPT-5 Mini for cost/latency; override with OPENAI_MODEL.
 */
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
export const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

export function isOpenAIConfigured(): boolean {
  return Boolean(OPENAI_API_KEY);
}
