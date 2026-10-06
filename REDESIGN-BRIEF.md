# PROJECT BRIEF — Redo mysnapcheck.org

## Goal
Rebuild mysnapcheck.org so it does three things the current site does not:
1. Opens on what people stand to lose, not on a calculator.
2. Sorts visitors into the groups created by the 2025 SNAP law changes, so I can say on video "find your group" and they recognize themselves.
3. Gives each group its yearly minimum to keep benefits: income updates, recertification, interview, address and household changes, work-hour reporting.
Match the Benefits Insider brand exactly (benefitsinsider.co), and reuse the pattern that is already working on checkup.benefitsinsider.co.

## What exists today (keep or replace)
- Live site: https://mysnapcheck.org — a senior-focused eligibility and benefit estimator. Source: `~/benefits-insider/apps/snap-eligibility/`, repo github.com/benefitsinsider/mysnapcheck, Netlify auto-deploy, DNS at GoDaddy.
- Problems to fix: it asks for email AND phone before showing an estimate; its footer still says figures are "pending final verification"; its figures are FY2026 and expired September 30, 2026; leads land in Netlify Forms and go nowhere.
- Keep the estimator, but move it behind the group step. The estimate is one tool inside the site, not the front door.

## The front door (same voice as the Checkup)
Headline: lead with the loss. Working lines:
- "Don't lose your food benefits over a letter you didn't open."
- "The rules for keeping SNAP changed in 2025. Most people found out when the card stopped working."
Under it: the fact that the rules changed, three trust promises (free, nothing sold, nobody calls you), and the ask: "Find your group. Get your yearly checklist. About 2 minutes."
Live countdown and season line are not needed here; SNAP has no single window. A "last verified" date is.

## The groups (the heart of the rebuild)
Each visitor answers 4–6 questions and lands in ONE group. Each group gets its own page section and checklist. On video I will say "if you're in group 2…" so the groups need plain names and a number.

Based on USDA Food and Nutrition Service guidance on the One Big Beautiful Bill Act (checked October 5, 2026; every rule below must be re-verified at fns.usda.gov before it ships):

| # | Group | What changed for them |
|---|---|---|
| 1 | **Age 60 and older** | Still exempt from the general work requirements, so the time limit does not apply. Special elderly/disabled rules: medical expense deduction, no gross-income test, longer certification periods. Their job is reporting and recertifying on time. |
| 2 | **Age 55 to 59, no disability, no child under 14 at home** | NEW. The time limit used to stop at 54. It now runs to 64. They must work, volunteer or be in training 80 hours a month, or they get 3 months of benefits in a 36-month period. This is the group that will be caught off guard. |
| 3 | **Age 18 to 54, no child under 14 at home** | Already under the time limit; now the exemptions are narrower. |
| 4 | **Parents and caretakers** | The exemption now covers a child under 14 (it was under 18). An adult whose youngest child is 14 to 17 is now subject to the time limit. |
| 5 | **People with a disability, or caring for someone who cannot care for themselves** | Exempt from the work requirements if medically certified. Their job is keeping the certification current. |
| 6 | **Veterans, people experiencing homelessness, former foster youth** | Their automatic exemptions were REMOVED by the 2025 law. They are now subject to the time limit unless they qualify under another group. Verify foster-youth removal separately. |
| 7 | **Members of federally recognized tribes** | NEW exemption from the time limit (as defined under the Indian Health Care Improvement Act). |
| 8 | **Students, pregnant people, people in drug or alcohol treatment** | Existing exemptions; confirm each still stands. |

Routing questions: age range · a child under 14 in the home? · a disability or caring for someone? · veteran / homeless / former foster youth? · tribal member? · student / pregnant / in treatment? "Not sure" gets a how-to-tell card, as on the Checkup.

## The yearly minimum, per group
Every group's checklist covers the same five jobs, with the group's own rules filled in. Figures and periods vary by state, so the site says "ask your state" where it must, and links to the state SNAP office.
1. **Income updates:** what change has to be reported, how soon, and how (simplified reporting rules; the threshold that triggers a report).
2. **Recertification:** how often (certification periods differ by household type and state; elderly/disabled households often get longer ones), what the renewal packet asks for, and what happens if the deadline passes.
3. **The interview:** when one is required, phone vs. in person, what to have ready.
4. **Address, household and contact changes:** moving, someone joining or leaving the household, a new phone number. Missed mail is the number-one way benefits end.
5. **Work requirements (groups 2, 3, 4, 6):** the 80 hours a month, what counts (work, volunteering, training), how it is reported, the 3-months-in-36 limit, and how to ask for an exemption or a good-cause exception.
Plus, for everyone: "If you were cut off, ask why in writing" and "if you were told you make too much, that number changes every October 1."

## The estimator
Keep it, updated to FY2027 maximums (effective October 1, 2026; verified against the USDA FNS COLA memo), 48 states and D.C., with Alaska, Hawaii, Guam and the Virgin Islands noted as different. Clearly labeled an estimate. It sits after the group checklist, not before.

## Sign-up (copy the Checkup)
- Email required, first name required, mobile optional with the standard text-consent box.
- Email goes to Beehiiv directly; contact and tags go to GoHighLevel (group tag, e.g. `snap-group-2`; source tag from `?src=` on the link; `sms-weekly` if they opt in).
- A text keyword for video: **SNAP** (or similar) to 1-888-459-8182, set up in GoHighLevel the same way as MEDICARENOW and CHECKUP, with the link `https://mysnapcheck.org/?src=sms`.
- Email the person their group checklist, the same way the Checkup does.
- Password-protected `/admin` page: completions by day, group counts, what was collected.
- Promises on the page, verbatim from the Checkup: free, nothing sold, nobody calls you, we never sell or share your information.

## Sponsor block (swappable)
- One sponsor slot, shown the way Chapter appears on the Checkup: an opt-in block after the checklist, never a gate, with the logo, what they do in one sentence, the call to action, and the paid-partnership line that says how I am paid.
- First sponsor: **Propel** (the Providers app). Pull the exact wording and the disclosure from the Propel contract file before writing the block, and confirm what they can and cannot be described as doing.
- Build it as ONE config file (name, logo, line, link, phone, disclosure, start and end dates). Replacing Propel with another sponsor later is an edit to that file, not to the page. If the end date passes with no replacement, the block disappears on its own.
- The sponsor block also goes into the emailed checklist, from the same config.
- The sponsor never receives contact data. The page promise "we never sell or share your information" stays.

## Brand
From the live stylesheet at benefitsinsider.co (not the older magnet spec):
- Colors: navy `#034186`, blue `#2F6BA5`, gold `#FFDE59`, crimson `#9B1B30`, ink `#030712`, mist `#DBE5F1`, gray background `#F6F8FA`.
- Fonts: Lora for headings, Inter for body (19px body on desktop). Pill buttons, 999px radius.
- Gold only on navy; on white use navy or blue for labels.
- Illustrations in the style of the "Four ways" cards on the homepage: 56px line icons, navy stroke, gold fill. One per group and per checklist section.
- Layout model: checkup.benefitsinsider.co (hero with the tool card on the right, how-it-works strip, "why do you need my email," who made this, footer disclaimer).

## Accuracy rules (non-negotiable)
- Every rule verified at fns.usda.gov or the state agency before it ships; every figure dated on the page ("Checked [date]").
- Run the full checklist text through the audit pack (ChatGPT and Gemini with browsing) before launch, as done for the Checkup. Log results.
- Politically neutral: describe what the 2025 law did, not who passed it. "The law signed July 4, 2025" is enough.
- Not a government site; standard disclaimer; link to the state SNAP office and 1-800-221-5689 (USDA SNAP information line, verify).
- Annual maintenance: FY figures every October 1; work-requirement rules whenever FNS issues guidance.

## Deliverables
1. The rebuilt site in `~/benefits-insider/apps/snap-eligibility/` (one page plus functions), deployed to the existing Netlify site and domain.
2. The group checklists as one shared file, used by the page and the email.
3. `/admin` page.
4. Carrie's one-line keyword request (copy of MEDICARENOW with the new keyword and link).
5. A Skool teaser image and post, and YouTube reply text with `?src=youtube`.
6. The sponsor config file, filled in for Propel.
