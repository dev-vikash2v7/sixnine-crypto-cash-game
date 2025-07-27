import crypto from "crypto";

export function generateSeed() {
  return crypto.randomBytes(32).toString("hex");
}
export function hashSeed(seed) {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

// Provably fair crash multiplier (classic: "99 / (1 - X)" or "floor((1/(1-R))*100)/100")
// Simple example:
export function getCrashPoint(serverSeed) {
  const h = crypto.createHash("sha256").update(serverSeed).digest("hex");
  const int = parseInt(h.slice(0, 16), 16);
  if (int % 33 === 0) return 0; // "Instant crash"
  return Math.floor((100 * (1 / (1 - (int % 1000000) / 1000000))) ) / 100; // e.g. min 1.01x, max varies
}
