import crypto from "crypto";

// raw token goes in the email link; only the hash is stored
export function makeVerifyToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  return { raw, hash, expires };
}

export function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}