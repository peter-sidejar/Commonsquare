// Client-side mirror of the Postgres `handle_is_clean` function. The DB
// function is the source of truth (and the CHECK constraint on profiles
// enforces it), but we duplicate the logic here so the user gets instant
// "Not allowed" feedback while typing instead of hitting the error at
// profile-lock-in time. Keep this list in sync with the SQL function.

const BAD_PATTERNS = [
  // Slurs / hate (non-exhaustive).
  "nigg", "fag", "tranny", "retard", "kike", "spic", "chink", "gook",
  "wetback", "hitler", "nazi", "kkk",
  // Sexual / explicit.
  "fuck", "fuk", "fck", "shit", "cunt", "cock", "dick", "pussy",
  "penis", "vagina", "anus", "butt", "buts", "boob", "tits", "titty",
  "asshole", "arse", "bitch", "whore", "slut", "rape", "incest",
  "porn", "sexy", "horny", "cum", "jizz", "wank", "crap", "bastard",
  "damn",
  // Reserved / impersonation.
  "admin", "moderator", "support", "staff", "official", "system",
  "commonsquare", "root", "help", "login", "signup", "auth",
  "team", "mod", "owner", "founder", "ceo",
] as const;

// L33tspeak letter folds applied before stripping non-alphanumerics so
// `Adm1n`, `sh1t`, `a55hole`, `f4g` all normalize to their plain-text form.
const L33T: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  "$": "s",
};

function normalize(raw: string): string {
  let n = raw.toLowerCase();
  for (const [from, to] of Object.entries(L33T)) {
    n = n.split(from).join(to);
  }
  return n.replace(/[^a-z0-9]/g, "");
}

export type HandleVerdict =
  | { ok: true }
  | { ok: false; reason: "too-short" | "blocked" };

export function checkHandle(raw: string): HandleVerdict {
  const n = normalize(raw);
  if (n.length < 3) return { ok: false, reason: "too-short" };
  for (const pattern of BAD_PATTERNS) {
    if (n.includes(pattern)) return { ok: false, reason: "blocked" };
  }
  return { ok: true };
}
