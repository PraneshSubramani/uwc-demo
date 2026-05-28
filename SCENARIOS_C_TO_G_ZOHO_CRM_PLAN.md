# UWC Demo — Scenarios C, D, E, F, G — Zoho CRM Configuration Plan

**For:** Pranesh (Sam Prabhu) / Sagar / Priyanka — A2Z Cloud build team
**Author:** Sam Prabhu (drafted in plan mode 2026‑05‑28, Thu late afternoon)
**Demo:** Mon 1 June 2026, 15:00–17:00 BST · video conference · presenter Akanksha Anand
**Internal review:** Fri 29 May AM · Paul Whitelock + Dash Bunyan
**Build window remaining:** Thu 28 (evening) → Fri 29 EOD (≈ 14 productive hours)
**Org:** `20114943111` on `crm.zoho.eu` · admin `uwc_admin@a2zcloud.eu.com`
**Supersedes for C–G:** the wireframe‑centric §3.4 of `CRM_ARCHITECTURE_DELTA.md`. Scenarios A + B keep their HTML wireframes (already built). C–G now move into real Zoho.

---

## 0 — Strategic context (read this first)

### 0.1 What changed
Client (Akanksha / UWC International) has confirmed they do **not need wireframes for C–G**. They want the corresponding modules, layouts, fields, workflows and sample records configured in the live Zoho org, and the demo run inside the CRM. Wireframes A + B remain, since the applicant portal and IO marketing analytics genuinely cannot be configured inside CRM (they're separate Catalyst/Mailchimp surfaces).

### 0.2 Demo proportion shift
| Slot | Old (per BUILD_DECISIONS_v4) | New (this plan) |
|---|---|---|
| Scenario A — NC Admin / Permissions / Programme Config | wireframe + live cameo | wireframe stays (already built, Pranesh approved) |
| Scenario B — Applicant Registration / Eligibility / Form | wireframe primary | wireframe stays (portal not in CRM) |
| **Scenario C — Selection / Scoring / Safeguarding** | 70% wireframe | **100% live Zoho** |
| **Scenario D — Nomination / Place Allocation / Pack** | 85% wireframe | **100% live Zoho** (BC sync = simulated stub) |
| **Scenario E — Governance / Body Management** | 75% wireframe | **100% live Zoho** |
| **Scenario F — NC Management / Volunteer Oversight** | 80% wireframe | **100% live Zoho** (NC Chair portal = link to Zoho Sign‑in URL) |
| **Scenario G — Comms / Mailing Lists / Bulk Updates** | 85% wireframe | **100% live Zoho** (Mailchimp = real Marketplace extension or visual stub on Campaigns) |

### 0.3 Hard blockers (must be resolved before any build can start)
Lifted directly from `CRM_ARCHITECTURE_DELTA.md §4.1`. These remain P0 — every scenario below assumes both are resolved.

| # | Blocker | Owner | How to fix |
|---|---|---|---|
| **B‑1** | `uwc_admin` cannot reach `Setup` (Modules and Fields, Blueprints, Workflows, Roles) | Pranesh / Paul Whitelock | Promote uwc_admin profile to **Super Administrator** OR provide a separate Super‑Admin login Sagar can use during build. Without this, none of §1–§5 below is possible. |
| **B‑2** | `Accounts` module returns *Permission Denied* to uwc_admin | Same | Either enable Accounts at org level + grant profile access, OR confirm the NC‑Account + School‑Account record types stay in custom modules per §1.1 below. **This plan goes custom‑modules** (recommended), so B‑2 is downgraded to "nice to have". |

### 0.4 Decisions locked in this plan (binding unless Pranesh overrides)
1. **No new users created.** Single `uwc_admin` POV throughout. Role differentiation in C–G shown via **Field‑Level Security + Layout Rules + Permission Profiles** — Akanksha narrates "this is what Clara sees" by toggling profile via `Setup → Users → Switch User` (or via a pre‑seeded 2nd browser tab logged in as a constrained profile if Pranesh/Paul approves one extra user for blind‑review proof).
2. **NCs and Schools = custom modules** (not Accounts record types) — sidesteps blocker B‑2 entirely and matches `BUILD_DECISIONS_v4 §1 L2`.
3. **Applications module = the existing renamed Potentials.** No rebuild. Blueprint added on top per `BLUEPRINT_AND_WORKFLOW_SPEC.md`.
4. **Business Central sync** in Scenario D = **Deluge stub** that logs "Sent to BC #INV‑2026‑000041" to a custom field. No real integration.
5. **Mailchimp** in Scenario G = either the official Mailchimp for Zoho CRM marketplace extension (if EU DC supported — Sagar verifies) OR a Deluge function that emits `Mailchimp Campaign ID = MC‑demo‑{auto}` and toasts "Synced to Mailchimp". Lean **stub** to derisk demo day.
6. **NC Chair portal (Scenario F step 5–6)** = real Zoho CRM login as a constrained profile Grace, OR a one‑off Zoho Portal user with a Portal Profile that exposes only NC Volunteer + MoU Obligation list. Sagar picks lower‑risk option Fri morning.
7. **GDPR opt‑out proof (Scenario G)** = real Workflow Rule that blocks email send and a real `Communication Log` record with "BLOCKED (opted out)" status. Marcus's consent record is seeded with `Consent_Change = Opted Out`.

### 0.5 What the panel will actually see in CRM (single‑sentence summary)
Akanksha opens the live Zoho CRM, navigates the **Applications** Kanban (10‑stage Blueprint from `BLUEPRINT_AND_WORKFLOW_SPEC.md`), then drills into **Safeguarding Cases** (C), **Place Allocations + Nomination Packs** (D), **Governance Bodies + Memberships + Competencies** (E), **National Committees + NC Volunteers + Training Records + MoU Obligations** (F), and **Mailing Lists + Campaigns + Communication Log + Consent Records** (G) — each with real records, real workflows firing, real role‑gated visibility.

---

## 1 — Master module build list (consolidated across C–G)

Build these in this order (each one is the dependency of the next). Times assume Setup access is unblocked.

| # | Module | API name | Scenarios | Effort | Depends on |
|---|---|---|---|---|---|
| M‑1 | National Committees (custom) | `National_Committees` | A, D, F | 0.5h + 30m sample | — |
| M‑2 | Schools (custom) | `Schools` | A, D | 0.5h + 30m sample | — |
| M‑3 | Programmes (rename of Products, already exists, empty) | `Products` | A, D | 30m fields + 30m sample | M‑1 |
| M‑4 | Applications Blueprint upgrade (10 stages + 8 WRs + 6 Deluge fns) | `Deals` | A, B, C, D | 4h | M‑1, M‑3 (sample data only) |
| M‑5 | Review Scores subform on Applications | `Review_Scores` (subform) | **C** | 30m | M‑4 |
| M‑6 | Safeguarding Cases (custom) | `Safeguarding_Cases` | **C** | 1h + Blueprint 30m | M‑4 |
| M‑7 | School Place Allocations (custom) | `School_Place_Allocations` | **D** | 1h + 20m sample | M‑1, M‑2 |
| M‑8 | Nomination Packs (custom) | `Nomination_Packs` | **D** | 1h + Deluge generator 1h | M‑4, M‑7 |
| M‑9 | Governance Bodies (custom) | `Governance_Bodies` | **E** | 1h | — |
| M‑10 | Governance Memberships (custom, junction Contact↔Body) | `Governance_Memberships` | **E** | 45m | M‑9 |
| M‑11 | Competencies (custom) | `Competencies` | **E** | 45m | M‑9 |
| M‑12 | NC Volunteers (custom, junction Contact↔NC) | `NC_Volunteers` | **F** | 1h | M‑1 |
| M‑13 | Training Records (custom) | `Training_Records` | **F** | 45m | M‑12 |
| M‑14 | MoU Obligations (custom) | `MoU_Obligations` | **F** | 45m | M‑1 |
| M‑15 | Mailing Lists (custom) | `Mailing_Lists` | **G** | 1h | — |
| M‑16 | Communication Log (custom) | `Communication_Logs` | **G** | 45m | — |
| M‑17 | Consent Records (custom) | `Consent_Records` | **G** | 45m | — |

**Total module build:** ≈ 18 hours. Need ≥ 2 builders in parallel to hit Fri 29 EOD.

### 1.1 Custom module naming convention
- Display label uses UWC vocabulary ("National Committees", "Safeguarding Cases").
- API names use the Zoho default conversion (spaces → underscores). Sagar/Priyanka confirm each on creation — Zoho occasionally suffixes `_1` if there's a collision.
- Each custom module must have **Layouts → Default Layout** with sections in the order shown in the per‑scenario tables below, *before* records are seeded. Re‑sectioning after data exists is fine but slower.

### 1.2 Role / profile model (single‑user POV demo)
We seed **4 Permission Profiles** + **3 Role records** even if only `uwc_admin` is the user. This lets us:
- Demo field‑level masking by toggling Akanksha's effective profile (Setup → Users → uwc_admin → Profile dropdown) — takes 5 seconds.
- Optionally create 1 secondary user "Clara Demo" for the blind‑review step (recommended — see §2.4 below).

| Profile | Modules visible | Field masking |
|---|---|---|
| IO Super Admin | All | Nothing masked |
| NC Admin | Apps, Contacts, NCs, Schools, Programmes, NC Volunteers, MoU, Mailing Lists | DOB visible · Personal Statement read‑only |
| Reviewer | Apps (own queue only), Contacts (own NC), Review Scores subform | Other reviewer's scores hidden via FLS |
| Data Protection Lead | Contacts, Consent Records, Communication Logs, Safeguarding Cases | DOB masked · Address masked · Personal Statement masked |

| Role | Reports to | Data scope |
|---|---|---|
| International Office | (top) | Org‑wide |
| NC Admin – Brazil | International Office | Records where `National_Committee = UWC Brazil` |
| NC Reviewer – Brazil | NC Admin – Brazil | Same + Reviewer rules |

(Same pattern can be cloned per‑country if Pranesh wants Germany/Kenya/India/UK roles too — not required for demo.)

---

## 2 — Scenario C: Selection · Scoring · Safeguarding

### 2.1 Goal
Show the live CRM enforcing **blind two‑reviewer scoring** with a real automation that unlocks both reviewers' scores once both have submitted, and a **safeguarding flag workflow** that locks the application and creates a Safeguarding Case record for IO triage.

### 2.2 Akanksha's narrative (60–90 sec voiceover)
> "Selection is the most safeguarding‑sensitive moment in the UWC pipeline. Two reviewers per applicant, fully blinded to each other's scores until both have submitted. If at any point a reviewer raises a safeguarding flag, the application is immediately locked and an IO triage case opens. Watch."

### 2.3 Modules to configure in Zoho

#### M‑5 Review Scores (subform on Applications)
`Setup → Modules and Fields → Applications → + Subform → "Review Scores"`

| Label | API name | Type | Notes |
|---|---|---|---|
| Reviewer | `Reviewer_Lookup` | Lookup → Users | Auto‑populated to `${Users.current}` on row create. Used by FLS rule below. |
| Academic Potential | `Score_Academic` | Integer (1–10) | Layout Rule below hides this field when `Row.Reviewer ≠ ${Users.current}` AND `Parent.All_Reviews_Complete = false`. |
| Community Engagement | `Score_Community` | Integer (1–10) | Same FLS rule. |
| Communication Skills | `Score_Communication` | Integer (1–10) | Same FLS rule. |
| UWC Values Commitment | `Score_Values` | Integer (1–10) | Same FLS rule. |
| Overall Recommendation | `Overall_Recommendation` | Picklist | `Yes · Conditional · No`. Same FLS rule. |
| Reviewer Comments | `Reviewer_Comments` | Multi‑line (2000) | Same FLS rule. |
| Submitted At | `Submitted_At` | DateTime · Auto | Set by Workflow on row save (see WR‑C‑3). |
| Visible to NC Admin | `Visible_to_NC_Admin` | Checkbox | Default `false`. Workflow WR‑C‑4 flips to `true` for all rows when `Review_Count >= 2`. |

#### Application module fields to add (in addition to those already specified in `BLUEPRINT_AND_WORKFLOW_SPEC.md §1.2`)
| Label | API name | Type | Notes |
|---|---|---|---|
| Assigned Reviewers | `Assigned_Reviewers` | Multi‑user Lookup | Populated during T3 (Submitted → Under Review) Blueprint transition. Drives the reviewer's saved view filter. |
| Review Count | `Review_Count` | Integer | Default `0`. Incremented by Deluge `incrementReviewCount` (WR‑C‑3). |
| All Reviews Complete | `All_Reviews_Complete` | Checkbox | Default `false`. Flipped by WR‑C‑4. |
| Safeguarding Flag Status | `Safeguarding_Flag_Status` | Picklist | `None · Under Review · Escalated · Resolved · Closed`. Default `None`. |
| Safeguarding Flag Raised By | `Safeguarding_Flag_Raised_By` | Lookup → Users | Auto‑set when status changes from `None`. |
| Safeguarding Flag Raised Date | `Safeguarding_Flag_Raised_Date` | DateTime | Auto‑set when status changes from `None`. |

#### M‑6 Safeguarding Cases module
`Setup → Modules and Fields → + Create New Module → "Safeguarding Cases"`

Layout sections in order: Case Identity · Triage Details · Resolution · Linked Records · System.

| Label | API name | Type | Section | Notes |
|---|---|---|---|---|
| Case ID | `Case_Id` | Auto‑number | Case Identity | Format `SGC-{YYYY}-{00001}`. Starts at 1. |
| Reporter | `Reporter_Lookup` | Lookup → Users | Case Identity | The user who raised the flag on the Application. |
| Date Raised | `Date_Raised` | DateTime · Auto | Case Identity | Auto on record create. |
| Severity | `Severity` | Picklist | Triage Details | `Low · Medium · High`. Required. Default blank. |
| Status | `SG_Status` | Picklist | Triage Details | `Under Review · Escalated · Resolved · Closed`. Default `Under Review`. |
| Triage Notes | `Triage_Notes` | Multi‑line (5000) | Triage Details | Visible only to IO Super Admin + Data Protection Lead profiles (FLS). |
| Resolution Steps | `Resolution_Steps` | Multi‑line (5000) | Resolution | Free‑text actions log. |
| Linked Application | `Application_Lookup` | Lookup → Applications | Linked Records | Mandatory. |
| Linked Contact | `Contact_Lookup` | Lookup → Contacts | Linked Records | Read‑only, auto‑populated via Deluge on case create from the Application's `Applicant_Name`. |

Blueprint on `SG_Status`: `Under Review → Escalated → Resolved → Closed`. Transition gate: cannot leave `Under Review` unless `Triage_Notes` is non‑empty. Use the same transition Setup pattern as the Applications Blueprint.

### 2.4 Workflow rules (Setup → Automation → Workflow Rules → Applications)

**WR‑C‑1 — Auto‑task on Under Review**
- Trigger: `Application Stage` changes to `Under Review`.
- Action: Create Task → `Subject = "Assign reviewers – {{Applicant_Name}}"`, due = +3 working days, assigned to `Application.Owner` (NC Admin).

**WR‑C‑2 — Auto‑populate Assigned Reviewers from popup**
- This is enforced by the Blueprint T3 transition spec from `BLUEPRINT_AND_WORKFLOW_SPEC.md §2.2` — During‑Transition action picks 2 users from a popup. Sagar implements as a Blueprint script (Setup → Blueprints → Transition → During → Select Field → Assigned_Reviewers).

**WR‑C‑3 — Increment Review_Count + stamp Submitted_At**
- Trigger: On record save, when `Review Scores` subform has a new row with `Submitted_At` is null.
- Action 1 (Function): `incrementReviewCount(applicationId)` (Deluge code in §2.5 below).
- Action 2 (Field Update on subform row): `Submitted_At = NOW()`.

**WR‑C‑4 — Unlock all scores when both reviewers in**
- Trigger: Field update on Applications when `Review_Count` changes AND `Review_Count >= 2`.
- Action 1: Field Update → `All_Reviews_Complete = true`.
- Action 2: Function → `unlockAllReviewScores(applicationId)` (flips `Visible_to_NC_Admin = true` on every subform row).
- Action 3: Email Alert → template `ReviewsCompleteForNCAdmin` to `Application.Owner`.

**WR‑C‑5 — Safeguarding flag raised → lock + create case**
- Trigger: `Safeguarding_Flag_Status` changes from `None` to `Under Review`.
- Action 1: Function → `createSafeguardingCase(applicationId, raisedByUserId)`.
- Action 2: Field Update → `Safeguarding_Flag_Raised_By = ${Users.current}`, `Safeguarding_Flag_Raised_Date = NOW()`.
- Action 3: Layout Rule → make every Application field read‑only when `Safeguarding_Flag_Status != None`.
- Action 4: Email Alert → template `SafeguardingFlagRaised` to IO Super Admin + Data Protection Lead.

**WR‑C‑6 — Stage → Shortlisted → applicant email**
- Trigger: `Application Stage` changes to `Shortlisted`.
- Action: Email Alert → template `ShortlistCongratulations` to `Applicant_Name.Email`.

### 2.5 Deluge functions (Setup → Customisation → Functions)

```deluge
// incrementReviewCount(applicationId) — invoked by WR-C-3
appId = applicationId.toLong();
app = zoho.crm.getRecordById("Deals", appId);
current = ifnull(app.get("Review_Count"), 0).toLong();
upd = Map();
upd.put("Review_Count", current + 1);
zoho.crm.updateRecord("Deals", appId, upd);
info "Review_Count -> " + (current + 1) + " on app " + appId;
return "ok";
```

```deluge
// unlockAllReviewScores(applicationId) — invoked by WR-C-4
appId = applicationId.toLong();
app = zoho.crm.getRecordById("Deals", appId);
rows = ifnull(app.get("Review_Scores"), List());
updated = List();
for each r in rows {
  r.put("Visible_to_NC_Admin", true);
  updated.add(r);
}
upd = Map();
upd.put("Review_Scores", updated);
zoho.crm.updateRecord("Deals", appId, upd);
return "ok";
```

```deluge
// createSafeguardingCase(applicationId, raisedByUserId) — invoked by WR-C-5
appId = applicationId.toLong();
app = zoho.crm.getRecordById("Deals", appId);
contactId = app.get("Contact_Name").get("id");
caseRec = Map();
caseRec.put("Reporter_Lookup", raisedByUserId);
caseRec.put("Date_Raised", zoho.currenttime.toString("yyyy-MM-dd'T'HH:mm:ssXXX"));
caseRec.put("SG_Status", "Under Review");
caseRec.put("Application_Lookup", appId);
caseRec.put("Contact_Lookup", contactId);
created = zoho.crm.createRecord("Safeguarding_Cases", caseRec);
info "Created safeguarding case " + created.get("id");
return created.get("id");
```

### 2.6 Sample records to seed (Scenario C)

| Record | Module | Key field values |
|---|---|---|
| Sofia Almeida | Contacts | Type=Student · DOB=10/03/2009 · Country=Brazil · Email=sofia.almeida@example.com |
| Miguel Santos | Contacts | Type=Student · DOB=12/06/2009 · Country=Portugal · `Safeguarding_Note` pre‑seeded for narrative reason |
| Clara Ramos | Users (or pre‑seeded Contact if no extra user) | Role = NC Reviewer Brazil |
| Paulo Fonseca | Users (or pre‑seeded Contact) | Role = NC Reviewer Brazil |
| Ana Carvalho | Users (or pre‑seeded Contact) | Role = NC Admin Brazil |
| Sofia – Application | Applications | Stage = `Under Review` · Assigned_Reviewers = [Clara, Paulo] · Review_Count = 0 · National_Committee = UWC Brazil · Programme = UWC Brazil 2026 |
| Miguel – Application | Applications | Stage = `Under Review` · Assigned_Reviewers = [Clara, Paulo] · Review_Count = 0 · Safeguarding_Flag_Status = None (we'll flip live) |
| Clara's review of Sofia | Review_Scores subform | Pre‑seeded with all 4 scores + Recommendation = Yes · Submitted_At ≠ null |

### 2.7 Demo click‑path (10 steps mirroring `03_scenario_C.html`)

| # | What Akanksha does in CRM | What the panel sees |
|---|---|---|
| 1 | Switch profile to **Reviewer (Clara)** → Open Applications → Saved View "My Review Queue" (`Assigned_Reviewers contains me AND Stage = Under Review`) | Two rows: Sofia Almeida, Miguel Santos |
| 2 | Open Sofia → Review Scores subform → + Add Row → Enter Clara's scores (9/8/8/9 · Recommendation Yes) → Save | Subform row saved · `Submitted_At` populates |
| 3 | Refresh page · still as Clara | Application now shows `Review_Count = 1`. Clara's scores visible (she's the row owner). No second reviewer row yet. |
| 4 | Switch profile to **Reviewer (Paulo)** → Open Sofia | Paulo sees Clara's row but **all score columns are blank/—** (FLS rule). Paulo cannot see Clara's recommendation. |
| 5 | Paulo enters his own scores (8/9/7/9 · Yes) → Save | Workflow fires: `Review_Count → 2`, `All_Reviews_Complete = true`. Refresh → both rows now show all scores. Email Alert toast fires. |
| 6 | Switch profile to **NC Admin (Ana)** → Open Sofia | Ana sees both rows fully. Average score widget on layout (formula field `Avg_Score = (Sum of 4 scores) / 8`). |
| 7 | Stay as Ana → open Miguel → click "Raise Safeguarding Flag" custom button → choose Severity = High → confirm | WR‑C‑5 fires: page reloads, application banner flips to red "🔒 Application locked — Safeguarding flag raised". Every field read‑only. |
| 8 | Sidebar → **Safeguarding Cases** module → top row is `SGC-2026-00001` (Miguel) · Status = Under Review · Reporter = Ana · Linked Application = Miguel‑Application | Switch profile to **IO Super Admin (Akanksha)** → enter Triage Notes "Spoke with NC Chair, age‑appropriate concern" → transition Blueprint to Resolved |
| 9 | Back to Applications → Sofia → Stage dropdown → move to **Shortlisted** → save | WR‑C‑6 fires → Email Alert sent to Sofia (open Setup → Email Sent → preview template) |
| 10 | Quick reference panel: open the saved Tab Group "Scenario C reference" — shows Module Fields catalog page filtered to Scenario C modules | Optional, 30s wrap‑up |

### 2.8 Verification checklist (run before internal review Fri 29)
- [ ] Clara's row on Sofia hides scores for Paulo until WR‑C‑4 fires
- [ ] WR‑C‑3 increments `Review_Count` reliably (test with a sandbox app)
- [ ] WR‑C‑4 unlocks all subform rows (re‑login as Paulo, scores now visible)
- [ ] Custom button "Raise Safeguarding Flag" on Application detail page creates Safeguarding Case + locks app
- [ ] `Triage_Notes` is hidden from Reviewer profile (verify by switching)
- [ ] Email template `ShortlistCongratulations` renders Sofia's first name correctly

### 2.9 Risks specific to C
- **FLS in Zoho CRM does not natively hide rows in a subform based on the row's `Reviewer` value.** Workaround: Layout Rule with formula `Row.Reviewer != ${Users.current} AND Parent.All_Reviews_Complete = false → hide field` — confirm in Setup with Priyanka. If Layout Rules can't do row‑scoped, fallback is a **Client Script** on the Application detail page that wipes peer score cells via DOM until unlock fires (Sagar — 1h fallback).
- Custom button cannot directly open a confirmation modal — use Deluge button with `optParam = severity` and a popup (Zoho CRM standard pattern).

---

## 3 — Scenario D: Nomination · Place Allocation · Pack

### 3.1 Goal
Show IO Admissions allocating school places to NCs, an NC Admin generating a nomination pack PDF, a school accepting the nomination, and the application moving to **Placed** with a Business Central sync notification.

### 3.2 Akanksha's narrative
> "Once selection is complete, IO Admissions allocates places per NC per school per cycle. NC Admins see only their own quota. When a school accepts, the application moves to Placed and a finance event fires to Business Central. Here is one Brazilian applicant going to UWC Atlantic."

### 3.3 Modules

#### M‑7 School Place Allocations
| Label | API name | Type | Notes |
|---|---|---|---|
| Allocation ID | `Allocation_Id` | Auto‑number | `SPA-{YYYY}-{0001}`. |
| School | `School_Lookup` | Lookup → Schools | Required. |
| National Committee | `NC_Lookup` | Lookup → National Committees | Required. |
| Cycle | `Cycle` | Picklist | `2026 · 2027 · 2028`. Default current cycle. |
| Places Allocated | `Places_Allocated` | Integer | Set by IO Admissions. |
| Places Used | `Places_Used` | Integer | Default 0. Auto‑incremented by `decrementSchoolQuota` (already in `BLUEPRINT_AND_WORKFLOW_SPEC.md §4.4`). |
| Places Remaining | `Places_Remaining` | Formula | `Places_Allocated - Places_Used`. |

List view layout: matrix‑style grid via Zoho `Group By: School, Pivot: NC`. Custom button **"Allocate Places"** opens a Deluge popup that lets IO Admissions adjust `Places_Allocated` by school/NC pair.

#### M‑8 Nomination Packs
| Label | API name | Type | Notes |
|---|---|---|---|
| Pack ID | `Pack_Id` | Auto‑number | `NP-{YYYY}-{00001}`. |
| Application | `Application_Lookup` | Lookup → Applications | Mandatory. |
| Target School | `Target_School_Lookup` | Lookup → Schools | Mandatory. |
| Pack Status | `Pack_Status` | Picklist | `Draft · Generated · Sent · Acknowledged · Accepted · Declined`. |
| Generated At | `Generated_At` | DateTime · Auto | Set by `generateNominationPack` function. |
| NC Reference | `NC_Reference` | Text | Auto‑generated `{NC_Code}-{YYYY}-{Application_Number_Suffix}` e.g. `BR-2026-041`. |
| BC Invoice ID | `BC_Invoice_ID` | Text | Populated by `sendToBusinessCentral` stub. |
| PDF Attachment | `Pack_PDF` | File Upload | Attached automatically by `generateNominationPack`. |

Application module gets **2 new custom buttons** here:
- **"Generate Nomination Pack"** (visible when Stage = `Shortlisted` AND `School_Nominated` is set) → calls `generateNominationPack(applicationId)`.
- **"Nominate to School"** (visible when Stage = `Shortlisted` AND a Nomination Pack with status = `Generated` exists) → opens modal to confirm school + place number → on confirm, sets `Stage = Nominated`, fires WR‑D‑2.

#### M‑1/M‑2 sample data needed
- 5 NC records (UWC Brazil, Germany, Kenya, India, UK) with `NC_Code = BR|DE|KE|IN|UK`.
- 3 School records (UWC Atlantic 12/8 places, RC Nordic 8/6, Mahindra 6/4) — the "12/8" means Allocated/Remaining.

### 3.4 Workflow rules

**WR‑D‑1 — Decrement school quota on Nominated**
- Trigger: `Stage` changes to `Nominated`.
- Action 1: Function `decrementSchoolQuota(schoolId, ncId)` (already in `BLUEPRINT_AND_WORKFLOW_SPEC.md §4.4`, just wired here).
- Action 2: Email Alert → template `NominationToSchool` to `School_Nominated.Admissions_Director_Email`.
- Action 3: Update Nomination Pack → `Pack_Status = Sent`.

**WR‑D‑2 — School accepts → Placed**
- Trigger: Nomination Pack `Pack_Status` changes to `Accepted`.
- Action 1: Field Update on linked Application → `Stage = Placed`.
- Action 2: Function `sendToBusinessCentral(applicationId)` — stub that writes `BC_Invoice_ID = "INV-2026-" + autoNum` on the Application + on the Pack.
- Action 3: Email Alerts (3): template `PlaceConfirmed` to Applicant + `PlaceConfirmedNC` to NC Admin + `PlaceConfirmedIO` to IO Admissions.
- Action 4: Lock the Application — Layout Rule `Stage = Placed → all fields read‑only`.

### 3.5 Deluge functions

```deluge
// generateNominationPack(applicationId)
appId = applicationId.toLong();
app = zoho.crm.getRecordById("Deals", appId);
applicant = zoho.crm.getRecordById("Contacts", app.get("Contact_Name").get("id"));
school = zoho.crm.getRecordById("Schools", app.get("School_Nominated").get("id"));
nc = zoho.crm.getRecordById("National_Committees", app.get("National_Committee").get("id"));

// Build NC reference: BR-2026-041
ncCode = nc.get("NC_Code");
yr = zoho.currenttime.year();
appNum = app.get("Application_Name");  // APP-2026-00041
suffix = appNum.subString(appNum.lastIndexOf("-") + 1);
ncRef = ncCode + "-" + yr + "-" + suffix;

// Build HTML (UWC navy header + applicant block + school block + sig area)
html = "<!doctype html><html><head><style>";
html = html + "body{font-family:Helvetica;color:#222;}";
html = html + ".banner{background:#003087;color:#fff;padding:24px;font-size:22px;}";
html = html + ".section{padding:16px 24px;border-bottom:1px solid #eee;}";
html = html + "</style></head><body>";
html = html + "<div class='banner'>UWC Nomination Pack — " + ncRef + "</div>";
html = html + "<div class='section'><h3>Applicant</h3><p>" + applicant.get("First_Name") + " " + applicant.get("Last_Name") + "</p><p>DOB: " + applicant.get("Date_of_Birth") + "</p></div>";
html = html + "<div class='section'><h3>Nominating National Committee</h3><p>" + nc.get("NC_Name") + "</p></div>";
html = html + "<div class='section'><h3>Target School</h3><p>" + school.get("School_Name") + "</p></div>";
html = html + "<div class='section'><h3>Personal Statement</h3><p>" + ifnull(app.get("Personal_Statement"), "") + "</p></div>";
html = html + "</body></html>";

// Render HTML → PDF via Zoho's Documents/Sign API or zoho.docs.invokeAPI
// For demo, just attach the HTML as .html file (PDF rendering = post-demo)
pdf = invokeurl
[
  url : "https://www.zoho.com/sign/api/v1/utility/html-to-pdf"
  type : POST
  parameters : {"html": html}
  connection : "zoho_sign_conn"  // create connection first
];

pack = Map();
pack.put("Application_Lookup", appId);
pack.put("Target_School_Lookup", school.get("id"));
pack.put("Pack_Status", "Generated");
pack.put("Generated_At", zoho.currenttime);
pack.put("NC_Reference", ncRef);
created = zoho.crm.createRecord("Nomination_Packs", pack);
// Attach PDF
zoho.crm.attachFile("Nomination_Packs", created.get("id"), pdf);
return created.get("id");
```

```deluge
// sendToBusinessCentral(applicationId) — DEMO STUB
appId = applicationId.toLong();
invNum = "INV-2026-" + randomNumber(100000, 999999).toString();
upd = Map();
upd.put("BC_Invoice_ID", invNum);
zoho.crm.updateRecord("Deals", appId, upd);
info "BC stub fired — invoice " + invNum + " logged for app " + appId;
// Real integration would invokeUrl Business Central OAuth endpoint.
return invNum;
```

### 3.6 Sample records to seed (Scenario D)

| Record | Module | Values |
|---|---|---|
| Place Allocation Atlantic ↔ Brazil | School_Place_Allocations | School=Atlantic · NC=UWC Brazil · Cycle=2026 · Allocated=4 · Used=0 |
| Place Allocation Atlantic ↔ Germany | School_Place_Allocations | Allocated=3 · Used=0 |
| Place Allocation Atlantic ↔ Kenya | School_Place_Allocations | Allocated=2 · Used=0 |
| Place Allocation Atlantic ↔ India | School_Place_Allocations | Allocated=2 · Used=0 |
| Place Allocation Atlantic ↔ UK | School_Place_Allocations | Allocated=1 · Used=0 |
| Place Allocation Nordic ↔ Brazil | School_Place_Allocations | Allocated=2 · Used=0 |
| (Repeat per school for full matrix — see §3.3 totals) | | |
| Sofia – Application | Already exists from C | Move to Stage = `Shortlisted` post‑Scenario C demo |

Set `Schools.Admissions_Director_Email` to a real mailbox Sagar controls so the demo email actually arrives (use Pranesh's catch‑all). Helen Richards' email should be `helen.richards+atlantic@a2zcloud.eu.com`.

### 3.7 Demo click‑path (10 steps mirroring `04_scenario_D.html`)

| # | What Akanksha does | What the panel sees |
|---|---|---|
| 1 | Profile = **IO Admissions (Fatima)** · Open **Place Allocations** list with Pivot view (Schools × NCs) | Matrix of allocations across 3 schools × 5 NCs, totals row |
| 2 | Click "Allocate Places" custom button → modal lets Fatima bump UWC Atlantic ↔ Brazil from 4 to 5 → confirm | Cell updates · audit log row added |
| 3 | Profile = **NC Admin (Ana)** · Open **NC Dashboard – Brazil** (homepage tab) — shows tile "Atlantic: 5 / 5 places available" pulled from Place Allocations filtered to UWC Brazil | Tile visualisation |
| 4 | Open Sofia → Stage is `Shortlisted` (from Scenario C close) · Click **Generate Nomination Pack** | `generateNominationPack` fires → toast "Pack `NP-2026-00001` generated for UWC Atlantic" |
| 5 | Open the Nomination Pack record → click attached HTML/PDF to preview | UWC navy banner, Sofia's details, Brazil NC reference `BR-2026-041` |
| 6 | Back to Sofia → click **Nominate to School** → modal asks "Confirm school = UWC Atlantic, places remaining = 5" → confirm | Stage → `Nominated` · WR‑D‑1 fires: school quota decrements to 4, email sent to Helen |
| 7 | Profile = **School Admissions Director (Helen)** · Open **Nomination Packs** filtered to `Target_School = UWC Atlantic AND Pack_Status = Sent` | One row: Sofia |
| 8 | Open Sofia's pack → click custom button **Accept Nomination** → confirm | `Pack_Status = Accepted` · WR‑D‑2 fires |
| 9 | Profile = **IO Admissions (Fatima)** · Open Sofia's Application | Stage = `Placed` · `BC_Invoice_ID = INV-2026-456789` populated · banner "Locked — placed" |
| 10 | (Optional) Show Setup → Workflow Rules → WR‑D‑2 detail proving the BC sync action is wired (not real fire — just config evidence) | — |

### 3.8 Verification + risks (D)
- [ ] Place Allocations matrix view actually renders as a pivot (Zoho list views call this **Group By with two dimensions** — may need to add a Canvas view or a Custom Dashboard as fallback if pivot is awkward).
- [ ] `decrementSchoolQuota` is idempotent — if the demo is re‑run, NC Admin needs to manually reset `Places_Used`. Bake this into the **demo reset script** Sagar writes.
- [ ] PDF generation: Zoho Sign HTML→PDF requires a Zoho Sign connection. If Sagar can't get it created in time, fall back to **attaching the HTML directly** — panel still sees the branded preview when they click the file.
- [ ] Custom button "Accept Nomination" requires creating a Portal Profile or simulating Helen via profile switch. Lean on profile switch.

---

## 4 — Scenario E: Governance Structure · Body Management

### 4.1 Goal
Show the IO managing the global UWC governance structure: bodies (Boards, Committees, Advisory groups), memberships (with term dates and renewal alerts), and a **competency matrix** that identifies gaps where a Board lacks members with required expertise.

### 4.2 Akanksha's narrative
> "UWC governance is multi‑layered — global board, regional boards, advisory committees per NC. Members rotate every 3–4 years. Compliance and skills coverage matter. Here's how the IO sees the network state and identifies competency gaps."

### 4.3 Modules

#### M‑9 Governance Bodies
| Label | API name | Type | Notes |
|---|---|---|---|
| Body Name | `Body_Name` | Single‑line text | Required. |
| Body Type | `Body_Type` | Picklist | `Board · Committee · Advisory`. |
| Body Purpose | `Body_Purpose` | Multi‑line | Mandate. |
| Parent Body | `Parent_Body` | Lookup → Governance Bodies | Self‑referential. Null for top‑level. |
| Body Status | `Body_Status` | Picklist | `Active · Dormant · Dissolved`. |
| Member Count | `Member_Count` | Integer · Auto | Roll‑up count of related `Governance_Memberships` where `Status = Active`. |
| Expired Member Count | `Expired_Member_Count` | Integer · Auto | Roll‑up where `Term_Expires < TODAY`. Drives red badges. |

#### M‑10 Governance Memberships
| Label | API name | Type | Notes |
|---|---|---|---|
| Member | `Member_Contact` | Lookup → Contacts | Required. |
| Governance Body | `Governance_Body` | Lookup → Governance Bodies | Required. |
| Role | `Member_Role` | Picklist | `Chair · Vice‑Chair · Trustee · Secretary · Treasurer · Advisor`. |
| Appointed Date | `Appointed_Date` | Date | Required. |
| Term Length (years) | `Term_Length` | Integer | Default 3. |
| Term Expires | `Term_Expires` | Formula (Date) | `Appointed_Date + (Term_Length * 365)`. Display badge in list: `EXPIRED` (red) if past, `EXPIRING SOON` (amber) if < 90 days. |
| Status | `Membership_Status` | Picklist | `Active · Lapsed · Resigned · Concluded`. Workflow flips to `Lapsed` automatically when Term_Expires < TODAY. |
| Competencies Held | `Competencies_Held` | Multi‑lookup → Competencies | What this member brings to the Body — drives the matrix in §4.5. |

#### M‑11 Competencies
| Label | API name | Type | Notes |
|---|---|---|---|
| Competency Name | `Competency_Name` | Text | e.g. "Marketing & Comms", "Youth Engagement", "Asia‑Pacific Regional". |
| Category | `Competency_Category` | Picklist | `Governance · Finance · Legal · Technical · Regional · Sector`. |
| Required for Board | `Required_Board` | Checkbox | Drives gap analysis. |
| Total Holders | `Total_Holders` | Integer · Auto | Roll‑up count of Memberships with this competency. |
| Gap Count | `Gap_Count` | Integer · Auto | Number of Active Boards (`Body_Type=Board AND Body_Status=Active`) that have zero current members holding this Competency. |

`Gap_Count` is calculated by a daily scheduled function `recomputeCompetencyGaps()` since Zoho's native roll‑up doesn't support "bodies missing this competency".

### 4.4 Workflow + scheduled function

**WR‑E‑1 — Renewal alert (60 days before expiry)**
- Trigger: Daily, query `Governance_Memberships WHERE Term_Expires = TODAY + 60`.
- Action: Email IO Super Admin + Body Chair → template `MembershipRenewalDue`.

**WR‑E‑2 — Auto‑lapse on expiry**
- Trigger: Field update — `Term_Expires` reaches today (use daily scheduled function `lapseExpiredMemberships`).
- Action: Set `Membership_Status = Lapsed`.

```deluge
// recomputeCompetencyGaps() — runs daily at 02:00 UTC
allComps = zoho.crm.getRecords("Competencies", 1, 200);
allBodies = zoho.crm.searchRecords("Governance_Bodies", "(Body_Type:equals:Board)and(Body_Status:equals:Active)");
for each c in allComps {
  cId = c.get("id");
  gap = 0;
  for each b in allBodies {
    bId = b.get("id");
    // Find Active memberships in this body holding this competency
    members = zoho.crm.searchRecords("Governance_Memberships",
      "(Governance_Body:equals:" + bId + ")and(Membership_Status:equals:Active)and(Competencies_Held:in:" + cId + ")");
    if (members.size() == 0) gap = gap + 1;
  }
  zoho.crm.updateRecord("Competencies", cId, {"Gap_Count": gap});
}
return "ok";
```

### 4.5 Competency matrix view (the centrepiece)
Build a **Zoho CRM Dashboard** → "Governance Competency Matrix" with a custom HTML widget (Setup → Customisation → Widgets → + Create → "Governance Matrix"). The widget renders an HTML table:

- Rows = Active Boards
- Columns = Competencies with `Required_Board = true`
- Cells = green tick if ≥1 Active member holds the competency, red cross if 0
- Footer row = `Gap_Count` per competency from M‑11

The widget fetches data via Deluge Inline Function `getCompetencyMatrix()` that returns JSON. Lighter than building a true Canvas view.

### 4.6 Sample records to seed (Scenario E)

| Body | Type | Status | Parent |
|---|---|---|---|
| UWC International Board | Board | Active | (null) |
| UWC Brazil NC Board | Board | Active | UWC International Board |
| UWC Kenya NC Board | Board | Active | UWC International Board |
| Safeguarding Advisory Committee | Advisory | Active | UWC International Board |
| Finance Sub‑Committee | Committee | Active | UWC International Board |

Memberships (anchored to existing Contacts, per BUILD_DECISIONS §2 sample data):

| Member | Body | Role | Appointed | Expires | Status | Competencies Held |
|---|---|---|---|---|---|---|
| Dame Catherine Prior | UWC International Board | Chair | 01/01/2024 | 31/12/2026 | Active | Governance, Strategy |
| Dr Ravi Menon | UWC International Board | Trustee | 01/03/2022 | 31/03/2025 | **Lapsed** (EXPIRED) | Finance, Asia‑Pacific Regional |
| Sarah Okonkwo | UWC International Board | Secretary | 01/08/2024 | 31/08/2027 | Active | Legal, Governance |
| Thomas Berger | UWC International Board | Trustee | 01/12/2021 | 31/12/2024 | **Lapsed** (EXPIRED) | Marketing & Comms |
| Amina Hassan | UWC International Board | Trustee | 01/09/2025 | 30/09/2028 | Active | Youth Engagement, Africa Regional |

Competencies with `Required_Board = true`:
`Governance · Finance · Legal · Strategy · Marketing & Comms · Youth Engagement · Safeguarding · Asia‑Pacific Regional · Africa Regional · Europe Regional · Americas Regional`

**Expected demo gaps** (driven by sample data): Marketing & Comms (Thomas lapsed → 1 board exposed), Youth Engagement (only Amina, fine), Asia‑Pac (Ravi lapsed → red flag), Europe Regional + Americas Regional (no one — red flags).

### 4.7 Demo click‑path (8 steps mirroring `05_scenario_E.html`)

| # | What Akanksha does | What the panel sees |
|---|---|---|
| 1 | Open **Governance Bodies** list view | 5 bodies, status badges, member counts |
| 2 | Click "+ New" → create "Programme Quality Committee" → save | New row · Member_Count = 0 |
| 3 | Open UWC International Board record | Detail page · sections: Body Identity, Membership Overview, History, Linked Bodies. Members list shows 5, two with red EXPIRED badges |
| 4 | Click "+ Add Member" → modal: pick Contact = Akanksha Anand, Role = Advisor, Appointed = today, Term Length = 3, Competencies = [Programme Design, Youth Engagement] → save | New active membership appears |
| 5 | Switch tab → **Historical Memberships** (Saved View `Membership_Status != Active`) | Thomas Berger + Dr Ravi Menon with their expired terms |
| 6 | Switch tab → **Competency Matrix** dashboard (the centrepiece) | HTML matrix · rows = boards · cols = competencies · 4 red cells highlighted in Marketing & Comms, Asia‑Pacific Regional, Europe Regional, Americas Regional |
| 7 | Switch tab → **Network Summary** report (built via Zoho Reports: bodies × member counts × competency coverage %) | Pie of body types, bar of coverage, count of lapsed memberships network‑wide |
| 8 | Optional: open Setup → Workflow Rules → WR‑E‑1 to show the 60‑day renewal alert | Config evidence |

### 4.8 Verification + risks (E)
- [ ] `Term_Expires` formula computes correctly (test with a sample membership where Appointed = 01/01/2023, Term_Length = 3 → should show 31/12/2025).
- [ ] Lapsed badge shows red — done via Field Conditional Formatting on list views.
- [ ] Competency matrix widget loads in under 2 seconds — pre‑seed `Gap_Count` manually on Fri evening; daily scheduler fires Sun night for the live demo.
- [ ] **Risk:** Zoho doesn't ship a self‑referential lookup widget for hierarchical bodies (Parent_Body) — Sagar may need to render the hierarchy in the widget too. If short on time, drop the hierarchy diagram from §3 detail view; bodies still list under their parent in the report.

---

## 5 — Scenario F: NC Management · Volunteer Oversight

### 5.1 Goal
Show the IO managing all 30+ National Committees: drill into a single NC, see its volunteer roster with **training compliance** colour codes, view the NC Chair's portal view (MoU obligations), and the IO **NC Health Dashboard** with global KPIs.

### 5.2 Akanksha's narrative
> "Every NC operates with a small volunteer team. The IO must be able to see at a glance which NCs are healthy and which have safeguarding training gaps or overdue MoU obligations. Here is UWC Kenya as a worked example — including a clearly visible compliance gap."

### 5.3 Modules

#### M‑1 National Committees (now build out fully — was M‑1 stub earlier)
| Label | API name | Type | Notes |
|---|---|---|---|
| NC Name | `NC_Name` | Text | Required. |
| NC Code | `NC_Code` | Text (2 char) | e.g. `BR · DE · KE · IN · UK`. Used in nomination references. |
| Country | `Country` | Picklist | ISO country list. |
| NC Status | `NC_Status` | Picklist | `Active · Suspended · Observer · Inactive`. |
| NC Chair | `NC_Chair_Lookup` | Lookup → NC Volunteers | One active Chair per NC. |
| Members Count | `Member_Count` | Integer · Auto | Roll‑up of `NC_Volunteers WHERE NC_Lookup = this AND Active`. |
| Established Year | `Established_Year` | Integer | — |
| Governance Body | `Governance_Body_Lookup` | Lookup → Governance Bodies | Cross‑link to Scenario E. |
| MoU Health | `MoU_Health` | Formula (Text) | See formula below. |
| Country Flag | `Country_Flag_URL` | URL | Pre‑populated from the 21 SVGs in `wireframes/_shared/assets/uwc-brand/flags/`. Shown as `<img>` in list view via Canvas. |

`MoU_Health` formula:
```
if (count of MoU_Obligations linked WHERE Obligation_Status = Overdue) >= 2 → "Critical (Red)"
else if (count >= 1) → "Attention (Amber)"
else → "Good (Green)"
```
(Zoho doesn't roll‑up counts directly — implement as a Deluge scheduled function `recomputeMoUHealth()` that updates the field nightly.)

#### M‑12 NC Volunteers (junction Contact↔NC)
| Label | API name | Type | Notes |
|---|---|---|---|
| Full Name | `Full_Name` | Formula (Text) | `First_Name + " " + Last_Name`. |
| Contact | `Contact_Lookup` | Lookup → Contacts | The person record. |
| NC | `NC_Lookup` | Lookup → National Committees | Required. Controls data scope. |
| Volunteer Role | `Volunteer_Role` | Picklist | `Chair · Admin · Selection Coordinator · Reviewer · Observer`. |
| Member Since | `Member_Since` | Date | — |
| Portal Access | `Portal_Role` | Picklist | `Chair · Member · None`. Drives Portal Profile. |
| Training Status | `Training_Status` | Formula (Text) | Derived: `CURRENT` (all required Trainings have Expiry > TODAY), `EXPIRED` (any required Training Expiry < TODAY), `MISSING` (no Training Records at all). Daily scheduler updates. |

#### M‑13 Training Records
| Label | API name | Type | Notes |
|---|---|---|---|
| Volunteer | `Volunteer_Lookup` | Lookup → NC Volunteers | — |
| Training Type | `Training_Type` | Picklist | `Safeguarding · Code of Conduct · Selection Process · GDPR`. |
| Completed | `Completed_Date` | Date | — |
| Expires | `Expiry_Date` | Formula (Date) | Safeguarding: Completed + 2 years; Code of Conduct: Completed + 3 years; Selection Process: Completed + 1 year; GDPR: Completed + 2 years. |
| Certificate | `Certificate_Attachment` | File Upload | PDF. |
| Status | `Training_Status` | Formula | `CURRENT · EXPIRING SOON (< 90 days) · EXPIRED`. |

#### M‑14 MoU Obligations
| Label | API name | Type | Notes |
|---|---|---|---|
| Obligation Name | `Obligation_Name` | Text | e.g. "Annual Report Q2 2026". |
| NC | `NC_Lookup` | Lookup → National Committees | — |
| Due Date | `Due_Date` | Date | — |
| Status | `Obligation_Status` | Picklist | `Pending · Submitted · Overdue · Waived`. |
| Submitted On | `Submitted_On` | DateTime · Auto | — |
| Overdue Days | `Overdue_Days` | Formula (Integer) | If Status = Overdue → `TODAY() - Due_Date` else 0. |
| Linked Document | `Linked_Document` | URL | Optional WorkDrive link. |

### 5.4 Workflows

**WR‑F‑1 — Auto‑mark MoU Overdue**
- Scheduled daily; queries MoU where `Status = Pending AND Due_Date < TODAY`; sets `Status = Overdue`.

**WR‑F‑2 — Email NC Chair when training expires within 30 days**
- Daily query Training_Records where `Expiry_Date = TODAY + 30`.
- Action: email to `Volunteer_Lookup.Contact.Email` cc `NC.NC_Chair`.

### 5.5 Sample records to seed (Scenario F)
- **UWC Kenya** NC (Code = KE, Country = Kenya, Chair = Grace Omondi, Established = 1962, Status = Active).
- 3 NC Volunteers under Kenya:
  - **Grace Omondi** — Role: Chair · Portal: Chair · Training: 2 records, both CURRENT.
  - **Daniel Kimani** — Role: Selection Coordinator · Training: Safeguarding completed 01/02/2023 → Expired 01/02/2025. Training_Status = **EXPIRED**.
  - **Aisha Waweru** — Role: Reviewer · Training: NONE. Training_Status = **MISSING**.
- 4 MoU Obligations for Kenya:
  - Annual Report Q2 2026 · Due 31/03/2026 · `Overdue` · `Overdue_Days` ≈ 58.
  - Safeguarding Self‑Assessment 2026 · Due 30/06/2026 · `Pending`.
  - Financial Statements 2025 · Due 31/03/2026 · `Submitted` (with linked URL).
  - DPIA Review 2026 · Due 30/09/2026 · `Pending`.

Repeat lighter seeding for the other 4 NCs (Brazil, Germany, India, UK) so the NC list view is populated.

### 5.6 NC Chair portal view (Step 5–6)
Two options for Grace's view:
- **Option A (cleaner):** create one secondary user "Grace Omondi" with profile = "NC Chair Portal Access" — only Volunteers + MoU + NC Detail visible. Akanksha logs out / logs in.
- **Option B (lower risk):** profile switch — promote uwc_admin briefly to view as Grace via Setup → Users → Switch User. Akanksha narrates.

Demo Fri evening with Option A if user creation OK with Paul; otherwise Option B.

### 5.7 Demo click‑path (8 steps mirroring `06_scenario_F.html`)

| # | What Akanksha does | What the panel sees |
|---|---|---|
| 1 | Open **National Committees** list view, sorted by `MoU_Health` | 5 NCs · UWC Kenya highlighted red (Critical) · UWC India amber · others green |
| 2 | Open UWC Kenya record | Detail page · sections: NC Identity, Leadership, Member Stats, MoU Obligations, Linked Programmes, Audit |
| 3 | Click related list "NC Volunteers" | 3 rows · Grace green (CURRENT) · Daniel red (EXPIRED) · Aisha grey (MISSING) |
| 4 | Open Daniel Kimani → Training Records related list | One Training record: Safeguarding · Completed 01/02/2023 · Expired 01/02/2025 · Status EXPIRED red badge |
| 5 | Log in as **Grace** (Option A) OR switch profile (Option B) → NC Chair portal opens to NC Dashboard | Grace sees only Kenya data — 3 volunteers, MoU panel, no IO data |
| 6 | Click MoU Obligations panel | 4 rows · Annual Report Q2 2026 in red OVERDUE 58 days |
| 7 | Back to IO Super Admin → open **NC Health Dashboard** (built in Zoho Reports/Dashboards) | KPIs: Total NCs 5, Active 4, Suspended 0, Overdue MoUs network‑wide 1, Volunteers with Training Gaps 2, click‑through to Kenya |
| 8 | Optional reference: open Setup → Workflows → WR‑F‑1 + WR‑F‑2 to prove the daily lifecycle is wired | — |

### 5.8 Verification + risks (F)
- [ ] `Training_Status` formula returns `MISSING` for Aisha (no records) — Zoho formulas can't directly query "no related records exist" → use Deluge scheduled `recomputeVolunteerTrainingStatus()` to write the value.
- [ ] `MoU_Health` updates nightly via `recomputeMoUHealth()` — pre‑seed it manually for Kenya before demo.
- [ ] NC Chair portal access (Option A) — make sure Grace's view scopes correctly. Common pitfall: Zoho Roles must be configured before Permission Profile restrictions apply.
- [ ] If using a real flag image URL field, host them publicly (they're already in `wireframes/_shared/assets/uwc-brand/flags/`). Quickest: push to a GitHub Pages branch on `PraneshSubramani/uwc-demo` and reference raw URLs.

---

## 6 — Scenario G: Communications · Mailing Lists · Bulk Updates

### 6.1 Goal
Show building a **dynamic mailing list** (segment criteria with consent exclusions), sending via Mailchimp (real or stub), writing back **Communication Logs** in bulk, viewing per‑contact comm history, and demonstrating **GDPR opt‑out enforcement** plus the **Consent Records audit log**.

### 6.2 Akanksha's narrative
> "Marketing operations must respect consent and produce an audit trail every time a contact's consent changes or a campaign is sent. Here we build an Impact Report mailing list — watch the opted‑out contact be excluded automatically."

### 6.3 Modules

#### M‑15 Mailing Lists
| Label | API name | Type | Notes |
|---|---|---|---|
| List Name | `List_Name` | Text | e.g. "Impact Report Q2 2026". |
| Segment Criteria | `Segment_Criteria_JSON` | Multi‑line (10000) | Serialised JSON describing the segment (e.g. `{"include":[{"field":"Contact_Type","op":"in","value":["Donor","Alumni"]}],"exclude":[{"field":"Consent_Email","op":"=","value":"Opted Out"}]}`). |
| Member Count | `Member_Count` | Integer · Auto | After running `buildList`. |
| Exclusion Count | `Exclusion_Count` | Integer · Auto | Number of contacts who matched criteria but were excluded for consent. |
| Built At | `Built_At` | DateTime · Auto | — |
| Status | `List_Status` | Picklist | `Draft · Built · Sent · Archived`. |
| Linked Campaign | `Campaign_Lookup` | Lookup → Campaigns | Created on send. |

#### Custom button **"Build & Preview"** on Mailing Lists detail
- Calls Deluge `buildMailingList(listId)` which:
  - Parses `Segment_Criteria_JSON`.
  - Queries Contacts via `zoho.crm.searchRecords` matching include rules.
  - Excludes any contact whose latest Consent_Records record for that channel is `Opted Out` or `Withdrawn`.
  - Writes `Member_Count`, `Exclusion_Count`, `Built_At = NOW()`, `List_Status = Built`.
  - Returns a list of names/emails for the preview panel.

#### Custom button **"Push to Mailchimp"** on Mailing Lists detail
- If Mailchimp extension installed: invokes the extension's `pushAudience` API.
- Stub fallback: creates a Campaign record with `Delivery_Channel = Mailchimp`, `Mailchimp_Campaign_Id = "MC-demo-" + autoNum`, sets `List_Status = Sent`, then calls `logCampaignSends(campaignId)` which inserts one Communication_Log row per recipient.

#### Campaigns module (use Zoho's standard Campaigns)
Add custom fields to standard Campaigns:
- `Mailing_List_Lookup` (Lookup → Mailing_Lists)
- `Delivery_Channel` (Picklist · `Zoho Campaigns · Mailchimp · Manual`)
- `Mailchimp_Campaign_Id` (Text)
- `Subject_Line` (Text)
- `From_Name` (Text, default `UWC International <hello@uwc.org>`)

#### M‑16 Communication Log
| Label | API name | Type | Notes |
|---|---|---|---|
| Contact | `Contact_Lookup` | Lookup → Contacts | One row per contact per campaign send. |
| Campaign | `Campaign_Lookup` | Lookup → Campaigns | Parent. |
| Direction | `Direction` | Picklist | `Outbound · Inbound`. |
| Channel | `Channel` | Picklist | `Email · SMS · Letter · Call`. |
| Sent At | `Sent_At` | DateTime · Auto | — |
| Open Status | `Open_Status` | Picklist | `Not opened · Opened · Clicked · Bounced · Unsubscribed · BLOCKED (opted out)`. |
| Suppression Reason | `Suppression_Reason` | Text | Populated when `Open_Status = BLOCKED`. |

#### M‑17 Consent Records
| Label | API name | Type | Notes |
|---|---|---|---|
| Contact | `Contact_Lookup` | Lookup → Contacts | — |
| Change Type | `Consent_Change` | Picklist | `Opted In · Opted Out · Withdrawn · Re‑confirmed`. |
| Source | `Consent_Source` | Picklist | `Web form · Email link · Portal preferences · Manual · Onboarding`. |
| Lawful Basis | `Lawful_Basis` | Picklist | `Consent · Legitimate interest · Contract · Legal obligation`. |
| Channel | `Consent_Channel` | Picklist | `Email · SMS · Postal · Phone`. |
| IP / Reference | `IP_Or_Reference` | Text | Masked after 90 days via Deluge nightly job. |
| Recorded At | `Recorded_At` | DateTime · Auto | Write‑locked via Validation Rule on update. |
| Notes | `Notes` | Multi‑line | Optional. |

**Validation rule (Setup → Modules and Fields → Consent_Records → Validation Rules):**
`On Update: prevent any field change → "Consent Records are immutable for GDPR audit."`

#### Contacts module — derived field
Add to Contacts:
- `Consent_Email_Status` — Formula (Text) — looks up the latest Consent_Records row for `Channel = Email` and returns its `Consent_Change`. Used by Mailing List exclusion logic. (Formula can't roll‑up; implement via Deluge function on Consent_Records save: writes a denormalised `Consent_Email_Status` text field back to the Contact for fast filtering.)

### 6.4 Workflow rules

**WR‑G‑1 — Opt‑out write‑back to Contact**
- Trigger: Consent_Records record created.
- Action: Deluge function `mirrorConsentToContact(contactId, channel, changeType)` updates the relevant `Consent_<Channel>_Status` field on the Contact.

**WR‑G‑2 — Block send to opted‑out contact**
- Implicit — `buildMailingList` excludes them. Belt‑and‑braces: at `logCampaignSends`, recheck consent and write `BLOCKED (opted out)` rows for any contact whose status changed between build and send.

**WR‑G‑3 — GDPR DSAR shortcut**
- Custom button on Contact: "Generate Consent Audit Trail" → Deluge → exports CSV of all `Consent_Records WHERE Contact_Lookup = this` ordered by `Recorded_At DESC`, attaches to Contact as `DSAR-{ContactName}-{Date}.csv`.

### 6.5 Sample records to seed (Scenario G)

Contacts (build on existing if any):
- **Jonathan Osei** — Donor · Email = jonathan.osei+demo@a2zcloud.eu.com · Consent_Email_Status = Opted In (Web form, 02/01/2026)
- **Isabelle Fontaine** — Donor · Opted In (Email link, 14/11/2025)
- **Sam Blackwood** — Alumni · Opted In (Portal preferences, 09/03/2026)
- **Grace Omondi** — NC Chair · Opted In (Onboarding, 01/01/2024)
- **Marcus Weber** — NC Admin Germany · **Opted Out** (Email link, 22/04/2026) ← the GDPR demo subject

Consent_Records (one per contact above, immutable):
- For Marcus: one historical `Opted In` (Onboarding, 12/02/2022) + one current `Opted Out` (Email link, 22/04/2026) — proves audit trail.

Mailing List:
- `Impact Report Q2 2026` · Status = Draft · Segment criteria pre‑populated: `Contact_Type in [Donor, Alumni, NC Chair, NC Admin] AND Consent_Email_Status != Opted Out`.

### 6.6 Demo click‑path (9 steps mirroring `07_scenario_G.html`)

| # | What Akanksha does | What the panel sees |
|---|---|---|
| 1 | Profile = **IO Marketing** · Open **Mailing Lists** → + New → name "Impact Report Q2 2026" → segment builder (or paste JSON) → save Draft | Empty list, ready to build |
| 2 | Click **Build & Preview** → preview pane lists 4 names (Jonathan, Isabelle, Sam, Grace) + "1 excluded (Marcus Weber — opted out)" | Member_Count = 4, Exclusion_Count = 1 |
| 3 | Click **Push to Mailchimp** → modal "Push 4 contacts as audience MC‑Demo?" → confirm | Campaign created · Mailchimp_Campaign_Id = MC‑demo‑000123 · toast "Synced to Mailchimp" |
| 4 | Open Campaign record → switch to a pre‑loaded browser tab showing the Mailchimp UI (real if extension is up; otherwise a sanitised screenshot of the Mailchimp campaign report — Akanksha flags as illustrative) | 4 recipients · 50% open rate (illustrative) |
| 5 | Back in CRM → open **Communication Log** module list view filtered to Campaign = "Impact Report Q2 2026" | 5 rows: 4 Outbound + 1 BLOCKED (opted out) for Marcus with `Suppression_Reason = "Email opted out 22/04/2026"` |
| 6 | Open Jonathan Osei → tab **Communication History** (related list) | 1 row — the Impact Report send · Sent_At populated · Open_Status = Sent |
| 7 | Open Marcus Weber → top of detail page shows red banner "🚫 Email channel: OPTED OUT (since 22/04/2026)" · Related list **Consent Records** shows 2 immutable rows | Click the older Opt In row — modal says "Locked — GDPR audit. Cannot edit." |
| 8 | Sidebar → **Consent Audit Log** (a saved view on Consent_Records, sorted by Recorded_At DESC) | All consent changes in the org · search box prominent (DSAR shortcut) |
| 9 | (Optional) On Marcus → click **Generate Consent Audit Trail** button → CSV downloads as DSAR demo | Akanksha says "this is the response to a Subject Access Request — fully audit‑ready" |

### 6.7 Verification + risks (G)
- [ ] Validation rule on Consent_Records blocks updates (test by trying to edit a row).
- [ ] Mailchimp extension on EU DC — Sagar verifies install Friday morning. If unavailable, stub path is the demo path.
- [ ] `Suppression_Reason` populates correctly — pre‑seed a Communication_Log row with `BLOCKED (opted out)` for Marcus so it's visible even if `logCampaignSends` skips him.
- [ ] DSAR CSV: at minimum, exports the rows. PDF rendering optional.

---

## 7 — Cross‑scenario sample data summary

To avoid contradictions, seed the org **in this order**:

1. **National Committees (5):** UWC Brazil, Germany, Kenya, India, UK — with NC_Codes and Country_Flag URLs.
2. **Schools (3):** UWC Atlantic (12 places, 8 remaining), Robert College Nordic (8/6), Mahindra College (6/4).
3. **Programmes (5):** "UWC Brazil 2026", "UWC Germany 2026", "UWC Kenya 2026", "UWC India 2026", "UWC UK 2026" — each linked to its NC.
4. **Contacts (~16):**
   - Applicants: Sofia Almeida, Amara Diallo, Lena Fischer, Kwame Asante, Preethi Nair, Miguel Santos.
   - NC Volunteers: Ana Carvalho (Brazil), Marcus Weber (Germany), Grace Omondi + Daniel Kimani + Aisha Waweru (Kenya), Priya Sharma (India), James Thornton (UK).
   - Comms: Jonathan Osei, Isabelle Fontaine, Sam Blackwood.
   - Governance: Dame Catherine Prior, Dr Ravi Menon, Sarah Okonkwo, Thomas Berger, Amina Hassan.
   - School: Helen Richards, Erik Solberg, Anjali Mehta.
5. **NC Volunteers (junctions, ~7).**
6. **Training Records (~5):** Grace's 2 current + Daniel's 1 expired; rest left blank for Aisha to show MISSING.
7. **MoU Obligations (~8):** Kenya 4 + 1 each for the others.
8. **Governance Bodies (5) + Memberships (5).**
9. **Competencies (~11).**
10. **Applications (6):** one per Applicant, distributed across Blueprint stages:
    - Sofia → starts at `Under Review` for Scenario C demo
    - Amara → `Submitted`
    - Lena → `Registered`
    - Kwame → `Nominated` (pre‑seeded for D demo continuation)
    - Preethi → `In Progress`
    - Miguel → `Under Review`, then in C demo flips Safeguarding flag
11. **Review Scores subform rows:** Sofia has Clara's row pre‑seeded so Paulo demo step 4 has something to hide.
12. **Place Allocations matrix (~15 rows).**
13. **Consent Records (~8):** at minimum the 5 contacts in Scenario G.
14. **Mailing List "Impact Report Q2 2026" Draft.**

All names match `BUILD_DECISIONS_v4 §2` — no Christopher Maclead anywhere.

---

## 8 — Build sequencing (Thu 28 evening → Fri 29 EOD)

Assumes blockers B‑1 + B‑2 cleared by Thu 28 evening. Two builders in parallel.

| Slot | Sagar (lead — modules + sample data) | Priyanka (lead — Blueprints + Deluge + Workflows) |
|---|---|---|
| **Thu 28 evening** (3h) | Build M‑1 (NCs) + M‑2 (Schools) + Programmes fields; seed §7 steps 1–3 | Build Application Blueprint per `BLUEPRINT_AND_WORKFLOW_SPEC.md §2`; configure 10 stages + colours |
| **Fri 29 AM 09:00–12:00** (3h) | Build M‑5 (Review Scores), M‑6 (Safeguarding Cases), M‑7 (Place Allocations), M‑8 (Nomination Packs) | Write WR‑C‑1..6, WR‑D‑1..2 + Deluge `incrementReviewCount`, `unlockAllReviewScores`, `createSafeguardingCase`, `generateNominationPack`, `sendToBusinessCentral` stub |
| **Fri 29 lunch — INTERNAL REVIEW with Paul + Dash** (1h) — A + B wireframes, C + D live | | |
| **Fri 29 PM 13:30–17:30** (4h) | Build M‑9..M‑11 (Governance) + M‑12..M‑14 (NC + Volunteers + Training + MoU) + M‑15..M‑17 (Mailing + Comm Log + Consent); seed all sample data | Write WR‑E‑1..2 + scheduled `recomputeCompetencyGaps`; WR‑F‑1..2 + `recomputeMoUHealth` + `recomputeVolunteerTrainingStatus`; WR‑G‑1..3 + `buildMailingList` + `mirrorConsentToContact`; Competency Matrix widget; Consent Validation Rule |
| **Fri 29 evening** (2h, both) | Verification checklist run; demo reset script (resets `Places_Used`, `Review_Count`, Safeguarding flag, MoU dates); pre‑load tab groups for Akanksha | |
| **Sat 30** | Akanksha walkthrough · fix list · polish | Same |
| **Sun 31** | Dry‑run · pre‑load tabs · double‑check email deliverability | Same |
| **Mon 1 June 14:30 BST** | Final smoke test · Akanksha at the console | |

If Fri PM slips, **drop in this order** (lowest demo cost first):
1. Mailchimp real integration → use stub.
2. Nomination Pack PDF rendering → attach HTML.
3. Governance hierarchy widget → simple list.
4. NC Chair portal user → profile switch.
**Do NOT drop** Safeguarding Cases (Scenario C centrepiece), Competency Matrix (Scenario E centrepiece), MoU Health roll‑up (Scenario F centrepiece), Consent Records immutability (Scenario G centrepiece).

---

## 9 — Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R‑1 | Setup access not granted by Thu eve | Medium | Catastrophic — no live build possible | Pranesh escalate to Paul + Buket Thu morning. Fallback: revert to wireframe demo for C–G (already built). |
| R‑2 | Layout Rules can't do row‑scoped FLS for blind review | Medium | High | Sagar prototypes within 30 min Thu eve. Fallback: Client Script (1h). Last resort: narrate "this is how Paulo would see it" and flip to wireframe. |
| R‑3 | Zoho Sign connection for HTML→PDF | Medium | Low | Attach HTML directly. |
| R‑4 | Mailchimp EU DC compatibility | Medium | Low | Stub. |
| R‑5 | Daily scheduled functions don't fire in time for demo | Low | Medium | Run them manually as one‑off Functions on Sun evening to refresh values. |
| R‑6 | Consent Records immutability rule blocks Sagar from fixing seeded data | Medium | Low | Enable Validation Rule AFTER seeding completes Fri evening. |
| R‑7 | Profile switch is too slow on screen for blind‑review reveal | Low | Medium | Pre‑seed Clara's row (already in §2.6) so step 1 is just "open Sofia"; switch only needed at steps 4 + 6. |
| R‑8 | Pre‑loaded tab cache invalidates mid‑demo | Low | Medium | Demo reset script clears tabs + reloads them 30 min before demo. |
| R‑9 | NC Chair portal user creation rejected by Paul | Low | Low | Use profile switch (Option B). |
| R‑10 | Akanksha forgets a step | Low | Medium | Presenter cue‑card per scenario printed Fri (mirrors §2.7/§3.7/§4.7/§5.7/§6.6). |

---

## 10 — Presenter cue cards (single line per step, for Akanksha's printout)

### Scenario C (~10 min)
1. "Reviewer queue — Clara has two applicants assigned."
2. "Clara scores Sofia — academic, community, communication, values."
3. "Clara saved; awaiting Paulo."
4. "Paulo opens Sofia — Clara's scores are hidden. Blind review enforced by field‑level security."
5. "Paulo submits — automation fires — both reviewers now visible."
6. "NC Admin Ana sees both scored, panel decision next."
7. "Reviewer raises a safeguarding flag on Miguel — application locks."
8. "IO Super Admin opens the Safeguarding Case — triages, resolves."
9. "Sofia shortlisted — congratulations email automatically sent."
10. *(Optional)* "Module reference appendix for the panel."

### Scenario D (~9 min)
1. "IO Admissions sees the place allocation matrix — schools × NCs."
2. "Fatima bumps Atlantic's Brazilian quota."
3. "Ana sees five places available."
4. "Generate Nomination Pack on Sofia's application."
5. "UWC‑branded PDF preview."
6. "Nominate Sofia to UWC Atlantic."
7. "School Admissions Director sees the nomination."
8. "Helen accepts — application moves to Placed."
9. "Business Central invoice fires — place confirmed across the system."
10. *(Optional)* "Workflow configuration evidence."

### Scenario E (~7 min)
1. "Governance Bodies — global board, regional boards, advisories."
2. "Create a new Programme Quality Committee."
3. "International Board detail — two expired memberships flagged."
4. "Add a new advisor — Akanksha onto the Board."
5. "Historical memberships — full term audit trail."
6. **Centrepiece** "Competency Matrix — four red gaps the board must address."
7. "Network‑wide summary report."
8. *(Optional)* "60‑day renewal alerts auto‑fire."

### Scenario F (~8 min)
1. "All NCs — Kenya in red, India amber, others green."
2. "UWC Kenya record — leadership, members, MoUs."
3. "Volunteer roster — Grace current, Daniel expired, Aisha missing."
4. "Daniel's safeguarding training expired 18 months ago."
5. "NC Chair portal — Grace sees only her data."
6. "MoU panel — Annual Report Q2 overdue by 58 days."
7. "IO NC Health Dashboard — network KPIs at a glance."
8. *(Optional)* "Daily scheduler keeps it accurate."

### Scenario G (~8 min)
1. "Build a mailing list — Impact Report Q2 2026."
2. "Build & Preview — four contacts in, one excluded for consent."
3. "Push to Mailchimp."
4. "Mailchimp campaign view."
5. "Communication Log — four sent, one BLOCKED with reason."
6. "Jonathan's full communication history."
7. "Marcus opted out — banner, immutable consent records."
8. "Consent Audit Log — full GDPR audit trail."
9. *(Optional)* "DSAR shortcut — one‑click consent export."

---

## 11 — Open questions for Pranesh to answer before build starts

1. **Setup access** — confirmed unblocked? If not, this whole plan is a wireframe contingency.
2. **Secondary user creation OK?** One real "Clara Demo" user makes Scenario C step 4 visually undeniable. Two real users (Clara + Grace) make C + F bulletproof. Cost: 2 Zoho user licences for 1 month. Worth it.
3. **Mailchimp** — install official Mailchimp for Zoho CRM extension or use the stub? My recommendation: **stub** (faster, lower risk). Real Mailchimp can be a Phase 1 deliverable post‑pilot.
4. **Email deliverability** — which mailbox catches demo emails? My default = `sam.prabhu+uwc‑demo@a2zcloud.eu.com` so Akanksha can show the inbox if asked.
5. **Wireframe A + B status** — confirmed staying as wireframes? (Yes assumed in this plan.)
6. **BC sync** — anyone need it to actually fire, or stub is fine? My recommendation: **stub**.
7. **Tab pre‑load script** — Akanksha runs it 30 min before demo? Pranesh to confirm she's comfortable with this.

---

## 12 — What Sagar/Priyanka can start TONIGHT (Thu 28 May)

Even before Setup access is fully clear, **two things can be prepped offline**:

1. **Sample data spreadsheet** — Sagar creates an XLSX with one tab per module mapping to §7. Columns = field labels. Rows = sample records. Ready to bulk‑import via CSV the moment access lands.
2. **Deluge function library** — Priyanka writes all functions from §2.5 + §3.5 + §4.4 + §5.x + §6.x into a single `.txt` file ready to paste. Each function tested against `zoho.crm.searchRecords` syntax (since the API is well‑known).

Both deliverables fit in ≤ 2 hours and de‑risk Friday.

---

*End of Scenarios C–G Zoho CRM configuration plan.*
*Drafted in plan mode — no Zoho writes performed. Pranesh, please review and reply with: (a) GO + answer to §11 open questions, or (b) redlines.*
