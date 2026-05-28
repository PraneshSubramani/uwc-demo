# Build Decisions v4 — Final answer doc

**Date:** 27 May 2026 (Wed late)
**Author:** Sam Prabhu
**Supersedes:** the open questions in `FINAL_PLAN_v3.md` §10
**Purpose:** Lock every remaining decision so I can start building tonight without further round-trips.

---

## 1. Decisions locked from your reply

| # | Decision | Implication for the build |
|---|---|---|
| **L1** | **Zero new users in real Zoho CRM.** Only `uwc_admin` (Akanksha) is used. | Real CRM demo runs from single-admin POV only. All role-based perspectives (Marcus / Ana / Clara / Paulo / Sofia / Helen / Fatima / Data Protection Lead) live entirely in the wireframe role-switcher. |
| **L2** | **Skip Accounts module entirely for NC/School modelling.** Two options offered: Programme module OR separate NC module. | **My pick: separate custom modules** for `National Committees` and `Schools` in the wireframe ERD. Cleanest semantics — Programme = "selection cycle per NC per year" (1:N from NC), keeps Programmes module focused. The real Zoho doesn't have to build these — they're shown only in wireframes. |
| **L3** | **Single-admin POV in real CRM** = what Akanksha demos. Full multi-user functionality demonstrated via wireframe replica. | The wireframe is the **target-state replica** — shows the CRM exactly as it would look fully implemented. Akanksha narrates: "this is how it looks when this user logs in — let me show you Marcus's view…" |
| **L4** | **Give Blueprint + workflow spec separately** so Pranesh/Sagar can implement. | **DONE.** See `BLUEPRINT_AND_WORKFLOW_SPEC.md` — 10-stage Blueprint, 8 workflows, 6 Deluge functions, 6 email templates, all copy-pasteable for Sagar. |
| **L5** | If Blueprint gets implemented in real CRM → also show in wireframes. Wireframes prove the functionality regardless. | Wireframes carry the full Blueprint visualisation. If the live CRM gets it built by Fri, Akanksha can also flip to live for a "see, it's real" moment in Scenario A. |
| **L6** | **Potentials-vs-Deal semantic mismatch → don't worry about it. Generalise.** | The wireframes use "Application" labels throughout — they don't expose the underlying Potentials API. The demo narrative is pure UWC; the rename is invisible to the panel. |
| **L7** | **A2Z logo top-right in real CRM → ignore.** | I won't touch real CRM branding. The wireframes have UWC navy wordmark throughout. Panel sees UWC branding everywhere they look during a scenario. |
| **L8** | **No real Zoho UI work at all.** All work lives in wireframes. | My build effort goes 100% into the HTML files + `_shared/` library + the data-model SVG diagrams. |

---

## 2. My recommendation: **single-file HTML per scenario** (not React)

You asked which to use. Single-file HTML wins for our specific situation. Here's the side-by-side:

### Single-file HTML (one self-contained `.html` per scenario)

| ✅ Wins | ⚠ Trade-offs |
|---|---|
| Akanksha can double-click any file from a USB stick, email attachment, or the demo laptop's downloads folder | More CSS/JS duplication across the 9 files — mitigated by `_shared/` source-of-truth, with build step = simple `cat`/`sed` inlining |
| Zero build step. No npm. No Node version. No `webpack failed` on demo day. | Each file is ~80–120 KB once inlined — still well under the 300 KB browsers handle instantly |
| Each scenario is a totally isolated failure domain — if scenario E somehow corrupts, A–D + F–G still open fine | — |
| Pranesh can open and edit any file in any text editor with zero tooling | — |
| Works offline, works from `file://`, works from a USB stick on Akanksha's iPad if needed | — |
| Existing `uwc_full_scenario B_demo.html` (the team's reference) uses exactly this pattern — proven to work | — |
| Easier to ship to UWC after the demo as evidence — they get HTML files they can browse forever | — |

### React project (Vite/CRA build + dev server)

| ⚠ Wins | ❌ Risks for THIS demo |
|---|---|
| Cleaner component reuse code-wise | Requires a build step and a static server (or pre-deployed URL) |
| State management for role-switcher is more elegant in JSX | One bad npm install on demo laptop = entire demo dead |
| Long-term maintainability if A2Z reused the demo for other clients | Akanksha can't email Paul a single file to preview — has to share a built `dist/` folder or a URL |
| — | Browser cache or CORS issue on demo day = no fallback |
| — | Pranesh editing requires Node + npm setup |
| — | 5-day build window doesn't justify the tooling overhead |

### Verdict

**Single-file HTML per scenario.** All 9 files in `wireframes/`. Source-of-truth tokens/data live in `_shared/*.css` and `_shared/*.js`. I inline them into each scenario file at build time (a simple shell script with `cat` — no npm). Pranesh can edit either the source files OR an inlined scenario file directly with no toolchain.

**The role-switcher engine** (~80 lines of vanilla JS) is the most complex piece — it works the same in single-file HTML as it would in React. JSX gives no advantage here.

If you want to disagree and force React, say so — I'll switch. But I'd be flagging the demo-day risk every step of the way.

---

## 3. Final file structure (locked)

```
uwc-demo/
├── docs/                                  (existing — untouched)
├── wireframes/                            (NEW)
│   ├── _shared/                           source-of-truth library
│   │   ├── uwc-tokens.css
│   │   ├── zoho-tokens.css                (locked from live-CRM audit screenshots)
│   │   ├── role-switcher.js               cross-file role-switching engine
│   │   ├── sample-data.js                 Sofia / Ana / Marcus / etc. — single source
│   │   ├── inline-build.sh                trivial shell script: cats _shared into each HTML file
│   │   └── assets/
│   │       ├── uwc-brand/                 ✅ DONE — logo, hero, wordmark, 21 country flags
│   │       └── zoho-reference/            ✅ DONE — 8 screenshots from live CRM audit
│   ├── 00_index.html                       UWC-branded landing — A–G picker + data model + reference
│   ├── 01_scenario_A.html                  NC Admin · Permissions · Programme Config (9 steps)
│   ├── 02_scenario_B.html                  Applicant Registration · Eligibility · Form (10 steps)
│   ├── 03_scenario_C.html                  Selection · Scoring · Safeguarding (10 steps)
│   ├── 04_scenario_D.html                  Nomination · Place Allocation · Pack (10 steps)
│   ├── 05_scenario_E.html                  Governance Structure · Body Management (8 steps)
│   ├── 06_scenario_F.html                  NC Management · Volunteer Oversight (8 steps)
│   ├── 07_scenario_G.html                  Comms · Mailing Lists · Bulk Updates (9 steps)
│   └── 99_data_model.html                  Salesforce-style ERD (current vs target) + 8-layer architecture
├── PLAN_FOR_PRANESH_REVIEW.md             (v1 — superseded)
├── FINAL_PLAN_v2.md                       (v2 — superseded)
├── FINAL_PLAN_v3.md                       (v3 — most of it still current)
├── CRM_ARCHITECTURE_DELTA.md              ✅ DONE — current-vs-target module audit
├── BLUEPRINT_AND_WORKFLOW_SPEC.md         ✅ DONE — Sagar/Priyanka implementation guide
└── BUILD_DECISIONS_v4.md                  (this file — supersedes v3 §10 open questions)
```

---

## 4. Role-switcher dropdown — per scenario, locked

Topbar of every scenario file: `View as: [👤 Marcus Weber · NC Admin (DE) ▼]`

Each scenario file shows only the roles relevant to it. When the user changes, the screen re-renders:
- Different module visibility (Marcus sees only Germany records — Brazil records vanish from list views)
- Field-level masking (Data Protection Lead sees DOB as `••••••••`)
- Different action buttons (NC Admin sees Unlock; Reviewer sees Score; School sees Accept/Decline)
- Different KPI cards on dashboards

| Scenario | Roles in dropdown |
|---|---|
| A | Marcus (NC Admin DE) · Ana (NC Admin BR) · Akanksha (IO Super Admin) · Data Protection Lead |
| B | Public visitor · Sofia (Portal) · Maria Almeida (Guardian) · Ana (NC Admin) · IO Marketing |
| C | Clara (Reviewer) · Paulo (Reviewer) · Ana (NC Admin) · Akanksha (IO Super Admin) |
| D | Fatima (IO Admissions) · Ana (NC Admin) · Helen (Atlantic School) |
| E | Akanksha (IO Super Admin) · IO CRM Administrator |
| F | Akanksha (IO Super Admin) · Grace (NC Chair Kenya) |
| G | IO Marketing · Akanksha (IO Super Admin) · Individual Contact (Jonathan Osei) · Marcus (opted-out) |

Akanksha's narration pattern: walk through the scenario as the default role, then at designated "role-comparison" moments swap role to show how the same data appears differently.

---

## 5. Live CRM findings that update the architecture

From the 8 reference screenshots captured this session:

| Finding | Impact |
|---|---|
| **Contact module already has student fields** (Type=Student, Date of Birth, Gender, Parent Name, Relationship + custom related lists Programmes, Applications, Parent Name, Applicant Names) | Reduces wireframe build for Contact-related screens. I'll mirror this exactly. |
| **Application Kanban shows 3 stages** (Qualification 10% → Eligibility Review 20% → Review 40%) | Wireframes show the full 10-stage Blueprint per `BLUEPRINT_AND_WORKFLOW_SPEC.md`. |
| **Programmes module is empty** | Wireframes show 5 Programme records per Build Plan §2.1 sample data. |
| **Setup is reachable** by `uwc_admin` for Modules/Pipelines/Workflows | Sagar can implement the Blueprint spec without needing a more-privileged account. ✅ unblocker. |
| **Accounts module is in sidebar** under Sales | Permission denied was on the LIST view; the module IS enabled. (You explicitly said to skip Accounts for NCs anyway — staying with separate-NC-module recommendation.) |
| **Home dashboard already has UWC banner image** + KPIs (My Open Applications: 6, My Calls Today: 2, My Leads: 10) | Some UWC theming exists. Wireframes will show a richer UWC dashboard — Akanksha can flip to real for "see, it's actually configured". |
| **Sample data is still mostly default Zoho** (Christopher Maclead, Sage Wieser, "Demo" / "Webinar" / "TradeShow" meetings) | Wireframes use the real UWC sample names (Sofia, Ana, Marcus, etc.) per Build Plan §2. Sagar should clean default data per MUST-1..6 in the Blueprint spec. |

---

## 6. Sequencing (locked, given above decisions)

| Slot | Output |
|---|---|
| **Wed 27 evening (tonight)** | `_shared/uwc-tokens.css` + `_shared/zoho-tokens.css` (from live screenshots) + `_shared/role-switcher.js` + `_shared/sample-data.js` + `_shared/inline-build.sh` + `00_index.html` skeleton |
| **Wed 27 late tonight** | `99_data_model.html` — Salesforce-style ERD (current-state greyed boxes vs target-state coloured) + 8-layer architecture diagram |
| **Thu 28 AM** | `01_scenario_A.html` + `02_scenario_B.html` |
| **Thu 28 PM** | `03_scenario_C.html` + `04_scenario_D.html` |
| **Fri 29 AM** | `05_scenario_E.html` + `06_scenario_F.html` + `07_scenario_G.html` |
| **Fri 29 lunch** | Internal review with Paul + Dash |
| **Sat 30** | Apply fix list · final polish |
| **Sun 31** | Akanksha dry-run · tab pre-load script per Presenter Guide |
| **Mon 1 June 15:00** | Live demo |

Parallel for Sagar/Priyanka: implement `BLUEPRINT_AND_WORKFLOW_SPEC.md` MUST-1..6 (about 5.5 hours of work).

---

## 7. Single-question final ask

**Reply `GO` to start tonight on the `_shared/*` library + `00_index.html` + `99_data_model.html`.**

Optional add-ons in your reply:
- `GO, switch navy to #004A97` if you want to match the live uwc.org logo colour (instead of Build Plan's #003087)
- `GO, but build with React` if you want to override my single-file HTML recommendation
- `GO, also build [thing]` if there's anything I missed

Anything else — say it and I redline.

— End of Build Decisions v4 —
