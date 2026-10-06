/* mysnapcheck.org — the groups and the yearly checklist.
   ONE source of truth, used by the page and by the sign-up function (the email).
   Rules verified Oct 5-6, 2026 against: FNS OBBB ABAWD Exceptions Implementation Memo (Oct 3, 2025);
   FNS OBBB Time Limit Changes Q&A #1 (June 11, 2026: ages 60-64 ARE under the time limit, Q4);
   FNS FY2027 COLA memo (Aug 21, 2026); 7 CFR 271.2, 273.2, 273.7, 273.11, 273.12, 273.14, 273.15, 273.24.
   Outside cross-check (ChatGPT + Gemini) settled Oct 6, 2026; see AUDIT-LOG.md. Re-run the pack after ANY change. */
var BISnap = (function(){
  var GROUPS = {
    1: {n:1, name:"Age 65 and older", tl:false, why:"The time limit now runs through age 64, so at 65 you are outside it. You are also excused from the general work requirements, and the rules below for people 60 and older work in your favor."},
    2: {n:2, name:"Age 55 to 64, no exemption", tl:true, why:"This is new. Before the Big Beautiful Bill, the time limit stopped at age 54. It now runs through 64. If no exception applies to you, you must meet the work rule or you get 3 months of benefits in a 36-month period. At 60 to 64 you are still excused from the general work requirements, and your state cannot make you join a work program, but USDA has confirmed the time limit applies to you unless another exception does."},
    3: {n:3, name:"Age 18 to 54, no exemption", tl:true, why:"You were already under the time limit. The Big Beautiful Bill narrowed the exemptions, so check whether one still applies to you."},
    4: {n:4, name:"Parent or caretaker of a child under 14", tl:false, why:"Having a child under 14 in your SNAP household excuses you from the time limit. That age used to be 18. The month your youngest turns 14, the time limit can apply to you unless another exemption does."},
    5: {n:5, name:"Disability, caregiver, or pregnant", tl:false, why:"You are excused from the time limit if you cannot work because of a physical or mental limitation, you are pregnant, or you care for a child under 6 or for someone who cannot care for themselves. A limitation or caregiving also excuses you from the general work requirements; pregnancy on its own excuses you from the time limit only. Your job is keeping the paperwork current."},
    6: {n:6, name:"Veteran, experiencing homelessness, or former foster youth", tl:true, why:"The Big Beautiful Bill removed the automatic exemptions for veterans, people experiencing homelessness, and people age 24 or younger who were in foster care at 18. Unless another exemption applies, you are now under the time limit."},
    7: {n:7, name:"Member of a federally recognized tribe", tl:false, why:"The Big Beautiful Bill added an exemption from the time limit for people defined as an Indian, Urban Indian, or California Indian under the Indian Health Care Improvement Act. Your state office needs to know you qualify."},
    8: {n:8, name:"Student, in treatment, or already working 30+ hours", tl:false, why:"Studying at least half-time, taking part regularly in an alcohol or drug treatment program, or working at least 30 hours a week (or earning the equivalent of 30 hours at federal minimum wage) excuses you from the general work requirements, and that excuses you from the time limit. The day that stops, the rules can change for you."}
  };
  function assign(a){
    if (a.age === "65") return 1;
    if (a.limit === "y") return 5;
    if (a.child === "u14") return 4;
    var s = a.sit || [];
    if (s.indexOf("tribe") >= 0) return 7;
    if (s.indexOf("student") >= 0 || s.indexOf("treatment") >= 0 || s.indexOf("work30") >= 0) return 8;
    if (s.indexOf("vet") >= 0 || s.indexOf("homeless") >= 0 || s.indexOf("foster") >= 0) return 6;
    return (a.age === "55" || a.age === "60") ? 2 : 3;
  }
  var GROSS = {1:"$1,729",2:"$2,345",3:"$2,960",4:"$3,575",5:"$4,191",6:"$4,806",7:"$5,421",8:"$6,037"};
  function build(a){
    var g = GROUPS[assign(a)], G = [], warn = null, sit = a.sit || [], tl = g.tl || a.child === "teen" && g.n !== 1 && g.n !== 5 && g.n !== 7 && g.n !== 8;
    var status = a.status || "have", elderly = a.age === "60" || a.age === "65";

    if (status === "cut") warn = {t:"You were cut off. Do this first.",
      p:"Benefits end for reasons that can be fixed: a missed letter, a missed interview, a report that never arrived, or a work-rule month that was counted wrong.",
      items:["<b>Ask your SNAP office, in writing, exactly why your case closed.</b> You have a right to the reason and to see your file.",
             "<b>If the reason is wrong, ask for a fair hearing.</b> You can ask about any action taken in the last 90 days. If you ask before the date on your notice of adverse action (usually within 10 days), your benefits can continue while you wait.",
             "<b>If the reason is a missed step, fix it and reapply the same day.</b> You do not have to wait for a new year. If the reason is the time limit or a sanction, you also have to clear that (see your checklist).",
             "<b>If you were told you make too much,</b> the income limits moved on October 1. Reapply."]};

    G.push({t:"Your group: " + g.n + ". " + g.name, items:["<b>Why you are in this group.</b> " + g.why]});

    if (tl) {
      var w = ["<b>Meet 80 hours a month.</b> Work for pay, work in exchange for something other than money, volunteer, take part in a work program such as SNAP Employment and Training, or any combination that adds up to 80 hours. Workfare counts for the hours your state assigns.",
               "<b>Know the limit.</b> If you do not meet the 80 hours, you can get only 3 months of SNAP in a 36-month period, unless your area has a waiver or your state grants you one of its few discretionary exemptions. A new 36-month period brings a new 3 months.",
               "<b>Report it when your hours drop.</b> If your work hours fall below 20 a week, averaged over the month, you must tell your office. On simplified reporting the deadline is 10 days after the end of that month; on change reporting your state sets a 10-day rule.",
               "<b>Keep proof of your hours:</b> pay stubs, a letter from where you volunteer, or sign-in sheets from a work program.",
               "<b>Lost benefits under the time limit?</b> You can get SNAP again after you meet the 80 hours for a 30-day period, or if you become excused.",
               "<b>Ask about exemptions and exceptions.</b> A physical or mental limitation, pregnancy, caring for someone who cannot care for themselves, a child under 14 in your household, or tribal membership can excuse you. Your state also has a small number of exemptions it can grant at its discretion, and some areas have time-limit waivers. Ask."];
      if (a.child === "teen") w.unshift("<b>Your youngest child is 14 to 17.</b> The exception for parents now stops at 14, so the time limit applies to you unless another exception does. Your state must screen you for every other exception before it counts a month.");
      if (a.age === "60") w.unshift("<b>At 60 to 64:</b> you are excused from the general work requirements and cannot be required to join a work program, but USDA confirmed in June 2026 that the time limit still applies unless another exception does. Social Security retirement alone is not an exception; SSDI or SSI is.");
      if (g.n === 6) {
        if (sit.indexOf("vet") >= 0) w.push("<b>Veterans:</b> if you cannot work because of a physical or mental condition, service-connected or not, ask to be screened as unable to work. That exception still exists.");
        if (sit.indexOf("homeless") >= 0) w.push("<b>Without a fixed address:</b> give the office a mailing address you can check, such as a shelter, a relative, or general delivery at the post office. SNAP cannot require a fixed address, but a notice you never see can close your case.");
      }
      G.push({t:"The work rule and the time limit", items:w});
    }

    if (elderly) G.push({t:"Rules that work in your favor at 60 and older", items:[
      "<b>No gross-income test.</b> A household with a member who is 60 or older or disabled only has to pass the net-income test.",
      "<b>Medical costs count.</b> Unreimbursed medical expenses over $35 a month for the member who is 60 or older or disabled lower your countable income. Keep receipts and pharmacy printouts and report them.",
      "<b>Your shelter deduction has no cap.</b> For other households in the 48 states and D.C. it stops at $769 a month.",
      "<b>Higher asset limit:</b> $4,750 for your household, against $3,000 for others. Your home and most retirement accounts do not count, and many states skip the asset test altogether. Ask.",
      "<b>No work program can be required of you.</b> At 60 or older you are excused from the general work requirements, so your state cannot make you join Employment and Training.",
      "<b>Longer certification.</b> If every adult in your household is 60 or older or disabled, your state can certify you for up to 24 months instead of 12."]});
    if (g.n === 5) G.push({t:"Keeping your exemption on file", items:[
      "<b>Keep the proof current.</b> A doctor's statement, a disability award letter, or proof that the person you care for cannot care for themselves. Ask your office what they accept and when it expires.",
      "<b>If you receive disability benefits,</b> say so on every form. SSDI, SSI, and a VA disability rated or paid as total (or VA aid and attendance or housebound status) also qualify your household for the medical expense deduction and the higher asset limit.",
      "<b>Pregnant:</b> tell your office. The exemption applies while you are pregnant; a child under 6 then excuses you from the general work requirements."]});
    if (g.n === 4) G.push({t:"Because you have a child under 14", items:[
      "<b>Mark your youngest child's 14th birthday.</b> From then on the time limit can apply to you unless another exception does. Your state must screen you for every other exception before it counts a month. Plan the 80 hours, or the exception, before then.",
      "<b>A child under 6</b> also excuses you from the general work requirements.",
      "<b>Report household changes:</b> a child moving in or out changes both your benefit and your exception. The deadline depends on your reporting type (below)."]});
    if (g.n === 7) G.push({t:"Your tribal exemption", items:[
      "<b>Tell your office and bring documentation.</b> USDA lists examples: a tribal enrollment card, a Certificate of Degree of Indian Blood card, or an Indian Health Service eligibility letter. Other proof can work too. The exception is new, and caseworkers may not ask.",
      "<b>The general work requirements still apply</b> if you are 16 to 59 and able to work, unless another exemption covers you."]});
    if (g.n === 8) G.push({t:"What keeps you excused", items:[
      sit.indexOf("work30") >= 0 ? "<b>Working 30 or more hours a week,</b> or earning at least the federal minimum wage times 30 hours, excuses you. If you drop under 30 hours, that exemption ends and the time limit can apply. The change you must report under simplified reporting is hours under 20 a week averaged over the month, within 10 days after the end of that month." : "",
      sit.indexOf("student") >= 0 ? "<b>Students:</b> you must be enrolled at least half-time. College students also have their own eligibility rules; ask your office which ones apply." : "",
      sit.indexOf("treatment") >= 0 ? "<b>Treatment:</b> the program must be one you take part in regularly. Keep a letter from the program." : "",
      "<b>Keep proof.</b> You may be asked for it at recertification or if anything looks questionable."].filter(Boolean)});

    G.push({t:"1. Income updates", items:[
      "<b>Know your reporting type.</b> Most households are on simplified reporting: you must report when your gross monthly income goes over the limit for your household size, when hours drop under 20 a week if the time limit applies to you, or when someone wins substantial lottery or gambling money. Change-reporting households must report more, including a new job, a job ending, or a change of more than $150 a month in unearned income, within 10 days.",
      "<b>The gross limit for your household size</b> (48 states and D.C., Oct 1, 2026 to Sept 30, 2027): 1 person " + GROSS[1] + " · 2 " + GROSS[2] + " · 3 " + GROSS[3] + " · 4 " + GROSS[4] + " · 5 " + GROSS[5] + ". Larger households, Alaska and Hawaii are different.",
      "<b>Report lottery or gambling winnings</b> of $4,750 or more from a single game. That is a federal rule, and it applies to every household.",
      "<b>Underreporting costs more than it saves.</b> Overpayments are collected back, and states answer to USDA for their error rates, so they check."]});
    G.push({t:"2. Recertification", items:[
      "<b>Find your certification end date.</b> It is on your approval notice. Most households are certified for up to 12 months; households where every adult is 60 or older or disabled can get up to 24.",
      "<b>Watch for the notice of expiration</b> before that date. If you have moved and not told the office, it goes to your old address.",
      "<b>Return the recertification application by the 15th of your last month,</b> and finish the interview and any proof they ask for. Then your state must decide before your current period ends, which avoids a gap.",
      "<b>Miss it and benefits stop.</b> If you file within 30 days after your period ends it is still handled as a recertification, but there can be weeks with nothing on the card."]});
    G.push({t:"3. The periodic report", items:[
      elderly ? "<b>If every adult in your household is 60 or older or disabled and nobody has earned income,</b> you do not file periodic reports on a 12-month certification. On a 13-to-24-month certification you file one a year."
                : "<b>Many households must send a short report partway through the year,</b> usually between months 4 and 6. It asks whether anything changed.",
      "<b>Send it back even if nothing changed.</b> If it is missing, your state must send a reminder giving you 10 days. After that the case closes."]});
    G.push({t:"4. The interview", items:[
      elderly ? "<b>Expect an interview at recertification.</b> On a 24-month certification, no interview is required in the middle. Your state must still contact you at least once every 12 months."
                : "<b>Expect an interview at recertification,</b> usually at least once every 12 months. It can be by phone or in person, and your state can waive it in some cases.",
      "<b>Have ready:</b> ID, proof of income for everyone in the household, rent or mortgage and utility bills, medical bills if someone is 60 or older or disabled, and proof of any exception. You may not need all of it, and the office cannot insist on one specific document if other proof works.",
      "<b>Missed the call?</b> Contact the office right away to reschedule. They must send you a notice of the missed interview, and rescheduling is on you. If it is not done by the 30th day, the application is denied."]});
    G.push({t:"5. Address, household and contact changes", items:[
      "<b>Tell your office when you move,</b> even if your reporting type does not require it right away. A notice you never see can close your case.",
      "<b>Report people moving in or out</b> of your household on your reporting type's schedule. It changes your benefit, and it can change your exception.",
      "<b>Keep a phone number and email on file</b> that you check. Interviews are often by phone, and some states send reminders by text or email."]});
    G.push({t:"Every year", items:[
      "<b>October 1:</b> maximum benefits, income limits and deductions change. If you were ever told you make too much, that number has moved.",
      "<b>Write down every contact:</b> the date, the name, what you were told, and any case or reference number.",
      "<b>Your state SNAP office decides your case</b> and sets the state options. Find it through the USDA state directory, or call the SNAP information line at 1-800-221-5689."]});
    return {group:g, warn:warn, groups:G};
  }
  return {GROUPS:GROUPS, assign:assign, build:build};
})();
if (typeof module !== "undefined" && module.exports) module.exports = BISnap;
