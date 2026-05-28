# UWC Demo Wireframes + CRM Architecture — FINAL PLAN v2 (post-Pranesh review)

**Date:** 27 May 2026 (Wed)
**Demo:** Mon 1 June 2026 · 15:00–17:00 BST · video conference
**Presenter:** Akanksha Anand (pre-briefed)
**Internal review:** Fri 29 May AM with Paul Whitelock + Dash Bunyan
**Build window:** Wed 27 – Fri 29 May
**Author:** Sam Prabhu

Supersedes `PLAN_FOR_PRANESH_REVIEW.md`. Locks all 9 open questions and adds the new role-switcher requirement.

---

## 1. Decisions locked (from your reply)

| # | Decision | Effect on build |
|---|---|---|
| D1 | **Ignore existing `uwc_full_scenario B_demo.html`. Treat as visual reference only.** Build 7 new HTML files A–G from scratch. | Old file stays in `docs/`. New files in `wireframes/`. Lift design system + components, do not lift content. |
| D2 | **NEW — Each scenario file has a role-switcher in the top bar.** Akanksha can change "View as: [Role ▼]" mid-step and the screen re-renders with that role's visibility, field-level show/hide, and action affordances. | Significant UX pattern. Detailed in §3 below. |
| D3 | **NC = standard Account record (Account Type = "National Committee").** No new module. | Mailing lists in G can filter on Account Type. Volunteer junction = standard Contact Roles. |
| D4 | Akanksha pre-briefed — no action needed. | — |
| D5 | **Drop Technical Questions written response from scope.** | Not building it. Not referencing it in wireframes. |
| D6 | **Build `00_index.html` landing page** to pick A–G with one click. | One extra file, ~30 min. |
| D7 | **Two distinct visual modes inside each file:** UWC-branded for portal pages, **pixel-accurate Zoho CRM UI** for back-office pages. | Pranesh will share Zoho demo account creds. I will log in via Chromium-via-Chrome MCP (or Lightpanda MCP) and screenshot Zoho CRM's actual UI to wireframe accurately. Until creds arrive I'll use public Zoho CRM screenshots from zoho.com/crm/ as the visual reference. |
| D8 | **No GitHub Pages required.** HTML shared as files. (Optional GH Pages "fine" — I'll push to a `gh-pages` branch as a non-blocking nice-to-have on Sat 30 if time allows.) | Saves a deploy step. |
| D9 | **Data model file = Salesforce Schema-Builder style ERD + overall architecture connecting all modules.** | One file: `99_data_model.html`. ERD with boxes + connector lines (Salesforce visual idiom), plus a layered architecture diagram showing UWC International ↔ portals ↔ CRM ↔ integrations. |
| D10 | UWC logo, brand assets, website refs → Pranesh will push to GitHub. I'll pull. | I'll work with the navy wordmark placeholder per Build Plan §1.2 fallback until assets land. |

**Implicit decision (not stated but follows from D7):** the existing scenario B file's design system (sidebar nav, screen-toggle, cards, pills, alerts) carries forward for **portal-style screens**. For **Zoho CRM screens** I need a second design language layered in: left module nav, top utility bar, list views with filters/sort/bulk actions, detail view with related lists, all in Zoho's grey/blue/white density.

---

## 2. Final file structure

```
uwc-demo/
├── docs/                          (existing — untouched, including the old scenario B file as reference)
├── wireframes/                    (NEW — everything I produce)
│   ├── _shared/
│   │   ├── uwc-tokens.css         UWC palette, fonts, spacing scale
│   │   ├── zoho-tokens.css        Zoho CRM palette, fonts, density
│   │   ├── components.html        annotated component library (for my own reference)
│   │   ├── sample-data.js         single source: Sofia, Ana, Marcus, Clara, Paulo, Helen, Fatima, Grace, governance roster
│   │   ├── role-switcher.js       the cross-file role-switching engine
│   │   └── assets/                logos, hero photos (pushed by Pranesh from uwc.org)
│   ├── 00_index.html              UWC-branded landing — picker for A–G + data model + presenter guide link
│   ├── 01_scenario_A.html         NC Admin · Permissions · Programme Configuration
│   ├── 02_scenario_B.html         Applicant Registration · Eligibility · Form Submission
│   ├── 03_scenario_C.html         Multi-Stage Selection · Scoring · Safeguarding
│   ├── 04_scenario_D.html         Nomination · Place Allocation · Pack Generation
│   ├── 05_scenario_E.html         Governance Structure · Body Management
│   ├── 06_scenario_F.html         NC Management · Volunteer Oversight
│   ├── 07_scenario_G.html         Communications · Mailing Lists · Bulk Updates
│   └── 99_data_model.html         Salesforce-style ERD + overall architecture diagram
├── FINAL_PLAN_v2.md               (this file)
└── PLAN_FOR_PRANESH_REVIEW.md     (v1 — superseded)
```

**Self-contained rule:** every scenario HTML inlines its own CSS + JS so it runs from any folder, double-clicked, with no server. `_shared/*.css` is the source-of-truth — I edit there, then inline into each file. `role-switcher.js` is the only logic that's complex enough to keep as a shared file referenced via `<script src>` — but every file also has a fallback inlined copy in case file:// CORS chokes.

---

## 3. The role-switcher pattern (new requirement, design locked)

This is the single most important new behaviour. Designed so Akanksha can demonstrate UWC's `What we are looking for: ... how record visibility differs across teams and roles` requirement live without flipping between files.

### 3.1 Top-bar control

Every scenario file has, in the top bar to the right of the UWC brand:

```
[UWC International — DEMO]    View as: [👤 Marcus Weber · NC Admin (DE)  ▼]    [Step 4 of 9]
                                       ┌─────────────────────────────────┐
                                       │ 👤 Akanksha Anand                │
                                       │    IO Super Admin (Global)       │
                                       │ 👤 Marcus Weber           ✓     │
                                       │    NC Admin (Germany)            │
                                       │ 👤 Ana Carvalho                  │
                                       │    NC Admin (Brazil)             │
                                       │ 👤 Data Protection Lead          │
                                       │    Compliance & GDPR             │
                                       │ ──────────────────────────────── │
                                       │ Restricted to roles relevant to  │
                                       │ this scenario.                   │
                                       └─────────────────────────────────┘
```

The dropdown options are **scoped per scenario** — only roles meaningful to that scenario appear.

### 3.2 Per-scenario role options

| Scenario | Roles in the dropdown | Default |
|---|---|---|
| A | Marcus (NC Admin DE), Ana (NC Admin BR), Akanksha (IO Super Admin), Data Protection Lead | Marcus |
| B | Public visitor, Sofia (Portal), Maria Almeida (Guardian), Ana (NC Admin), IO Marketing | Public visitor |
| C | Clara (Reviewer), Paulo (Reviewer), Ana (NC Admin), Akanksha (IO Super Admin — for safeguarding view) | Clara |
| D | Fatima (IO Admissions), Ana (NC Admin), Helen (Atlantic School Admissions Director) | Fatima |
| E | Akanksha (IO Super Admin), IO CRM Administrator | Akanksha |
| F | Akanksha (IO Super Admin), Grace (NC Chair Kenya) | Akanksha |
| G | IO Marketing/Comms, Akanksha (IO Super Admin), Individual Contact view (Jonathan Osei) | IO Marketing |

### 3.3 What changes when the role switches

Four classes of element react to role state, driven by data attributes:

| Attribute | Behaviour |
|---|---|
| `data-role-show="ios,nc-admin-de"` | Element visible only when current role is one of the listed roles |
| `data-role-hide="data-protection"` | Element hidden when current role is one of the listed roles |
| `data-role-fields-mask="dob,financial_aid,parent_contact"` | Listed field IDs render as `••••••••` with a "Hidden — role permission" tooltip |
| `data-role-variant="ios:Full audit log\|nc-admin-de:Germany NC only\|data-protection:Restricted view"` | Element swaps inner text based on role (use `\|` separator) |

### 3.4 What the JS engine does (single function)

```js
function applyRole(roleId){
  document.body.dataset.currentRole = roleId;
  document.querySelectorAll('[data-role-show]').forEach(el => {
    el.hidden = !el.dataset.roleShow.split(',').includes(roleId);
  });
  document.querySelectorAll('[data-role-hide]').forEach(el => {
    el.hidden = el.dataset.roleHide.split(',').includes(roleId);
  });
  document.querySelectorAll('[data-role-fields-mask]').forEach(el => {
    const masked = el.dataset.roleFieldsMask.split(',');
    el.querySelectorAll('[data-field]').forEach(f => {
      const shouldMask = masked.includes(f.dataset.field) && /* role triggers masking */;
      f.classList.toggle('field-masked', shouldMask);
    });
  });
  document.querySelectorAll('[data-role-variant]').forEach(el => {
    const variants = Object.fromEntries(el.dataset.roleVariant.split('|').map(s => s.split(':')));
    if (variants[roleId]) el.textContent = variants[roleId];
  });
  // Also: update topbar label + role-aware sidebar nav (some steps hidden per role)
}
```

Plus: visible **role badge** colour-coded on the topbar (blue = IO, green = NC Admin, amber = Reviewer, red = Data Protection, purple = School, white = Portal/Student).

### 3.5 The narrative pattern

Akanksha's flow in any scenario:
1. Start at Step 1 with the default role
2. Step through the scenario
3. At designated "role-comparison" steps, she opens the dropdown and switches role — the panel sees the SAME data with DIFFERENT visibility
4. Most scenarios will have 2–3 role-comparison moments

This solves the problem from today's call where Dash said "show data protection lead and IO Super Admin on the same record" — now it's one screen, one click.

---

## 4. Per-scenario screen plan (final)

Each scenario file has: sidebar step nav (left), top bar with role switcher + step counter (top), main scroll area. Step count chosen to fit Akanksha's allocated minutes per scenario.

### Scenario A — NC Admin · Permissions · Programme Configuration (~8 min · 9 steps)
**Default role:** Marcus Weber. Switches: → Ana Carvalho → Akanksha → Data Protection Lead.
- Visual mode: 80% **Zoho CRM UI**, 20% wireframe overlays for the role-comparison moments.

| Step | Screen | Role mode |
|---|---|---|
| 1 | Marcus logs in — module nav shows Germany scope only | Zoho CRM home |
| 2 | Germany Programme record — edit deadline, place count, stages, local question inline | Zoho CRM record edit |
| 3 | NC dashboard — 14 applications by stage with colour chips, days-to-deadline | Zoho CRM dashboard |
| 4 | User & role management — create reviewer, senior committee member, second NC Admin | Zoho CRM setup |
| 5 | Permission matrix — field/record/module level toggles | Zoho CRM permission editor (wireframe accuracy of Zoho's actual permission UI) |
| 6 | Edit applicant record on their behalf — override panel with reason | Zoho CRM record edit + custom button |
| 7 | Unlock submitted application — modal with Unlock Reason → audit log entry | Zoho CRM custom action |
| 8 | **Role comparison** — same Contact record viewed as IO Super Admin vs Data Protection Lead | Topbar role switch live; masked fields appear/disappear |
| 9 | CRM field reference appendix | Field table |

### Scenario B — Applicant Registration · Eligibility · Form Submission (~10 min · 10 steps)
**Default role:** Public visitor. Switches: → Sofia (Portal) → Maria (Guardian) → Ana (NC Admin) → IO Marketing.
- Visual mode: 70% **UWC-branded portal**, 30% Zoho CRM (for the back-office views).

| Step | Screen | Role mode |
|---|---|---|
| 1 | UWC portal landing page — UWC branded, language selector (EN active, PT active for Sofia) | UWC portal |
| 2 | Eligibility check — 14-year-old DOB → blocked with friendly message | UWC portal |
| 3 | Eligibility passes for 16-year-old → registration form | UWC portal |
| 4 | Sofia signs up + email verification flow | UWC portal |
| 5 | Sofia's student dashboard — application 60% saved, language Portuguese | UWC portal |
| 6 | Application form (Portuguese) — text, date, dropdown, file upload, multi-line essay | UWC portal |
| 7 | **Role switch to Maria (Guardian)** — guardian portal landing → parental consent capture | UWC portal · role variant |
| 8 | Sofia returns — submit button now enabled · Blueprint gate-check alert | UWC portal |
| 9 | **Role switch to Ana (NC Admin)** — application appears in NC queue in Zoho CRM | Zoho CRM |
| 10 | **Role switch to IO Marketing** — source attribution dashboard, HubSpot UTM integration view | Zoho CRM dashboard + HubSpot embed |

### Scenario C — Multi-Stage Selection · Scoring · Safeguarding (~10 min · 10 steps)
**Default role:** Clara (Reviewer). Switches: → Paulo → Ana → Akanksha.
- Visual mode: 90% **Zoho CRM UI**, 10% wireframe for safeguarding workflow.

| Step | Screen | Role mode |
|---|---|---|
| 1 | Clara's reviewer queue — assigned applications, COI declare button | Zoho CRM list |
| 2 | Clara opens Sofia's application — scoring form (4 dims × 1–10, overall picklist) | Zoho CRM form |
| 3 | Clara submits — banner "Awaiting other reviewer" | Zoho CRM |
| 4 | **Role switch to Paulo** — Paulo's queue, Sofia's app present, Clara's scores HIDDEN (lock icon) | Zoho CRM · masked fields |
| 5 | Paulo scores Sofia, submits — automation fires `Review_Count = 2`, unlock event | Zoho CRM + automation overlay |
| 6 | **Role switch to Ana (NC Admin)** — both score sets now visible side-by-side | Zoho CRM record |
| 7 | Clara raises safeguarding flag on Miguel Santos — application locks, red banner | Zoho CRM + wireframe overlay |
| 8 | **Role switch to Akanksha (IO Super Admin)** — safeguarding triage record, escalation panel | Zoho CRM · safeguarding workflow |
| 9 | Panel decision — Sofia → Shortlisted, auto-email preview to Sofia | Zoho CRM Blueprint transition |
| 10 | CRM field reference appendix | Field table |

### Scenario D — Nomination · Place Allocation · Pack Generation (~9 min · 10 steps)
**Default role:** Fatima (IO Admissions). Switches: → Ana → Helen.
- Visual mode: 80% **Zoho CRM UI**, 20% UWC-branded for the school portal view + PDF preview.

| Step | Screen | Role mode |
|---|---|---|
| 1 | Fatima's IO place-allocation grid — Schools × NCs matrix with quotas (Atlantic 8, RC Nordic 6, Mahindra 4) | Zoho CRM custom view |
| 2 | Fatima allocates 2 Atlantic places to Brazil NC | Zoho CRM custom action |
| 3 | **Role switch to Ana (NC Admin)** — Brazil's quota updated on her dashboard | Zoho CRM dashboard |
| 4 | Ana generates nomination pack for Sofia — spinner → PDF | Zoho CRM + PDF preview |
| 5 | Nomination pack PDF preview — compiled application, references, assessments, consent receipt | UWC-branded PDF (HTML mock) |
| 6 | Ana nominates Sofia to Atlantic place #4 — quota auto-decrements | Zoho CRM |
| 7 | **Role switch to Helen (Atlantic Admissions Director)** — incoming nominations list | UWC-branded school portal |
| 8 | Helen reviews the pack inline + accepts — Nominated → Placed transition | UWC portal + Zoho CRM toast |
| 9 | **Role switch back to Fatima** — final placement confirmed, BC sync tile | Zoho CRM dashboard |
| 10 | Pack status tracking + CRM field reference | Zoho CRM list + field table |

### Scenario E — Governance Structure · Body Management (~7 min · 8 steps)
**Default role:** Akanksha (IO Super Admin). Optional switch to IO CRM Administrator.
- Visual mode: 95% **Zoho CRM UI**, 5% for the competency-matrix visualisation overlay.

| Step | Screen | Role mode |
|---|---|---|
| 1 | Governance Bodies list view — Board, Audit Committee, Nominations Committee, Risk Advisory | Zoho CRM custom module list |
| 2 | Create new Governance Body — type/purpose/metadata form | Zoho CRM record create |
| 3 | UWC International Board record — header + member roster (Dame Catherine, Dr Ravi Menon, Sarah Okonkwo, Thomas Berger, Amina Hassan) | Zoho CRM detail view |
| 4 | Add member — Contact lookup, role picklist, appointment + term dates | Zoho CRM record create |
| 5 | Historical membership — expired terms (Dr Ravi Menon · Thomas Berger) shown with "Term ended" badge | Zoho CRM related list |
| 6 | Competency matrix — required vs covered, 3 gaps highlighted (Marketing & Comms, Youth Engagement, Asia-Pac Regional) | Wireframe overlay on Zoho |
| 7 | Network-wide governance summary — all bodies, member counts, upcoming expiries | Zoho CRM dashboard |
| 8 | CRM field reference — Governance Body, Membership, Competency modules | Field table |

### Scenario F — NC Management · Volunteer Oversight (~8 min · 8 steps)
**Default role:** Akanksha. Switch to Grace (NC Chair Kenya) for the NC's own view.
- Visual mode: 80% **Zoho CRM UI**, 20% UWC portal for NC Chair view.

| Step | Screen | Role mode |
|---|---|---|
| 1 | All NCs list — health-coloured tiles across 150+ NCs | Zoho CRM map/list view |
| 2 | UWC Kenya NC record — country, status, key contacts, linked governance | Zoho CRM Account detail |
| 3 | Volunteer roster — Grace (CURRENT), Daniel Kimani (EXPIRED), Aisha Waweru (MISSING) | Zoho CRM related list |
| 4 | Open Daniel's training record — expired safeguarding training | Zoho CRM record |
| 5 | **Role switch to Grace** — NC Chair portal: her volunteers, her MoU obligations | UWC-branded NC portal |
| 6 | MoU obligations panel — Annual Report submitted vs OVERDUE | Both views show it |
| 7 | **Back to Akanksha** — IO NC-health dashboard: active volunteer counts, MoU compliance, training expiry per NC | Zoho CRM dashboard |
| 8 | CRM field reference appendix | Field table |

### Scenario G — Communications · Mailing Lists · Bulk Updates (~8 min · 9 steps)
**Default role:** IO Marketing/Comms. Switches: → Akanksha → Individual Contact (Jonathan Osei) → Marcus Weber (opted-out).
- Visual mode: 70% **Zoho CRM UI**, 30% Mailchimp campaign view (wireframe of Mailchimp's actual UI).

| Step | Screen | Role mode |
|---|---|---|
| 1 | Mailing list builder — criteria editor: "All donors who contributed in last 12 months" → dynamic preview count | Zoho CRM segment builder |
| 2 | Saved mailing list — 47 donors + 12 NC Chairs (excludes Marcus — visible in count delta) | Zoho CRM list view |
| 3 | Send via Mailchimp — campaign brief, template preview (Impact Report) | Zoho + Mailchimp integration panel |
| 4 | Mailchimp campaign view (wireframe of Mailchimp's actual UI) — sync confirmed | Mailchimp wireframe |
| 5 | Send fires → bulk update toast: "Recording 59 outbound communications" | Zoho CRM |
| 6 | **Role switch to Individual Contact view** — Jonathan Osei's communication history | Zoho CRM Contact detail |
| 7 | **Role switch to Marcus Weber (opted-out)** — consent panel, "excluded from 14 campaigns" tally | Zoho CRM Contact detail with consent visible |
| 8 | GDPR audit screen — consent change log with timestamps + lawful basis | Zoho CRM custom report |
| 9 | CRM field reference — Mailing List, Campaign, Communication Log, Consent Record | Field table |

### Landing page · `00_index.html`
- UWC-branded splash. Pulls hero photo from `_shared/assets/` when Pranesh pushes it.
- 7 clickable scenario cards in a 4-3 grid (A-D top, E-G bottom).
- Each card: scenario letter (large), title, one-line description, time estimate, default-role badge, CTA "Start demo".
- Two utility cards at the bottom: "Data Model" → `99_data_model.html`, "Presenter Guide" → opens `docs/UWC_Demo_Presenter_Guide.docx` in a new tab (or a HTML render if you'd prefer).

### Data model · `99_data_model.html`
Two sections in one file:

**Section 1 — Salesforce Schema-Builder-style ERD.** Visual layout (SVG, hand-laid-out for clarity, not auto-generated):
- 18 module boxes positioned by domain cluster: People (Contact, Lead), Application core (Application, Programme, NC Account, School Account), Selection (Review subform, Safeguarding Flag), Placement (Nomination Pack, Place Allocation), Governance (Body, Membership, Competency), Volunteer ops (NC Volunteer junction, Training Record, MoU Obligation), Comms (Mailing List, Campaign, Communication Log, Consent Record), Audit (Audit Log)
- Connector lines: lookup arrows with cardinality labels (1:N, N:N) — same style as Salesforce Schema Builder uses
- Colour-coded by domain
- Hover any box → side panel shows field list

**Section 2 — Overall architecture layer diagram.** Top-down:
1. **External actors** — Applicants, NCs, Schools, IO Staff, Mailchimp, HubSpot, Google Drive, Raiser's Edge, Business Central
2. **Portals layer** — UWC-branded Student Portal, NC Portal, School Portal (all custom on Zoho Catalyst)
3. **API layer** — Catalyst REST APIs, Zoho Flow connectors
4. **CRM core** — Zoho CRM Enterprise (modules grouped from ERD)
5. **Automations layer** — Blueprints, Workflow Rules, Custom Functions
6. **Storage** — Zoho WorkDrive (transitioning to Google Drive per NFR-044)
7. **Integration layer** — Zoho Flow → Mailchimp, HubSpot, Raiser's Edge SKY API, BC OData
8. **Security layer** — SSO via Google Cloud Identity, role-based permissions, field-level security, audit log

Both diagrams hand-drawn in SVG for clarity and demo-readiness.

---

## 5. Visual fidelity plan — getting Zoho CRM UI right

You said "exactly like how the existing Zoho CRM UI is" and offered demo account credentials.

**What I need from you:**
1. Zoho CRM demo account credentials (or a sandbox URL + login)
2. The org's data centre — `.com` (US) or `.eu` (EU)?
3. Whether you want the wireframe to match Zoho CRM **Classic UI** or **Vertical UI** — they look quite different. Default assumption: Classic (Vertical is mostly for sales pipelines).

**What I'll do once I have those:**
1. Open Chrome MCP, log in
2. Walk through the key surfaces: Module list view (Leads, Contacts), Detail view (Contact record), Setup → Users & Control → Roles, Setup → Customisation → Modules and Fields, Blueprint editor
3. Screenshot each surface (8–12 screenshots)
4. Use them as pixel references for the CSS I write — exact spacing, font weight, button styling, table density, sidebar nav width

**Until then:** I can build the structure using public Zoho CRM marketing screenshots from `zoho.com/crm/`. Those are accurate enough for the first internal review with Paul + Dash. The Chrome-based refinement happens after the Fri 29 review, before Mon 1 June.

---

## 6. Sample data — exact from Build Plan v4.1 §2

| Data set | Records to render |
|---|---|
| National Committees | UWC Brazil (Ana Carvalho · primary), UWC Germany (Marcus Weber), UWC Kenya (Grace Omondi), UWC India (Priya Sharma), UWC UK (James Thornton) |
| Applicants | **Sofia Almeida** (Brazil, 16, Under Review, primary character), Amara Diallo (Guinea→Germany, 17, Shortlisted, second reviewer queue), Lena Fischer (Germany, 16, Submitted), Kwame Asante (Ghana→Kenya, 17, Nominated), Preethi Nair (India, 16, parental consent pending), Miguel Santos (Portugal→Brazil, 17, Shortlisted, pre-created safeguarding flag) |
| Schools | UWC Atlantic College (Helen Richards, 12 places, 8 remaining), UWC Red Cross Nordic (Erik Solberg, 8/6), UWC Mahindra College (Anjali Mehta, 6/4) |
| Governance — UWC International Board | Dame Catherine Prior (Chair, expires Dec 2026), Dr Ravi Menon (Trustee, EXPIRED Mar 2025), Sarah Okonkwo (Secretary, expires Aug 2027), Thomas Berger (Trustee, EXPIRED Dec 2024), Amina Hassan (Trustee, expires Sep 2028) |
| Competency gaps | Marketing & Communications · Youth Engagement · Asia-Pacific Regional Expertise — all intentional |
| Kenya volunteers | Grace Omondi (NC Chair, training CURRENT), Daniel Kimani (Selection Coordinator, EXPIRED), Aisha Waweru (Reviewer, MISSING) |
| MoU obligations | Annual report submitted (Grace) · Annual report OVERDUE (Daniel) |
| Comms contacts | Jonathan Osei (donor, opted in), Isabelle Fontaine (donor, opted in), Sam Blackwood (alumni, opted in), Grace Omondi (NC Chair, opted in), Marcus Weber (NC Admin, **OPTED OUT** — GDPR demo) |

All names and facts are pre-locked. The wireframes will use these verbatim — no improvisation, no placeholder Lorem.

---

## 7. UWC brand application

From Build Plan §1 + uwc.org observation (visually confirmed from consciousness; live fetch needs Chromium):

| Element | Value | Where applied |
|---|---|---|
| Primary | UWC Navy `#003087` | Portal header, nav, dashboard chrome, primary buttons, dominant CRM-side accents |
| Accent | UWC Red `#C8102E` | CTA buttons, alerts, safeguarding flags — **sparingly** |
| Surface | White `#FFFFFF` | Page + card backgrounds |
| Tint | Light navy `#E8EEF6` | Alternating table rows, panels, hover states |
| Helper | Mid grey `#6C757D` | Secondary labels, microcopy |
| Logo | UWC International primary navy wordmark | Top-left every portal page. Wordmark placeholder until you push the PNG. |
| Type — UWC-branded | Playfair Display (titles) + DM Sans (body) + DM Mono (technical) | Same as existing scenario B file |
| Type — Zoho CRM | -apple-system / Roboto / Open Sans | Match Zoho's actual default |
| Hero photo | Student photos from uwc.org | When you push them. Until then: navy hero block with overlay text. |

No A2Z branding anywhere in the wireframes — confirmed by Build Plan §1.

---

## 8. Build sequence (after final approval)

| Slot | Output | Dependency |
|---|---|---|
| Wed 27 May PM (after approval) | `_shared/uwc-tokens.css`, `_shared/zoho-tokens.css`, `_shared/role-switcher.js`, `_shared/sample-data.js`, `00_index.html` skeleton | Approval of this plan |
| Wed 27 May late | `99_data_model.html` ERD + architecture diagrams (SVG hand-laid-out) | Sample data finalised |
| Thu 28 May AM | `01_scenario_A.html` (most complex — role comparison central) + `02_scenario_B.html` | None |
| Thu 28 May PM | `03_scenario_C.html` + `04_scenario_D.html` | None |
| Fri 29 May AM | `05_scenario_E.html` + `06_scenario_F.html` + `07_scenario_G.html` | None |
| Fri 29 May lunchtime | Internal review pass — fix list | Paul + Dash review |
| Sat 30 May | Apply fixes · refine Zoho CRM look using live Chromium screenshots | Zoho creds from you |
| Sun 31 May | Final polish · Akanksha dry-run | Akanksha available |
| Mon 1 June 14:30 | Tab pre-load per Presenter Guide | — |
| Mon 1 June 15:00 | Live demo | — |

Parallel: Sagar/Priyanka own anything that ships as **real Zoho config** (Build Plan strategy of demo-real-where-cheap-enough).

---

## 9. Dependencies I'm waiting on

| # | Need | From | When | Blocker level |
|---|---|---|---|---|
| Dep1 | "Go" on this final plan | Pranesh | Wed 27 PM | Hard blocker — can't start until approved |
| Dep2 | Zoho CRM demo account credentials + data centre confirmation | Pranesh | Thu 28 ideally, hard need Sat 30 | Soft for first draft; hard for fidelity polish |
| Dep3 | UWC logo (PNG) + hero photos pushed to repo | Pranesh / Sagar | Fri 29 AM | Soft — wordmark placeholder works for review |
| Dep4 | Confirmation on Zoho CRM UI variant (Classic vs Vertical) | Pranesh | Thu 28 AM | Soft — defaulting to Classic |
| Dep5 | Confirmation that 8 named users in Build Plan §3 are the final cast | Pranesh / Sagar | Thu 28 AM | Soft — using Build Plan v4.1 as canonical |
| Dep6 | The branded PowerPoint slides referenced in today's call (Sofia's Journey) — to align wireframe vocabulary | Sagar | Optional | Nice-to-have |

---

## 10. Risks + mitigations

| Risk | Mitigation |
|---|---|
| Zoho CRM fidelity falls short — panel notices | Get live screenshots via Chromium ASAP (Dep2). For first draft, use public marketing screenshots. |
| Role-switcher introduces a bug mid-demo | Each file has a "fallback to default role" reset button hidden in the topbar (Ctrl+Shift+R). |
| One file fails to load on demo day | Every file is self-contained — Akanksha opens another tab from the index. |
| Hero photos / logos don't arrive in time | Wordmark placeholder per Build Plan §1.2 fallback. |
| Akanksha needs to demo something live in real Zoho that isn't wireframed | Build Plan strategy holds: announce "this is wireframe; for live config questions, here's the real CRM" — switch tabs to real Zoho. |
| Internal review (Paul + Dash) flags structural issues | Friday lunchtime → Sunday is a 60-hour buffer. The role-switcher pattern is the highest-risk piece — if Paul kills it, fall back to multi-step "now as Marcus" / "now as Data Protection Lead" pattern (3x more clicks but same content). |

---

## 11. Single-question final ask

**Approve this plan to execute, and confirm the Wed 27 PM start so I can produce `_shared/*` + `00_index.html` + `99_data_model.html` tonight?**

If yes:
- I start the moment you reply "go"
- I pull from your GitHub repo when you push assets (logo, photos)
- I ping you for Zoho creds (Dep2) by Thu 28 AM

If you want to change anything in this plan, redline it and I'll re-issue v3.

— Plan ends —
