/* mysnapcheck.org — the ONE sponsor slot.
   To swap sponsors, edit this file only. The page and the emailed checklist both read it.
   If today is outside start..end, nothing is shown anywhere. */
var BISponsor = {
  name: "Propel",
  // STANDING RULE (Kwame, 2026-10-06): every time the sponsor is shown, show the logo MARK with the
  // wordmark, on the page, in the email and on any promo image. Never the name alone.
  mark: "assets/propel-icon.svg",              // the logo mark, relative to the site root
  logo: "assets/propel-wordmark.svg",          // the wordmark
  logoPng: "https://mysnapcheck.org/assets/propel-logo.png", // mark + wordmark lockup, absolute, for email clients
  start: "2026-10-01", end: "2026-12-31",        // contract term; block disappears after `end`
  heading: "Check your EBT balance in seconds, free.",
  // Approved sponsor language (Propel batch 01, section E) with the mandatory "private app" line.
  line: "Propel is the free app more than 5 million Americans use to manage their EBT benefits: check your balance in seconds, get deposit alerts, lock your card against skimming, and find real discounts on groceries and everyday essentials.",
  cta: "Get the free Propel app",
  url: "https://benefitsinsider.co/partners/propel-ebt-app",
  disclosure: "Paid partnership. Propel pays Benefits Insider to sponsor our SNAP content. Propel is a private company; the Propel app is not a government service and is not affiliated with any government agency. Propel never receives your information from this site.",
  active: function (d) { var t = (d || new Date()).toISOString().slice(0, 10); return t >= this.start && t <= this.end; }
};
if (typeof module !== "undefined" && module.exports) module.exports = BISponsor;
