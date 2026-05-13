// Small admin check. For MVP we maintain an allowlist of admin emails in
// the ADMIN_EMAILS env var (comma-separated). Anyone whose Supabase Auth
// session email matches gets admin powers (publish topics, edit, archive).
// Replace with a proper role system once we have more than a handful of
// admins.

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS ?? "";
  const allowed = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

// Bearer token used by the n8n ingest workflow when POSTing new topics to
// /api/topics. Separate from the service role key — narrower scope, easier
// to rotate. n8n stores this in its own credentials store.
export function isValidIngestToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const expected = process.env.TOPICS_INGEST_TOKEN;
  if (!expected) return false;
  // Constant-time-ish compare via length equality + char-by-char.
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
