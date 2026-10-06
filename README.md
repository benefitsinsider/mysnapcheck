# My SNAP Check — mysnapcheck.org

Rebuilt 2026-10-05. A short quiz sorts the visitor into one of eight groups created by the 2025 SNAP law changes, then gives that group its yearly checklist (income updates, recertification, periodic report, interview, address changes, and the work rule where it applies). Benefit estimator after the checklist. Same pattern as checkup.benefitsinsider.co.

## Files
- `site/index.html` — the page.
- `site/checklist.js` — **the groups and every checklist item.** One file, used by the page and the emailed copy.
- `site/sponsor.js` — **the one sponsor slot.** Edit this file to swap sponsors. Outside its start/end dates the block disappears from the page and the email.
- `site/admin.html` + `netlify/functions/admin.mjs` — password-protected sign-up log (`ADMIN_PASSWORD`).
- `netlify/functions/subscribe.mjs` — consent record → Beehiiv → GoHighLevel (tags) → emails the checklist → sign-up log.
- `index-old-estimator.html` — the 2026 estimator-only site, kept for reference. Not served.

## Netlify setup (same site and domain as before)
Publish dir is now `site` (from netlify.toml). Add environment variables:
`GHL_API_KEY`, `GHL_LOCATION_ID` (same as medicarenow-site) · `BEEHIIV_API_KEY`, `BEEHIIV_PUB_ID` (same as moneymap) · `ADMIN_PASSWORD` (12+ chars). Optional: `RESEND_API_KEY` + `EMAIL_FROM` for the checklist email instead of GoHighLevel.
The old Netlify Forms lead capture (`snap-leads`) is gone; leads now go to GoHighLevel and Beehiiv.

## The groups
1 Age 60+ · 2 Age 55–59, no exemption (NEW time limit) · 3 Age 18–54, no exemption · 4 Child under 14 · 5 Disability / caregiver / pregnant · 6 Veteran / homeless / former foster youth (exemptions REMOVED) · 7 Tribal member (NEW exemption) · 8 Student / treatment / working 30+ hours.
Parents whose youngest is 14–17 land in group 2 or 3 by age, with an extra item. GoHighLevel tag: `snap-group-N`.

## Tracking
`?src=word` on any link becomes the tag `src-word` (sms, youtube, skool, email…). Text keyword: SNAP (existing keyword, workflow updated) → `https://mysnapcheck.org/?src=sms`.

## Sources (checked 2026-10-05)
fns.usda.gov: SNAP work requirements page; OBBB ABAWD exceptions implementation memo (Oct 3, 2025: time limit to age 64, child exemption under 14, veteran/homeless/foster-youth exceptions removed, tribal exception added); FY2027 COLA tables (page updated Oct 1, 2026). 7 CFR 273.10 (certification periods) and 273.12 (reporting).
⚠️ Age 60–64: the time limit statute now runs to 64, but FNS states people 60+ remain excused from the general work requirements, which excuses them from the time limit. The site places 60–64 in group 1 and tells them to confirm with their state.

## Maintenance
- Every October 1: FY figures in `site/index.html` (estimator constants) and the gross-limit line in `site/checklist.js`; update "checked" dates.
- Whenever FNS issues new OBBB guidance: re-check the exemptions in `site/checklist.js` and re-run the audit pack.
