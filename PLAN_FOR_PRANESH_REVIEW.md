# UWC Demo Wireframes + CRM Architecture — Plan for Review

**Prepared:** 27 May 2026 (Wed), 5 days before demo (Mon 1 June, 15:00 BST)
**Author:** Sam Prabhu (drafted with Cowork session on Mac Studio)
**Reviewer needed:** Pranesh — **plan must be approved before any HTML execution**
**Internal review with Paul Whitelock + Dash Bunyan:** w/c 26 May (already in flight per Build Plan v4.1)

---

## 1. What I read (so we agree on starting point)

| Source | Status | Key takeaways for this plan |
|---|---|---|
| `#UWC-27 May.txt` (today's call) | Read | Approach approved by team: **wireframe everything in HTML, one file per scenario A–G**, model data first. Portal binds to **Contact** (not Lead). NCs are a **custom module / Account record type = NC**. Two portals: Student + NC/Committee. Paul to confirm final approach. |
| `Demo and Presentation Session Briefing v1 1.pdf` (UWC's brief) | Read | 7 scenarios A–G locked. 9 user roles defined. 2-hr session: Welcome → Solution Overview → 60-min Scenario Demos → 30-min Delivery Plan → Q&A. 10% of overall evaluation weighting. |
| `Technical Questions Briefing 1.pdf` | Read | **Separate deliverable** — written response on Cybersecurity, DLP, Encryption, API security, MFA/RBAC, Multi-language, GDPR. Not part of this wireframe build, but Akanksha must be ready to discuss live. |
| `5128 - UWC - CRM And Applications Platform - V4.docx` | Catalogued (3.2 MB, V4) | Latest proposal version — Sonia's authoritative solution architecture lives here. Reference for any "what does the platform do" question. |
| `UWC_Demo_Build_Plan_v4.1.docx` | Read (first ~12k chars) | Branding, sample data, 8 user accounts, Blueprint stages, automations all locked. **My build must conform exactly.** |
| `UWC_Demo_Presenter_Guide.docx` | Read (first 6k chars) | Akanksha's screenplay. Each scenario already has a step-by-step narration. The wireframes must let her execute these narrations verbatim. |
| `uwc_full_scenario B_demo.html` (existing, 96 KB) | Read structure | **Visual + technical template for everything I build.** Single-file, vanilla JS, sidebar nav with numbered steps, screen-toggle via `go(i)`. Currently 16 steps + CRM field reference. Covers Sofia's full journey (B+C+D mixed). |
| Consciousness — 10+ stored entries on UWC + A2Z | Queried | Confirms client identity (UWC International), tender ref 5128, prior Scenario 2 architecture recommendation (Zoho CRM + custom portal on AWS London), team roster, A2Z reference (StudyIn). |

**One important observation:** the existing `uwc_full_scenario B_demo.html` is actually a **full-journey** demo, not strictly Scenario B from UWC's brief. Its 16 steps cover registration → form → blueprint → reviewer scoring → nomination → placement, which spans UWC's scenarios B + C + D. **This is the first open question below.**

---

## 2. CRM Architecture (Modules · Fields · Automations · Relationships)

This is the data model the wireframes will mock. Designed to satisfy all 7 scenarios while staying close to the Build Plan v4.1 Blueprint and the StudyIn precedent A2Z is leaning on.

### 2.1 Module map

| # | Module | Type | Purpose | Scenarios using it |
|---|---|---|---|---|
| M1 | **Contact** | Standard (extended) | Single source of truth for every person — applicant, parent, alumnus, donor, volunteer, NC Chair, governance member. Carries role tags over time. | All |
| M2 | **Lead** | Standard | Marketing-qualified inbound only. Auto-converts to Contact on portal registration. | B (Marketing source view), G (campaigns) |
| M3 | **Application** | Custom | One record per applicant per cycle. Holds blueprint stage, scores, decisions, audit. | A, B, C, D |
| M4 | **Programme** | Custom | Per-NC, per-cycle config: deadlines, stages, local questions, place quotas. | A, D |
| M5 | **Account** | Standard, with **record types**: `NC`, `School`, `Donor Org`, `Partner Org` | NCs and schools modelled as Account record types (per call decision, Paul to confirm). | A, D, F |
| M6 | **NC Volunteer** | Custom (junction) | Joins Contact ↔ NC Account with role, tenure, training compliance. | A, F |
| M7 | **Governance Body** | Custom | Boards, committees, advisory groups at international + national level. | E |
| M8 | **Governance Membership** | Custom (junction) | Joins Contact ↔ Governance Body with role, appointment date, term expiry, status. | E |
| M9 | **Competency** | Custom | Reusable list (Finance, Governance, Safeguarding, Climate, etc.). Linked to Governance Body (required) and Contact (held). | E |
| M10 | **Training Record** | Custom | Per-Contact training event (type, completed, expires, status, NC link). | F |
| M11 | **MoU Obligation** | Custom | Per-NC obligation row (type, due, status, document link). | F |
| M12 | **School Place Allocation** | Custom | Per-School per-Cycle quota with remaining count. | D |
| M13 | **Nomination Pack** | Custom | Per-Application pack PDF + status (Sent · Reviewed · Accepted · Declined). | D |
| M14 | **Mailing List** | Custom (saved view + segment) | Targeted segment definition + Mailchimp sync handle. | G |
| M15 | **Campaign** | Standard | Mailchimp campaign mirror, with consent stats and bulk-update audit. | G |
| M16 | **Communication Log** | Custom | Per-Contact outbound record (campaign, channel, sent date, opens, opt-out events). | G |
| M17 | **Consent Record** | Custom | Per-Contact consent state with timestamps + lawful basis. | B (parental consent), G (opt-outs) |
| M18 | **Audit Log** | Native CRM | All record changes, blueprint transitions, unlock reasons. | A, B, C, D (all reference it) |

### 2.2 Application module field plan (the centrepiece — exact from existing scenario B HTML, extended)

Identity + eligibility · Lifecycle · Relationships · Consent + safeguarding · Form responses · Review subform.
Full field-level table will be reproduced as the **appendix screen on each scenario file** so the panel can flick to it. Already proven in the existing B file — keeping the same structure.

### 2.3 Application lifecycle Blueprint (per Build Plan v4.1, locked)

```
Registered → In Progress → Submitted → Under Review → Shortlisted → Nominated → Placed
                                                                                  ↓
                                       Terminals from any stage: Declined · Withdrawn · Waitlisted
```

Gate conditions, who-can-transition, and the 8 automated transition actions are exactly as Priyanka has them in §4.1.2 of Build Plan v4.1. The wireframes will visualise:
- Gate-check alerts (mandatory fields, parental consent, safeguarding open) before each transition
- Audit-log entries showing who-when-why
- Email previews that fire on each transition
- "Blind review unlock" event — the `All_Reviews_Complete = true` flip that reveals scores to NC Admin

### 2.4 Automations to wireframe-demo (separate from Blueprint)

| # | Automation | Trigger | Wireframe shows | Scenario |
|---|---|---|---|---|
| AU1 | Lead→Contact auto-convert on portal registration | Portal account verified | Lead record fades → Contact record appears with portal-user badge | B |
| AU2 | Reviewer assignment notification | NC Admin assigns Application | Reviewer queue + email preview | C |
| AU3 | Blind review unlock | `Review_Count = 2` | Lock icon → unlocked, both score sets visible | C |
| AU4 | Safeguarding flag — lock + alert | Reviewer raises flag | Application locked from progression, red banner, dual email to NC Admin + IO | C |
| AU5 | Nomination pack PDF generation | NC Admin clicks Generate | PDF preview opens with all sections compiled | D |
| AU6 | Training compliance daily scan | Daily cron | Volunteer table re-colours: CURRENT/EXPIRING SOON/EXPIRED | F |
| AU7 | MoU obligation overdue alert | Due-date passed | NC dashboard tile turns red, IO alert | F |
| AU8 | Mailchimp campaign sync | Send button | Mailing list → Mailchimp campaign view + sent count + bulk Communication Log inserts | G |
| AU9 | GDPR right-to-erasure (mentioned in Tech Questions) | IO Super Admin action | Optional bonus screen showing what's removed vs retained | (tech Q if asked) |

### 2.5 Integrations to show

| System | Direction | Shown in | Treatment |
|---|---|---|---|
| Mailchimp | Bidirectional | G | Wireframe of Mailchimp campaign view side-by-side with CRM |
| HubSpot | Inbound source tracking | B (marketing view) | Wireframe of HubSpot source-attribution panel + UTM map |
| Google Drive | Outbound file storage | B (file upload), D (nomination pack) | "File saved to Google Drive" toast + folder structure |
| Raiser's Edge NXT | Reference only | E or G (donor view) | Note on contact card: "Donor record syncs from Raiser's Edge" |
| Business Central | Reference only | D (place allocation cost) | Tile on IO dashboard: "Sent to Business Central #INV-2026-0124" |
| Google Cloud Identity SSO | Login | All portal screens | "Sign in with Google" button on portal entry |

### 2.6 Roles + visibility matrix (matches Build Plan §3)

8 named users, exact same as Akanksha will log in as. Wireframes will render each role's view with the locked-down field-level + record-level security visible (greyed-out fields, "no access" badges, narrower module list).

---

## 3. Wireframe deliverable — file structure + per-scenario screen plan

### 3.1 File layout (proposed)

```
uwc-demo/
├── docs/                          (existing — untouched)
├── wireframes/                    (NEW)
│   ├── _common/
│   │   ├── design-tokens.css      shared :root vars + utility classes
│   │   ├── components.html        annotated component library (cards, pills, alerts, portal frame, field tables)
│   │   └── sample-data.js         single source for Sofia, Ana, Marcus etc.
│   ├── 00_index.html              landing page — picks A–G
│   ├── 01_scenario_A.html         NC Admin · Permissions · Programme Config
│   ├── 02_scenario_B.html         Applicant Registration · Eligibility · Form Submission
│   ├── 03_scenario_C.html         Multi-Stage Selection · Scoring · Safeguarding
│   ├── 04_scenario_D.html         Nomination · Place Allocation · Pack Generation
│   ├── 05_scenario_E.html         Governance Structure · Body Management
│   ├── 06_scenario_F.html         NC Management · Volunteer Oversight
│   ├── 07_scenario_G.html         Communications · Mailing Lists · Bulk Updates
│   └── 99_data_model.html         Full CRM architecture diagram + module/field reference
└── PLAN_FOR_PRANESH_REVIEW.md     (this file)
```

**Design principle:** every scenario file is **fully self-contained** — opens in any browser, no build step, no shared dependency. CSS variables and components are duplicated into each file (with a single source in `_common/` for editing). This protects Akanksha if a file refuses to load on the demo day — she just opens another one.

**The existing `uwc_full_scenario B_demo.html`** is the visual + structural template. I will not rewrite its design — I will lift the design tokens, components, sidebar nav pattern, and `go(i)` step-toggle JS verbatim and re-skin each new scenario around them.

### 3.2 Step plan per scenario

#### Scenario A — NC Admin · Permissions · Programme Configuration (~8 min)
**Login**: Marcus Weber (NC Admin Germany) → switch to Ana Carvalho (NC Admin Brazil) → switch to Data Protection Lead.

| Step | Screen | Notes |
|---|---|---|
| 1 | Login splash — Marcus signs in | Module list shows Germany-only scope |
| 2 | Marcus's home — Germany programme card | Edit deadline / place count / stages / local question inline |
| 3 | NC dashboard — 14 applications, stage colours | Blueprint stage chips, days-to-deadline countdown |
| 4 | User & role management | Create reviewer, senior committee member, second NC Admin |
| 5 | Permission matrix view | Field-level / record-level / module-level toggles |
| 6 | Edit applicant record on their behalf | NC Admin override panel with reason capture |
| 7 | Unlock submitted application | Modal with Unlock Reason → audit log entry preview |
| 8 | Side-by-side: IO Super Admin vs Data Protection Lead view of same Contact | DOB, financial aid, parent contact greyed out |
| 9 | CRM field reference appendix | Same pattern as existing B file |

#### Scenario B — Applicant Registration · Eligibility · Form Submission (~10 min)
**Login**: Public portal → Sofia signs in → switch to IO Marketing.

Use existing `uwc_full_scenario B_demo.html` as the starting point, but **trim** it back to just B's scope (steps 1–9 of the existing file: invite/eligibility/dashboard/form/submission/CRM record). Add the new marketing-source attribution step at the end.

| Step | Screen | Notes |
|---|---|---|
| 1 | Lead record (NC Admin view) — option to invite | Or self-register path |
| 2 | Invitation email | Existing |
| 3 | Portal landing page (UWC branded, Português) | Existing |
| 4 | Eligibility gate — 14-year-old DOB → blocked | Existing |
| 5 | Sign-up → student dashboard, 60% saved | Existing |
| 6 | Application form (Portuguese) | Existing — file upload, essay, dropdown, date |
| 7 | Parental consent capture — Maria Almeida | Existing |
| 8 | Submit + Blueprint gate check | Existing |
| 9 | CRM Application record created | Existing |
| 10 | **NEW** — IO Marketing view: source attribution dashboard | UTM map, social/partner-school/NC-website/direct-search funnel, journey-to-enrolment chart with HubSpot integration panel |
| 11 | CRM field reference appendix | Existing |

#### Scenario C — Multi-Stage Selection · Scoring · Safeguarding
**Login**: Clara Ramos (Reviewer) → Paulo Fonseca (Reviewer) → NC Admin (Ana) → IO Super Admin.

| Step | Screen | Notes |
|---|---|---|
| 1 | Reviewer queue — Clara's assigned applications | Conflict-of-interest declare button |
| 2 | Clara opens Sofia's application — scoring form | 4 dimensions × 1–10, overall recommendation picklist |
| 3 | Clara submits — Paulo's view: scores still hidden | Lock icon, "Awaiting other reviewer" banner |
| 4 | Paulo opens his copy of Sofia's application | Independent scoring form |
| 5 | Paulo submits — automation fires `Review_Count = 2` | `All_Reviews_Complete = true`, scores unlock |
| 6 | NC Admin view: both score sets now visible | Side-by-side comparison panel |
| 7 | Safeguarding flag raised on Miguel Santos | Application locks, red banner, dual email preview (NC Admin + IO) |
| 8 | Safeguarding workflow — flag triage record | Status flow Under Review → Resolved |
| 9 | Panel decision recorded — Sofia → Shortlisted | Stage transition + auto-email to Sofia |
| 10 | CRM field reference appendix | Same |

#### Scenario D — Nomination · Place Allocation · Pack Generation
**Login**: Fatima Al-Rashid (IO Admissions) → Ana (NC Admin) → Helen Richards (School Admissions Director).

| Step | Screen | Notes |
|---|---|---|
| 1 | IO Admissions place-allocation grid | Schools × NCs matrix, remaining quotas (Atlantic 8, RC Nordic 6, Mahindra 4) |
| 2 | Fatima allocates 2 Atlantic places to Brazil NC | Quota decrement + audit |
| 3 | Ana sees Brazil's quota updated | NC dashboard tile refresh |
| 4 | Ana generates nomination pack for Sofia | "Generate Pack" button → spinner → preview |
| 5 | Nomination pack PDF preview | Compiled: application, references, assessments, parental consent receipt |
| 6 | Ana nominates Sofia to Atlantic College, place #4 | Quota auto-decrements |
| 7 | Helen Richards (Atlantic) — incoming nominations list | Pack ready, auto-task due in 5 days |
| 8 | Helen reviews the pack inline + accepts | Stage transition Nominated → Placed |
| 9 | IO view — final placement confirmed, BC notification | "Sent to Business Central #INV-…" tile |
| 10 | Pack status tracking dashboard | Sent / Reviewed / Decision per nomination |
| 11 | CRM field reference appendix | Same |

#### Scenario E — Governance Structure · Body Management
**Login**: IO Super Admin (Akanksha).

| Step | Screen | Notes |
|---|---|---|
| 1 | Governance bodies list view | UWC International Board, Audit Committee, Nominations Committee, Risk Advisory Group |
| 2 | Create new Governance Body — type/purpose/metadata form | Picklist for type (Board/Committee/Advisory) |
| 3 | UWC International Board record — header + member roster | Dame Catherine Prior (Chair), Dr Ravi Menon (Trustee), Sarah Okonkwo (Secretary), Thomas Berger (Trustee), Amina Hassan (Trustee) |
| 4 | Add member workflow — Contact lookup, role, appointment, term | Term expiry calculation |
| 5 | Historical membership view | Expired terms displayed with "Term ended" badge |
| 6 | Competency matrix — required vs covered | Three gaps highlighted: Marketing & Comms, Youth Engagement, Asia-Pac Regional |
| 7 | Network-wide governance summary report | All bodies + member counts + upcoming expiries |
| 8 | CRM field reference appendix | Governance Body + Membership + Competency modules |

#### Scenario F — NC Management · Volunteer Oversight
**Login**: IO Super Admin (Akanksha).

| Step | Screen | Notes |
|---|---|---|
| 1 | NC list view across all 150+ NCs | Health-coloured tiles |
| 2 | UWC Kenya NC record — header + linked governance | Grace Omondi as Chair, country/status/key contacts |
| 3 | Volunteer roster for Kenya | Grace (NC Chair · training CURRENT) · Daniel Kimani (Selection Coordinator · training EXPIRED) · Aisha Waweru (Reviewer · training MISSING) |
| 4 | Open Daniel's training record — expired safeguarding training | Renew workflow |
| 5 | MoU obligations panel for Kenya | Annual Report submitted · Annual Report OVERDUE |
| 6 | IO NC-health dashboard | Active volunteer counts, outstanding MoU items, training compliance per NC |
| 7 | Compliance drill-down — list of NCs with overdue items | Sortable, exportable |
| 8 | CRM field reference appendix | NC Account, NC Volunteer, Training Record, MoU Obligation |

#### Scenario G — Communications · Mailing Lists · Bulk Updates
**Login**: IO Communications staff (uses Akanksha's IO Super Admin login for demo).

| Step | Screen | Notes |
|---|---|---|
| 1 | Mailing list builder — criteria editor | "All donors who have contributed in last 12 months" OR "all NC Chairs" — dynamic preview count |
| 2 | Saved mailing list — 47 donors + 12 NC Chairs | Excludes Marcus Weber (opted out — visible in count delta) |
| 3 | Send via Mailchimp — campaign brief, template preview | Impact Report subject + preheader |
| 4 | Mailchimp campaign view (mocked) — confirmation | Sync icon, recipients confirmed |
| 5 | Send fires → bulk update of Communication Log | Toast: "Recording 59 outbound communications across 59 Contact records" |
| 6 | Open Jonathan Osei's contact — communication history | All outbound shown, with open/click data |
| 7 | Consent & preferences panel on Marcus Weber's record | Opt-out enforced, "excluded from 14 campaigns" tally |
| 8 | GDPR audit screen — consent change log | Timestamps + lawful basis |
| 9 | CRM field reference appendix | Mailing List, Campaign, Communication Log, Consent Record |

### 3.3 Reusable component library (lifted from existing B file)

| Component | Class | Where used |
|---|---|---|
| Sidebar step nav | `.sidebar / .nav-item / .nav-num` | Every scenario |
| Topbar with UWC brand + red DEMO badge | `.topbar / .demo-badge` | Every scenario |
| Card with navy header | `.card / .ch / .cht / .cb` | Every scenario |
| Application stage pills | `.pill / .p-reg / .p-sub / etc.` | A, B, C, D |
| Alerts (warn/ok/info/error) | `.al / .al-w / .al-ok / .al-i / .al-e` | Every scenario |
| Field group (label + value, 2-col grid) | `.fg / .fc / .fl / .fv` | Every CRM record view |
| Portal frame (branded student/NC portal) | `.pframe / .ptb / .pbody` | B, C |
| Stats grid (3-up KPI tiles) | `.sg / .stat / .stn / .stl` | A (dashboard), F (health) |
| Progress tracker / blueprint stages | `.pw / .ptrack / .pfill / .stabs / .stab` | B, C, D |
| Form inputs | `.flabel / .finput / .btn-p / .btn-r / .btn-o` | B, A |
| Email preview card | `.ecard / .eh / .ebody / .ecta` | B, C, D, G |
| List / grid views | `.gl / .gh / .gr` | A, F |
| Field reference table | `.ft / .ft-name / .ft-t / .ft-pick / .ft-look` | Every CRM appendix |
| Timeline entries | `.tli / .tld / .tll / .tla / .tlm` | Audit logs, history |

All vocabulary already exists in the scenario B file. Re-using it gives 7 files that **visually rhyme** — the panel will feel the same product across all scenarios.

### 3.4 What this is NOT

- **Not a real Zoho instance.** Akanksha's narration explicitly says "this is a wireframe; if you want to see live CRM at any point, ask and we'll switch." Build Plan v4.1 also reserves real Zoho work for items that can be configured in 4 days.
- **Not interactive beyond step nav.** Buttons that look real are not wired to APIs. The exception is the existing scenario B file already has form-input affordances — same level of fidelity, no more.
- **Not the Technical Questions response.** That's a separate written doc due 21 May — already overdue if we're at 27 May; flag this with Paul.

---

## 4. Open questions for Pranesh (must resolve before I build)

| # | Question | My recommendation | Needs decision from |
|---|---|---|---|
| Q1 | Existing `uwc_full_scenario B_demo.html` covers B+C+D mixed. **Split it into B-only + new C + new D files**, or **keep it as a "full Sofia journey" overview file + build A, E, F, G new**? | **Split.** UWC's brief gave 7 distinct scenarios; mixing B/C/D in one file makes Akanksha's 60-minute time-boxed scenario walk harder. Lift the existing screens into the new B/C/D files. | Pranesh + Paul |
| Q2 | NCs as **Account record type** vs **dedicated custom module**? Build Plan §2.1 implies they're a record-set; today's call had Dash saying "it's like Accounts, but not customers — affiliated organisations." | **Account record type = "NC"** with portal access via a related-list Membership module. Cleaner than a new module, satisfies the "they're sort of accounts" framing, lets Mailing Lists in G filter naturally. | Pranesh (Dash already implied this) |
| Q3 | Is **Akanksha pre-briefed** that I'm producing all 7 wireframes? Build Plan v4.1 §3 lists her as presenter — she needs the files by Fri 29 May for the internal review with Paul + Dash. | Confirm with Paul that I'm cleared to deliver all 7 by **Thu 28 May EOD** for the internal review the morning of Fri 29 May. | Pranesh → Paul |
| Q4 | The **Technical Questions written response** (Cybersecurity, DLP, encryption, MFA, GDPR, multi-language) was due **Thu 21 May**. Is it submitted? If not, the panel may push it into Q&A on 1 June. | Confirm with Paul. If not submitted, I can draft skeleton answers in parallel to the wireframes — but it's NOT in scope for this work unless you say so. | Pranesh → Paul |
| Q5 | Do you want a **landing page (`00_index.html`)** that lets Akanksha pick A–G with one click, or just deliver 7 standalone files? | Build the index. Costs ~30 min and is a safety net if her tab gets lost mid-demo. | Pranesh |
| Q6 | The Build Plan says **UWC logo** to be downloaded from uwc.org. Do you want me to embed it (will I have file access to a PNG) or use the navy "UWC International" wordmark placeholder per Build Plan §1.2 fallback? | Wordmark placeholder for first draft. Swap to real logo on Fri 29 once Sagar provides it. | Sagar to provide |
| Q7 | **Should I use Zoho's actual visual style** (Zoho CRM nav, colours, density) for the CRM-side screens, or **UWC brand throughout** (as the existing B file does)? Today's call had Sam saying "spoof the CRM screens" with HTML. | **Two visual modes within each file:** UWC-branded for student portal / IO portal screens (already established), **plain Zoho-style** (light grey/blue, dense list views) for the back-office CRM screens. Existing B file actually does this — CRM screens are visually distinct from portal screens. I'll match the same convention. | Pranesh |
| Q8 | **Hosting / preview** — do you want these as static files Pranesh opens locally, or pushed to a GitHub Pages on `PraneshSubramani/uwc-demo` so Akanksha + Paul can preview from anywhere? | Push to a `gh-pages` branch on the same repo. Static HTML deploys in seconds. Gives Paul + Dash a URL for the internal review on 29 May. | Pranesh |
| Q9 | The **CRM data-model file (`99_data_model.html`)** — do you want it as a separate file with module diagrams + complete field reference, or absorbed into each scenario's appendix only? | Build it separately AND keep per-scenario field appendices. Standalone file is the "back-office reference" — if the panel asks an architecture question, Akanksha opens this file. | Pranesh |

---

## 5. Sequencing — what happens after you approve

Assuming approval by EOD Wed 27 May:

| Day | Output | Done by |
|---|---|---|
| Wed 27 May (today, after approval) | `00_index.html` + `99_data_model.html` skeleton + `_common/design-tokens.css` extracted | Sam |
| Thu 28 May AM | `01_scenario_A.html` + `02_scenario_B.html` (B split from existing file) | Sam |
| Thu 28 May PM | `03_scenario_C.html` + `04_scenario_D.html` (C/D split from existing file + extended) | Sam |
| Fri 29 May AM | `05_scenario_E.html` + `06_scenario_F.html` | Sam |
| Fri 29 May lunchtime | `07_scenario_G.html` + `99_data_model.html` finalised | Sam |
| Fri 29 May PM | Internal review with Paul + Dash · fixes captured | Team |
| Sat 30 / Sun 31 May | Fix list applied, push to `gh-pages` | Sam |
| Mon 1 June 14:30 | Akanksha's setup window — tab pre-loading per Presenter Guide | Akanksha |
| Mon 1 June 15:00 | Live demo | Akanksha + Paul |

Parallel: any items that can be built **in real Zoho** rather than wireframe (Build Plan v4.1 strategy) — Sagar/Priyanka own that workstream.

---

## 6. Acceptance check before I write a single line of HTML

- [ ] Q1 (split vs full-journey) — decided
- [ ] Q2 (NC modelling) — decided
- [ ] Q7 (visual style) — decided
- [ ] Q8 (hosting target) — decided
- [ ] Q9 (data-model file) — decided
- [ ] Q3 + Q4 (Akanksha brief + tech-questions response) — escalated to Paul if needed
- [ ] Logo + sample data assets — Sagar confirms availability for Fri 29 AM

Once any 5 of the 9 questions are answered (or marked "decide as you go"), I have enough to start the index file and Scenario A. Will not touch the existing scenario B HTML file until Q1 is resolved.

— Plan ends —
