/* mysnapcheck.org — the groups and the yearly checklist.
   ONE source of truth, used by the page and by the sign-up function (the email).
   Rules verified Oct 5, 2026 against fns.usda.gov (work requirements, OBBB implementation memos,
   FY2027 COLA tables) and 7 CFR 273.10 / 273.12. Re-run the audit pack after ANY change. */
var BISnap = (function(){
  var GROUPS = {
    1: {n:1, name:"Age 60 and older", tl:false, why:"Federal rules excuse anyone 60 or older from the general work requirements, and that also excuses you from the time limit. The 2025 law raised the time-limit age to 64, so confirm your status with your state."},
    2: {n:2, name:"Age 55 to 59, no exemption", tl:true, why:"This is new. Before the 2025 law, the time limit stopped at age 54. It now runs to 64. If no exemption applies to you, you must meet the work rule or you get 3 months of benefits in a 36-month period."},
    3: {n:3, name:"Age 18 to 54, no exemption", tl:true, why:"You were already under the time limit. The 2025 law narrowed the exemptions, so check whether one still applies to you."},
    4: {n:4, name:"Parent or caretaker of a child under 14", tl:false, why:"Having a child under 14 in your SNAP household excuses you from the time limit. That age used to be 18. The month your youngest turns 14, the time limit can apply to you unless another exemption does."},
    5: {n:5, name:"Disability, caregiver, or pregnant", tl:false, why:"You are excused from the work rules if you cannot work because of a physical or mental limitation, you are pregnant, or you care for a child under 6 or for someone who cannot care for themselves. Your job is keeping the paperwork current."},
    6: {n:6, name:"Veteran, experiencing homelessness, or former foster youth", tl:true, why:"The 2025 law removed the automatic exemptions for veterans, people experiencing homelessness, and people age 24 or younger who were in foster care at 18. Unless another exemption applies, you are now under the time limit."},
    7: {n:7, name:"Member of a federally recognized tribe", tl:false, why:"The 2025 law added an exemption from the time limit for people defined as an Indian, Urban Indian, or California Indian under the Indian Health Care Improvement Act. Your state office needs to know you qualify."},
    8: {n:8, name:"Student, in treatment, or already working 30+ hours", tl:false, why:"Studying at least half-time, taking part regularly in an alcohol or drug treatment program, or working at least 30 hours a week (or earning the equivalent of 30 hours at federal minimum wage) excuses you from the general work requirements, and that excuses you from the time limit. The day that stops, the rules can change for you."}
  };
  function assign(a){
    if (a.age === "65" || a.age === "60") return 1;
    if (a.limit === "y") return 5;
    if (a.child === "u14") return 4;
    var s = a.sit || [];
    if (s.indexOf("tribe") >= 0) return 7;
    if (s.indexOf("student") >= 0 || s.indexOf("treatment") >= 0 || s.indexOf("work30") >= 0) return 8;
    if (s.indexOf("vet") >= 0 || s.indexOf("homeless") >= 0 || s.indexOf("foster") >= 0) return 6;
    return a.age === "55" ? 2 : 3;
  }
  var GROSS = {1:"$1,729",2:"$2,345",3:"$2,960",4:"$3,575",5:"$4,191",6:"$4,806",7:"$5,421",8:"$6,037"};
  function build(a){
    var g = GROUPS[assign(a)], G = [], warn = null, sit = a.sit || [], tl = g.tl || a.child === "teen" && g.n !== 1 && g.n !== 5 && g.n !== 7 && g.n !== 8;
    var status = a.status || "have";

    if (status === "cut") warn = {t:"You were cut off. Do this first.",
      p:"Benefits end for reasons that can be fixed: a missed letter, a missed interview, a report that never arrived, or a work-rule month that was counted wrong.",
      items:["<b>Ask your SNAP office, in writing, exactly why your case closed.</b> You have a right to the reason and to see your file.",
             "<b>If the reason is wrong, ask for a fair hearing.</b> Do it quickly; the deadline to ask runs from the date on your notice and is set by your state. Ask whether your benefits can continue while you wait.",
             "<b>If the reason is a missed step, fix it and reapply the same day.</b> You do not have to wait for a new year.",
             "<b>If you were told you make too much,</b> the income limits moved on October 1. Reapply."]};

    G.push({t:"Your group: " + g.n + ". " + g.name, items:["<b>Why you are in this group.</b> " + g.why]});

    if (tl) {
      var w = ["<b>Meet 80 hours a month.</b> Work for pay, work in exchange for something other than money, volunteer, take part in a work program such as SNAP Employment and Training, or any combination that adds up to 80 hours. Workfare counts for the hours your state assigns.",
               "<b>Know the limit.</b> If you do not meet the 80 hours, you can get only 3 months of SNAP in a 36-month period.",
               "<b>Report it when your hours drop.</b> If your work hours fall below 20 a week, averaged over the month, you must tell your office. The usual deadline is 10 days after the end of that month.",
               "<b>Keep proof of your hours:</b> pay stubs, a letter from where you volunteer, or sign-in sheets from a work program.",
               "<b>Lost benefits under the time limit?</b> You can get SNAP again after you meet the 80 hours for a 30-day period, or if you become excused.",
               "<b>Ask about exemptions and exceptions.</b> A physical or mental limitation, pregnancy, caring for someone who cannot care for themselves, a child under 14 in your household, or tribal membership can excuse you. Your state also has a small number of exemptions it can grant at its discretion, and some areas have time-limit waivers. Ask."];
      if (a.child === "teen") w.unshift("<b>Your youngest child is 14 to 17.</b> The exemption for parents now stops at 14, so the time limit applies to you unless another exemption does.");
      if (g.n === 6) {
        if (sit.indexOf("vet") >= 0) w.push("<b>Veterans:</b> if you receive VA disability compensation or cannot work because of a service-connected condition, ask whether you qualify as unable to work. That exemption still exists.");
        if (sit.indexOf("homeless") >= 0) w.push("<b>Without a fixed address:</b> give the office a mailing address you can check, such as a shelter, a relative, or general delivery at the post office. Missed mail is how cases close.");
      }
      G.push({t:"The work rule and the time limit", items:w});
    }

    if (g.n === 1) G.push({t:"Rules that work in your favor at 60 and older", items:[
      "<b>No gross-income test.</b> A household with a member who is 60 or older or disabled only has to pass the net-income test.",
      "<b>Medical costs count.</b> Out-of-pocket medical expenses over $35 a month for the member who is 60 or older or disabled lower your countable income. Keep receipts and pharmacy printouts and report them.",
      "<b>Your shelter deduction has no cap.</b> For other households it stops at $769 a month.",
      "<b>Higher asset limit:</b> $4,750 for your household, against $3,000 for others. Your home and most retirement accounts do not count.",
      "<b>Longer certification.</b> If every adult in your household is 60 or older or disabled, your state can certify you for up to 24 months instead of 12."]});
    if (g.n === 5) G.push({t:"Keeping your exemption on file", items:[
      "<b>Keep the proof current.</b> A doctor's statement, a disability award letter, or proof that the person you care for cannot care for themselves. Ask your office what they accept and when it expires.",
      "<b>If you receive disability benefits</b> (SSDI, SSI, VA disability, or others your state recognizes), say so on every form. It can also qualify you for the medical expense deduction and the higher asset limit.",
      "<b>Pregnant:</b> tell your office. The exemption applies while you are pregnant; a child under 6 then excuses you from the general work requirements."]});
    if (g.n === 4) G.push({t:"Because you have a child under 14", items:[
      "<b>Mark your youngest child's 14th birthday.</b> That month the time limit can apply to you unless another exemption does. Plan the 80 hours, or the exemption, before then.",
      "<b>A child under 6</b> also excuses you from the general work requirements.",
      "<b>Report household changes:</b> a child moving in or out changes both your benefit and your exemption."]});
    if (g.n === 7) G.push({t:"Your tribal exemption", items:[
      "<b>Tell your office and bring documentation</b> of tribal membership or eligibility under the Indian Health Care Improvement Act. The exemption is new, and caseworkers may not ask.",
      "<b>The general work requirements still apply</b> if you are 16 to 59 and able to work, unless another exemption covers you."]});
    if (g.n === 8) G.push({t:"What keeps you excused", items:[
      sit.indexOf("work30") >= 0 ? "<b>Working 30 or more hours a week,</b> or earning at least the federal minimum wage times 30 hours, excuses you. If your hours drop, tell your office within 10 days after the end of that month." : "",
      sit.indexOf("student") >= 0 ? "<b>Students:</b> you must be enrolled at least half-time. College students also have their own eligibility rules; ask your office which ones apply." : "",
      sit.indexOf("treatment") >= 0 ? "<b>Treatment:</b> the program must be one you take part in regularly. Keep a letter from the program." : "",
      "<b>Keep proof</b> and expect to show it at recertification."].filter(Boolean)});

    G.push({t:"1. Income updates", items:[
      "<b>Know your reporting type.</b> Most households are on simplified reporting: you must report only when your gross monthly income goes over the limit for your household size. Change-reporting households must report more, including a new job, a job ending, or a change of more than $100 in unearned income, within 10 days.",
      "<b>The gross limit for your household size</b> (48 states and D.C., Oct 1, 2026 to Sept 30, 2027): 1 person " + GROSS[1] + " · 2 " + GROSS[2] + " · 3 " + GROSS[3] + " · 4 " + GROSS[4] + " · 5 " + GROSS[5] + ". Larger households, Alaska and Hawaii are different.",
      "<b>Report lottery or gambling winnings</b> above the threshold your state uses. That one applies to everyone.",
      "<b>Underreporting costs more than it saves.</b> Overpayments are collected back, and states now face federal penalties for error rates, so they check."]});
    G.push({t:"2. Recertification", items:[
      "<b>Find your certification end date.</b> It is on your approval notice. Most households are certified for up to 12 months; households where every adult is 60 or older or disabled can get up to 24.",
      "<b>Watch for the notice of expiration</b> before that date. If you have moved, it goes to your old address.",
      "<b>Return the recertification application by the 15th of your last month.</b> Your state must then decide before your current period ends, which avoids a gap.",
      "<b>Miss it and benefits stop.</b> You can reapply, but there can be weeks with nothing on the card."]});
    G.push({t:"3. The periodic report", items:[
      g.n === 1 ? "<b>If every adult in your household is 60 or older or disabled and nobody has earned income,</b> you do not file periodic reports on a 12-month certification. On a 13-to-24-month certification you file one a year."
                : "<b>Many households must send a short report partway through the year,</b> usually between months 4 and 6. It asks whether anything changed.",
      "<b>Send it back even if nothing changed.</b> A missing report closes the case."]});
    G.push({t:"4. The interview", items:[
      g.n === 1 ? "<b>Expect an interview at recertification.</b> On a 24-month certification, no interview is required in the middle. Your state must still contact you at least once every 12 months."
                : "<b>Expect at least one interview every 12 months.</b> It can be by phone or in person, depending on your state.",
      "<b>Have ready:</b> ID, proof of income for everyone in the household, rent or mortgage and utility bills, medical bills if someone is 60 or older or disabled, and proof of any exemption.",
      "<b>Missed the call?</b> Call back the same week. A missed interview is a denial, and it is one of the easiest to fix."]});
    G.push({t:"5. Address, household and contact changes", items:[
      "<b>Tell your office when you move,</b> even if your reporting type does not require it right away. Benefits end most often because a letter went to the wrong address.",
      "<b>Report people moving in or out</b> of your household. It changes your benefit, and it can change your exemption.",
      "<b>Keep a phone number and email on file</b> that you check. Many states now send interview calls and reminders that way."]});
    G.push({t:"Every year", items:[
      "<b>October 1:</b> maximum benefits, income limits and deductions change. If you were ever told you make too much, that number has moved.",
      "<b>Write down every contact:</b> the date, the name, what you were told, and any case or reference number.",
      "<b>Your state SNAP office is the only one who can confirm your exact rules.</b> Find it through the USDA state directory, or call the SNAP information line at 1-800-221-5689."]});
    return {group:g, warn:warn, groups:G};
  }
  return {GROUPS:GROUPS, assign:assign, build:build};
})();
if (typeof module !== "undefined" && module.exports) module.exports = BISnap;
