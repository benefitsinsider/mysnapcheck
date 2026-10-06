// The sign-up log behind /admin. Password-protected; serves JSON to admin.html.
// Env: ADMIN_PASSWORD (set it in Netlify; without it this endpoint refuses everything).
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

const json = (code, body) =>
  new Response(JSON.stringify(body), { status: code, headers: { "content-type": "application/json", "cache-control": "no-store" } });

function sameSecret(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "method not allowed" });
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) return json(503, { error: "ADMIN_PASSWORD is not set (12+ characters) in Netlify" });

  let d; try { d = await req.json(); } catch { return json(400, { error: "bad payload" }); }
  if (!sameSecret(d.password || "", expected)) {
    await new Promise((r) => setTimeout(r, 1500));   // slow down guessing
    console.log("ADMIN_DENIED ip=" + (req.headers.get("x-nf-client-connection-ip") || "?"));
    return json(401, { error: "wrong password" });
  }

  const store = getStore("snap-signups");
  const rows = [];
  let cursor;
  do {
    const page = await store.list({ cursor });
    for (const b of page.blobs) {
      const r = await store.get(b.key, { type: "json" });
      if (r) rows.push(r);
    }
    cursor = page.cursor;
  } while (cursor);
  rows.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return json(200, { count: rows.length, rows });
};
