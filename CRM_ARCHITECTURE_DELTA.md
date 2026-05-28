# UWC Zoho CRM — Live Audit + Architecture Delta

**Org:** `20114943111` on Zoho **EU DC** (`crm.zoho.eu`)
**Teamspace:** `CRM Teamspace` (default, single)
**Admin used for audit:** `uwc_admin@a2zcloud.eu.com`
**Audited:** Wed 27 May 2026, by Sam Prabhu via Playwright session
**Demo deadline:** Mon 1 June 2026, 15:00 BST

---

## 1. What's actually in the org right now

### 1.1 Modules enabled (visible to uwc_admin)

| Display name | Underlying module | Notes |
|---|---|---|
| Home | — | Default dashboard |
| Reports | Reports (standard) | Out of box |
| Analytics | Dashboards (standard) | Out of box |
| My Requests | Requesters (standard) | Out of box |
| Workqueue | Workqueue (standard) | Out of box |
| **Leads** | Leads (standard) | Out of box; 10 standard sample records (Christopher Maclead, Carissa Kidman, etc.) |
| **Contacts** | Contacts (standard) | Out of box; 10 standard sample records (Kris Marrier, Sage Wieser, etc.) |
| **Applications** | **Potentials** (renamed) | Sales Deals module repurposed. 4 sample records (Benton, Truhlar And Truhlar Attys, Chemel, Chanay). |
| **Campaigns** | Campaigns (standard) | Out of box, kept original name |
| Tasks · Meetings · Calls | Standard activities | Out of box |
| **Programmes** | **Products** (renamed) | Empty — 0 records. Just shows "Create Programme" empty state. |
| Vendors · SalesInbox · Services · Projects | Standard | Out of box, mostly unused |
| **Local Questions** | CustomModule4 | Custom module created. Record state unverified. |
| **Academic Details** | CustomModule1 | Custom module created. |
| **Documents Details** | CustomModule2 | Custom module created. |
| **Questions** | CustomModule3 | Custom module created (separate from Local Questions). |
| Integrations | — | Section header in sidebar, contents not visible |

### 1.2 Modules NOT visible / blocked

| Module | Status |
|---|---|
| **Accounts** | "Permission Denied — Insufficient Privileges" for uwc_admin. Either disabled at org level or restricted from this profile. **This is a critical blocker for my recommended architecture** which puts NCs and Schools as Account record types. |
| **Setup** (`/setup/*`) | Returns "Invalid URL" / "Insufficient Privileges". The uwc_admin profile cannot configure modules, fields, blueprints, users, or roles. |

### 1.3 Applications module (=Potentials) — current state

**Stages currently configured** (3 visible in Kanban):
1. Qualification — 10%
2. Eligibility Review — 20%
3. Review — 40%

These are the Potentials default Sales Stages with light edits. The Build Plan v4.1 §4.1 specifies a **10-stage Blueprint**:
`Registered → In Progress → Submitted → Under Review → Shortlisted → Nominated → Placed`, plus terminals `Declined · Withdrawn · Waitlisted`.
**Delta: 7 stages missing, no Blueprint configured.**

**Fields seen in filter sidebar:**
- Amount (inherited from Potentials — semantic mismatch for Applications)
- Applicant Name (lookup to Contacts — repurposed Deal Name's Contact lookup)
- Applicant Number (custom, added)
- Application Name (rename of Deal Name)
- Application Owner (standard owner field)
- Campaign Source (inherited)
- Closing Date (inherited — works as "Application deadline")
- Communication (custom or inherited, unclear)

**Sample data:**
| Application | Stage | Amount | Linked Contact | Closing Date |
|---|---|---|---|---|
| Benton | Qualification | £250,000 | John Butt (Sample) | 28 May 2026 |
| Truhlar And Truhlar Attys | Eligibility Review | £100,000 → £45,000 | Sage Wieser (Sample) | 28 May 2026 |
| Chemel | Review | £70,000 | James Venere (Sample) | 28 May 2026 |
| Chanay | Eligibility Review | £55,000 | Josephine Darakjy (Sample) | 29 May 2026 |

**Problems with current Application data:**
- Names are nonsense (Benton, Chemel) — placeholder, not UWC narrative
- Amounts in GBP make no sense for student applications (£250k for "Benton"?)
- Linked Contacts are Zoho's default sample data, not Sofia/Amara/Lena/etc. from Build Plan §2.2

### 1.4 Programmes module (=Products) — current state
Empty. No records. Just the "List out Programmes — Create Programme / Import Programmes" landing.

**Build Plan needs 5 Programme records** (one per NC for 2026 cycle): Brazil, Germany, Kenya, India, UK.

### 1.5 Custom modules — record state unconfirmed
Local Questions, Academic Details, Documents Details, Questions exist but I didn't drill into records (admin profile may not allow). **Recommend Sagar verifies these are populated.**

### 1.6 User / Role configuration
**Cannot inspect — Setup is locked.**
But based on records I CAN see, only one user is referenced: `UWC A2Z Admin` (the one whose creds I'm using). The Build Plan v4.1 §3 specifies **8 named users** with role boundaries:

| User | Role | Visible in org? |
|---|---|---|
| Akanksha Anand | IO Super Admin | Unknown — likely not yet created |
| Ana Carvalho | NC Admin Brazil | Unknown — likely not yet |
| Marcus Weber | NC Admin Germany | Unknown — likely not yet |
| Clara Ramos | NC Reviewer | Unknown — likely not yet |
| Paulo Fonseca | NC Reviewer | Unknown — likely not yet |
| Helen Richards | School Admissions Atlantic | Unknown — likely not yet |
| Fatima Al-Rashid | IO Admissions | Unknown — likely not yet |
| (Data Protection Lead) | Compliance role | Unknown — likely not yet |

### 1.7 Branding in CRM
- Org logo top-right: **yellow "A2Z" square** — this is A2Z Cloud's brand, not UWC. **Build Plan §1 requires NO A2Z branding in the demo environment.** This must be changed to a UWC navy wordmark.
- No UWC colour theming applied — Zoho's default blue (#3b6ef5-ish) primary remains.

---

## 2. The strategic pattern they used (rename-standard-modules)

### 2.1 What they did

Rather than create dedicated custom modules, the team **renamed Zoho standard modules** to fit the UWC vocabulary:

| Renamed to | Source standard module | Why it was chosen |
|---|---|---|
| Applications | Potentials (Deals) | Already has Stage/Pipeline/Probability/Amount/Closing-Date conventions |
| Programmes | Products | Already has Product Name/Code/Description/Active flag |
| (Campaigns kept) | Campaigns | Maps directly to Communications/Mailing-List use |

### 2.2 Trade-offs

**✅ Pros**
- Faster setup — no custom-module creation, no field-by-field build
- Inherited features come free: Kanban view, Stage Probability, Pipeline reports, Sales Stage history, related lists (Notes/Attachments/Activities), Workflow Rule triggers
- Field-level security and audit log are already wired
- Built-in standard reports work out of the box

**❌ Cons**
- **Semantic mismatch**: Potentials' Amount/Probability conventions don't apply to Applications. The Build Plan blueprint is a deterministic stage flow, not a probabilistic sales pipeline.
- **Auto-conversion flows confused**: Standard Lead→Contact→Deal (Potential) conversion path is wired into Zoho's UI. We've used the Deal slot for Applications, which means the "Convert Lead" button will create an Application automatically — fine for our flow but the UI labels say "Convert to Deal."
- **API field names are wrong**: API uses `Deal_Name`, `Stage`, `Amount`, `Probability`, `Closing_Date`, `Account_Name`. For Catalyst portal integration this means every API call hits Potential-named fields, not Application-named. Maintenance pain, onboarding friction.
- **Reporting locked to Sales vocabulary**: Standard reports say "Sales Pipeline", "Deal Conversion Rate" — needs override.

### 2.3 My verdict on the pattern

**Keep it for the demo. Replace it post-pilot.** Reasons:
1. 4 build days left — no time to rebuild a true Applications module from scratch with proper Blueprint, layouts, and Catalyst APIs
2. Demo audience is the UWC evaluation panel — they care about flow, not the underlying API field name
3. Per today's call: anything that isn't easily configurable in Zoho gets wireframed instead. Applications wireframe will use proper Application semantics regardless of the underlying renamed module.
4. **Post-pilot (Phase 1 of the implementation, per the proposal)** — rebuild as a true custom module with proper field names, full Blueprint, dedicated Catalyst APIs.

**For the demo:** the wireframes carry the "real" Application data model. The live Zoho only gets demoed where the rename is acceptable (Kanban view, basic record fields).

---

## 3. Target architecture (where we need to be by demo)

### 3.1 Required modules (10 must-have for the 7 scenarios)

| # | Module | Source | Status | Build cost | Required for scenario(s) |
|---|---|---|---|---|---|
| M1 | **Contact** (extended) | Standard | ✅ Exists, needs field extensions | 2h fields + 30m sample data | All |
| M2 | **Lead** | Standard | ✅ Exists | 30m sample data | B (registration trigger), G (campaigns) |
| M3 | **Application** | Renamed Potentials | ✅ Exists, needs Blueprint rebuild | 4h Blueprint + 1h fields + 30m sample | A, B, C, D |
| M4 | **Programme** | Renamed Products | ✅ Module exists, EMPTY | 1h fields + 30m sample (5 records) | A, D |
| M5 | **Account** (with record types NC, School) | Standard — **CURRENTLY BLOCKED for uwc_admin** | 🔒 **PROFILE NEEDS UNLOCK** | 2h enable + record type config + 30m sample (5 NCs + 3 schools) | A, D, F, G |
| M6 | **NC Volunteer** (junction Contact↔NC Account) | Custom — **NEEDS CREATION** | ❌ Not built | 3h module + 30m sample | A, F |
| M7 | **Governance Body** | Custom — **NEEDS CREATION** | ❌ Not built | 3h module + 30m sample | E |
| M8 | **Governance Membership** (junction) | Custom — **NEEDS CREATION** | ❌ Not built | 2h junction + 30m sample | E |
| M9 | **Training Record** | Custom — **NEEDS CREATION** | ❌ Not built | 2h module + 30m sample | F |
| M10 | **Communication Log** | Use standard Activities/Emails | ✅ Likely covered by Calls/Emails | 30m segment view | G |

**Estimated total build time for backend Zoho:** ~22 hours of configuration. **Days available:** ~3. **Per-developer capacity:** 6–7h/day. **Feasible only if Sagar + Priyanka work in parallel.**

### 3.2 Required modules I'm DROPPING from the live Zoho build

For scenarios that don't have time to be configured in real Zoho, **the wireframe carries the demo**. Akanksha says "this is wireframe" and the panel accepts it (per today's call decision).

| Module | Live Zoho? | Wireframe carries it? |
|---|---|---|
| Competency (for Governance E) | ❌ Skip in live Zoho | ✅ Wireframe |
| MoU Obligation (for F) | ❌ Skip in live Zoho | ✅ Wireframe |
| School Place Allocation (for D) | ❌ Skip in live Zoho | ✅ Wireframe |
| Nomination Pack (for D) | ❌ Skip in live Zoho | ✅ Wireframe (PDF preview) |
| Mailing List builder UI (for G) | ⚠️ Use Campaigns module as proxy | ✅ Wireframe of segment builder + Mailchimp |
| Consent Record audit (for G + GDPR) | ❌ Skip in live Zoho | ✅ Wireframe |
| Safeguarding Flag workflow (for C) | ❌ Skip in live Zoho | ✅ Wireframe |
| Field-level security demo (for A) | ⚠️ Real if profile permissions can be set in time | ✅ Wireframe role-switcher carries it |

### 3.3 Application Blueprint — the critical build item

Build Plan v4.1 §4.1 mandates a **10-stage Blueprint** with **gate conditions** and **8 transition automations**. Current Zoho has 3 stages and no Blueprint.

**Minimum for credible demo:**
- All 10 stages defined with the locked UWC stage colours
- Stage transitions wired with at least the 4 most important gates: (a) Parental consent gate for Submitted, (b) Two-reviewer count gate for Shortlisted, (c) School quota gate for Placed, (d) Safeguarding-clear gate for Shortlisted
- 3 essential automations: (1) email-on-submit, (2) review-count incrementer, (3) all-reviews-complete unlock

**4 hours of Priyanka's time, blocked by Setup access.**

### 3.4 The 7 scenarios — what's live Zoho vs what's wireframe

| Scenario | Live Zoho coverage | Wireframe coverage | Net % to wireframe |
|---|---|---|---|
| A — NC Admin / Permissions / Programme Config | Role boundaries (if Roles built in time), Programme record (if Sagar populates), Application list view, basic dashboard | All field-level security comparisons, unlock-application reason capture flow, audit log presentation | ~50/50 |
| B — Applicant Registration / Eligibility / Form Submission | Lead → Contact conversion can be demoed live | Entire UWC portal (landing, eligibility gate, Portuguese form, parental consent, save/resume, dashboard) is wireframe — there is NO portal built. IO Marketing source-attribution view is wireframe. | ~85% wireframe |
| C — Selection / Scoring / Safeguarding | Review subform on Application record (if built), basic Kanban | Blind review enforcement (locked scores), safeguarding flag workflow, panel decision automation | ~70% wireframe |
| D — Nomination / Place Allocation / Pack | Application stage transition to Nominated | IO allocation grid, NC quota tracking, nomination pack PDF, School Admissions Director portal, accept/decline flow, BC sync notification | ~85% wireframe |
| E — Governance | Custom module Governance Body if built in time | Competency matrix, historical membership, network summary | ~75% wireframe |
| F — NC Management / Volunteers | NC Account record + linked Contact volunteers if Accounts unlocked + populated | Training compliance dashboard, MoU obligations, IO health dashboard, NC Chair portal view | ~80% wireframe |
| G — Comms / Mailing Lists | Campaigns module list, basic Contact filter | Mailchimp campaign view (mocked), bulk Communication Log update, GDPR consent audit, opt-out enforcement | ~85% wireframe |

**Overall: ~75% of the demo is wireframe-driven.** This is consistent with today's call decision.

---

## 4. The delta — exactly what changes, by priority

### 4.1 P0 — must-have before demo (blocking)

| # | Change | Owner | Effort | Blocker |
|---|---|---|---|---|
| P0-1 | **Unlock Accounts module for uwc_admin profile OR provide an alternate higher-priv account** | Pranesh / Paul | 15 min | Hard — without this, NCs/Schools cannot be created in CRM at all |
| P0-2 | **Unlock Setup access** for whoever is building (Sagar/Priyanka) — they need a Super Administrator profile | Pranesh / Paul | 15 min | Hard — without Setup, no Blueprint, no Roles, no field changes |
| P0-3 | **Replace yellow A2Z org logo with UWC navy wordmark** — Setup → Personalisation → Company Logo | Sagar | 10 min | Soft — but very visible on every screen |
| P0-4 | **Delete the default Zoho sample data** in Leads, Contacts, Applications | Sagar | 20 min | Soft — but Build Plan §2 wants real UWC sample names only |
| P0-5 | **Create the 5 NC Accounts** (Brazil, Germany, Kenya, India, UK) per Build Plan §2.1 | Sagar | 30 min | Depends on P0-1 |
| P0-6 | **Create the 6 sample Applicants as Contacts** (Sofia, Amara, Lena, Kwame, Preethi, Miguel) per Build Plan §2.2 | Sagar | 45 min | None |
| P0-7 | **Create the 3 School Accounts** (Atlantic, RC Nordic, Mahindra) per Build Plan §2.3 | Sagar | 20 min | Depends on P0-1 |
| P0-8 | **Build Application Blueprint** — 10 stages, gate conditions, colours | Priyanka | 4h | Depends on P0-2 |
| P0-9 | **Create 8 named user accounts** with role boundaries per Build Plan §3 | Pranesh / Paul | 1h | Depends on P0-2 |
| P0-10 | **Test blind review** — log in as Paulo Fonseca and verify Clara's scores are hidden | Pranesh | 30m | Depends on P0-8 + P0-9 |

### 4.2 P1 — should-have (improves demo quality but not blocking)

| # | Change | Owner | Effort |
|---|---|---|---|
| P1-1 | Populate the 5 Programme records | Sagar | 30m |
| P1-2 | Configure Governance Body custom module (if time) | Priyanka | 3h |
| P1-3 | Build Application sample data — link the 6 Applicants to NCs + Programmes | Sagar | 45m |
| P1-4 | Configure Kenya NC volunteer records (Grace, Daniel, Aisha) | Sagar | 30m |
| P1-5 | Disable unused modules from sidebar (Vendors, SalesInbox, Services, Projects, Questions) — clutter | Sagar | 15m |
| P1-6 | Set theme colours in CRM personalisation (navy primary) | Sagar | 20m |

### 4.3 P2 — wireframe-only (do not build in live Zoho)

| # | Capability | Lives in |
|---|---|---|
| P2-1 | UWC-branded student portal (landing, eligibility, form, dashboard) | Wireframe Scenario B |
| P2-2 | Parental consent workflow + Maria's guardian portal | Wireframe Scenario B |
| P2-3 | Safeguarding flag triage workflow | Wireframe Scenario C |
| P2-4 | IO Place Allocation grid + nomination pack PDF | Wireframe Scenario D |
| P2-5 | School Admissions Director portal | Wireframe Scenario D |
| P2-6 | Competency matrix + gap analysis | Wireframe Scenario E |
| P2-7 | MoU obligations tracking + IO health dashboard | Wireframe Scenario F |
| P2-8 | Mailchimp integration view + bulk Communication Log update + consent audit | Wireframe Scenario G |
| P2-9 | All cross-role visibility comparisons (Data Protection Lead view, etc.) | Role-switcher in every wireframe file |
| P2-10 | HubSpot source attribution + UWC marketing analytics | Wireframe Scenario B |

---

## 5. Recommended demo strategy (based on this delta)

Given the constrained live-Zoho state, **shift demo balance further toward wireframe**:

1. **Solution Overview slot (15:05–15:15, 10 min)** — Akanksha runs a 2-minute Zoho CRM live tour (just navigation: "this is the CRM, this is the portal, this is the back office") — then immediately announces "for the depth of the scenarios I'll be presenting interactive wireframes that follow our solution architecture, with the live system referenced where it's already configured."
2. **Scenario Demos (15:15–16:15, 60 min)** — primarily wireframes (per UWC's brief — explicitly allowed: "Pre-recorded demonstrations are not acceptable. UWC International does not expect suppliers to present a fully configured solution; however, the environment must be configured sufficiently to demonstrate the concepts and workflows within each scenario.")
3. **For each scenario** — Akanksha follows the role-switcher pattern, then for ONE moment per scenario jumps to live Zoho to show the equivalent record (proof that the underlying CRM is real, configured, and working — not just slideware).
4. **For Scenario A specifically** — this is the strongest "live Zoho" candidate because role-based permission demos work natively. Plan to demo Marcus's restricted module list LIVE if P0-1, P0-2, P0-8, P0-9 are done.

This protects against the panel saying "show me in the actual CRM" — Akanksha can always switch tabs and show at least one real record per scenario.

---

## 6. Open questions Pranesh needs to answer

| # | Question | Why it matters |
|---|---|---|
| Q1 | Who in A2Z has Super Admin access to this org? Can they unlock Accounts module + grant Sagar/Priyanka full Setup access? | Without this, ~40% of the live-Zoho work cannot start |
| Q2 | Is `uwc_admin` the intended demo presenter login, or will Akanksha use a different account on demo day? | Affects which permissions need to be tightened/loosened |
| Q3 | Has Sagar started building the Application Blueprint? (I can only see 3 stages — but the Blueprint editor would be in Setup, which I can't reach) | If yes, my P0-8 estimate halves |
| Q4 | Have the 4 custom modules (Local Questions, Academic Details, Documents Details, Questions) been populated with sample data and connected to Applications/Programmes? | Affects how much of the live CRM is "real" vs "shell" |
| Q5 | Are we OK with the rename-Potentials strategy for the demo, OR do you want me to flag in the wireframes that the post-pilot rebuild creates a true Application custom module? | Affects what we tell UWC during the demo and in the architecture diagram |
| Q6 | The current org has a yellow "A2Z" logo top-right. Build Plan §1 says NO A2Z branding. Who has access to upload the UWC navy wordmark in Personalisation? | Hard but visible item |
| Q7 | Will the 8 named users (Marcus, Ana, Clara, Paulo, Helen, Fatima, Akanksha, Data Protection Lead) be created as real Zoho users (one CRM licence each), or are some of them shared logins? Licence cost implications. | Affects user-creation effort and demo authenticity |

---

## 7. Summary — what I'm taking forward into the wireframes

1. **The 7 wireframes assume the target architecture** (10 modules in the Application Blueprint, NCs as Account record type, dedicated Governance/Competency/Training modules).
2. **The live CRM screens shown inside the wireframes** match what's actually built (Potentials-renamed Applications module with Sales Stage Kanban, Products-renamed Programmes module).
3. **The CRM data model diagram (`99_data_model.html`)** shows BOTH:
   - Current state (boxes greyed for "exists today")
   - Target state (boxes coloured for "build for go-live")
   - Connector arrows showing dependencies
4. **The wireframes' Zoho-style screens** match the dark-topbar / light-sidebar / blue-CTA Vertical UI captured in the audit screenshots.
5. **Where the wireframes show fields the live CRM doesn't have**, the field-reference appendix on each scenario file is labelled "Target field model — for build-out post-pilot".

— Architecture delta ends —
