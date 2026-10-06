// Form handler for My SNAP Check (mysnapcheck.org)
// Modeled on medicarenow-site/netlify/functions/subscribe.mjs.
//
// Order matters: the consent record is written BEFORE anything else, because if consent is
// ever challenged the record is the defence. Then the contact goes to GoHighLevel.
// The checklist itself is built in the browser and never depends on this call succeeding.
//
// Secrets live in Netlify env vars, never in this repo:
//   GHL_API_KEY      GoHighLevel private-integration token
//   GHL_LOCATION_ID  GoHighLevel location
//   CONSENT_WEBHOOK  (optional) POST target for a durable consent log
//   BEEHIIV_API_KEY + BEEHIIV_PUB_ID  the newsletter (same values as the moneymap site)
//
// Emailing the checklist — one of two routes, chosen by which keys exist:
//   RESEND_API_KEY + EMAIL_FROM   send through Resend (EMAIL_FROM e.g. "Kwame from Benefits Insider <checkup@benefitsinsider.co>")
//   otherwise                     send through GoHighLevel, as an email to the contact just created
// The email is ALWAYS built here from the person's answers (checklist.js), never from text sent by
// the browser — otherwise this endpoint could be used to send anyone any message from our address.

// ⚠️ If the wording on the page changes, change it here in the same commit.
const EMAIL_CONSENT_TEXT =
  "By continuing you agree to receive the free Benefits Insider newsletter by email. Unsubscribe on any email.";
const SMS_CONSENT_TEXT =
  "I agree to join the Benefits Insider weekly text list: recurring automated marketing texts with updates " +
  "that can affect your benefits, finances or retirement, including occasional messages about products and " +
  "services from partners I have vetted. I will never sell or share your information. Consent is not a " +
  "condition of any purchase. About 1 text per week. Message and data rates may apply. Reply STOP to cancel, HELP for help.";

import snap from "../../site/checklist.js";
import sponsor from "../../site/sponsor.js";
import { getStore } from "@netlify/blobs";

const SITE = "https://mysnapcheck.org";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Only known answers reach the checklist builder.
function cleanAnswers(a) {
  const one = (v, ok) => (ok.includes(v) ? v : undefined);
  const many = (v, ok) => (Array.isArray(v) ? v.filter((x) => ok.includes(x)) : []);
  const out = {
    status: one(a.status, ["have", "applying", "cut"]),
    age: one(a.age, ["18", "55", "60", "65"]),
    child: one(a.child, ["u14", "teen", "none"]),
    limit: one(a.limit, ["y", "n", "ns"]),
    sit: many(a.sit, ["vet", "homeless", "foster", "tribe", "student", "treatment", "work30", "none"]),
  };
  return out.age ? out : null;
}

export function checklistEmail(first, answers) {
  const R = snap.build(answers), g = R.group;
  const li = (t) => `<tr><td style="vertical-align:top;padding:9px 10px 9px 0;font-size:20px;line-height:1.2;color:#034186">&#9744;</td>` +
                    `<td style="padding:9px 0;font:16px/1.55 Arial,Helvetica,sans-serif;color:#111827;border-bottom:1px solid #E5E7EB">${t}</td></tr>`;
  const block = (title, items, warn) =>
    `<div style="margin:22px 0 0;padding:18px 20px;border:${warn ? "2px solid #9B1B30" : "1px solid #E5E7EB"};border-radius:12px;background:${warn ? "#fdf2f3" : "#ffffff"}">` +
    `<h2 style="margin:0 0 6px;font:bold 20px/1.25 Georgia,serif;color:${warn ? "#9B1B30" : "#034186"}">${title}</h2>` +
    (warn ? `<p style="margin:6px 0 4px;font:16px/1.55 Arial,Helvetica,sans-serif;color:#111827">${warn}</p>` : "") +
    `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">${items.map(li).join("")}</table></div>`;
  const body =
    (R.warn ? block(R.warn.t, R.warn.items, R.warn.p) : "") + R.groups.map((g) => block(g.t, g.items)).join("");
  const html =
    `<div style="background:#F6F8FA;padding:24px 12px"><div style="max-width:640px;margin:0 auto">` +
    `<div style="background:#034186;border-radius:14px;padding:24px 22px;color:#ffffff">` +
    `<p style="margin:0;font:bold 12px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#FFDE59">My SNAP Check · group ${g.n}</p>` +
    `<h1 style="margin:10px 0 8px;font:bold 26px/1.2 Georgia,serif;color:#ffffff">${esc(first)}, here is your yearly checklist.</h1>` +
    `<p style="margin:0;font:16px/1.5 Arial,Helvetica,sans-serif;color:#DBE5F1">Your group: <b style="color:#ffffff">${g.n}. ${esc(g.name)}</b>.</p></div>` +
    body +
    `<p style="margin:24px 0 0;font:16px/1.55 Arial,Helvetica,sans-serif;color:#111827">You can check items off and print your list here: ` +
    `<a href="${SITE}/?src=checklist-email" style="color:#034186;font-weight:bold">${SITE.replace("https://", "")}</a></p>` +
    `<p style="margin:14px 0 0;font:16px/1.55 Arial,Helvetica,sans-serif;color:#111827">Nobody will call you because of this email. I don't work for any agency.</p>` +
    (sponsor.active() ? `<div style="margin:22px 0 0;padding:18px 20px;border:2px solid #034186;border-radius:12px;background:#ffffff">` +
      `<p style="margin:0;font:bold 11px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#2F6BA5">From our sponsor</p>` +
      `<p style="margin:12px 0 0"><img src="${sponsor.logoPng}" alt="${esc(sponsor.name)}" height="44" style="height:44px;display:block;border:0"></p>` +
      `<p style="margin:8px 0 6px;font:bold 20px/1.25 Georgia,serif;color:#034186">${esc(sponsor.heading)}</p>` +
      `<p style="margin:0 0 10px;font:15px/1.5 Arial,Helvetica,sans-serif;color:#111827">${esc(sponsor.line)}</p>` +
      `<p style="margin:0 0 10px"><a href="${sponsor.url}" style="color:#034186;font-weight:bold">${esc(sponsor.cta)} →</a></p>` +
      `<p style="margin:0;font:12px/1.5 Arial,Helvetica,sans-serif;color:#6B7280">${esc(sponsor.disclosure)}</p></div>` : "") +
    `<p style="margin:14px 0 0;font:16px/1.55 Arial,Helvetica,sans-serif;color:#111827">Kwame Kuadey<br>Benefits Insider</p>` +
    `<p style="margin:22px 0 0;font:12px/1.55 Arial,Helvetica,sans-serif;color:#6B7280">You are getting this because you asked for your checklist at ${SITE.replace("https://", "")}. ` +
    `mysnapcheck.org is not affiliated with, or endorsed by, the U.S. Department of Agriculture or any state SNAP agency. ` +
    `This is general education, not individualized legal or financial advice. Only your state SNAP office can confirm the rules that apply to your case. ` +
    `Rules and figures are for October 1, 2026 through September 30, 2027 and were checked October 5, 2026.</p></div></div>`;
  return { subject: `Your SNAP checklist (group ${g.n})`, html };
}

async function sendChecklist({ first, email, answers, contactId }) {
  const a = cleanAnswers(answers);
  if (!a) { console.log("CHECKLIST_EMAIL_SKIPPED no_valid_answers"); return false; }
  const { subject, html } = checklistEmail(first, a);
  try {
    if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [email], subject, html }),
      });
      if (!r.ok) console.log("CHECKLIST_EMAIL_ERROR resend " + r.status + " " + (await r.text()).slice(0, 300));
      else console.log("CHECKLIST_EMAIL_SENT resend");
      return r.ok;
    }
    if (process.env.GHL_API_KEY && contactId) {
      const r = await fetch("https://services.leadconnectorhq.com/conversations/messages", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GHL_API_KEY}`, Version: "2021-04-15", "content-type": "application/json" },
        body: JSON.stringify({ type: "Email", contactId, subject, html }),
      });
      if (!r.ok) console.log("CHECKLIST_EMAIL_ERROR ghl " + r.status + " " + (await r.text()).slice(0, 300));
      else console.log("CHECKLIST_EMAIL_SENT ghl");
      return r.ok;
    }
    console.log("CHECKLIST_EMAIL_NOT_CONFIGURED");
    return false;
  } catch (e) { console.log("CHECKLIST_EMAIL_FAILED " + e.message); return false; }
}

const GROUPS = new Set(["1", "2", "3", "4", "5", "6", "7", "8"]);

const json = (code, body) =>
  new Response(JSON.stringify(body), { status: code, headers: { "content-type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "method not allowed" });

  let d;
  try { d = await req.json(); } catch { return json(400, { error: "bad payload" }); }

  const first = String(d.first_name || "").trim().slice(0, 80);
  const email = String(d.email || "").trim().toLowerCase().slice(0, 200);
  const phoneRaw = String(d.phone || "").replace(/\D/g, "");
  const smsConsent = d.sms_consent === true || d.sms_consent === "on" || d.sms_consent === "yes";
  const a = d.answers && typeof d.answers === "object" ? d.answers : {};
  // The group is computed here from the answers, never trusted from the browser.
  const cleaned = cleanAnswers(a);
  const group = cleaned ? String(snap.assign(cleaned)) : (GROUPS.has(String(d.group)) ? String(d.group) : "0");
  // Where they came from: ?src=youtube on the link becomes the tag "src-youtube". No src = "src-direct".
  const src = /^[a-z0-9-]{1,24}$/.test(String(d.src || "")) ? String(d.src) : "direct";

  if (!first) return json(400, { error: "first name required" });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error: "valid email required" });
  if (phoneRaw && phoneRaw.length < 10) return json(400, { error: "valid mobile number required" });

  // A phone number without the consent box is dropped, never stored.
  const phone = phoneRaw && smsConsent ? "+1" + phoneRaw.slice(-10) : null;

  // ---- 1. the consent record, first and always ---------------------------------
  const record = {
    ts: new Date().toISOString(),
    ip: req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || null,
    ua: req.headers.get("user-agent") || null,
    source: "mysnapcheck.org",
    first_name: first, email, phone,
    email_consent_text: EMAIL_CONSENT_TEXT,
    sms_consent_given: Boolean(phone),
    sms_consent_text: phone ? SMS_CONSENT_TEXT : null,   // snapshot the exact wording shown
    group,
  };
  console.log("CONSENT_RECORD " + JSON.stringify(record));
  if (process.env.CONSENT_WEBHOOK) {
    try {
      await fetch(process.env.CONSENT_WEBHOOK, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(record),
      });
    } catch (e) { console.log("CONSENT_WEBHOOK_FAILED " + e.message); }
  }

  // ---- 2. Beehiiv: the newsletter, the same direct route the Money Map uses ---------
  if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUB_ID) {
    try {
      const r = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUB_ID}/subscriptions`, {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}` },
        body: JSON.stringify({ email, reactivate_existing: true, send_welcome_email: true,
                               utm_source: "snap-check", utm_medium: "app", utm_campaign: src }),
      });
      if (!r.ok) console.log("BEEHIIV_ERROR " + r.status);
    } catch (e) { console.log("BEEHIIV_FAILED " + e.message); }
  } else {
    console.log("BEEHIIV_NOT_CONFIGURED newsletter_signup_not_sent email=" + email);
  }

  // ---- 3. GoHighLevel: tags, and the weekly text list ------------------------------
  // Tags describe coverage type only. Do not pass these contacts to any agency: the page
  // promises "we will never sell or share your information."
  const tags = ["snap-check", "snap-check-optin", "snap-group-" + group];
  if (a.status === "cut") tags.push("snap-cut-off");
  if (a.status === "applying") tags.push("snap-applying");
  if (phone) tags.push("sms-weekly");
  tags.push("src-" + src);

  let contactId = null, stored = false;
  if (!process.env.GHL_API_KEY) {
    console.log("GHL_NOT_CONFIGURED lead_exists_only_in_logs email=" + email);
  } else {
    try {
      const body = { locationId: process.env.GHL_LOCATION_ID, firstName: first, email, source: "snap check", tags };
      if (phone) body.phone = phone;
      const r = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GHL_API_KEY}`, Version: "2021-07-28", "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json().catch(() => ({}));
      stored = r.ok; contactId = j?.contact?.id || j?.id || null;
      if (!r.ok) console.log("GHL_ERROR " + r.status + " " + JSON.stringify(j).slice(0, 300));
    } catch (e) { console.log("GHL_FAILED " + e.message); }
  }

  // ---- 4. Email the checklist ----------------------------------------------------
  const emailed = await sendChecklist({ first, email, answers: a, contactId });

  // ---- 5. The sign-up log Kwame reads at /admin -----------------------------------
  // Minimal on purpose: when, who (first name + email), whether a phone was given (the
  // number itself stays in GoHighLevel), coverage type, where they came from, and whether
  // each hand-off worked. No answers beyond the coverage type, nothing else.
  try {
    const ts = new Date().toISOString();
    const key = ts + "-" + Buffer.from(email).toString("base64url").slice(0, 24);
    await getStore("snap-signups").setJSON(key, {
      ts, first_name: first, email, phone_given: Boolean(phone), category: group, src, stored, emailed,
    });
  } catch (e) { console.log("STORE_FAILED " + e.message); }

  return json(200, { ok: true, stored, emailed });
};
