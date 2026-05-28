# Scenario A — Deep Fix Plan v1

**Status:** PLAN MODE — awaiting Pranesh approval. **No execution until approved.**
**Trigger:** Pranesh's review of v4 with 5 reference screenshots from his live Zoho session.
**Date:** 28 May 2026
**Author:** Sam Prabhu

---

## 1. Issues raised + my diagnosis

I went through each thing Pranesh flagged, grepped the current `01_scenario_A.html` (2,510 lines / 256 KB), and matched each against the 5 reference screenshots. Nine issue clusters identified.

### Issue 1 — Viewport fit (page renders at "half width / half height")

**Current CSS:**
```
.app { height: 100vh; display: grid; grid-template-rows: 32px auto 1fr; }
.stage { overflow: hidden; }
.screen { display: none; height: 100%; }
.screen.active { display: block; ... }
.zoho-shell { display: grid; grid-template-rows: 52px 1fr; /* NO explicit height: 100% */ }
```

**Hypothesis:** `.screen.active` is `display: block` with `height: 100%`. Block children inside a grid item inherit width but not necessarily computed height from the grid track. On some browsers (or when there's a wrapper that's not flex/grid), the inner `.zoho-shell` collapses to its content height, leaving empty space below.

**Fix:**
```
.stage { display: flex; }              /* make stage a flex container */
.screen { display: none; flex: 1; min-width: 0; min-height: 0; }
.screen.active { display: flex; }      /* changed from block */
.zoho-shell { height: 100%; min-height: 100%; width: 100%; }
.zoho-shell .zoho-body { min-height: 0; }  /* allow children to scroll */
.zoho-content { min-height: 0; overflow: auto; }
```

Verify on 1440×900 + 1280×800 + 1024×768. If Pranesh's laptop reports a specific aspect ratio I can tune for that.

### Issue 2 — Settings has no admin / permission view

**Current:** Settings gear button maps to `setup-home` → `sc-3` (Users list) and `setup-profile` → `sc-4` (one Profile permissions screen). That's it. No Setup Home hub, no Roles, no clear navigation between them.

**What real Zoho has (Pranesh's screenshot 6 — Setup Home):**
10 category tiles in a 5×2 grid:
- **General**: Personal Settings, Users, Company Settings, Calendar Booking, Motivator, Agents
- **Security Control**: Profiles, Roles and Sharing, Zoho Mail Add-on Users, Compliance Settings, Territory Management, Trusted Domain, Support Access, Single Sign-On (SAML), Security Policies, Active Directory Sync, Login History, Audit Log
- **Channels**: Email, Telephony, Business Messaging, Notification SMS, Webforms, Chat, Portals
- **Customization**: Modules and Fields, Pipelines, Wizards, Kiosk Studio, Canvas, Customize Home page, Translations, Templates, Teamspace
- **Automation**: Workflow Rules, Actions, Schedules, Assignment, Scoring Rules, Cadences
- **Process Management**: Blueprint, Approval Processes, Review Processes, Connected Workflow
- **Experience Center**: Signals, CommandCenter, Segmentation
- **Data Administration**: Import, Export, Data Backup, Remove sample data, Storage, Recycle Bin, Sandbox
- **Marketplace**: All, Zoho, Google, Microsoft, Facebook, LinkedIn, TikTok, QuickBooks
- **Developer Hub**: MCP for AI Agents, APIs and SDKs, Connections, Variables, Circuits, Functions, Widgets, Data Model

**Plan:**
- New screen `sc-setup-home` — replicate the 10-tile grid. Most links go to toast "Demoed elsewhere or post-pilot setup"; the ones we wire fully are: **Users** + **Profiles** + **Roles**.
- Replace current `sc-3` (Users list) with a richer **Users** page (like Pranesh's screenshot 5) — list on left, detail panel on right with Teamspace info / Locale info / Groups / Display Name Format / **Profile + Role assignment**.
- New screen `sc-setup-profile-list` — list of profiles (Administrator · Standard · NC Administrator · NC Reviewer · School Director · IO Admissions · Restricted Reviewer · Marketing).
- New screen `sc-setup-profile-detail` — replicate Pranesh's screenshot 4 with module-permission toggles (Leads / Contacts / Accounts / Applications / Tasks / Meetings / Calls / Reports / Analytics / Programmes / Campaigns / Vendors / Local Questions / Questions / Schools). Each toggle ON shows "View, Create, Edit, Delete ⌄"; clicking the dropdown shows the 4 checkboxes (View/Create/Edit/Delete) per Pranesh's expanded popup.
- New screen `sc-setup-roles` — role hierarchy tree:
  ```
  IO Super Admin (Akanksha)
  ├── IO Admissions (Fatima)
  ├── IO Marketing
  ├── NC Admin — Germany (Marcus)
  │   └── NC Reviewer Germany
  ├── NC Admin — Brazil (Ana)
  │   ├── NC Reviewer Brazil (Clara)
  │   └── NC Reviewer Brazil (Paulo)
  ├── NC Admin — Kenya (Grace)
  ├── NC Admin — India (Priya)
  ├── NC Admin — UK (James)
  └── School Admissions Directors (Helen, Erik, Anjali)
  ```
- Nav wiring: Settings gear → `sc-setup-home` (hub). Tile clicks navigate to specific Setup sub-pages.

### Issue 3 — Programme detail layout doesn't match Zoho

**Reference:** Pranesh's screenshot 1 (Test programme detail).
Field layout in real Zoho:
```
Programme Information
  Programme Name      |   Open Date
  Programme Code      |   Support Start Date
  Cycle Year          |   Place Allocation
  Status              |   Application Deadline

Description Information
  Description (full width)

System Fields
  Created By          |   Modified By
  Programme Owner     |   Programme Category
```
Header pattern: Avatar (single-letter T) + Programme name + Add Tags + Last Update + Edit + ⋯
Tabs: Overview / Timeline
Compact info card on top (currently shows Programme Category single field)
"Hide Details" toggle above sections

**Current:** Sections are "Programme Configuration / Selection Stages / Local Question". Doesn't match Zoho's grouping.

**Plan:** Rewrite `sc-1` (Programme detail) to:
- **Top compact info card**: Programme Category (single field as Zoho shows)
- **Programme Information** section with the 8 fields above in 2-column grid
- **Description Information** section with full-width Description field
- **Selection Stages** — KEEP as a custom UWC-specific extension (label it "Selection Pipeline" with a chip strip showing 5 stages) but place AFTER System Fields and label it "Pipeline Configuration (custom)" so the panel knows it's an extension
- **Local Question (Germany-specific)** — keep but mark as a custom field with "Multi-line text" badge so it's clear what type it is
- **System Fields** section with Created By, Modified By, Programme Owner, Programme Category (proper place for these)
- Left rail Related List: Notes, Connected Records, Attachments, Open Activities, Closed Activities, Contacts, Leads, Applications, Accounts (greyed if NC Admin), **Local Questions (1)**, **Reviewers (4)**

### Issue 4 — Edit mode on Programme record is broken

**Current:** Edit button on Programme detail (sc-1) has no click handler. It does nothing.

**Plan:** Wire the Edit button to open an **Edit Programme** view that matches Pranesh's screenshot 2:
- Page title: "Edit Programme" + "Edit Page Layout" link
- Cancel / Save & New / Save buttons top-right
- **Programme Image** upload area at top (placeholder circle icon)
- **Programme Information** section — all fields as inputs:
  - Programme Name [text input · "Test"] | Open Date [date picker placeholder "D MMM, YYYY"]
  - Programme Code [text input] | Support Start Date [date picker]
  - Cycle Year [text input] | Place Allocation [text input]
  - Status [dropdown -None-] | Application Deadline [date picker]
- **Description Information** — Description multi-line textarea full width
- **System Fields** — Programme Owner dropdown (UWC A2Z Admin), Programme Category dropdown (-None-)
- Bottom right: "Create Form Views" + "Standard View ⌄" + "Create a custom form page"
- On Save: 800ms spinner → return to detail view with updated values + toast "Programme saved" + new Timeline entry

### Issue 5 — Local Question field type clarity

**Current:** Local Question rendered as a styled blockquote in view mode. No edit form for it yet.

**Plan:**
- View mode: keep the blockquote display
- Edit mode: render as a `<textarea>` (multi-line text) like the Description field
- Add a small "Multi-line text" type chip next to the field label so the panel knows the field type when scanning the layout

### Issue 6 — Application detail: fields, documents, review scores

**Current issues:**
- NC Local Question Answer renders as a blockquote (fine)
- Personal Statement (excerpt) — single line preview
- Documents shown as a table on the right
- Review Scores shown as a yellow notice "Reviewer scores hidden..."

**Pranesh wants:**
- NC Local Question Answer + Personal Statement → proper multi-line text display (paragraphs, line breaks preserved)
- Documents on the LEFT SIDE (he'll send screenshots; my best guess: a "Documents" related-list item in the left rail + an Attachments/Documents card on the main area, similar to Zoho's "Attachments" related list)
- Review Score should have **actors** (specific reviewers) + **dimensions with scores** — 2 or 3 sample reviewer rows visible

**Plan — Application detail rewrite:**
- **Header**: ← back + avatar + "APP-2026-{xxx} · {Applicant Name}" + stage chip + Add Tags + Last Update + role-gated **Unlock/Lock** + Edit + ⋯
- **Tabs**: Overview | Timeline
- **Left rail (Related List)**: Notes · Attachments · Emails · Open Activities · Closed Activities · **Documents (3)** · **Review Scores (2)** · References · Parent Name
- **Overview body**:
  - Application Status compact card (Stage chip, Submitted Date, Programme, NC, Parental Consent, Eligibility Status)
  - **Personal Statement** — full multi-line paragraph display (~250 words for Lena Fischer)
  - **Education Background** — multi-line
  - **Extracurricular Activities** — multi-line
  - **Leadership Statement** — multi-line
  - **NC Local Question Answer** — multi-line in target language
  - **Review Scores** — proper table:
    | Reviewer | Academic | Community | Communication | Values | Overall | Submitted |
    |---|---|---|---|---|---|---|
    | Clara Ramos | 9 | 8 | 9 | 9 | **Yes** | 26 May 2026 14:22 |
    | Paulo Fonseca | 8 | 9 | 8 | 9 | **Conditional** | 26 May 2026 16:08 |
    With "All reviews complete · scores unlocked" status banner.
  - **Documents** — table with Document name | Status | Uploaded date (Passport scan / School Reference / Personal Statement PDF / Parental Consent)

### Issue 7 — Role-based action button visibility

**Currently:** Unlock/Lock and Edit buttons always show.

**Plan — wiring `data-role-show` on the action buttons:**

| Action | Visible to | Hidden from |
|---|---|---|
| **Unlock for amendment** (on Submitted apps) | Marcus (DE for Germany), Ana (BR for Brazil), Akanksha (global), Fatima (IO Admissions) | Clara, Paulo (reviewers), Helen (school), Data Protection Lead |
| **Lock application** (on non-Submitted apps) | Same as Unlock | Same as Unlock |
| **Edit** | Same as Unlock + School Director (their school's nominees only) | Reviewers, Data Protection Lead |
| **Send Mail** | All except Data Protection Lead | DPL |
| **Convert** (on Lead) | NC Admin, IO Marketing, IO Super Admin | Reviewers, DPL, School |
| **Delete** (on any record) | IO Super Admin only | All others |

When a hidden-button role is active, the button doesn't render at all (not just disabled). The "..." overflow menu also adjusts.

### Issue 8 — Two-tier permission model (Role + Profile)

**Current:** I have only Profiles (Module permissions). No explicit Role hierarchy.

**Plan — make both explicit:**

- **Profile** = WHAT you can do per module (View/Create/Edit/Delete). Configured in Setup → Profiles → {profile name}.
  - Profiles I'll define: Administrator, NC Administrator, NC Reviewer, School Director, IO Admissions, Restricted Reviewer (Data Protection), Marketing.
- **Role** = WHERE you sit in the org hierarchy. Drives data visibility (you see records owned by yourself or roles BELOW you in the tree).
  - Role tree as in Issue 2 above.

Each user (Marcus, Ana, Clara, etc.) is assigned **one Profile + one Role**:
| User | Profile | Role |
|---|---|---|
| Akanksha | Administrator | IO Super Admin |
| Fatima | IO Admissions | IO Admissions |
| Data Protection Lead | Restricted Reviewer | Compliance |
| Marcus | NC Administrator | NC Admin — Germany |
| Ana | NC Administrator | NC Admin — Brazil |
| Clara | NC Reviewer | NC Reviewer — Brazil |
| Paulo | NC Reviewer | NC Reviewer — Brazil |
| Helen | School Director | School Admissions — Atlantic |

The role-switcher dropdown shows BOTH the user's profile AND role (e.g. "Marcus Weber · NC Administrator · NC Admin Germany"). The current scope banner ("Marcus sees only Germany") is driven by ROLE; the action-button visibility is driven by PROFILE.

### Issue 9 — Reviewer + School Director roles missing from the switcher

**Current scenario A roles in the switcher:** Marcus, Ana, Akanksha, Data Protection Lead.

**Plan:** Add **Clara (NC Reviewer)** + **Helen (School Director)** + **Fatima (IO Admissions)** to the dropdown. When switched:
- Clara → Application detail hides Unlock/Lock/Edit. Review Scores section shows ONLY Clara's row (Paulo's row hidden until "All_Reviews_Complete = true"). Sidebar simplified (just My Reviews + Applications I'm assigned).
- Helen → Sees only nominations addressed to UWC Atlantic. No NC Admin module, no Setup. Can Accept/Decline a nomination (Scenario D demo prep).
- Fatima → IO-level view, can see all NCs but cannot edit individual applicant records. Manages Place Allocation.

This means **7 roles in the switcher**, not 4 — and the role switch genuinely changes capability across the whole app.

---

## 2. New file structure (still single HTML file)

Expanding the existing `01_scenario_A.html` to include the new screens. Estimated final size: **~240 KB** (current 256 KB → after dedupe → adds Setup hub + Edit Programme form + richer Application detail → settles around 240 KB).

### New screens to add
| ID | Title | Purpose |
|---|---|---|
| `sc-setup-home` | Setup Home (10-tile grid) | Click any tile → sub-page or toast |
| `sc-setup-users-detail` | Users → user detail with locale + groups + assignment | Existing sc-3 upgraded |
| `sc-setup-profiles-list` | Profiles list (8 profiles) | Click row → profile detail |
| `sc-setup-profiles-detail` | Profile detail with module-permission toggles | Existing sc-4 upgraded |
| `sc-setup-roles` | Role hierarchy tree | Read-only org chart |
| `sc-programme-edit` | Edit Programme form | The fix for Issue 4 |
| `sc-clara-myreviews` | Clara's "My Reviews" landing | New role demo |
| `sc-helen-nominations` | Helen's incoming nominations | New role demo |

### Renamed / rewritten screens
| ID | Change |
|---|---|
| `sc-1` (Programme detail) | Rewrite to match Zoho field grouping |
| `sc-application-detail` | Rewrite with role-gated buttons, multi-line fields, real Review Scores table, Documents related list |
| `sc-3` (Users list) | Upgrade to full Users page with detail panel |
| `sc-4` (Profile · NC Administrator) | Becomes one instance of `sc-setup-profiles-detail` |

### Removed
| Item | Reason |
|---|---|
| The "step" comments in screen IDs | Already removed in v4 |
| Hard-coded "step counter" markup | Already removed in v4 |

---

## 3. Data model additions

Add to the existing `UWC.*` data store in the script section:

```js
UWC.profiles = [
  { id: 'admin', name: 'Administrator', users: 1, permissions: { Leads: 'all', Contacts: 'all', Applications: 'all', /* ... */ } },
  { id: 'nc-admin', name: 'NC Administrator', users: 5, permissions: { Leads: 'view+create+edit', Contacts: 'all', Applications: 'all', Programmes: 'view+edit', Schools: 'view-only', Governance: 'none' } },
  { id: 'nc-reviewer', name: 'NC Reviewer', users: 12, permissions: { Applications: 'view+score-only-own', Contacts: 'view-only', Reports: 'view-own' } },
  { id: 'school-director', name: 'School Director', users: 3, permissions: { Applications: 'view-nominations-only', Contacts: 'view-nominations-only', NominationPack: 'accept-decline' } },
  { id: 'io-admissions', name: 'IO Admissions', users: 2, permissions: { Applications: 'view-global', PlaceAllocation: 'all', NominationPack: 'view-global' } },
  { id: 'restricted-reviewer', name: 'Restricted Reviewer (DPL)', users: 1, permissions: { Contacts: 'view-masked', ConsentRecord: 'all', AuditLog: 'view-all' } },
  { id: 'marketing', name: 'Marketing', users: 4, permissions: { Leads: 'all', Campaigns: 'all', MailingList: 'all' } }
];

UWC.roles = [
  { id: 'io-super', name: 'IO Super Admin', parent: null, users: ['akanksha'] },
  { id: 'io-admissions', name: 'IO Admissions', parent: 'io-super', users: ['fatima'] },
  { id: 'io-marketing', name: 'IO Marketing', parent: 'io-super', users: [] },
  { id: 'nc-admin-de', name: 'NC Admin — Germany', parent: 'io-super', users: ['marcus'] },
  { id: 'nc-admin-br', name: 'NC Admin — Brazil', parent: 'io-super', users: ['ana'] },
  { id: 'nc-admin-ke', name: 'NC Admin — Kenya', parent: 'io-super', users: ['grace'] },
  { id: 'nc-rev-br', name: 'NC Reviewer — Brazil', parent: 'nc-admin-br', users: ['clara', 'paulo'] },
  { id: 'school-atlantic', name: 'School Admissions — Atlantic', parent: 'io-super', users: ['helen'] },
  { id: 'dpl', name: 'Compliance / DPL', parent: 'io-super', users: ['data-protection'] }
];

UWC.reviewScores = {
  'app-sofia': [
    { reviewer: 'clara', name: 'Clara Ramos', academic: 9, community: 8, communication: 9, values: 9, overall: 'Yes', submittedAt: '2026-05-26 14:22' },
    { reviewer: 'paulo', name: 'Paulo Fonseca', academic: 8, community: 9, communication: 8, values: 9, overall: 'Conditional', submittedAt: '2026-05-26 16:08' }
  ],
  'app-lena': [
    { reviewer: 'klaus-rev', name: 'Klaus Reviewer DE', academic: 7, community: 8, communication: 8, values: 9, overall: 'Yes', submittedAt: '2026-05-23 11:04' },
    { reviewer: 'eva-rev', name: 'Eva Reviewer DE', academic: 8, community: 7, communication: 7, values: 8, overall: 'Conditional', submittedAt: '2026-05-24 09:33' }
  ]
};

UWC.documents = {
  'app-sofia': [
    { name: 'Passport scan.pdf', status: 'Received', uploaded: '2026-05-20', uploadedBy: 'Sofia Almeida' },
    { name: 'School transcript.pdf', status: 'Received', uploaded: '2026-05-21', uploadedBy: 'Sofia Almeida' },
    { name: 'Personal statement.pdf', status: 'Received', uploaded: '2026-05-22', uploadedBy: 'Sofia Almeida' },
    { name: 'Parental consent form.pdf', status: 'Received', uploaded: '2026-05-24', uploadedBy: 'Maria Almeida' }
  ]
  /* same for app-lena */
};
```

---

## 4. Capability matrix — what each role can do (drives every button)

| Role | View Apps | Edit Apps | Unlock | Score | Accept Nomination | Setup access | See DOB/Financial |
|---|---|---|---|---|---|---|---|
| Akanksha (IO Super) | All | All | Yes | — | — | Full | Yes |
| Fatima (IO Admissions) | All | No | Yes | — | — | View-only | Yes |
| Marcus (NC Admin DE) | Germany only | Germany only | Germany only | — | — | Own NC config | Yes (Germany) |
| Ana (NC Admin BR) | Brazil only | Brazil only | Brazil only | — | — | Own NC config | Yes (Brazil) |
| Clara (Reviewer) | Assigned only | No | No | Own only | — | None | No |
| Paulo (Reviewer) | Assigned only | No | No | Own only | — | None | No |
| Helen (School) | Nominations to Atlantic | No | No | — | Yes | None | Yes (own nominees) |
| Data Protection Lead | All (masked) | No | No | — | — | View-only | **Masked •••** |

Each row drives a `data-role-visible="role-id-list"` attribute on the corresponding action button / field / sidebar item.

---

## 5. Build sequence — if approved

| Order | Task | Owner | Effort |
|---|---|---|---|
| 1 | Fix viewport CSS (Issue 1) | Opus | 15 min |
| 2 | Add `UWC.profiles`, `UWC.roles`, `UWC.reviewScores`, `UWC.documents` data | Opus | 20 min |
| 3 | Rewrite `sc-1` Programme detail with proper field grouping | Opus | 30 min |
| 4 | Build `sc-programme-edit` form | Opus | 30 min |
| 5 | Wire Programme Edit button → open edit form | Opus | 10 min |
| 6 | Rewrite `sc-application-detail` with multi-line fields, Review Scores table, Documents related list | Opus | 45 min |
| 7 | Add role-gated visibility on action buttons + masked fields | Opus | 30 min |
| 8 | Build `sc-setup-home` with 10-tile grid | Opus | 30 min |
| 9 | Build `sc-setup-profiles-list` + `sc-setup-profiles-detail` | Opus | 45 min |
| 10 | Build `sc-setup-roles` (hierarchy tree) | Opus | 30 min |
| 11 | Upgrade `sc-3` Users page with rich detail panel | Opus | 30 min |
| 12 | Add Clara + Paulo + Helen + Fatima to role-switcher; wire their distinct landing views | Opus | 45 min |
| 13 | QA pass via Playwright — every role, every action button, every screen | Opus | 30 min |
| 14 | Commit + push | Opus | 5 min |
| **TOTAL** | | | **~6.5 hours** |

This is opus-level work. Per the process rule (one scenario at a time, no parallel agents on scenario rebuilds), I'll do this myself in opus rather than dispatching sonnet sub-agents.

---

## 6. Things I'm NOT changing

| What | Why |
|---|---|
| The "Welcome to Scenario A" overlay | Working, not broken |
| The scope banner | Working as intended |
| The Demo bar (DEMO MODE / role switcher / Reset) | Working as intended in v4 |
| Contacts list + Contact detail | Already polished in v3 |
| The 4 existing role-switcher behaviours (Marcus, Ana, Akanksha, DPL) | Already verified working |
| The role-comparison split view (Akanksha vs DPL) | Already working |
| The Kanban view | Working |
| The Field reference appendix | Working — keep as documentation |
| All 14 sample Germany applications | Same data, just better detail page |

---

## 7. Open questions before I execute

| # | Question | My recommendation |
|---|---|---|
| Q1 | The viewport "half width/height" complaint — can you confirm the symptom by sending me a screenshot of how scenario A currently renders on your screen at full window? I want to confirm my CSS hypothesis before changing anything. | Send a screenshot when ready. |
| Q2 | For the Documents related list on Application detail — should it be a **left-rail item** (like Zoho's Attachments) OR a **main-area card** below Review Scores OR both? | Both — left rail item with count badge + main area card with table. Matches real Zoho behaviour. |
| Q3 | The 4 new roles I want to add to the dropdown (Clara, Paulo, Helen, Fatima) — do you want all 4 fully wired, or just enough to demonstrate the Reviewer + School Director patterns (e.g. Clara + Helen only, leave Paulo + Fatima as references)? | Add all 4 — the role switcher's value goes up with each genuine perspective shift. |
| Q4 | For the Setup Home 10-tile grid — many tiles like "Marketplace · TikTok" aren't relevant to UWC. Should I (a) replicate the full Zoho tile grid as-is for fidelity, or (b) trim to only UWC-relevant items (~30 items)? | (a) — replicate fully. Akanksha can say "this is what Setup looks like; here are the items relevant to UWC" while pointing at specific tiles. The fidelity matters more than tidiness. |
| Q5 | The Review Scores blind-review logic — when role is Clara, should Paulo's score row be (a) invisible entirely, (b) shown with all values as `••••••••`, or (c) shown as "Submitted · scores hidden until you submit yours"? | (c) — most accurate to real Blueprint behaviour. After Clara submits, both rows are visible. |
| Q6 | The Edit Programme form — should "Save & New" actually do anything in the wireframe? | "Save & New" → toast "Programme saved · New programme form opened" + clear all fields. Not strictly necessary but adds polish. |
| Q7 | Time budget — I estimated 6.5 hours of opus work. Acceptable? Or should I dispatch parts to sonnet to parallelise? (Counter-recommendation: keep it opus because the role/permission logic touches many spots; one mind preserves consistency.) | Opus all the way for this. |
| Q8 | Should the build be one big commit or several incremental commits (Issue 1 fix → push, Issue 3 fix → push, etc.)? | One incremental session with **frequent commits** (one per Issue) so you can pull at any point and see partial progress. |

---

## 8. Ask

**Reply with one of:**
- **`GO`** → I start in opus, work through the 14 steps in §5 sequentially, commit after each major issue, push at the end. Send a screenshot of the viewport issue (Q1) if you have one handy.
- **`GO with changes:`** + redlines → I update the plan and re-issue.
- **`WAIT`** → Hold while you think about something specific.

No file changes will happen until you reply.

— Plan v1 ends —
